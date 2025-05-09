"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AdminHomePage = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex w-5/6 h-1/2 p-10 justify-between items-center ">
        <Link
          className="w-[24%] h-full"
          href="/admin/dashboard">
          <Button className="w-full h-full cursor-pointer">Dashboard</Button>
        </Link>

        <Link
          className="w-[24%] h-full"
          href="/admin/book">
          <Button className="w-full h-full cursor-pointer">Book</Button>
        </Link>

        <Link
          className="w-[24%] h-full"
          href="/admin/rooms">
          <Button className="w-full h-full cursor-pointer">Rooms</Button>
        </Link>

        <Link
          className="w-[24%] h-full"
          href="/admin/inbox">
          <Button className="w-full h-full cursor-pointer">Inbox</Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminHomePage;
