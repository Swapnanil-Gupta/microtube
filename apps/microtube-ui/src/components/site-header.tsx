import Link from "next/link";
import { buttonVariants } from "./ui/button";
import ThemeToggle from "./theme-toggle";
import Icons from "@/lib/icons";

export default async function SiteHeader() {
  return (
    <header className="bg-white dark:bg-neutral-950">
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
          </nav>
        </div>
      </div>
    </header>
  );
}
