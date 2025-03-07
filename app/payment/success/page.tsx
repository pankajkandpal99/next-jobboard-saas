"use client";
import { requireUser } from "@/app/utils/requireUser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PaymentSuccess = () => {
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
            <Check className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>

          <div className="mt-3 mb-6 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              Congrats your payment was successfull your job posting is now
              active!
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

export default PaymentSuccess;
