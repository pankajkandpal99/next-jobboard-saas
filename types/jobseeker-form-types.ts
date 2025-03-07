import { JobSeekerType } from "@/app/utils/zodSchema";

export type JobSeekerFieldConfig = {
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "file";
};

export type JobSeekerFormConfig = Record<
  keyof JobSeekerType,
  JobSeekerFieldConfig
>;
