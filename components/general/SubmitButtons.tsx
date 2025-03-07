"use client";
import React from "react";
import { Button } from "../ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface GeneralSubmitButtonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string;
  icon?: React.ReactNode;
}

const GeneralSubmitButton = ({
  text,
  variant,
  className,
  icon,
}: GeneralSubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button variant={variant} className={className} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />{" "}
          <span className="">Submitting...</span>{" "}
        </>
      ) : (
        <>
          {icon && <div>{icon}</div>}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
};
export default GeneralSubmitButton;

export const SaveJobButton = ({ savedJob }: { savedJob: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Heart
            className={cn(
              savedJob
                ? "fill-current text-red-500"
                : "size-4 transition-colors"
            )}
          />
          {savedJob ? "Saved" : "Save Job"}
        </>
      )}
    </Button>
  );
};
