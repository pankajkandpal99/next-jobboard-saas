import { requireUser } from "@/app/utils/requireUser";
import CopyLinkMenuItem from "@/components/general/CopyLink";
import EmptyState from "@/components/general/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { myJobs } from "@/lib/services/jobs";
import { MoreHorizontal, PenBoxIcon, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MyJobs = async () => {
  const user = await requireUser();
  const data = await myJobs(user.id as string);

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No job posts found"
        description="You don't have any job posts yet."
        buttonText="Create a job post now!"
        href="/post-job"
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Jobs</CardTitle>
          <CardDescription>
            Manage your job listings and applications here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <Image
                      src={listing.company.logo}
                      alt="company logo"
                      width={40}
                      height={40}
                      className="rounded-md size-10"
                    />
                  </TableCell>
                  <TableCell>{listing.company.name}</TableCell>
                  <TableCell>{listing.jobTitle}</TableCell>
                  <TableCell>
                    {listing.status.charAt(0).toUpperCase() +
                      listing.status.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell>
                    {listing.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/my-jobs/${listing.id}/edit`}>
                            <PenBoxIcon />
                            Edit Job
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <CopyLinkMenuItem
                            jobUrl={`${process.env.NEXT_PUBLIC_URL}/job/${listing.id}`}
                          />
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link href={`/my-jobs/${listing.id}/delete`}>
                            <XCircle />
                            Delete Job
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default MyJobs;
