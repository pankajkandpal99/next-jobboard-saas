import { saveJobPost, unSaveJobPost } from "@/app/actions";
import { auth } from "@/app/utils/auth";
import { getFlagEmoji } from "@/app/utils/countryList";
import { benefits } from "@/app/utils/listOfBenefits";
import JsonToHtml from "@/components/general/JsonToHtml";
import { SaveJobButton } from "@/components/general/SubmitButtons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getClient, getJob } from "@/lib/services/jobs";
import { cn } from "@/lib/utils";
import { request } from "@arcjet/next";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type iParams = Promise<{ jobId: string }>;

const JobIdPage = async ({ params }: { params: iParams }) => {
  const { jobId } = await params;
  const session = await auth();

  const req = await request();
  const decision = await getClient(!!session).protect(req, { requested: 10 });

  if (decision.isDenied()) {
    throw new Error("forbidden");
  }

  const jobResult = await getJob(jobId as string, session?.user?.id as string);
  if (!jobResult) {
    throw new Error("Job not found");
  }

  const { jobData: data, savedJob } = jobResult;
  const locationFlag = getFlagEmoji(data?.location as string);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="col-span-2 space-y-8 my-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="">
            <h1 className="text-3xl font-bold">{data?.jobTitle}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-medium">{data?.company.name}</span>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full" variant="secondary">
                {data?.employment}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full text-white">
                {locationFlag && <span className="mr-1">{locationFlag}</span>}{" "}
                {data?.location}
              </Badge>
            </div>
          </div>

          {session?.user ? (
            <form
              action={async () => {
                "use server";
                if (savedJob) {
                  await unSaveJobPost(savedJob.id);
                } else {
                  await saveJobPost(jobId);
                }
              }}
            >
              <SaveJobButton savedJob={!!savedJob} />
            </form>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline" })}
            >
              <Heart className="size-4" />
              Save Job
            </Link>
          )}
        </div>

        <section>
          <JsonToHtml json={JSON.parse(data?.jobDescription as string)} />
        </section>

        <section>
          <h3 className="font-semibold mb-4">
            Benefits{" "}
            <span className="text-sm text-muted-foreground font-normal">
              (green is offered)
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = data?.benefits.includes(benefit.id);
              return (
                <Badge
                  key={benefit.id}
                  variant={isOffered ? "default" : "outline"}
                  className={cn(
                    isOffered ? "" : "opacity-75 cursor-not-allowed",
                    "text-sm px-4 py-1.5 rounded-full"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>

      <div className="col-span-1 space-y-6 my-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="">
              <h3 className="font-semibold">Apply now</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please let {data?.company.name} know you found this job on
                JobMarshal. This helps us grow!
              </p>
            </div>

            <Button className="w-full text-white">Apply now</Button>
          </div>
        </Card>

        {/* Job details */}
        <Card className="p-6 space-y-2">
          <h3 className="font-semibold">About the Job</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Apply before
              </span>
              <span className="text-sm">
                {new Date(
                  (data?.createdAt?.getTime() ?? 0) +
                    (data?.listingDuration ?? 0) * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Posted on</span>
              <span>
                {data?.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Employment Type
              </span>
              <span>{data?.employment}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span>{data?.location}</span>
            </div>
          </div>
        </Card>

        {/* Company details */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src={data?.company.logo as string}
                alt="Company Logo"
                height={48}
                width={48}
                className="rounded-full size-12"
              />

              <div className="flex flex-col">
                <h3 className="font-semibold">{data?.company.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {data?.company.about}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobIdPage;
