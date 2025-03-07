import React from "react";
import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import LoginCard from "./LoginCard";
import { handleGithubLogin, handleGoogleLogin } from "./utils/authUtils";

const LoginForm = async () => {
  const session = await auth();

  if (session?.user) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col gap-6">
      <LoginCard
        onGithubLogin={handleGithubLogin}
        onGoogleLogin={handleGoogleLogin}
      />

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default LoginForm;
