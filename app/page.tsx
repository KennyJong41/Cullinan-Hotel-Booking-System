import SearchForm from '@/components/SearchForm';
import RoomGrid from '@/components/RoomGrid';
import { query } from '@/lib/db';

export default async function HomePage() {
  // 获取特色房间
  const roomsResult = await query(`
    SELECT * FROM rooms 
    WHERE is_available = true 
    ORDER BY created_at DESC 
    LIMIT 3
  `);

  // 获取酒店信息
  const hotelInfoResult = await query('SELECT * FROM hotel_info LIMIT 1');
  const hotelInfo = hotelInfoResult.rows[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[600px]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/hotel-hero.jpg)',
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Experience Luxury at Cullinan Hotel
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              {hotelInfo?.description || 'Luxury 5-star hotel offering premium accommodations'}
            </p>
            <div className="max-w-4xl">
              <SearchForm />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured Rooms & Suites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our selection of luxurious accommodations designed for your comfort
            </p>
          </div>
          <RoomGrid rooms={roomsResult.rows} />
        </div>
      </section>

      {/* Hotel Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Welcome to Cullinan Hotel
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Located in the heart of the city, Cullinan Hotel offers an unparalleled luxury experience. 
                  Our commitment to excellence ensures every guest enjoys world-class service and amenities.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-bold text-2xl">24/7</div>
                    <div className="text-gray-700">Concierge Service</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-bold text-2xl">5★</div>
                    <div className="text-gray-700">Luxury Rating</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-bold text-2xl">100+</div>
                    <div className="text-gray-700">Rooms & Suites</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-bold text-2xl">3</div>
                    <div className="text-gray-700">Restaurants</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(/hotel-lobby.jpg)' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}