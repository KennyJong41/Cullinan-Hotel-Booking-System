import { Room } from '@/types';
import { Bed, Users, Star, MapPin } from 'lucide-react';
import Link from 'next/link';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const amenities = Array.isArray(room.amenities) 
    ? room.amenities.slice(0, 3)
    : [];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Room Image */}
      <div className="relative h-56 bg-gray-200">
        {room.photos && room.photos.length > 0 ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${room.photos[0]})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Bed className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
          <span className="font-bold text-blue-600">${room.price_per_night}</span>
          <span className="text-gray-500 text-sm">/night</span>
        </div>
      </div>

      {/* Room Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
            <p className="text-gray-600 text-sm">{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="ml-1 font-bold">5.0</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {room.description || 'Luxurious accommodation with premium amenities'}
        </p>

        {/* Room Details */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>Up to {room.capacity} guests</span>
          </div>
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{room.capacity === 1 ? 'Single Bed' : 'Multiple Beds'}</span>
          </div>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            href={`/rooms/${room.id}`}
            className="btn-secondary flex-1 text-center"
          >
            View Details
          </Link>
          {room.is_available && (
            <Link
              href={`/book?roomId=${room.id}`}
              className="btn-primary flex-1 text-center"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}