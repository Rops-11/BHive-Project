// components/custom/UserAvatar.tsx
"use client"; // This component will use client-side interactions (Popover)

import React from "react";
import { useRouter } from "next/navigation"; // For logout redirect
import { useTransition } from "react"; // For logout pending state

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { logoutUser } from "@/app/actions/auth/login";

import { LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

interface UserAvatarProps {
  align?: "center" | "end" | "start";
  showCheveron?: boolean;
}

export function UserAvatar({
  align = "end",
  showCheveron = false,
}: UserAvatarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { fullName } = useAuth();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    startTransition(async () => {
      await logoutUser();
      router.push("/auth");
      router.refresh();
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0 md:h-10 md:w-auto md:px-3 md:py-2 md:space-x-2">
          <Avatar className="h-8 w-8 md:h-8 md:w-8 border-2 border-transparent group-hover:border-primary transition-colors">
            <AvatarImage
              src="@/assets/bhivelogo.jpg"
              alt={fullName || "User Avatar"}
            />
            <AvatarFallback className="font-semibold">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          {showCheveron && (
            <div className="hidden md:flex md:flex-col md:items-start md:leading-tight">
              <p className="text-xs font-medium truncate max-w-[100px]">
                {fullName}
              </p>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-180" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0"
        align={align}>
        <div className="flex items-center space-x-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="@/assets/bhivelogo.jpg"
              alt={fullName || "User Avatar"}
            />
            <AvatarFallback className="font-semibold">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <p className="font-semibold text-sm truncate">
              {fullName || "User"}
            </p>
          </div>
        </div>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-900/50 dark:hover:text-red-400"
            onClick={handleLogout}
            disabled={isPending}>
            <LogOut className="mr-2 h-4 w-4" />
            {isPending ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
