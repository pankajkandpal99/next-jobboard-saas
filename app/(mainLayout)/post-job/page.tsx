/* eslint-disable react/no-unescaped-entities */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import { companies, stats, testimonials } from "@/constants";
import { Company, Stat, Testimonial } from "@/types";
import JobForm from "@/components/forms/job/JobForm";
import { requireUser } from "@/app/utils/requireUser";
import { getCompany } from "@/lib/services/company";
import { redirect } from "next/navigation";

const PostJobPage: React.FC = async () => {
  const session = await requireUser();
  const company = await getCompany(session?.id as string);

  if (!company) {
    redirect("/");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      <JobForm
        companyDescription={company.about}
        companyLocation={company.location}
        companyWebsite={company.website}
        companyLogo={company.logo}
        companyXAccount={company.xAccount}
        companyName={company.name}
      />

      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Trusted by Industry Leaders
            </CardTitle>
            <CardDescription>
              Join thousands of companies hiring top talent
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Company Logo */}
            <div className="grid grid-cols-3 gap-4">
              {companies.map((company: Company) => (
                <div key={company.id} className="">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={80}
                    height={80}
                    className="rounded-lg opacity-75 transition-opacity hover:opacity-100"
                  />
                </div>
              ))}
            </div>

            {/* Some qoutes */}
            <div className="space-y-4">
              {testimonials.map((testimonial: Testimonial, index: number) => (
                <blockquote
                  key={index}
                  className="border-l border-primary pl-4"
                >
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>

                  <footer className="mt-2 text-sm font-medium">
                    - {testimonial.author}, {testimonial.company}
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* We will render stats here */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat: Stat) => (
                <div key={stat.id} className="rounded-lg bg-muted p-4">
                  <h4 className="text-2xl font-bold">{stat.value}</h4>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJobPage;
