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
    <main className="py-8">
      <p className="text-sm md:text-base text-neutral-500">
        You&apos;re watching
      </p>
      <h1 className="font-semibold text-3xl md:text-4xl mb-8 line-clamp-2">
        {video.title}
      </h1>
      <PlayVideoLayout video={video} />
    </main>
  );
}
