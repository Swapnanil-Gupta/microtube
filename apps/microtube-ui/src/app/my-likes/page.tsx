import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import authOptions from "@/lib/authOptions";
import VideoGrid from "@/components/video-grid";
import VideoGridItem from "@/components/video-grid-item";
import { GetVideosResponse } from "@/types";
import LinkPager from "@/components/link-pager";
import NoVideosAlert from "@/components/no-data-alert";

export default async function MyLikes({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");

  const page =
    typeof searchParams?.page === "string" ? Number(searchParams.page) : 1;
  const perPage =
    typeof searchParams?.perPage === "string"
      ? Number(searchParams.perPage)
      : 25;

  const response = await fetch(
    `http://localhost:3000/api/user/likes?page=${page}&per_page=${perPage}`,
    {
      headers: headers(),
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch my likes");
  }
  const { total, data: videos } = (await response.json()) as GetVideosResponse;
  if (!videos) {
    throw new Error("Failed to fetch my likes");
  }

  return (
    <div className="flex flex-col gap-4">
      {videos.length === 0 && (
        <NoVideosAlert message="Start by liking a video." />
      )}
      {videos.length > 0 && (
        <>
          <LinkPager
            pageUrl="/my-uploads"
            total={total}
            page={page}
            perPage={perPage}
          />
          <VideoGrid>
            {videos.map((video) => (
              <VideoGridItem key={video.id} video={video} />
            ))}
          </VideoGrid>
          <LinkPager
            pageUrl="/my-uploads"
            total={total}
            page={page}
            perPage={perPage}
          />
        </>
      )}
    </div>
  );
}
