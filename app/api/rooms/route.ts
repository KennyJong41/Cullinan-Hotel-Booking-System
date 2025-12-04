import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const searchSchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guests: z.coerce.number().min(1).max(10).optional(),
  roomType: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 验证参数
    const validation = searchSchema.safeParse({
      checkIn: searchParams.get('checkIn'),
      checkOut: searchParams.get('checkOut'),
      guests: searchParams.get('guests'),
      roomType: searchParams.get('roomType'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.errors },
        { status: 400 }
      );
    }

    const params = validation.data;
    let sqlQuery = 'SELECT * FROM rooms WHERE is_available = true';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // 动态构建查询条件
    if (params.guests) {
      sqlQuery += ` AND capacity >= $${paramIndex}`;
      queryParams.push(params.guests);
      paramIndex++;
    }

    if (params.roomType) {
      sqlQuery += ` AND type = $${paramIndex}`;
      queryParams.push(params.roomType);
      paramIndex++;
    }

    if (params.minPrice !== undefined) {
      sqlQuery += ` AND price_per_night >= $${paramIndex}`;
      queryParams.push(params.minPrice);
      paramIndex++;
    }

    if (params.maxPrice !== undefined) {
      sqlQuery += ` AND price_per_night <= $${paramIndex}`;
      queryParams.push(params.maxPrice);
      paramIndex++;
    }

    sqlQuery += ' ORDER BY price_per_night ASC';

    // 如果有入住日期，检查可用性
    if (params.checkIn && params.checkOut) {
      const availabilityQuery = `
        WITH available_rooms AS (
          ${sqlQuery}
        )
        SELECT ar.*
        FROM available_rooms ar
        WHERE NOT EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.room_id = ar.id
            AND b.status NOT IN ('cancelled')
            AND (
              ($${paramIndex}::date, $${paramIndex + 1}::date) 
              OVERLAPS (b.check_in, b.check_out)
            )
        )
      `;
      
      queryParams.push(params.checkIn, params.checkOut);
      const result = await query(availabilityQuery, queryParams);
      return NextResponse.json({ rooms: result.rows });
    }

    // 如果没有日期限制，直接返回
    const result = await query(sqlQuery, queryParams);
    return NextResponse.json({ rooms: result.rows });

  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// 创建新房间（管理员）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证输入
    const roomSchema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      type: z.string(),
      price_per_night: z.number().positive(),
      capacity: z.number().int().positive(),
      amenities: z.array(z.string()).optional(),
      photos: z.array(z.string()).optional(),
    });

    const validation = roomSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid room data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const roomData = validation.data;
    
    const result = await query(
      `INSERT INTO rooms (
        name, description, type, price_per_night, 
        capacity, amenities, photos, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING *`,
      [
        roomData.name,
        roomData.description || '',
        roomData.type,
        roomData.price_per_night,
        roomData.capacity,
        JSON.stringify(roomData.amenities || []),
        roomData.photos || [],
      ]
    );

    return NextResponse.json({ room: result.rows[0] });

  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}