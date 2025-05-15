"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

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
  const { fullName: contextFullName, setFullNameState } = useAuth();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const displayName = isClient ? contextFullName : null;

  const getInitials = (name?: string | null): string => {
    if (!name || name.trim() === "") return "U";
    const names = name
      .trim()
      .split(" ")
      .filter((n) => n);
    if (names.length === 0) return "U";
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, Math.min(2, names[0].length)).toUpperCase();
  };

  const initials = getInitials(displayName);

  const handleLogout = async () => {
    startTransition(async () => {
      if (setFullNameState) {
        setFullNameState(null);
      }

      await logoutUser();

      router.refresh();
    });
  };

  const avatarImageSrc = "@/assets/bhivelogo.jpg";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="group relative h-10 w-10 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0 md:h-10 md:w-auto md:px-3 md:py-2 md:space-x-2">
          <Avatar className="h-8 w-8 md:h-8 md:w-8 border-2 border-transparent group-hover:border-primary transition-colors">
            {}
            <AvatarImage
              src={avatarImageSrc}
              alt={displayName || "User Avatar"}
            />
            <AvatarFallback className="font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {showCheveron && isClient && displayName && (
            <div className="hidden md:flex md:flex-col md:items-start md:leading-tight">
              <p className="text-xs font-medium truncate max-w-[100px]">
                {displayName}
              </p>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-180" />
            </div>
          )}
          {}
          {showCheveron && (!isClient || !displayName) && (
            <div className="hidden md:flex md:items-center">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
              src={avatarImageSrc}
              alt={displayName || "User Avatar"}
            />
            <AvatarFallback className="font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <p className="font-semibold text-sm truncate">
              {displayName || "User"}
            </p>
            {}
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
