import ArcJetLogo from "@/public/arcjet.jpg";
import IngestLogo from "@/public/inngest-locale.png";
import {
  Company,
  iAppJobListingDurationProps,
  Stat,
  Testimonial,
} from "@/types";

export const companies: Company[] = [
  { id: 0, name: "ArcJet", logo: ArcJetLogo },
  { id: 1, name: "Ingest", logo: IngestLogo },
  { id: 2, name: "ArcJet", logo: ArcJetLogo },
  { id: 3, name: "Ingest", logo: IngestLogo },
  { id: 4, name: "ArcJet", logo: ArcJetLogo },
  { id: 5, name: "Ingest", logo: IngestLogo },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "We found our ideal candidate within 48 hours of posting. The quality of applicants was exceptional!",
    author: "Sarah Chen",
    company: "TechCorp",
  },
  {
    quote:
      "The platform made hiring remote talent incredibly simple. Highly recommended!",
    author: "Mark Johnson",
    company: "StartupX",
  },
  {
    quote:
      "We've consistently found high-quality candidates here. It's our go-to platform for all our hiring needs.",
    author: "Emily Rodriguez",
    company: "InnovateNow",
  },
];

export const stats: Stat[] = [
  { id: 0, value: "10k+", label: "Monthly active job seekers" },
  { id: 1, value: "48h", label: "Average time to hire" },
  { id: 2, value: "95%", label: "Employeer satisfaction rate" },
  { id: 3, value: "500+", label: "Companies hiring remotely" },
];

export const jobListingDurationPricing: iAppJobListingDurationProps[] = [
  {
    days: 30,
    price: 99,
    description: "Standard listing",
  },
  {
    days: 60,
    price: 179,
    description: "Extended visibility",
  },
  {
    days: 90,
    price: 249,
    description: "Maximum exposure",
  },
];
