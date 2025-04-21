'use client'

import { useState } from "react";
import { FaUser, FaChild } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

const BookRoom = () => {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  return (
    // Book Room Section
  
    <div className="bg-gray-100 rounded-2xl shadow-lg max-w-3xl mx-auto mt-8 p-6">
      <h2 className="text-xl text-gray-800 font-semibold text-center">Book a Room</h2>
      <p className="text-sm text-gray-500 text-center mb-4">
        Discover the perfect space for you!
      </p>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Date Selection */}
        <div className="flex flex-col items-start">
          <label className="text-sm font-medium text-gray-800">Date</label>
          <button className="flex items-center gap-2 border px-4 py-2 rounded-md bg-white shadow text-gray-600">
            <MdDateRange />
            Check Available
          </button>
        </div>

        {/* Person Selection */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaUser />
            <span>Adults</span>
            <select
              className="border rounded-md px-2 py-1"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaChild />
            <span>Children</span>
            <select
              className="border rounded-md px-2 py-1"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Book Now Button */}
        <button className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600">
          BOOK NOW
        </button>
      </div>
    </div>
  );
};

export default BookRoom;
