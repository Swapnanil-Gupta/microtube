import { GetCommentsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function fetchComments(videoId: string, page: number, perPage: number) {
  const response = await fetch(
    `http://localhost:3000/api/video/${videoId}/comment?page=${page}&per_page=${perPage}`
  );
  if (!response.ok) throw new Error("Failed to fetch video comments");
  const data = (await response.json()) as GetCommentsResponse;
  return data;
}

export default function useFetchComments(
  videoId: string,
  page: number,
  perPage: number
) {
  return useQuery({
    queryKey: ["comments", videoId, page, perPage],
    queryFn: () => fetchComments(videoId, page, perPage),
    keepPreviousData: true,
    staleTime: 600_000,
  });
}
