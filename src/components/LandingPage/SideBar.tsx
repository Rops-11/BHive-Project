"use client";
import {
  XMarkIcon,
  HomeIcon,
  BuildingOffice2Icon,
  KeyIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/assets/bhivelogo.jpg";

interface NavItemData {
  title: string;
  href: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
  Home: (
    <HomeIcon className="h-5 w-5 transition-all group-hover:scale-110 group-hover:opacity-80" />
  ),
  Facilities: (
    <BuildingOffice2Icon className="h-5 w-5 transition-all group-hover:scale-110 group-hover:opacity-80" />
  ),
  Rooms: (
    <KeyIcon className="h-5 w-5 transition-all group-hover:scale-110 group-hover:opacity-80" />
  ),
  Book: (
    <BookOpenIcon className="h-5 w-5 transition-all group-hover:scale-110 group-hover:opacity-80" />
  ),
};

interface SideBarProps {
  sideBar: boolean;
  setSideBar: Dispatch<SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  navItems?: NavItemData[];
}

const SideBar: React.FC<SideBarProps> = ({
  sideBar,
  setSideBar,
  setMobileMenuOpen,
  navItems,
}) => {
  const pathname = usePathname();

  return (
    <div
      className={`fixed top-0 right-0 w-64 h-screen bg-white shadow-lg z-50 
      transform transition-transform duration-300 ease-in-out 
      ${sideBar ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Bhive Hotel Logo"
            width={36}
            height={36}
            className="rounded-full drop-shadow-lg transition-transform hover:scale-110"
          />
          <span className="font-bold text-lg text-amber-900">Bhive Hotel</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setSideBar(false);
            setTimeout(() => setMobileMenuOpen(false), 300);
          }}
          className="p-2 rounded-full hover:bg-amber-100 transition-all hover:rotate-90 text-amber-900">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-col py-6 px-4 space-y-2">
        {navItems?.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              prefetch={false}
              onClick={() => {
                setSideBar(false);
                setTimeout(() => setMobileMenuOpen(false), 300);
              }}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:scale-105
                ${
                  isActive
                    ? "bg-amber-100 text-amber-900 font-semibold"
                    : "text-amber-900 hover:bg-amber-100"
                }`}>
              {iconMap[item.title] || <span className="w-5" />}
              <span
                className={`font-medium text-lg transition-transform group-hover:scale-105 group-hover:opacity-80`}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
