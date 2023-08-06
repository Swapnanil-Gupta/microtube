import Link from "next/link";
import { buttonVariants } from "./ui/button";
import clsx from "clsx";
import Icons from "@/lib/icons";

type Props = {
  pageUrl: string;
  total: number;
  page: number;
  perPage: number;
};

export default function LinkPager({ pageUrl, total, page, perPage }: Props) {
  const noOfPages = Math.ceil(total / perPage);

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={page > 1 ? `${pageUrl}?page=${page - 1}&perPage=${perPage}` : "#"}
        role="link"
        aria-disabled={page <= 1}
        className={clsx(
          buttonVariants({ variant: "secondary" }),
          "aria-disabled:opacity-50"
        )}
      >
        <Icons.prev className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Link>
      <Link
        href={
          page < noOfPages
            ? `${pageUrl}?page=${page + 1}&perPage=${perPage}`
            : "#"
        }
        role="link"
        aria-disabled={page >= noOfPages}
        className={clsx(
          buttonVariants({ variant: "secondary" }),
          "aria-disabled:opacity-50"
        )}
      >
        <Icons.next className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Link>
    </div>
  );
}
