import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-white dark:bg-neutral-950 border-t dark:border-t-neutral-700">
      <div className="container py-4 text-sm">
        Built by Swapnanil Gupta. The source code is available on{" "}
        <Link
          className="font-medium underline underline-offset-4"
          href="https://github.com/Swapnanil-Gupta/microtube"
        >
          GitHub
        </Link>
        .
      </div>
    </footer>
  );
}
