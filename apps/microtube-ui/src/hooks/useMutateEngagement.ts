import { GetVideoEngagementResponse, GetVideoStatsResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";

type Params = {
  videoId: string;
  userId?: string | null;
  onSuccess?: () => void;
  onError?: () => void;
};

type SaveEngagementParams = {
  videoId: string;
  payload: Partial<{
    liked: boolean;
    disliked: boolean;
  }>;
};

async function saveEngagement({ videoId, payload }: SaveEngagementParams) {
  const response = await fetch(
    `http://localhost:3000/api/video/${videoId}/engagement`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to save engagement");
  const data = (await response.json()) as GetVideoEngagementResponse;
  return data;
}

export default function useMutateEngagement({
  videoId,
  userId,
  onSuccess,
  onError,
}: Params) {
  return useMutation({
    mutationFn: saveEngagement,
    onMutate: async (newEngagement) => {
      if (!userId) return;

      // OPTIMISTIC ENGAGEMENT
      await queryClient.cancelQueries({
        queryKey: ["engagement", videoId, userId],
      });
      const prevEngagement =
        queryClient.getQueryData<GetVideoEngagementResponse>([
          "engagement",
          videoId,
          userId,
        ]);
      if (prevEngagement) {
        queryClient.setQueryData<GetVideoEngagementResponse>(
          ["engagement", videoId, userId],
          {
            data: {
              liked: false,
              disliked: false,
              ...newEngagement.payload,
            },
          }
        );
      }

      // OPTIMISTIC LIKE/DISLIKE COUNT
      await queryClient.cancelQueries({
        queryKey: ["stats", videoId],
      });
      const prevStats = queryClient.getQueryData<GetVideoStatsResponse>([
        "stats",
        videoId,
      ]);
      if (prevStats && prevEngagement) {
        let likes = prevStats.data.likes;
        let dislikes = prevStats.data.dislikes;
        const finalEngagement = {
          liked: false,
          disliked: false,
          ...newEngagement.payload,
        };

        if (prevEngagement.data.liked) {
          if (!finalEngagement.liked) likes--;
        } else {
          if (finalEngagement.liked) likes++;
        }

        if (prevEngagement.data.disliked) {
          if (!finalEngagement.disliked) dislikes--;
        } else {
          if (finalEngagement.disliked) dislikes++;
        }

        queryClient.setQueryData<GetVideoStatsResponse>(["stats", videoId], {
          data: {
            likes,
            dislikes,
          },
        });
      }

      return { prevEngagement, prevStats };
    },
    onSuccess,
    onError: (err, newEngagement, context) => {
      if (userId && context?.prevEngagement) {
        queryClient.setQueryData<GetVideoEngagementResponse>(
          ["engagement", videoId, userId],
          context.prevEngagement
        );
      }

      if (context?.prevStats) {
        queryClient.setQueryData<GetVideoStatsResponse>(
          ["stats", videoId],
          context.prevStats
        );
      }

      typeof onError === "function" && onError();
    },
    onSettled: () => {
      if (!userId) return;

      queryClient.invalidateQueries({
        queryKey: ["engagement", videoId, userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["stats", videoId],
      });
    },
  });
}
