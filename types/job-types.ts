import { Prisma } from "@prisma/client";
import { StaticImageData } from "next/image";

export type Company = {
  id: number;
  name: string;
  logo: StaticImageData;
};

export type Stat = {
  id: number;
  value: string;
  label: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  company: string;
};

export type JobType = "full-time" | "part-time" | "contract" | "internship";

export const jobTypes: JobType[] = [
  "full-time",
  "part-time",
  "contract",
  "internship",
];

export interface iAppJobListingDurationProps {
  days: number;
  price: number;
  description: string;
}

export type ActiveJobPost = Prisma.JobPostGetPayload<{
  select: {
    jobTitle: true;
    id: true;
    salaryFrom: true;
    salaryTo: true;
    employment: true;
    location: true;
    createdAt: true;
    company: {
      select: {
        name: true;
        logo: true;
        location: true;
        about: true;
      };
    };
  };
}>;

export type FetchedJobType = {
  jobData: Prisma.JobPostGetPayload<{
    select: {
      jobTitle: true;
      jobDescription: true;
      location: true;
      employment: true;
      benefits: true;
      listingDuration: true;
      createdAt: true;
      company: {
        select: { name: true; logo: true; location: true; about: true };
      };
    };
  }>;
  savedJob: Prisma.SavedJobPostGetPayload<{
    select: {
      id: true;
    };
  }> | null;
};

export type FavouriteJobType = Prisma.SavedJobPostGetPayload<{
  select: {
    job: {
      select: {
        id: true;
        jobTitle: true;
        salaryFrom: true;
        salaryTo: true;
        employment: true;
        location: true;
        createdAt: true;
        company: {
          select: {
            name: true;
            logo: true;
            location: true;
            about: true;
          };
        };
      };
    };
  };
}>;

export type MyJobType = Prisma.JobPostGetPayload<{
  select: {
    id: true;
    jobTitle: true;
    status: true;
    createdAt: true;
    company: {
      select: {
        name: true;
        logo: true;
      };
    };
  };
}>;

export type EditJobDataType = Prisma.JobPostGetPayload<{
  select: {
    benefits: true;
    id: true;
    jobTitle: true;
    jobDescription: true;
    salaryFrom: true;
    salaryTo: true;
    location: true;
    employment: true;
    listingDuration: true;
    company: {
      select: {
        about: true;
        name: true;
        location: true;
        website: true;
        xAccount: true;
        logo: true;
      };
    };
  };
}>;
