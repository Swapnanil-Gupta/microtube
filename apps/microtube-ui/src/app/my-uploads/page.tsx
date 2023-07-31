import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import authOptions from "@/lib/authOptions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Icons from "@/lib/icons";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

function ProcessedVideo({ video }: { video: any }) {
  if (video.status === "PROCESSED") {
    return (
      <Link href={`/watch/${video.id}`} key={video.id}>
        <div className="flex flex-col gap-y-3 rounded-lg group">
          <div className="relative overflow-hidden rounded-lg">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-center object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </AspectRatio>
            <span className="absolute bottom-2 right-2 text-white bg-black/75 px-2 py-1 rounded-lg flex items-center gap-1">
              <Icons.duration className="h-4 w-4" />
              {video.metadata?.duration}s
            </span>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="font-semibold line-clamp-2 text-md md:text-lg">
              {video.title}
            </p>
            <span className="text-sm md:text-md flex gap-1 items-center text-neutral-500">
              <Icons.ago className="h-5 w-5" />
              {formatDistanceToNow(new Date(video.uploadedAt))} ago
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (video.status === "UPLOADED") {
    return (
      <div className="flex flex-col gap-y-3 rounded-lg">
        <div className="relative overflow-hidden rounded-lg">
          <AspectRatio ratio={16 / 9}>
            <Skeleton className="h-full w-full" />
          </AspectRatio>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 px-2 py-1 rounded-lg flex items-center gap-1">
            <Icons.yetToBeProcessed className="h-4 w-4" />
            Yet to be processed
          </span>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold line-clamp-2 text-md md:text-lg">
            {video.title}
          </p>
          <span className="text-sm md:text-md flex gap-1 items-center text-neutral-500">
            <Icons.ago className="h-5 w-5" />
            {formatDistanceToNow(new Date(video.uploadedAt))} ago
          </span>
        </div>
      </div>
    );
  }

  if (video.status === "PROCESSING") {
    return (
      <div className="flex flex-col gap-y-3 rounded-lg">
        <div className="relative overflow-hidden rounded-lg">
          <AspectRatio ratio={16 / 9}>
            <Skeleton className="h-full w-full" />
          </AspectRatio>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 px-2 py-1 rounded-lg flex items-center gap-1">
            <Icons.loading className="h-4 w-4 animate-spin" />
            Processing
          </span>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold line-clamp-2 text-md md:text-lg">
            {video.title}
          </p>
          <span className="text-sm md:text-md flex gap-1 items-center text-neutral-500">
            <Icons.ago className="h-5 w-5" />
            {formatDistanceToNow(new Date(video.uploadedAt))} ago
          </span>
        </div>
      </div>
    );
  }

  if (video.status === "FAILED") {
    return (
      <div className="flex flex-col gap-y-3 rounded-lg">
        <div className="relative overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <AspectRatio ratio={16 / 9} />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 px-2 py-1 rounded-lg flex items-center gap-1">
            <Icons.failed className="h-4 w-4" />
            Failed
          </span>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold line-clamp-2 text-md md:text-lg">
            {video.title}
          </p>
          <span className="text-sm md:text-md flex gap-1 items-center text-neutral-500">
            <Icons.ago className="h-5 w-5" />
            {formatDistanceToNow(new Date(video.uploadedAt))} ago
          </span>
        </div>
      </div>
    );
  }

  return null;
}

export default async function MyUploads() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");

  const response = await fetch("http://localhost:3000/api/user/uploads", {
    headers: headers(),
  });
  const { total, data: videos } = await response.json();

  return (
    <main className="py-8">
      <h1 className="font-semibold text-2xl md:text-4xl mb-6 md:mb-10">
        My Uploads
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-4">
        {videos.map((video: any) => (
          <ProcessedVideo key={video.id} video={video} />
        ))}
      </div>
    </main>
  );
}
