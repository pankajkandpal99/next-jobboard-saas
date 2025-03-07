import Link from "next/link";
import React from "react";
import { Card, CardHeader } from "../ui/card";
import { ActiveJobPost } from "@/lib/services/jobs";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { MapPin } from "lucide-react";
import formatRelativeTime from "@/app/utils/formatRelativeTime";

interface iAppJobCardProps {
  job: ActiveJobPost;
}

const JobCard = ({ job }: iAppJobCardProps) => {
  return (
    <Link href={`/job/${job.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Company Logo */}
            <Image
              src={job.company.logo}
              alt={job.company.name}
              width={48}
              height={48}
              className="size-12 rounded-lg"
            />

            {/* Job Details */}
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h1 className="text-xl md:text-2xl font-bold">
                  {job.jobTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {job.company.name}
                  </p>
                  <span className="hidden md:inline text-muted-foreground">
                    *
                  </span>
                  <Badge className="rounded-full" variant="secondary">
                    {job.employment}
                  </Badge>

                  <span className="hidden md:inline text-muted-foreground">
                    *
                  </span>
                  <Badge className="rounded-full text-gray-200">
                    {job.location}
                  </Badge>

                  <span className="hidden md:inline text-muted-foreground">
                    *
                  </span>

                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(job.salaryFrom)} -{" "}
                    {formatCurrency(job.salaryTo)}
                  </p>
                </div>
              </div>

              {/* Location and Posted Date */}
              <div className="md:ml-auto text-right">
                <div className="flex items-center gap-2 justify-end">
                  <MapPin className="size-4" />
                  <h1 className="">{job.location}</h1>
                </div>

                <p className="text-sm text-muted-foreground md:text-right">
                  {formatRelativeTime(job.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Company About */}
          <p className="text-base text-muted-foreground line-clamp-2 !mt-5">
            {job.company.about}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default JobCard;
