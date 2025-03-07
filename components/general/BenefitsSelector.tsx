import { benefits } from "@/app/utils/listOfBenefits";
import React from "react";
import { Badge } from "../ui/badge";
import { ControllerRenderProps } from "react-hook-form";
import { JobPostType } from "@/app/utils/zodSchema";

interface iAppBenefitsProps {
  field: ControllerRenderProps<JobPostType, "benefits">;
}

const BenefitsSelector = ({ field }: iAppBenefitsProps) => {
  const toggleBenefit = (benefitId: string) => {
    const currentBenefits = field.value || [];

    const newBenefits = currentBenefits.includes(benefitId)
      ? currentBenefits.filter((id) => id !== benefitId)
      : [...currentBenefits, benefitId];

    field.onChange(newBenefits);
  };

  return (
    <div className="">
      <div className="flex flex-wrap gap-3">
        {benefits.map((benefit) => {
          const isSelected = (field.value || []).includes(benefit.id);

          return (
            <Badge
              key={benefit.id}
              variant={isSelected ? "default" : "outline"}
              onClick={() => toggleBenefit(benefit.id)}
              className={`cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm dark:prose-invert px-4 py-1.5 rounded-full ${
                isSelected && "text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                {benefit.icon}
                {benefit.label}
              </span>
            </Badge>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Selected Benefits :{" "}
        <span className="text-primary">{(field.value || []).length}</span>
      </div>
    </div>
  );
};

export default BenefitsSelector;
