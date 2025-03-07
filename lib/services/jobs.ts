import arcjet, { detectBot, tokenBucket } from "@/app/utils/arcjet";
import { prisma } from "@/app/utils/db";
import {
  ActiveJobPost,
  EditJobDataType,
  FavouriteJobType,
  FetchedJobType,
  MyJobType,
} from "@/types";
import { JobPostStatus } from "@prisma/client";
import { notFound } from "next/navigation";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
  })
);

// unauthenticated user have 10req per 60s and 30req with authenticated users
export function getClient(session: boolean) {
  if (session) {
    return aj.withRule(
      tokenBucket({
        mode: "DRY_RUN",
        capacity: 100,
        interval: "60s",
        refillRate: 30,
      })
    );
  } else {
    return aj.withRule(
      tokenBucket({
        mode: "DRY_RUN",
        capacity: 100,
        interval: "60s",
        refillRate: 10,
      })
    );
  }
}

export const getActiveJobs = async ({
  page = 1,
  pageSize = 2,
  jobTypes = [],
  location = "",
}: {
  page: number;
  pageSize: number;
  jobTypes: string[];
  location: string;
}): Promise<{ jobs: ActiveJobPost[]; totalPages: number } | null> => {
  const skip = (page - 1) * pageSize;
  const where = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employment: {
        in: jobTypes,
      },
    }),
    ...(location &&
      location !== "worldwide" && {
        location: location,
      }),
  };

  try {
    const [data, totalCount] = await Promise.all([
      await prisma.jobPost.findMany({
        where: where,
        take: pageSize,
        skip: skip,
        select: {
          jobTitle: true,
          id: true,
          salaryFrom: true,
          salaryTo: true,
          employment: true,
          location: true,
          createdAt: true,
          company: {
            select: {
              name: true,
              logo: true,
              location: true,
              about: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobPost.count({
        where: { status: "ACTIVE" },
      }),
    ]);

    return { jobs: data, totalPages: Math.ceil(totalCount / pageSize) };
  } catch (error) {
    console.error("Error fetching active jobs:", error);
    return null;
  }
};

export const getJob = async (
  jobId: string,
  userId?: string
): Promise<FetchedJobType | null> => {
  try {
    const [jobData, savedJob] = await Promise.all([
      await prisma.jobPost.findUnique({
        where: { id: jobId, status: "ACTIVE" },
        select: {
          jobTitle: true,
          jobDescription: true,
          location: true,
          employment: true,
          benefits: true,
          listingDuration: true,
          createdAt: true,
          company: {
            select: { name: true, logo: true, location: true, about: true },
          },
        },
      }),

      userId
        ? prisma.savedJobPost.findUnique({
            where: { userId_jobId: { userId, jobId } },
            select: { id: true },
          })
        : null,
    ]);

    if (!jobData) {
      return notFound();
    }

    return { jobData, savedJob: savedJob ? savedJob : null };
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
};

export const getFavourites = async (
  userId: string
): Promise<FavouriteJobType[] | null> => {
  try {
    const data = await prisma.savedJobPost.findMany({
      where: { userId: userId },
      select: {
        job: {
          select: {
            id: true,
            jobTitle: true,
            salaryFrom: true,
            salaryTo: true,
            employment: true,
            location: true,
            createdAt: true,
            company: {
              select: {
                name: true,
                logo: true,
                location: true,
                about: true,
              },
            },
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching favourite job:", error);
    return null;
  }
};

export const myJobs = async (userId: string): Promise<MyJobType[] | null> => {
  try {
    const data = await prisma.jobPost.findMany({
      where: { company: { userId: userId } },
      select: {
        id: true,
        jobTitle: true,
        status: true,
        createdAt: true,
        company: { select: { name: true, logo: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return data;
  } catch (error) {
    console.error("Error fetching my job service :", error);
    return null;
  }
};

export const getEditJobData = async (
  jobId: string,
  userId: string
): Promise<EditJobDataType | null> => {
  try {
    const data = await prisma.jobPost.findUnique({
      where: { id: jobId, company: { userId: userId } },
      select: {
        benefits: true,
        id: true,
        jobTitle: true,
        jobDescription: true,
        salaryFrom: true,
        salaryTo: true,
        location: true,
        employment: true,
        listingDuration: true,
        company: {
          select: {
            about: true,
            name: true,
            location: true,
            website: true,
            xAccount: true,
            logo: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching job for edit :", error);
    return null;
  }
};

export type { ActiveJobPost };
