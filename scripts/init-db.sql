-- 初始化数据库脚本
-- 如果表已存在，先删除
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS hotel_info CASCADE;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
);

-- 创建房间表
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity INTEGER NOT NULL,
    amenities JSONB,
    photos TEXT[],
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建预订表
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    room_id INTEGER REFERENCES rooms(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP
);

-- 创建支付表
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建酒店信息表
CREATE TABLE IF NOT EXISTS hotel_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'Cullinan Hotel',
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    check_in_time TIME DEFAULT '14:00',
    check_out_time TIME DEFAULT '12:00',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入酒店信息
INSERT INTO hotel_info (name, description, address, phone, email) VALUES 
('Cullinan Hotel', 'Luxury 5-star hotel offering premium accommodations and world-class service in the heart of the city.', 
'123 Luxury Avenue, Downtown District', '+1-555-0123', 'info@cullinanhotel.com')
ON CONFLICT DO NOTHING;

-- 创建默认管理员账户 (密码: admin123)
INSERT INTO users (email, password, first_name, last_name, phone, is_admin) VALUES 
('admin@cullinanhotel.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
'Hotel', 'Manager', '+1-555-0001', true)
ON CONFLICT (email) DO NOTHING;

-- 插入示例房间数据
INSERT INTO rooms (name, description, type, price_per_night, capacity, amenities, photos) VALUES 
('Deluxe King Room', 'Spacious room with king-sized bed and city view', 'deluxe', 299.00, 2, 
 '["Free WiFi", "Air Conditioning", "Mini Bar", "Safe", "TV", "Coffee Maker"]'::jsonb, 
 '{"https://images.unsplash.com/photo-1631049307264-da0ec9d70304", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7"}'),
('Executive Suite', 'Luxurious suite with separate living area and panoramic views', 'suite', 499.00, 3, 
 '["Free WiFi", "Air Conditioning", "Mini Bar", "Safe", "TV", "Jacuzzi", "Balcony"]'::jsonb, 
 '{"https://images.unsplash.com/photo-1611892440504-42a792e24d32", "https://images.unsplash.com/photo-1566665797739-1674de7a421a"}'),
('Standard Double', 'Comfortable room with two double beds and essential amenities', 'standard', 199.00, 2, 
 '["Free WiFi", "Air Conditioning", "TV", "Hairdryer"]'::jsonb, 
 '{"https://images.unsplash.com/photo-1568495248636-6432b97bd949"}'),
('Presidential Suite', 'Ultimate luxury with private terrace and butler service', 'presidential', 999.00, 4, 
 '["Free WiFi", "Air Conditioning", "Mini Bar", "Safe", "TV", "Jacuzzi", "Private Terrace", "Butler Service"]'::jsonb, 
 '{"https://images.unsplash.com/photo-1584132967334-10e028bd69f7", "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"}'),
('Family Room', 'Spacious room perfect for families with connecting options', 'family', 349.00, 4, 
 '["Free WiFi", "Air Conditioning", "TV", "Mini Fridge", "Crib Available"]'::jsonb, 
 '{"https://images.unsplash.com/photo-1590490360182-c33d57733427"}')
ON CONFLICT DO NOTHING;

-- 创建索引以提高查询性能
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_rooms_type ON rooms(type);
CREATE INDEX idx_rooms_price ON rooms(price_per_night);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);