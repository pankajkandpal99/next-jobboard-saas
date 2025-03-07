import Navbar from "@/components/general/Navbar";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12 mt-8">
        {children}
      </div>
    </div>
  );
}
