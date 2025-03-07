import { redirect } from "next/navigation";
import { auth } from "./auth";
import { User } from "next-auth";

export const requireUser = async (): Promise<User> => {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  return session.user;
};
