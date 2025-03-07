import React from "react";
import EmptyState from "./EmptyState";
import JobCard from "./JobCard";
import { getActiveJobs } from "@/lib/services/jobs";
import MainPagination from "./MainPagination";
import { ActiveJobPost } from "@/types";

const JobListings = async ({
  currentPage,
  jobTypes,
  location,
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
}) => {
  const response = await getActiveJobs({
    page: currentPage,
    pageSize: 2,
    jobTypes: jobTypes,
    location,
  });
  const jobs = response?.jobs || [];
  const totalPages = response?.totalPages || 0;

  return (
    <div className="w-full">
      {jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {jobs?.map((job: ActiveJobPost, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[50vh]">
          <EmptyState
            title="No jobs found"
            description="Try searching for a different job title or location"
            href="/"
            buttonText="Clear all filters"
          />
        </div>
      )}

      {/* Pagination */}
      {jobs && jobs.length > 0 && (
        <div className="flex justify-center items-center mt-8">
          <MainPagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
};

export default JobListings;
