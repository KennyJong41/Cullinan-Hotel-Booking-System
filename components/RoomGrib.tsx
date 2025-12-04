import RoomCard from './RoomCard';
import { Room } from '@/types';

interface RoomGridProps {
  rooms: Room[];
}

export default function RoomGrid({ rooms }: RoomGridProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No rooms available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}