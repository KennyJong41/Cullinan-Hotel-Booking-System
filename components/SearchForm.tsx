'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Users, Search } from 'lucide-react';

export default function SearchForm() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 86400000 * 2), // 2 days later
    guests: 2,
    roomType: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams({
      checkIn: searchData.checkIn.toISOString().split('T')[0],
      checkOut: searchData.checkOut.toISOString().split('T')[0],
      guests: searchData.guests.toString(),
    });
    
    if (searchData.roomType) {
      params.append('roomType', searchData.roomType);
    }
    
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="form-label flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Check-in
          </label>
          <DatePicker
            selected={searchData.checkIn}
            onChange={(date) => date && setSearchData({...searchData, checkIn: date})}
            className="input-field"
            minDate={new Date()}
            dateFormat="MMM dd, yyyy"
          />
        </div>
        
        <div>
          <label className="form-label flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Check-out
          </label>
          <DatePicker
            selected={searchData.checkOut}
            onChange={(date) => date && setSearchData({...searchData, checkOut: date})}
            className="input-field"
            minDate={searchData.checkIn}
            dateFormat="MMM dd, yyyy"
          />
        </div>
        
        <div>
          <label className="form-label flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Guests
          </label>
          <select
            className="input-field"
            value={searchData.guests}
            onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Rooms
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <label className="form-label">Room Type (Optional)</label>
        <select
          className="input-field"
          value={searchData.roomType}
          onChange={(e) => setSearchData({...searchData, roomType: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="deluxe">Deluxe Rooms</option>
          <option value="suite">Suites</option>
          <option value="standard">Standard Rooms</option>
        </select>
      </div>
    </form>
  );
}