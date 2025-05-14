"use client"; 

import { useEffect, useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { loginUser, type LoginFormState } from "@/app/actions/auth/login";
import { signupUser, type SignupFormState } from "@/app/actions/auth/signup";
import { toast } from "react-toastify";
import SubmitButton from "@/components/Auth/SubmitButton";

const initialLoginState: LoginFormState = {
  message: null,
  errors: {},
  success: false,
};

const initialSignupState: SignupFormState = {
  message: null,
  errors: {},
  success: false,
};

export default function StaffAuth() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Safely used here

  const [activeTab, setActiveTab] = useState("login");

  const [loginState, loginFormAction, isLoginPending] = useActionState(
    loginUser,
    initialLoginState
  );
  const [signupState, signupFormAction, isSignupPending] = useActionState(
    signupUser,
    initialSignupState
  );

  const redirectTo = searchParams.get("redirectTo") || "/admin";
  const messageFromMiddleware = searchParams.get("message");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl === "login" || tabFromUrl === "signup") {
      setActiveTab(tabFromUrl);
    } else if (tabFromUrl) {
      // If tab param exists but is invalid
      setActiveTab("login");
    }
    // If no tab param, it defaults to "login" via useState initial value
  }, [searchParams]);

  useEffect(() => {
    if (signupState.success && signupState.message) {
      toast.success(signupState.message);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("tab", "login");
      if (newSearchParams.has("signupMessage")) {
        // Example: if you used a specific param for this
        newSearchParams.delete("signupMessage");
      }
      // Clear general message param if it was related to signup success
      if (
        messageFromMiddleware &&
        messageFromMiddleware === signupState.message
      ) {
        newSearchParams.delete("message");
      }
      router.replace(`/auth/staff-auth?${newSearchParams.toString()}`);
      setActiveTab("login"); // Ensure local state matches
    }
  }, [
    signupState.success,
    signupState.message,
    router,
    searchParams,
    messageFromMiddleware,
  ]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background px-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.set("tab", value);
          router.push(`/auth/staff-auth?${newSearchParams.toString()}`);
        }}
        className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="space-y-3">
            <CardHeader>
              <CardTitle>Staff Log In</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel.
              </CardDescription>
            </CardHeader>
            <form
              action={loginFormAction}
              className="space-y-3">
              <CardContent className="space-y-4">
                {messageFromMiddleware &&
                  !loginState.message && // Only show middleware message if no form error message
                  activeTab === "login" && (
                    <div className="p-3 text-sm rounded-md bg-blue-100 text-blue-700">
                      {messageFromMiddleware}
                    </div>
                  )}
                {loginState.message && !loginState.success && (
                  <div className="p-3 text-sm rounded-md bg-red-100 text-red-700">
                    {loginState.message}
                  </div>
                )}
                {loginState.errors?.general && (
                  <div className="p-3 text-sm rounded-md bg-red-100 text-red-700">
                    {loginState.errors.general.join(", ")}
                  </div>
                )}
                <input
                  type="hidden"
                  name="redirectTo"
                  value={redirectTo}
                />
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    name="username"
                    type="text"
                    placeholder="your_staff_username"
                    required
                    autoComplete="username"
                  />
                  {loginState.errors?.username && (
                    <p className="text-xs text-red-600">
                      {loginState.errors.username.join(", ")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                  />
                  {loginState.errors?.password && (
                    <p className="text-xs text-red-600">
                      {loginState.errors.password.join(", ")}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton loading={isLoginPending}>Log In</SubmitButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="space-y-3">
            <CardHeader>
              <CardTitle>Staff Sign Up</CardTitle>
              <CardDescription>Create a new staff account.</CardDescription>
            </CardHeader>
            <form
              action={signupFormAction}
              className="space-y-3">
              <CardContent className="space-y-4">
                {signupState.message && !signupState.success && (
                  <div className="p-3 text-sm rounded-md bg-red-100 text-red-700">
                    {signupState.message}
                  </div>
                )}
                {signupState.errors?.general && (
                  <div className="p-3 text-sm rounded-md bg-red-100 text-red-700">
                    {signupState.errors.general.join(", ")}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signup-fullName">Full Name</Label>
                  <Input
                    id="signup-fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                  {signupState.errors?.fullName && (
                    <p className="text-xs text-red-600">
                      {signupState.errors.fullName.join(", ")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    name="username"
                    type="text"
                    placeholder="john_doe_staff"
                    required
                  />
                  {signupState.errors?.username && (
                    <p className="text-xs text-red-600">
                      {signupState.errors.username.join(", ")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                  />
                  {signupState.errors?.password && (
                    <p className="text-xs text-red-600">
                      {signupState.errors.password.join(", ")}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton loading={isSignupPending}>Sign Up</SubmitButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
