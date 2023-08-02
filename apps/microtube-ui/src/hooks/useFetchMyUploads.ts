import { GetVideosResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function fetchMyUploads(page: number, perPage: number) {
  const response = await fetch(
    `http://localhost:3000/api/user/uploads?page=${page}&per_page=${perPage}`
  );
  if (!response.ok) throw new Error("Failed to fetch my uploads");
  const data = (await response.json()) as GetVideosResponse;
  return data;
}

export default function useFetchMyUploads(
  initialData: GetVideosResponse,
  poll: boolean,
  page: number,
  perPage: number,
  userId?: string | null
) {
  return useQuery({
    queryKey: ["my-uploads", userId, page, perPage],
    queryFn: () => fetchMyUploads(page, perPage),
    initialData,
    enabled: Boolean(userId),
    refetchInterval: poll ? 3000 : false,
  });
}
