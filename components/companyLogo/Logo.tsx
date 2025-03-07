import React from "react";
import Image from "next/image";

interface CompanyLogoProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  src = "/logo.png",
  alt = "Company Logo",
  width = 40,
  height = 40,
  className = "",
  onClick,
}) => {
  return (
    <div className="">
      <Image
        onClick={onClick}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </div>
  );
};

export default CompanyLogo;
