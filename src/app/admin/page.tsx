"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AdminHomePage = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex w-5/6 h-1/2 p-10 justify-between items-center ">
        <Button className="w-[24%] h-full cursor-pointer">
          <Link href="/admin/dashboard">Dashboard</Link>
        </Button>
        <Button className="w-[24%] h-full cursor-pointer">
          <Link href="/admin/book">Book</Link>
        </Button>
        <Button className="w-[24%] h-full cursor-pointer">
          <Link href="/admin/book">Rooms</Link>
        </Button>
        <Button className="w-[24%] h-full cursor-pointer">
          <Link href="/admin/book">Inbox</Link>
        </Button>
      </div>
      {/* <form
        action={() => {
          logout();
        }}>
        <Button type="submit">Logout</Button>
      </form> */}
    </div>
  );
};

export default AdminHomePage;
