import Link from "next/link";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Icons from "@/lib/icons";
import { formatDistanceToNow } from "date-fns";

export default async function Home() {
  const response = await fetch("http://localhost:3000/api/video", {
    cache: "no-store",
  });
  const { data: videos } = await response.json();

  return (
    <main className="py-8">
      <h1 className="font-semibold text-2xl md:text-4xl mb-6 md:mb-10">
        Browse videos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
        {videos.map((video: any) => (
          <Link href={`/watch/${video.id}`} key={video.id}>
            <div className="flex flex-col gap-y-3">
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-center object-cover"
                  />
                </AspectRatio>
                <span className="absolute bottom-2 right-2 text-white bg-black/75 px-2 py-1 rounded-md flex items-center gap-1">
                  <Icons.duration className="h-4 w-4" />
                  {video.metadata?.duration}s
                </span>
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="font-semibold line-clamp-2 text-lg">
                  {video.title}
                </p>
                <span className="flex gap-1 items-center text-neutral-500 font-medium">
                  <Icons.user className="h-5 w-5" />
                  {video.userId}
                </span>
                <span className="flex gap-1 items-center text-neutral-500">
                  <Icons.ago className="h-5 w-5" />
                  {formatDistanceToNow(new Date(video.uploadedAt))} ago
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
