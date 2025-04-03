"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function DropdownMenuRoot({ children }: { children: React.ReactNode }) {
  return <DropdownMenu.Root>{children}</DropdownMenu.Root>;
}

export function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  return <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>;
}

export function DropdownMenuContent({ children }: { children: React.ReactNode }) {
  return <DropdownMenu.Content className="bg-white shadow-md rounded p-2">{children}</DropdownMenu.Content>;
}

export function DropdownMenuItem({ children }: { children: React.ReactNode }) {
  return <DropdownMenu.Item className="p-2 cursor-pointer hover:bg-gray-200">{children}</DropdownMenu.Item>;
}
