import { FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold">Bhive</h2>
          <p className="mt-2">
            The first industrial concept hotel in Iloilo with charming ambiance.
          </p>
          <div className="mt-4">
            <img
              src="src/assets/bhivelogo.png"
              alt="Bhive Hotel Logo"
              className="h-16"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">CONTACT INFO</h3>
          <p className="mt-2">Phone: 1234567890</p>
          <p>Email: company@email.com</p>
          <p>Location: PH92+H86, Mandurriao, Iloilo City, Iloilo</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">SOCIAL MEDIA</h3>
          <div className="flex items-center mt-2">
            <FaFacebook className="text-xl" />
            <span className="ml-2">Bhive Hotel</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm">
        © 2025 Bhive Dev team | all rights reserved
      </div>
    </footer>
  );
}
