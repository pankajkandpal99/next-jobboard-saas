import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

interface iAppEmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

const EmptyState = ({
  title,
  description,
  buttonText,
  href,
}: iAppEmptyStateProps) => {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border border-dashed p-8">
      <div className="flex items-center justify-center size-20 rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>

      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mb-6 mt-1 text-center text-sm leading-tight text-muted-foreground max-w-sm text-balance">
        {description}
      </p>

      <Link
        href={href}
        className={buttonVariants({
          variant: "default",
          className: "text-white",
        })}
      >
        <PlusCircle /> {buttonText}
      </Link>
    </div>
  );
};

export default EmptyState;
