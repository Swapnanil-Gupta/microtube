import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-4 text-sm">
        Microtube is a distributed and extensible system that offers a small
        subset of Youtube&apos;s functionality. The source code and architecture
        is available on{" "}
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
