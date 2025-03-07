import { redirect } from "next/navigation";
import { prisma } from "../db";

export async function checkIfUserHasFinishedOnboarding(
  userId: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompleted: true },
  });

  if (user?.onboardingCompleted) {
    redirect("/");
  }
}
