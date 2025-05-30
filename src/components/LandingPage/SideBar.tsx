import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/bhivelogo.jpg";

interface NavItemData {
  title: string;
  href: string;
}

const SideBar = ({
  sideBar,
  setSideBar,
  mobileMenuOpen,
  setMobileMenuOpen,
  navItems,
  role = "Guest",
}: {
  sideBar: boolean;
  setSideBar: Dispatch<SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  navItems?: NavItemData[]; // Updated prop to accept the new navigation links
  role?: "Admin" | "Guest";
}) => {
  const sideBarStyle = sideBar
    ? "fixed flex flex-col w-64 h-screen top-0 bg-gradient-to-b from-amber-400 to-amber-300 shadow-xl right-0 animate-slide-in-right transition duration-300 ease-in-out z-50"
    : "fixed flex flex-col w-64 h-screen top-0 bg-gradient-to-b from-amber-400 to-amber-300 shadow-xl right-0 animate-slide-out-right transition duration-300 ease-in-out z-50";

  return (
    <div className={sideBarStyle}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-amber-500/30">
        <div className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Bhive Hotel Logo"
            width={36}
            height={36}
            className="rounded-full drop-shadow-lg"
          />
          <span className="font-bold text-lg text-amber-900">BHive Hotel</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setSideBar(!sideBar);
            setTimeout(() => {
              setMobileMenuOpen(!mobileMenuOpen);
            }, 300);
          }}
          className="p-2 rounded-full hover:bg-amber-500/20 transition-colors text-amber-900">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-col h-full justify-between py-4">
        <div className="flex flex-col space-y-2 px-4">
          {navItems &&
            navItems.map((item) => (
              <NavItem
                key={item.title}
                href={item.href}>
                {item.title}
              </NavItem>
            ))}
        </div>
        {role === "Admin" && (
          <div className="px-4 mt-auto pt-4 border-t border-amber-500/20">
            <div className="flex flex-col space-y-3 mb-6">
              <Link
                href="/login"
                className="w-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium text-center px-4 py-3 rounded-lg transition-colors">
                Log In
              </Link>
              <Link
                href="/signup"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-center px-4 py-3 rounded-lg transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NavItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium px-5 py-3 rounded-lg transition-colors block">
      {children}
    </Link>
  );
};

export default SideBar;
