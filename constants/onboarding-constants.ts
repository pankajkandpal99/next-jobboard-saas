import { Building2, User2Icon } from "lucide-react";

export const USER_TYPES = {
  COMPANY: "company",
  JOB_SEEKER: "jobSeeker",
} as const;

export const USER_TYPE_LABELS = {
  [USER_TYPES.COMPANY]: "Company / Organization",
  [USER_TYPES.JOB_SEEKER]: "Job Seeker",
};

export const USER_TYPE_DESCRIPTIONS = {
  [USER_TYPES.COMPANY]: "Post jobs and find exceptional talent",
  [USER_TYPES.JOB_SEEKER]: "Find your dream job opportunity",
};

export const USER_TYPE_ICONS = {
  [USER_TYPES.COMPANY]: Building2,
  [USER_TYPES.JOB_SEEKER]: User2Icon,
};
