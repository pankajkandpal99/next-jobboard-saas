"use client";
import { countryList } from "@/app/utils/countryList";
import { useMemo } from "react";

const useCountryList = () => {
  return useMemo(() => {
    return countryList;
  }, []);
};

export default useCountryList;
