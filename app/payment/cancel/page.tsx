"use client";
import { requireUser } from "@/app/utils/requireUser";
/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PaymentCancel = () => {
  const router = useRouter();

  React.useEffect(() => {
    const checkUser = async () => {
      await requireUser();
    };
    checkUser();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="flex w-full justify-center">
            <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
          </div>

          <div className="mt-3 mb-6 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              No worries, you won't be charged. Please try again!
            </p>
          </div>

          <Button
            className="text-white w-full"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentCancel;
