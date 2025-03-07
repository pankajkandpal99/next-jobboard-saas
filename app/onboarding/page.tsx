import OnboardingForm from "@/components/forms/onboarding/Onboarding";
import React from "react";
import { requireUser } from "../utils/requireUser";
import { checkIfUserHasFinishedOnboarding } from "../utils/onboarding/onboarding";

const OnboardingPage = async () => {
  const user = await requireUser();
  await checkIfUserHasFinishedOnboarding(user?.id as string);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center py-10">
      <OnboardingForm />
    </div>
  );
};

export default OnboardingPage;
