'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";


type Facility = {
  title: string;
  description: string;
  href: string;
};

const facilities: Facility[] = [
  {
    title: "Bar",
    description: "",
    href: "/facilities/spa",
  },
  {
    title: "Benito Cafe",
    description: "Upon entering the lobby of the hotel,  ",
    href: "/facilities/spa",
  },
];

export default function FacilitiesDropdown() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-black font-semibold">
            Facilities
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 sm:w-[400px] sm:grid-cols-2">
              {facilities.map((facility, index) => (
                <li key={index}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={facility.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{facility.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {facility.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
