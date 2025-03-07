import { deleteJobPostData } from "@/app/actions";
import { requireUser } from "@/app/utils/requireUser";
import GeneralSubmitButton from "@/components/general/SubmitButtons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";

type Params = Promise<{ jobId: string }>;

const DeleteJob = async ({ params }: { params: Params }) => {
  await requireUser(); // if user logged in then go ahead, otherwise will go /login route.
  const { jobId } = await params;

  return (
    <div>
      <Card className="max-w-lg w-full mx-auto shadow-lg mt-28">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-400">
            Are you absolutely sure?
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-500 mt-2">
            This action cannot be undone. This will permanently delete your job
            listing and remove all of your job data from our servers.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex items-center justify-end gap-6 border-t pt-4">
          <Link
            href="/my-jobs"
            className={buttonVariants({
              variant: "secondary",
              className: "flex items-center gap-2",
            })}
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Link>

          <form
            action={async () => {
              "use server";
              await deleteJobPostData(jobId as string);
            }}
          >
            <GeneralSubmitButton
              text="Delete Job"
              variant="destructive"
              icon={<Trash className="w-4 h-4" />}
              className="flex items-center gap-2"
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteJob;
