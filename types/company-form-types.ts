import { CompanyType } from "@/app/utils/zodSchema";

export type CompanyFieldConfig = {
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select" | "image";
};

export type CompanyFormConfig = Record<keyof CompanyType, CompanyFieldConfig>;
