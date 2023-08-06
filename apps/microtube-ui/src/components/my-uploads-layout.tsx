"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import VideoGrid from "@/components/video-grid";
import VideoGridItem from "@/components/video-grid-item";
import LinkPager from "@/components/link-pager";
import { GetVideosResponse } from "@/types";
import useFetchMyUploads from "@/hooks/useFetchMyUploads";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import NoVideosAlert from "./ui/no-videos-alert";

type Props = {
  initialData: GetVideosResponse;
  page: number;
  perPage: number;
};

export default function MyUploadsLayout({ initialData, page, perPage }: Props) {
  const session = useSession();
  const user = session.data?.user;

  const [polling, setPolling] = useState(true);
  const myUploads = useFetchMyUploads(
    initialData,
    polling,
    page,
    perPage,
    user?.email
  );
  if (myUploads.isError || !myUploads.data || !myUploads.data.data) {
    throw new Error("Failed to fetch my uploads");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 justify-end">
        <Switch
          id="poll"
          checked={polling}
          onCheckedChange={(checked) => setPolling(checked)}
        />
        <Label htmlFor="poll">Poll</Label>
      </div>
      {myUploads.data.data.length === 0 && (
        <NoVideosAlert message="Be the first to upload a video by signing in." />
      )}
      {myUploads.data.data.length > 0 && (
        <>
          <LinkPager
            pageUrl="/my-uploads"
            total={myUploads.data?.total}
            page={page}
            perPage={perPage}
          />
          <VideoGrid>
            {myUploads.data.data.map((video) => (
              <VideoGridItem key={video.id} video={video} />
            ))}
          </VideoGrid>
          <LinkPager
            pageUrl="/my-uploads"
            total={myUploads.data.total}
            page={page}
            perPage={perPage}
          />
        </>
      )}
    </div>
  );
}
