import { GetVideosResponse } from "@/types";
import VideoGrid from "@/components/video-grid";
import VideoGridItem from "@/components/video-grid-item";
import LinkPager from "@/components/link-pager";
import NoVideosAlert from "@/components/ui/no-videos-alert";

export default async function Search({
  params: { searchTerm },
  searchParams,
}: {
  params: { searchTerm: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page =
    typeof searchParams?.page === "string" ? Number(searchParams.page) : 1;
  const perPage =
    typeof searchParams?.perPage === "string"
      ? Number(searchParams.perPage)
      : 25;

  const response = await fetch(
    `http://localhost:3000/api/video?title=${searchTerm}&page=${page}&per_page=${perPage}`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to search videos");
  }
  const { total, data: videos } = (await response.json()) as GetVideosResponse;
  if (!videos) {
    throw new Error("Failed to search videos");
  }

  return (
    <div className="flex flex-col gap-4">
      {videos.length === 0 && (
        <NoVideosAlert message="Try searching with a different title." />
      )}
      {videos.length > 0 && (
        <>
          <LinkPager
            pageUrl={`/search/${searchTerm}`}
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
            pageUrl={`/search/${searchTerm}`}
            total={total}
            page={page}
            perPage={perPage}
          />
        </>
      )}
    </div>
  );
}
