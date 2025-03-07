import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ControllerRenderProps } from "react-hook-form";
import { JobPostType } from "@/app/utils/zodSchema";
import { jobListingDurationPricing } from "@/constants";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface iAppJobListingDurationProps {
  field: ControllerRenderProps<JobPostType, "listingDuration">;
}

const JobListingDuration: React.FC<iAppJobListingDurationProps> = ({
  field,
}) => {
  return (
    <RadioGroup
      value={field.value?.toString()}
      onValueChange={(value) => field.onChange(parseInt(value))}
    >
      <div className="flex flex-col gap-4">
        {jobListingDurationPricing.map((duration, index) => (
          <div key={index} className="relative">
            <RadioGroupItem
              value={duration.days.toString()}
              id={duration.days.toString()}
              className="sr-only"
            />

            <Label
              htmlFor={duration.days.toString()}
              className="flex flex-col cursor-pointer"
            >
              <Card
                className={cn(
                  field.value === duration.days
                    ? "border-primary bg-primary/10"
                    : "hover:bg-secondary/50",
                  "p-4 border-2 transition-all"
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="">
                    <p className="font-semibold text-lg">{duration.days}</p>
                    <p className="text-sm text-muted-foreground">
                      {duration.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-xl">${duration.price}</p>
                    <p className="text-sm text-muted-foreground">
                      {(duration.price / duration.days).toFixed(2)}/days
                    </p>
                  </div>
                </div>
              </Card>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};

export default JobListingDuration;
