"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import CountrySelect from "./CountrySelect";
import { jobTypes } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const JobFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filters from the URL
  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];
  const currentLocation = searchParams.get("location") || "";
  const [selectedCountry, setSelectedCountry] = useState("");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    router.push(`?${createQueryString("location", value)}`);
  };

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    const current = new Set(currentJobTypes);

    if (checked) {
      current.add(jobType);
    } else {
      current.delete(jobType);
    }

    const newValue = Array.from(current).join(",");
    router.push(`?${createQueryString("jobTypes", newValue)}`);
  };

  const clearAllFilter = () => {
    setSelectedCountry("");
    router.push("/");
  };

  return (
    <Card className="w-full h-fit">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl md:text-2xl font-semibold">
          Filters
        </CardTitle>

        <Button
          onClick={clearAllFilter}
          variant="destructive"
          size="sm"
          className="h-8"
        >
          <span>Clear All</span>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6">
        <div className="space-y-3 mt-2">
          <Label className="text-lg font-semibold">Job Type</Label>
          <div className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {jobTypes.map((jobType, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={jobType}
                  onCheckedChange={(checked) =>
                    handleJobTypeChange(jobType, checked as boolean)
                  }
                  checked={currentJobTypes.includes(jobType)}
                />
                <Label htmlFor={jobType} className="text-sm font-medium">
                  {jobType}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-lg font-semibold">Location</Label>

          <CountrySelect
            onChange={handleCountryChange}
            value={currentLocation}
            placeholder="Select Location"
            label="Location"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFilters;
