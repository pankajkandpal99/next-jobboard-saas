/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Slider } from "../ui/slider";
import { Control, useController } from "react-hook-form";
import { JobPostType } from "@/app/utils/zodSchema";
import { formatCurrency } from "@/app/utils/formatCurrency";

interface iAppSliderProps {
  control: Control<JobPostType>;
  minSalary: number;
  maxSalary: number;
  step: number;
  currency: string;
}

const SalaryRangeSelector: React.FC<iAppSliderProps> = ({
  control,
  currency,
  maxSalary,
  minSalary,
  step,
}) => {
  const { field: fromField } = useController({
    name: "salaryFrom",
    control,
    defaultValue: minSalary,
  });

  const { field: toField } = useController({
    name: "salaryTo",
    control,
    defaultValue: maxSalary / 2,
  });

  const [range, setRange] = useState<[number, number]>([
    fromField.value || minSalary,
    toField.value || maxSalary / 2,
  ]);

  const handleChangeRange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setRange(newRange);
    fromField.onChange(newRange[0]);
    toField.onChange(newRange[1]);
  };

  return (
    <div className="w-full space-y-4">
      <Slider
        min={minSalary}
        max={maxSalary}
        step={step}
        value={range}
        onValueChange={handleChangeRange}
      />

      <div className="flex justify-between">
        <span>{formatCurrency(range[0])}</span>
        <span>{formatCurrency(range[1])}</span>
      </div>
    </div>
  );
};

export default SalaryRangeSelector;
