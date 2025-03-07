import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import CompanyLogo from "../companyLogo/Logo";
import { auth } from "../../app/utils/auth";
import { buttonVariants } from "../ui/button";
import UserDropdown from "./UserDropdown";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 bg-background shadow-md shadow-green-50 dark:shadow-gray-800 rounded">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-5 flex items-center justify-between pt-5">
        <Link href="/" className="flex items-center gap-2">
          <CompanyLogo
            src="/logo.png"
            alt="Logo Job Marshal"
            width={40}
            height={40}
            className=""
          />

          <h1 className="text-2xl font-bold">
            Job <span className="text-primary">Marshal</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-5">
          <ThemeToggle />
          <Link
            href="/post-job"
            className={`${buttonVariants({
              size: "lg",
            })} text-white hidden md:flex`}
          >
            Post Job
          </Link>

          {session?.user ? (
            <UserDropdown
              name={session.user.name as string}
              email={session.user.email as string}
              image={session.user.image as string}
              isMobile={true}
            />
          ) : (
            <Link
              href="/login"
              className={`${buttonVariants({
                variant: "outline",
                size: "lg",
              })}`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// import Link from "next/link";
// import React from "react";
// import { ThemeToggle } from "./ThemeToggle";
// import CompanyLogo from "../companyLogo/Logo";
// import { auth } from "../../app/utils/auth";
// import { buttonVariants } from "../ui/button";
// import UserDropdown from "./UserDropdown";
// import { Search } from "lucide-react";

// const Navbar = async () => {
//   const session = await auth();

//   return (
//     <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-green-100 dark:border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
//         <Link
//           href="/"
//           className="flex items-center gap-2 group transition-all duration-300"
//         >
//           <div className="relative overflow-hidden rounded-full p-1 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg group-hover:shadow-green-400/20 dark:group-hover:shadow-blue-500/20 transition-all duration-300">
//             <CompanyLogo
//               src="/logo.png"
//               alt="Logo Job Marshal"
//               width={40}
//               height={40}
//               className="transform group-hover:scale-105 transition-transform duration-300"
//             />
//           </div>
//           <h1 className="text-2xl font-bold relative">
//             Job{" "}
//             <span className="text-primary relative">
//               Marshal
//               <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
//             </span>
//           </h1>
//         </Link>

//         {/* Search Bar */}
//         <div className="hidden lg:flex relative max-w-md w-full mx-8">
//           <input
//             type="text"
//             placeholder="Search for jobs..."
//             className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
//           />
//           <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-4">
//           <Link
//             href="/browse-jobs"
//             className="font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
//           >
//             Browse Jobs
//           </Link>
//           <Link
//             href="/companies"
//             className="font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
//           >
//             Companies
//           </Link>
//           <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
//           <ThemeToggle />
//           <Link
//             href="/post-job"
//             className={`${buttonVariants({
//               size: "default",
//             })} bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300`}
//           >
//             Post Job
//           </Link>

//           {session?.user ? (
//             <UserDropdown
//               name={session.user.name as string}
//               email={session.user.email as string}
//               image={session.user.image as string}
//             />
//           ) : (
//             <Link
//               href="/login"
//               className={`${buttonVariants({
//                 variant: "outline",
//                 size: "default",
//               })} border-primary text-primary hover:bg-primary/10 transition-all duration-300`}
//             >
//               Login
//             </Link>
//           )}
//         </div>

//         {/* Mobile menu button - just showing a placeholder */}
//         <button className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
