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
  // throw this error to the nearest error boundary
  if (myUploads.isError) throw new Error("Failed to fetch my uploads");

  return (
    <>
      <div className="flex items-center gap-2 justify-end">
        <Switch
          id="poll"
          checked={polling}
          onCheckedChange={(checked) => setPolling(checked)}
        />
        <Label htmlFor="poll">Poll</Label>
      </div>
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
  );
}
