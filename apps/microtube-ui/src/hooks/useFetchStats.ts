import { GetVideoStatsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function fetchStats(videoId: string) {
  const response = await fetch(
    `http://localhost:3000/api/video/${videoId}/stats`
  );
  if (!response.ok) throw new Error("Failed to fetch video stats");
  const data = (await response.json()) as GetVideoStatsResponse;
  return data;
}

export default function useFetchStats(videoId: string) {
  return useQuery({
    queryKey: ["stats", videoId],
    queryFn: () => fetchStats(videoId),
  });
}
