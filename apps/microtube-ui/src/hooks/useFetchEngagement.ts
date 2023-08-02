import { GetVideoEngagementResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function fetchEngagement(videoId: string) {
  const response = await fetch(
    `http://localhost:3000/api/video/${videoId}/engagement`
  );
  if (!response.ok) throw new Error("Failed to fetch video engagement");
  const data = (await response.json()) as GetVideoEngagementResponse;
  return data;
}

export default function useFetchEngagement(
  videoId: string,
  userId?: string | null
) {
  return useQuery({
    queryKey: ["engagement", videoId, userId],
    queryFn: () => fetchEngagement(videoId),
    enabled: Boolean(userId),
  });
}
