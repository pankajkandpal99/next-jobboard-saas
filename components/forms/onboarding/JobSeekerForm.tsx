import { createJobSeeker } from "@/app/actions";
import { jobSeekerSchema, JobSeekerType } from "@/app/utils/zodSchema";
import { UploadDropzone } from "@/components/general/UploadThingReexported";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PdfImage from "@/public/pdf.png";
import { JobSeekerFormConfig } from "@/types";

const FORM_CONFIG: JobSeekerFormConfig = {
  name: {
    label: "Full Name",
    placeholder: "Enter your full name",
    type: "text",
  },
  about: {
    label: "Short Bio",
    placeholder: "Tell us about yourself...",
    type: "textarea",
  },
  resume: {
    label: "Resume (PDF)",
    placeholder: "Upload your resume",
    type: "file",
  },
};

const JobSeekerForm = () => {
  const [pending, setPending] = useState<boolean>(false);

  const form = useForm<JobSeekerType>({
    resolver: zodResolver(jobSeekerSchema),
    defaultValues: Object.keys(FORM_CONFIG).reduce(
      (acc, key) => ({
        ...acc,
        [key]: "",
      }),
      {} as JobSeekerType
    ),
  });

  const onSubmit = async (data: JobSeekerType) => {
    try {
      setPending(true);
      await createJobSeeker(data);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.error(`Something went wrong : ${error}`);
      }
    } finally {
      setPending(false);
    }
  };

  const renderField = (name: keyof JobSeekerType) => {
    const config = FORM_CONFIG[name];

    return (
      <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{config.label}</FormLabel>
            <FormControl>
              {config.type === "text" ? (
                <Input placeholder={config.placeholder} {...field} />
              ) : config.type === "textarea" ? (
                <Textarea placeholder={config.placeholder} {...field} />
              ) : (
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={PdfImage}
                        alt="Pdf Resume Image"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => field.onChange("")}
                        className="absolute -top-2 -right-2"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="resumeUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url);
                      }}
                      onUploadError={() => {
                        console.error("Upload failed");
                      }}
                      className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 cursor-pointer ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary ut-button:outline-none ut-button:border-none"
                    />
                  )}
                </div>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {Object.keys(FORM_CONFIG).map((field) =>
          renderField(field as keyof JobSeekerType)
        )}

        <Button type="submit" className="w-full text-white" disabled={pending}>
          {pending ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default JobSeekerForm;
