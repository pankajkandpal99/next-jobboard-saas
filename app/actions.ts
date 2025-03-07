"use server";
import { redirect } from "next/navigation";
import { prisma } from "./utils/db";
import { requireUser } from "./utils/requireUser";
import {
  companySchema,
  CompanyType,
  jobPostSchema,
  JobPostType,
  jobSeekerSchema,
  JobSeekerType,
} from "./utils/zodSchema";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { ArcjetMode, request } from "@arcjet/next";
import { stripe } from "./utils/stripe";
import { jobListingDurationPricing } from "@/constants";
import { inngest } from "./utils/inngest/client";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    shield({
      mode: process.env.ARCJET_SHIELD_MODE! as ArcjetMode, // DRY_RUN for development and LIVE mode for production....
    })
  )
  .withRule(
    detectBot({
      mode: process.env.ARCJET_BOT_MODE! as ArcjetMode,
      allow: [],
    })
  );

export async function createCompany(data: CompanyType) {
  try {
    const user = await requireUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const req = await request();
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      console.log("Arcjet decision details:", decision);
      throw new Error("Request blocked by security check");
    }

    const validationResult = companySchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      throw new Error("Invalid company data");
    }

    const validatedData = validationResult.data;

    const existingCompany = await prisma.company.findFirst({
      where: { userId: user.id },
    });

    if (existingCompany) {
      throw new Error("User already has a company");
    }

    // Use a transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Update the user and create the company in a single transaction
      await tx.user.update({
        where: { id: user.id },
        data: {
          onboardingCompleted: true,
          userType: "COMPANY",
          Company: {
            create: { ...validatedData },
          },
        },
      });
    });

    redirect("/");
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Error creating company:", error);
      throw new Error("Failed to create company");
    }
    throw error;
  }
}

export async function createJobSeeker(data: JobSeekerType) {
  try {
    const user = await requireUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const req = await request();
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      console.log("Arcjet decision details:", decision);
      throw new Error("Request blocked by security check");
    }

    const validationResult = jobSeekerSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      throw new Error("Invalid jobseeker data");
    }

    const validatedData = validationResult.data;

    const existJobSeeker = await prisma.jobSeeker.findFirst({
      where: { userId: user.id },
    });

    if (existJobSeeker) {
      throw new Error("User already has a jobseeker profile");
    }

    // Use a transaction to ensure atomicity, Update the user and create the jobseeker in a single transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          onboardingCompleted: true,
          userType: "JOB_SEEKER",
          JobSeeker: {
            create: { ...validatedData },
          },
        },
      });
    });

    redirect("/");
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Error creating company:", error);
      throw new Error("Failed to create company");
    }
    throw error;
  }
}

export async function createJob(data: JobPostType) {
  try {
    const user = await requireUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const req = await request();
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      throw new Error("Request blocked by security check");
    }

    const validationResult = jobPostSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      throw new Error("Invalid job post data");
    }

    const validatedData = validationResult.data;

    const company = await prisma.company.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        user: {
          select: { stripeCustomerId: true },
        },
      },
    });

    if (!company?.id) {
      throw new Error("Company not found for the authenticated user");
    }

    let stripeCustomerId = company.user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: user.name as string,
        email: user.email as string,
      });

      stripeCustomerId = customer.id;

      // update user with stripe customer id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Get price from pricing tiers based on duration
    const pricingTier = jobListingDurationPricing.find(
      (tier) => tier.days === validatedData.listingDuration
    );

    if (!pricingTier) {
      throw new Error("Invalid Listing duration selected");
    }

    const jobPost = await prisma.$transaction(async (tx) => {
      return await tx.jobPost.create({
        data: {
          jobDescription: validatedData.jobDescription,
          jobTitle: validatedData.jobTitle,
          employment: validatedData.employmentType,
          location: validatedData.location,
          salaryFrom: validatedData.salaryFrom,
          salaryTo: validatedData.salaryTo,
          listingDuration: validatedData.listingDuration,
          benefits: validatedData.benefits,
          companyId: company?.id,
        },
      });
    });

    // timer start to track how many days user gets subscription.... and change tha value after complete days like 30, 60 or 90 days subscription....
    await inngest.send({
      name: "job/created",
      data: {
        jobId: jobPost.id,
        expirationDays: validatedData.listingDuration,
      },
    });

    // create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            product_data: {
              name: `Job Posting - ${pricingTier.days} Days`,
              description: pricingTier.description,
              images: [
                "https://7by4x7oy59.ufs.sh/f/SjffB9XsH483CdoYeBJ1jXIaAtewKxiFr4VWsM6q21fSyJgY",
              ],
            },
            currency: "USD",
            unit_amount: pricingTier.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { jobId: jobPost.id },
      success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
    });

    redirect(session.url as string);
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Error posting job :", error);
      throw new Error("Failed to post a job");
    }
    throw error;
  }
}

export async function saveJobPost(jobId: string) {
  try {
    const user = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      throw new Error("forbidden");
    }

    await prisma.savedJobPost.create({
      data: {
        jobId: jobId,
        userId: user.id as string,
      },
    });

    revalidatePath(`/job/${jobId}`);
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Error saving job :", error);
      throw new Error("Failed to saved a job");
    }
    throw error;
  }
}

export async function unSaveJobPost(savedJobPostId: string) {
  try {
    const user = await requireUser();

    const req = await request();
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      throw new Error("forbidden");
    }

    const data = await prisma.savedJobPost.delete({
      where: { id: savedJobPostId, userId: user.id as string },
      select: { jobId: true },
    });

    revalidatePath(`/job/${data.jobId}`);
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Error saving job :", error);
      throw new Error("Failed to saved a job");
    }
    throw error;
  }
}

export async function updateJobPostData(jobPostId: string, data: JobPostType) {
  try {
    const user = await requireUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const req = await request();
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      throw new Error("Request blocked by security check");
    }

    // console.log(data);

    const validationResult = jobPostSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      throw new Error("Invalid job post data");
    }

    const validatedData = validationResult.data;

    await prisma.$transaction(async (tx) => {
      return await tx.jobPost.update({
        where: { id: jobPostId, company: { userId: user.id } },
        data: {
          jobDescription: validatedData.jobDescription,
          jobTitle: validatedData.jobTitle,
          employment: validatedData.employmentType,
          location: validatedData.location,
          salaryFrom: validatedData.salaryFrom,
          salaryTo: validatedData.salaryTo,
          listingDuration: validatedData.listingDuration,
          benefits: validatedData.benefits,
        },
      });
    });

    return redirect("/my-jobs");
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Error updating job :", error);
      throw new Error("Failed to update a job");
    }
    throw error;
  }
}

export async function deleteJobPostData(jobPostId: string) {
  try {
    const user = await requireUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const req = await request();
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      throw new Error("Request blocked by security check");
    }

    await prisma.jobPost.delete({
      where: { id: jobPostId, company: { userId: user.id } },
    });

    // job post has also cancelled after successfully deletion job post...
    await inngest.send({
      name: "job/cancel.expiration",
      data: { jobId: jobPostId },
    });

    return redirect("/my-jobs");
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Error updating job :", error);
      throw new Error("Failed to update a job");
    }
    throw error;
  }
}
