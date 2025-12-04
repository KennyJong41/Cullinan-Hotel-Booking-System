export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  is_admin: boolean;
}

export interface Room {
  id: number;
  name: string;
  description?: string;
  type: string;
  price_per_night: number;
  capacity: number;
  amenities: string[];
  photos: string[];
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  created_at: string;
  cancelled_at?: string;
  user?: User;
  room?: Room;
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  transaction_id?: string;
  created_at: string;
}

export interface HotelInfo {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  check_in_time: string;
  check_out_time: string;
  updated_at: string;
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BookingFormData {
  userId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}