'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (formData.checkIn) params.append('checkIn', formData.checkIn);
    if (formData.checkOut) params.append('checkOut', formData.checkOut);
    if (formData.guests) params.append('guests', formData.guests);
    if (formData.roomType) params.append('roomType', formData.roomType);
    
    router.push(`/rooms?${params.toString()}`);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minCheckOut = formData.checkIn || tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="form-label">Check-in Date</label>
          <input
            type="date"
            className="input-field"
            value={formData.checkIn}
            onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div>
          <label className="form-label">Check-out Date</label>
          <input
            type="date"
            className="input-field"
            value={formData.checkOut}
            onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
            min={minCheckOut}
            required
          />
        </div>
        
        <div>
          <label className="form-label">Guests</label>
          <select
            className="input-field"
            value={formData.guests}
            onChange={(e) => setFormData({...formData, guests: e.target.value})}
          >
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full">
            Search Rooms
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <label className="form-label">Room Type (Optional)</label>
        <select
          className="input-field"
          value={formData.roomType}
          onChange={(e) => setFormData({...formData, roomType: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
          <option value="standard">Standard</option>
        </select>
      </div>
    </form>
  );
}
