import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import authOptions from "@/lib/authOptions";
import VideoGrid from "@/components/video-grid";
import VideoGridItem from "@/components/video-grid-item";
import { GetVideosResponse } from "@/types";
import LinkPager from "@/components/link-pager";

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
  } // TODO: Handle error
  const { total, data: videos } = (await response.json()) as GetVideosResponse;
  // TODO: Handle empty error

  return (
    <main className="py-8">
      <h1 className="font-semibold text-3xl md:text-4xl mb-2">My Likes</h1>
      <p className="text-neutral-500 mb-4">
        All the videos that you&apos;ve liked
      </p>
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
    </main>
  );
}
