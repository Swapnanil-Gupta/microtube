import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import Icons from "@/lib/icons";
import { VideoWithMetadata } from "@/types";

export default function VideoGridItem({
  video,
  showUploadedBy = false,
}: {
  video: VideoWithMetadata;
  showUploadedBy?: boolean;
}) {
  const status = video.status;

  const thumbnail = {
    PROCESSED: (
      <Image
        src={video.thumbnailUrl || ""}
        alt={video.title}
        fill
        className="object-center object-cover group-hover:scale-110 transition-transform duration-300"
      />
    ),
    FAILED: null,
    UPLOADED: <Skeleton className="h-full w-full" />,
    PROCESSING: <Skeleton className="h-full w-full" />,
  };

  const icons = {
    PROCESSED: <Icons.duration className="h-4 w-4" />,
    UPLOADED: <Icons.yetToBeProcessed className="h-4 w-4" />,
    PROCESSING: <Icons.loading className="h-4 w-4 animate-spin" />,
    FAILED: <Icons.failed className="h-4 w-4" />,
  };

  const label = {
    PROCESSED: `${video.metadata?.duration || "N/A"}s`,
    UPLOADED: "Yet to be processed",
    PROCESSING: "Processing",
    FAILED: "Failed",
  };

  return (
    <Link href={`/watch/${video.id}`} key={video.id}>
      <div
        className={clsx(
          "flex flex-col gap-y-3 rounded-lg group",
          status === "FAILED" && "bg-neutral-100 dark:bg-neutral-800"
        )}
      >
        <div className="relative overflow-hidden rounded-lg">
          <AspectRatio ratio={16 / 9}>{thumbnail[status]}</AspectRatio>
          <span
            className={clsx(
              "absolute text-white bg-black/75 px-2 py-1 rounded-lg flex items-center gap-1",
              status === "PROCESSED"
                ? "bottom-2 right-2"
                : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            )}
          >
            {icons[status]}
            {label[status]}
          </span>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold line-clamp-2 text-md md:text-lg">
            {video.title}
          </p>
          {showUploadedBy && (
            <span className="flex gap-1 items-center text-neutral-500 font-medium">
              <Icons.user className="h-5 w-5" />
              {video.userId}
            </span>
          )}
          <span className="text-sm md:text-md flex gap-1 items-center text-neutral-500">
            <Icons.ago className="h-5 w-5" />
            {formatDistanceToNow(new Date(video.uploadedAt))} ago
          </span>
        </div>
      </div>
    </Link>
  );
}
