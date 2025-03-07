"use client";
import React from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

const CopyLinkMenuItem = ({ jobUrl }: { jobUrl: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      toast.success("URL copied to clipboard");
    } catch (error) {
      console.error("Error in copying url : ", error);
      toast.error("Failed to copu URL");
    }
  };

  return (
    <DropdownMenuItem onSelect={handleCopy}>
      <Link2 className="size-4" />
      <span>Copy Job URL</span>
    </DropdownMenuItem>
  );
};

export default CopyLinkMenuItem;
