"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "../actions/auth/signInWithGoogle";
import { toast } from "react-toastify";

import { FcGoogle } from "react-icons/fc";

import bhiveLogo from "@/assets/bhivelogo.jpg";

const LoginWithGoogle = () => {
  return (
    <div className="flex flex-col items-center w-full justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-900 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-800 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src={bhiveLogo}
              alt="BHive Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Sign in with your Google account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form
            action={async () => {
              const result = await signInWithGoogle();
              if (result?.error) {
                toast.error(result.error);
              }
            }}
            className="w-full">
            <Button
              type="submit"
              variant="outline"
              className="w-full py-3 text-lg font-medium border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 group">
              <FcGoogle className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Sign In With Google
            </Button>
          </form>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        © {new Date().getFullYear()} BHive Hotel. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginWithGoogle;
