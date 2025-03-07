import { requireUser } from "@/app/utils/requireUser";
import { JobPostType } from "@/app/utils/zodSchema";
import JobForm from "@/components/forms/job/JobForm";
import { getCompany } from "@/lib/services/company";
import { getEditJobData } from "@/lib/services/jobs";
import { notFound, redirect } from "next/navigation";
import React from "react";

type Params = Promise<{ jobId: string }>;

const EditJob = async ({ params }: { params: Params }) => {
  const { jobId } = await params;
  const user = await requireUser();
  const data = await getEditJobData(jobId, user.id as string);

  if (!data) {
    return notFound();
  }

  const company = await getCompany(user.id as string);
  if (!company) {
    redirect("/");
  }

  const transformedData: JobPostType = {
    id: data.id,
    jobTitle: data.jobTitle,
    jobDescription: data.jobDescription,
    listingDuration: data.listingDuration,
    location: data.location,
    salaryFrom: data.salaryFrom,
    salaryTo: data.salaryTo,
    benefits: data.benefits,
    employmentType: data.employment || "",
    companyName: data.company?.name || company.name,
    companyLocation: data.company?.location || company.location,
    companyDescription: data.company?.about || company.about,
    companyLogo: data.company?.logo || company.logo,
    companyWebsite: data.company?.website || company.website,
    companyXAccount: data.company?.xAccount || company.xAccount || "",
  };

  return (
    <div>
      <JobForm
        companyDescription={company?.about}
        companyLocation={company?.location}
        companyWebsite={company?.website}
        companyLogo={company?.logo}
        companyXAccount={company?.xAccount}
        companyName={company?.name}
        initialData={transformedData}
        isEditMode={true}
      />
    </div>
  );
};

export default EditJob;
