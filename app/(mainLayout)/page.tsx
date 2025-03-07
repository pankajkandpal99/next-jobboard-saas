import JobFilters from "@/components/general/JobFilters";
import JobListings from "@/components/general/JobListings";
import SuspenseJobListing from "@/components/general/SuspenseJobListing";
import React, { Suspense } from "react";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
    jobTypes?: string;
    location?: string;
  }>;
};

const Home = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const jobTypes = params.jobTypes?.split(",") || [];
  const location = params.location || "";

  const filterKey = `page=${currentPage};types=${jobTypes.join(
    ","
  )};location=${location}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <JobFilters />
      </div>

      <div className="md:col-span-2 flex flex-col gap-6">
        <Suspense fallback={<SuspenseJobListing />} key={filterKey}>
          <JobListings
            currentPage={currentPage}
            jobTypes={jobTypes}
            location={location}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
