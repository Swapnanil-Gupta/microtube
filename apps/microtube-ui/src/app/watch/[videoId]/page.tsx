import PlayVideoLayout from "@/components/play-video-layout";
import { GetVideoResponse } from "@/types";
import { notFound } from "next/navigation";

export default async function Watch({
  params,
}: {
  params: { videoId: string };
}) {
  const { videoId } = params;
  const response = await fetch(`http://localhost:3000/api/video/${videoId}`);
  const { data: video } = (await response.json()) as GetVideoResponse;

  if (!video || !video.videoUrls) return notFound();

  return (
    <main>
      <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mb-2">
        You&apos;re watching
      </p>
      <h1 className="font-semibold text-3xl md:text-4xl mb-10 max-w-[900px]">
        {video.title}
      </h1>
      <PlayVideoLayout video={video} />
    </main>
  );
}
