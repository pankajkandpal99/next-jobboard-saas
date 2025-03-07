import { requireUser } from "@/app/utils/requireUser";
import EmptyState from "@/components/general/EmptyState";
import JobCard from "@/components/general/JobCard";
import { getFavourites } from "@/lib/services/jobs";
import React from "react";

const FaouritePage = async () => {
  const user = await requireUser();
  const data = await getFavourites(user.id as string);

  if (data && data.length === 0) {
    return (
      <EmptyState
        title="No Favourites found"
        buttonText="Find a job"
        description="You don't have any favourites yet."
        href="/"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 mt-5 gap-2">
      {data?.map((favourite) => (
        <JobCard key={favourite.job.id} job={favourite.job} />
      ))}
    </div>
  );
};

export default FaouritePage;
