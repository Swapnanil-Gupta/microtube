import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { buttonVariants } from "./ui/button";
import UserDropdown from "./user-dropdown";
import SignInButton from "./signin-button";
import ThemeToggle from "./theme-toggle";
import Icons from "@/lib/icons";

export default async function SiteHeader() {
  const session = await getServerSession();
  return (
    <header className="bg-white dark:bg-neutral-950 sticky top-0 z-40 w-full border-b dark:border-b-neutral-700">
      <div className="container flex py-3 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="inline-block font-bold">
          <span className="flex items-center">
            <Icons.youtube className="h-5 w-5 mr-2" />
            microtube
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Link
              href="https://github.com/Swapnanil-Gupta/microtube"
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
            {session ? <UserDropdown /> : <SignInButton />}
          </nav>
        </div>
      </div>
    </header>
  );
}
