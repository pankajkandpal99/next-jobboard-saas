import { signIn } from "@/app/utils/auth";

export const handleGithubLogin = async () => {
  "use server";
  await signIn("github", { redirectTo: "/onboarding" });
};

export const handleGoogleLogin = async () => {
  "use server";
  await signIn("google", { redirectTo: "/onboarding" });
};
