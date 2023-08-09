import { GetVideosResponse } from "@/types";
import VideoGrid from "@/components/video-grid";
import VideoGridItem from "@/components/video-grid-item";
import LinkPager from "@/components/link-pager";
import NoVideosAlert from "@/components/no-data-alert";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page =
    typeof searchParams?.page === "string" ? Number(searchParams.page) : 1;
  const perPage =
    typeof searchParams?.perPage === "string"
      ? Number(searchParams.perPage)
      : 25;

  const response = await fetch(
    `http://localhost:3000/api/video?page=${page}&per_page=${perPage}`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }
  const { total, data: videos } = (await response.json()) as GetVideosResponse;
  if (!videos) {
    throw new Error("Failed to fetch videos");
  }

  return (
    <main>
      <h1 className="font-semibold text-3xl md:text-4xl mb-2">Browse Videos</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-12">
        Discover the most liked videos
      </p>
      <div className="flex flex-col gap-4">
        {videos.length === 0 && (
          <NoVideosAlert message="Be the first to upload a video by signing in." />
        )}
        {videos.length > 0 && (
          <>
            <LinkPager
              pageUrl="/"
              total={total}
              page={page}
              perPage={perPage}
            />
            <VideoGrid>
              {videos.map((video) => (
                <VideoGridItem key={video.id} video={video} showUploadedBy />
              ))}
            </VideoGrid>
            <LinkPager
              pageUrl="/"
              total={total}
              page={page}
              perPage={perPage}
            />
          </>
        )}
      </div>
    </main>
  );
}
