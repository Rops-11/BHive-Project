'use client'

import { useState } from "react";
import { MdDateRange } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const BookRoom = () => {
  const [checkIn, setCheckIn] = useState("14 Jun 2021");
  const [checkOut, setCheckOut] = useState("15 Jun 2021");
  const [rooms] = useState(1);
  const [guests, setGuests] = useState(2);

  return (
    <div className="bg-white rounded-full shadow-lg px-4 py-2 max-w-6xl mx-auto mt-8 flex items-center justify-between gap-2 md:gap-6">

      {/* Check-in */}
      <div className="flex flex-col items-start px-2 border-l border-gray-300 pl-4">
      <span className="flex items-center gap-2 text-sm text-gray-700 font-medium">
        <MdDateRange /> Check in
      </span>
      <input
        type="date"
        className="text-xs text-gray-500 border rounded px-2 py-1 mt-1"
        value={checkIn ? new Date(checkIn).toISOString().split('T')[0] : ""}
        onChange={e => setCheckIn(new Date(e.target.value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }))}
      />
      </div>

      {/* Check-out */}
      <div className="flex flex-col items-start px-2 border-l border-gray-300 pl-4">
      <span className="flex items-center gap-2 text-sm text-gray-700 font-medium">
        <MdDateRange /> Check out
      </span>
      <input
        type="date"
        className="text-xs text-gray-500 border rounded px-2 py-1 mt-1"
        value={checkOut ? new Date(checkOut).toISOString().split('T')[0] : ""}
        onChange={e => setCheckOut(new Date(e.target.value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }))}
      />
      </div>

      {/* Rooms and Guests */}
      <div className="flex flex-col items-start px-2 border-l border-gray-300 pl-4">
        <span className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <FaUser /> Rooms for
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">
        {rooms} room{rooms > 1 ? "s" : ""}
          </span>
          <span className="mx-1 text-xs text-gray-400">,</span>
          <select
        className="text-xs text-gray-500 border rounded px-2 py-1"
        value={guests}
        onChange={e => setGuests(Number(e.target.value))}
          >
        {[1, 2, 3, 4].map(num => (
          <option key={num} value={num}>
            {num} guest{num > 1 ? "s" : ""}
          </option>
        ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full px-6 py-3 flex items-center gap-2 text-sm font-medium">
      <IoSearch className="text-lg" />
      Search...
      </button>
    </div>
  );
};

export default BookRoom;
