"use client";
import { ArrowRight } from "lucide-react"; // Import ArrowRight icon from Lucide

const CheckRoomAvailability = () => {
  return (
    <div className="bg-white p-4 rounded-full shadow-md flex items-center gap-4 w-full max-w-4xl mx-auto my-8">

      <select className="border rounded-full px-4 py-2 text-sm w-1/4">
        <option>Single Bee</option>
        <option>Twin Bee</option>
        <option>Queen Bee</option>
        <option>BHIVE Suite</option>
        <option>BHIVE Family Suite</option>
      </select>

      {/* Check-in */}
      <input type="date" className="border rounded-full px-4 py-2 text-sm w-1/5" />

      {/* Arrow Icon */}
      <ArrowRight className="w-5 h-5 text-gray-500" />

      {/* Check-out */}
      <input type="date" className="border rounded-full px-4 py-2 text-sm w-1/5" />

      {/* Number of Guests */}
      <input type="number" min="1" className="border rounded-full px-4 py-2 text-sm w-1/6" placeholder="Guests" />

      {/* Check Availability Button */}
      <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90">
        Check Availability
      </button>
    </div>
  );
};

export default CheckRoomAvailability;
