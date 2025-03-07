import CompanyLogo from "@/components/companyLogo/Logo";
import LoginForm from "@/components/forms/LoginForm/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6 px-4 lg:px-0">
        <Link href="/" className="flex items-center gap-2 self-center">
          <CompanyLogo src="/logo.png" alt="Logo" className="size-10" />

          <h1 className="text-2xl font-bold">
            Job <span className="text-primary">Marshal</span>
          </h1>
        </Link>

        <LoginForm />
      </div>
    </div>
  );
}
