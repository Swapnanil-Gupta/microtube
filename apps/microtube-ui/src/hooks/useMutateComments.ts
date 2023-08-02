import { GetCommentResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Params = {
  onSuccess?: () => void;
  onError?: () => void;
};

async function saveComment({
  videoId,
  message,
}: {
  videoId: string;
  message: string;
}) {
  const response = await fetch(
    `http://localhost:3000/api/video/${videoId}/comment`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to post comment");
  const data = (await response.json()) as GetCommentResponse;
  return data;
}

export default function useMutateComments({ onSuccess, onError }: Params) {
  return useMutation({
    mutationFn: saveComment,
    onSuccess,
    onError,
  });
}
