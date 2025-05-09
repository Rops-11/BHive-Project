import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/outline";
import logo from "@/assets/bhivelogo.jpg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import SideBar from "../LandingPage/SideBar";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../ui/button";
import { logout } from "@/app/actions/auth";

const navigationLinks = [
  { title: "Dashboard", href: "/admin/dashboard" },
  { title: "Inbox", href: "/admin/inbox" },
  { title: "Rooms", href: "/admin/rooms" },
  { title: "Book", href: "/admin/book" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const { user } = useAuth();

  const isMobile = useIsMobile();

  const navStyle = isMobile
    ? `mx-auto flex max-w-7xl w-full items-center justify-between`
    : `mx-auto flex max-w-7xl w-full items-center`;

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 bg-gradient-to-t from-[#d4a017]/30 to-[#d4a017] shadow-md flex items-center p-10 backdrop-filter backdrop-blur-md transition">
      <nav className={navStyle}>
        <div className="flex items-center">
          <Link
            href="/admin"
            className="flex items-center">
            <Image
              src={logo}
              alt="Bhive Hotel Logo"
              width={48}
              height={48}
              className="drop-shadow-lg"
              priority
            />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 w-full text-black font-semibold justify-center items-center">
          <NavigationMenu className="flex w-full justify-between">
            <NavigationMenuList className="flex w-full justify-center items-center space-x-5">
              {navigationLinks.map((item) => (
                <NavigationMenuItem
                  key={item.title}
                  className="flex w-full justify-center items-center">
                  <NavigationMenuLink asChild>
                    <Link href={item.href}>
                      <p>{item.title}</p>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {!user ? (
          <div className="hidden md:flex space-x-3">
            <Link
              href="/login"
              className="bg-orange-400/30 hover:bg-orange-400/75 backdrop-blur-sm backdrop-filter text-black px-4 py-2 rounded-lg font-semibold">
              Log-in
            </Link>
            <Link
              href="/signup"
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
              Sign-up
            </Link>
          </div>
        ) : (
          <form action={logout}>
            <Button type="submit">Logout</Button>
          </form>
        )}

        <div className="flex md:hidden right-0">
          {!mobileMenuOpen && (
            <button
              type="button"
              onClick={() => {
                setSideBar(!sideBar);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="text-black">
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
        </div>
        {mobileMenuOpen && (
          <SideBar
            sideBar={sideBar}
            setSideBar={setSideBar}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            navItems={navigationLinks}
            role="Admin"
          />
        )}
      </nav>
    </header>
  );
}
