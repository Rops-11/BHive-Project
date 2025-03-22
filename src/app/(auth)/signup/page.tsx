import SignUpForm from "@/components/SignUpForm";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

const SignUp = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <Card className="w-1/2 h-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
