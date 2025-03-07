import { z } from "zod";
import { benefits } from "./listOfBenefits";
import { jobListingDurationPricing } from "@/constants";

export const companySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(50, "Company name must be at most 50 characters")
    .trim(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be at most 100 characters")
    .trim(),
  about: z
    .string()
    .min(
      10,
      "Please provide more information about your company (at least 10 characters)"
    )
    .max(500, "About section must be at most 500 characters")
    .trim(),
  logo: z.string().min(1, "Please upload a logo"),
  website: z.string().url("Please enter a valid website URL"),
  xAccount: z
    .string()
    .optional()
    .default("")
    .refine(
      (value) => {
        if (value && value.trim() !== "") {
          return /^@?(\w){1,15}$/.test(value);
        }
        return true;
      },
      { message: "Please enter a valid X (Twitter) handle" }
    ),
});

export const jobSeekerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
    .trim(),
  about: z
    .string()
    .min(
      19,
      "Please provide more information about yourself (at least 10 characters)"
    )
    .max(500, "About section must be at most 500 characters")
    .trim(),
  resume: z.string().min(1, "Please upload a resume"),
});

const validListingDurations = jobListingDurationPricing.map(
  (option) => option.days
);

export const jobPostSchema = z.object({
  id: z.string().optional(),
  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title cannot exceed 100 characters"),

  employmentType: z.string().min(1, "Please select an employment type"),

  location: z
    .string()
    .min(1, "Please select a location")
    .max(100, "Location cannot exceed 100 characters"),

  salaryFrom: z
    .number()
    .min(0, "Salary must be a positive number")
    .max(1_000_000, "Salary cannot exceed $1,000,000"),

  salaryTo: z
    .number()
    .min(0, "Salary must be a positive number")
    .max(1_000_000, "Salary cannot exceed $1,000,000"),

  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters")
    .max(10_000, "Job description cannot exceed 10,000 characters"),

  benefits: z
    .array(z.string())
    .min(1, "Please select at least one benefit")
    .max(10, "You cannot select more than 10 benefits")
    .refine(
      (selectedBenefits) =>
        selectedBenefits.every((benefit) =>
          benefits.some((b) => b.id === benefit)
        ),
      "One or more selected benefits are invalid"
    ),

  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name cannot exceed 100 characters"),

  companyLocation: z
    .string()
    .min(1, "Company location is required")
    .max(100, "Company location cannot exceed 100 characters"),

  companyLogo: z.string().min(1, "Company logo is required"),

  companyWebsite: z.string().min(1, "Company website is required"),

  companyXAccount: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value && value.trim() !== "") {
          return /^@?(\w){1,15}$/.test(value);
        }
        return true;
      },
      { message: "Invalid X (Twitter) handle" }
    ),

  companyDescription: z
    .string()
    .min(10, "Company description must be at least 10 characters")
    .max(2_000, "Company description cannot exceed 2,000 characters"),

  listingDuration: z
    .number()
    .min(1, "Listing duration must be at least 1 day")
    .max(365, "Listing duration cannot exceed 365 days")
    .refine(
      (value) => validListingDurations.includes(value),
      `Invalid listing duration. Must be one of: ${validListingDurations.join(
        ", "
      )} days`
    ),
});

export type CompanyType = z.infer<typeof companySchema>;
export type JobSeekerType = z.infer<typeof jobSeekerSchema>;
export type JobPostType = z.infer<typeof jobPostSchema>;
