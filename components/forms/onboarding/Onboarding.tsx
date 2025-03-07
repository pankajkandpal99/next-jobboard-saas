"use client";
import CompanyLogo from "@/components/companyLogo/Logo";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect } from "react";
import UserTypeSelection from "./UserTypeSelection";
import { UserSelectionType } from "../../../types/onboarding-types";
import { USER_TYPES } from "../../../constants/onboarding-constants";
import CompanyForm from "./CompanyForm";
import JobSeekerForm from "./JobSeekerForm";
import { useRouter, useSearchParams } from "next/navigation";

const OnboardingForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("user_type") as UserSelectionType;

  const handleUserTypeSelection = (type: UserSelectionType) => {
    const userTypeParam = type === USER_TYPES.COMPANY ? "company" : "jobseeker";
    router.push(`/onboarding?user_type=${userTypeParam}`);
  };

  useEffect(() => {
    if (
      userType &&
      userType.toString() !== "company" &&
      userType.toString() !== "jobseeker"
    ) {
      router.replace("/onboarding");
    }
  }, [userType, router]);

  const renderContent = () => {
    if (
      !userType ||
      (userType.toString() !== "company" && userType.toString() !== "jobseeker")
    ) {
      return <UserTypeSelection onSelect={handleUserTypeSelection} />;
    }

    if (
      userType.toString() !== "company" &&
      userType.toString() !== "jobseeker"
    ) {
      router.replace("/onboarding");
      return <UserTypeSelection onSelect={handleUserTypeSelection} />;
    }

    return userType === "company" ? <CompanyForm /> : <JobSeekerForm />;
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-5">
        <CompanyLogo width={50} height={50} />
        <h1 className="text-4xl font-bold">
          Job <span className="text-primary">Marshal</span>
        </h1>
      </div>

      <Card className="max-w-lg w-full ">
        <CardContent className="p-6">{renderContent()}</CardContent>
      </Card>
    </>
  );
};

export default OnboardingForm;
