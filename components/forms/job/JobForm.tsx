"use client";
import { createJob, updateJobPostData } from "@/app/actions";
import { jobPostSchema, JobPostType } from "@/app/utils/zodSchema";
import BenefitsSelector from "@/components/general/BenefitsSelector";
import CountrySelect from "@/components/general/CountrySelect";
import JobListingDuration from "@/components/general/JobListingDuration";
import SalaryRangeSelector from "@/components/general/SalaryRangeSelector";
import { UploadDropzone } from "@/components/general/UploadThingReexported";
import JobDescriptionEditor from "@/components/richTextEditor/JobDescriptionEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface iAppJobFormProps {
  companyLocation: string;
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  companyWebsite: string;
  companyXAccount?: string | null;
  initialData?: JobPostType; // Add initialData prop for edit mode
  isEditMode?: boolean; // Add isEditMode prop to distinguish between create and edit
}

const JobForm = ({
  companyLocation,
  companyName,
  companyDescription,
  companyLogo,
  companyWebsite,
  companyXAccount,
  initialData,
  isEditMode = false,
}: iAppJobFormProps) => {
  const [pending, setPending] = useState<boolean>(false);

  const form = useForm<JobPostType>({
    resolver: zodResolver(jobPostSchema),
    defaultValues:
      isEditMode && initialData
        ? initialData
        : {
            benefits: [],
            companyDescription: companyDescription,
            companyLocation: companyLocation,
            companyName: companyName,
            companyLogo: companyLogo,
            companyWebsite: companyWebsite,
            companyXAccount: companyXAccount || "",
            employmentType: "",
            jobDescription: "",
            jobTitle: "",
            location: "",
            listingDuration: 30,
            salaryFrom: 0,
            salaryTo: 0,
          },
  });

  const onSubmit = async (data: JobPostType) => {
    setPending(true);
    try {
      if (isEditMode && initialData?.id) {
        await updateJobPostData(initialData.id, data);
      } else {
        await createJob(data);
      }
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.error(
          `Something went wrong in ${
            isEditMode ? "updating" : "creating"
          } job : ${error}`
        );
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="col-span-1 lg:col-span-2 flex flex-col gap-8 lg:mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Employment Type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Employment Type</SelectLabel>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">
                              Internship
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Location</FormLabel>
                    <CountrySelect
                      onChange={field.onChange}
                      value={field.value}
                      label="Location"
                      placeholder="Enter Location"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <SalaryRangeSelector
                    control={form.control}
                    minSalary={10000}
                    maxSalary={1000000} // 1 million dollor
                    currency="USD"
                    step={2000}
                  />
                </FormControl>
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <JobDescriptionEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <BenefitsSelector field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Location</FormLabel>
                    <CountrySelect
                      onChange={field.onChange}
                      value={field.value}
                      label="Location"
                      placeholder="Select Location"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Website..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyXAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company X Account</FormLabel>
                    <FormControl>
                      <Input placeholder="Company x account" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px]"
                      placeholder="Say something about your company"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <div>
                      {field.value ? (
                        <div className="relative w-fit">
                          <Image
                            src={field.value}
                            alt="Company Logo"
                            width={100}
                            height={100}
                            className="rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 "
                            onClick={() => field.onChange("")}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            field.onChange(res[0].url);
                          }}
                          onUploadError={() => {
                            console.error(
                              "Error occured while uploading Job form uploading logo"
                            );
                          }}
                          className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 cursor-pointer ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary ut-button:outline-none ut-button:border-none"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Listing Duration</CardTitle>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="listingDuration"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <JobListingDuration field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full text-white" disabled={pending}>
          {pending
            ? isEditMode
              ? "Updating..."
              : "Posting..."
            : isEditMode
            ? "Update Job"
            : "Post Job"}
        </Button>
      </form>
    </Form>
  );
};

export default JobForm;

// interface iAppCreatJobFormProps {
//   companyLocation: string;
//   companyName: string;
//   companyDescription: string;
//   companyLogo: string;
//   companyWebsite: string;
//   companyXAccount?: string | null;
// }

// const CreateJobForm = ({
//   companyLocation,
//   companyName,
//   companyDescription,
//   companyLogo,
//   companyWebsite,
//   companyXAccount,
// }: iAppCreatJobFormProps) => {
//   const [pending, setPending] = useState<boolean>(false);

//   const form = useForm<JobPostType>({
//     resolver: zodResolver(jobPostSchema),
//     defaultValues: {
//       benefits: [],
//       companyDescription: companyDescription,
//       companyLocation: companyLocation,
//       companyName: companyName,
//       companyLogo: companyLogo,
//       companyWebsite: companyWebsite,
//       companyXAccount: companyXAccount || "",
//       employmentType: "",
//       jobDescription: "",
//       jobTitle: "",
//       location: "",
//       listingDuration: 30,
//       salaryFrom: 0,
//       salaryTo: 0,
//     },
//   });

//   const onSubmit = async (data: JobPostType) => {
//     setPending(true);
//     try {
//       await createJob(data);
//     } catch (error) {
//       if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
//         console.error(`Something went wrong in creating job : ${error}`);
//       }
//     } finally {
//       setPending(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="col-span-1 lg:col-span-2 flex flex-col gap-8 lg:mb-8"
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle>Job Information</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="jobTitle"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Job Title</FormLabel>
//                     <FormControl>
//                       <Input placeholder="job title" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="employmentType"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Employment Type</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Employment Type" />
//                         </SelectTrigger>
//                       </FormControl>

//                       <SelectContent>
//                         <SelectContent>
//                           <SelectGroup>
//                             <SelectLabel>Employment Type</SelectLabel>
//                             <SelectItem value="full-time">Full Time</SelectItem>
//                             <SelectItem value="part-time">Part Time</SelectItem>
//                             <SelectItem value="contract">Contract</SelectItem>
//                             <SelectItem value="internship">
//                               Internship
//                             </SelectItem>
//                           </SelectGroup>
//                         </SelectContent>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="location"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Job Location</FormLabel>
//                     <CountrySelect
//                       onChange={field.onChange}
//                       value={field.value}
//                       label="Location"
//                       placeholder="Enter Location"
//                     />
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormItem>
//                 <FormLabel>Salary Range</FormLabel>
//                 <FormControl>
//                   <SalaryRangeSelector
//                     control={form.control}
//                     minSalary={10000}
//                     maxSalary={1000000} // 1 million dollor
//                     currency="USD"
//                     step={2000}
//                   />
//                 </FormControl>
//               </FormItem>
//             </div>

//             <FormField
//               control={form.control}
//               name="jobDescription"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Job Description</FormLabel>
//                   <FormControl>
//                     <JobDescriptionEditor field={field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="benefits"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Benefits</FormLabel>
//                   <FormControl>
//                     <BenefitsSelector field={field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Company Information</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="companyName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Company Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Company name..." {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="companyLocation"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Company Location</FormLabel>
//                     <CountrySelect
//                       onChange={field.onChange}
//                       value={field.value}
//                       label="Location"
//                       placeholder="Select Location"
//                     />
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="companyWebsite"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Company Website</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Company Website..." {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="companyXAccount"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Company X Account</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Company x account" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="companyDescription"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Company Description</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       className="min-h-[120px]"
//                       placeholder="Say something about your company"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="companyLogo"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Company Logo</FormLabel>
//                   <FormControl>
//                     <div>
//                       {field.value ? (
//                         <div className="relative w-fit">
//                           <Image
//                             src={field.value}
//                             alt="Company Logo"
//                             width={100}
//                             height={100}
//                             className="rounded-lg"
//                           />
//                           <Button
//                             type="button"
//                             variant="destructive"
//                             size="icon"
//                             className="absolute -top-2 -right-2 "
//                             onClick={() => field.onChange("")}
//                           >
//                             <XIcon className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       ) : (
//                         <UploadDropzone
//                           endpoint="imageUploader"
//                           onClientUploadComplete={(res) => {
//                             field.onChange(res[0].url);
//                           }}
//                           onUploadError={() => {
//                             console.error(
//                               "Error occured while uploading Job form uploading logo"
//                             );
//                           }}
//                           className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 cursor-pointer ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary ut-button:outline-none ut-button:border-none"
//                         />
//                       )}
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Job Listing Duration</CardTitle>
//           </CardHeader>

//           <CardContent>
//             <FormField
//               control={form.control}
//               name="listingDuration"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <JobListingDuration field={field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//         </Card>

//         <Button type="submit" className="w-full text-white" disabled={pending}>
//           {pending ? "Posting..." : "Post Job"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default CreateJobForm;
