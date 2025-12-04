import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { z } from 'zod';

const bookingSchema = z.object({
  userId: z.number().int().positive(),
  roomId: z.number().int().positive(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().positive(),
  specialRequests: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let sqlQuery = `
      SELECT b.*, r.name as room_name, r.price_per_night,
             u.first_name, u.last_name, u.email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
    `;
    
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (userId) {
      sqlQuery += ` WHERE b.user_id = $${paramIndex}`;
      queryParams.push(userId);
      paramIndex++;
    }

    if (status) {
      sqlQuery += ` ${userId ? 'AND' : 'WHERE'} b.status = $${paramIndex}`;
      queryParams.push(status);
    }

    sqlQuery += ' ORDER BY b.created_at DESC';

    const result = await query(sqlQuery, queryParams);
    return NextResponse.json({ bookings: result.rows });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证输入
    const validation = bookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const bookingData = validation.data;
    
    // 检查房间是否可用
    const availabilityCheck = await query(
      `SELECT * FROM rooms WHERE id = $1 AND is_available = true`,
      [bookingData.roomId]
    );

    if (availabilityCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Room is not available' },
        { status: 400 }
      );
    }

    // 检查日期冲突
    const dateConflictCheck = await query(
      `SELECT * FROM bookings 
       WHERE room_id = $1 
         AND status NOT IN ('cancelled')
         AND ($2::date, $3::date) OVERLAPS (check_in, check_out)`,
      [bookingData.roomId, bookingData.checkIn, bookingData.checkOut]
    );

    if (dateConflictCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Room is already booked for selected dates' },
        { status: 400 }
      );
    }

    // 计算总价
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const roomPrice = availabilityCheck.rows[0].price_per_night;
    const totalAmount = roomPrice * nights;

    // 使用事务创建预订
    const booking = await transaction(async (client) => {
      // 创建预订
      const bookingResult = await client.query(
        `INSERT INTO bookings (
          user_id, room_id, check_in, check_out, 
          guests, total_amount, special_requests, status
        ) VALUES ($1, $2, $3::date, $4::date, $5, $6, $7, 'pending')
        RETURNING *`,
        [
          bookingData.userId,
          bookingData.roomId,
          bookingData.checkIn,
          bookingData.checkOut,
          bookingData.guests,
          totalAmount,
          bookingData.specialRequests || '',
        ]
      );

      return bookingResult.rows[0];
    });

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking,
      totalNights: nights,
      totalAmount,
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}