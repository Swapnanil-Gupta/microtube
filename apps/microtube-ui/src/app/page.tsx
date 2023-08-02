import { GetVideosResponse } from "@/types";
import VideoGrid from "@/components/video-grid";
import VideoGridItem from "@/components/video-grid-item";
import LinkPager from "@/components/link-pager";

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
  } // TODO: Handle error
  const { total, data: videos } = (await response.json()) as GetVideosResponse;
  // TODO: Handle empty error

  return (
    <main className="py-8">
      <h1 className="font-semibold text-3xl md:text-4xl mb-2">Browse Videos</h1>
      <p className="text-neutral-500 mb-4">Discover the most liked videos</p>
      <LinkPager pageUrl="/" total={total} page={page} perPage={perPage} />
      <VideoGrid>
        {videos.map((video) => (
          <VideoGridItem key={video.id} video={video} showUploadedBy />
        ))}
      </VideoGrid>
      <LinkPager pageUrl="/" total={total} page={page} perPage={perPage} />
    </main>
  );
}
