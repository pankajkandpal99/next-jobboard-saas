import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import LoginButtons from "./LoginButton";

interface LoginCardProps {
  onGithubLogin: () => void;
  onGoogleLogin: () => void;
}

const LoginCard = ({ onGithubLogin, onGoogleLogin }: LoginCardProps) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription>
          Login with your Google or GitHub account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginButtons
          onGithubLogin={onGithubLogin}
          onGoogleLogin={onGoogleLogin}
        />
      </CardContent>
    </Card>
  );
};

export default LoginCard;
