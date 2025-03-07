import React from "react";
import { UserSelectionType } from "../../../types/onboarding-types";
import UserTypeButton from "./UserTypeButton";
import { USER_TYPES } from "../../../constants/onboarding-constants";

interface UserTypeSelectionProps {
  onSelect: (type: UserSelectionType) => void;
}

const UserTypeSelection = ({ onSelect }: UserTypeSelectionProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome! Let&apos;s get started</h2>
        <p className="text-muted-foreground">
          Choose how you would like to use our plateform!
        </p>
      </div>

      <div className="grid gap-4">
        <UserTypeButton type={USER_TYPES.COMPANY} onSelect={onSelect} />
        <UserTypeButton type={USER_TYPES.JOB_SEEKER} onSelect={onSelect} />
      </div>
    </div>
  );
};

export default UserTypeSelection;
