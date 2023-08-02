import { Button } from "./ui/button";
import clsx from "clsx";
import Icons from "@/lib/icons";

type Props = {
  onNext: (page: number) => any;
  onPrev: (page: number) => any;
  total: number;
  page: number;
  perPage: number;
};

export default function ButtonPager({
  onNext,
  onPrev,
  total,
  page,
  perPage,
}: Props) {
  const noOfPages = Math.ceil(total / perPage);

  return (
    <div className="flex items-center justify-end py-2 gap-1">
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => page > 1 && onPrev(page - 1)}
      >
        <Icons.prev className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>
      <Button
        variant="secondary"
        disabled={page >= noOfPages}
        onClick={() => page < noOfPages && onNext(page + 1)}
      >
        <Icons.next className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}
