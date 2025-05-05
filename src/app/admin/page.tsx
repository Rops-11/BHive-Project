"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { logout } from "utils/actions/auth";

const AdminHomePage = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      AdminHomePage
      <form
        action={() => {
          logout();
        }}>
        <Button type="submit">Logout</Button>
      </form>
    </div>
  );
};

export default AdminHomePage;
