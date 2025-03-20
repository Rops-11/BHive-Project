import LoginForm from "@/components/LoginForm";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <Card className="w-1/2 h-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
