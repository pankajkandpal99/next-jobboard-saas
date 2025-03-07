import React from "react";
import { UserSelectionType } from "../../../types/onboarding-types";
import { Button } from "@/components/ui/button";
import {
  USER_TYPE_DESCRIPTIONS,
  USER_TYPE_ICONS,
  USER_TYPE_LABELS,
} from "../../../constants/onboarding-constants";

interface UserTypeButtonProps {
  type: Exclude<UserSelectionType, null>;
  onSelect: (type: UserSelectionType) => void;
}

const UserTypeButton = ({ type, onSelect }: UserTypeButtonProps) => {
  const Icon = USER_TYPE_ICONS[type];

  return (
    <Button
      variant="outline"
      onClick={() => onSelect(type)}
      className="w-full h-auto p-6 items-center gap-4 border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5"
    >
      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
        {<Icon className="size-6 text-primary" />}
      </div>

      <div className="text-left">
        <h3 className="font-semibold text-lg">{USER_TYPE_LABELS[type]}</h3>
        <p className="">{USER_TYPE_DESCRIPTIONS[type]}</p>
      </div>
    </Button>
  );
};

export default UserTypeButton;
