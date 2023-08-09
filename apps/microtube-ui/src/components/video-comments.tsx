"use client";

import { useState } from "react";
import useFetchComments from "@/hooks/useFetchComments";
import Loader from "./loader";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import useMutateComments from "@/hooks/useMutateComments";
import Icons from "@/lib/icons";
import ButtonPager from "./button-pager";
import NoDataAlert from "./no-data-alert";

export default function VideoComments({ videoId }: { videoId: string }) {
  const session = useSession();
  const user = session.data?.user;

  const perPage = 25;
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const comments = useFetchComments(videoId, page, perPage);
  const mutation = useMutateComments({
    onSuccess: () => {
      setComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
      comments.refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post the comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  function handleComment() {
    if (!user) {
      toast({
        title: "Not allowed",
        description: "You must be signed in to post a comment",
        variant: "destructive",
      });
      return;
    }
    if (!comment) return;
    mutation.mutate({ videoId: videoId, message: comment });
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-semibold text-base md:text-lg">Comments</h3>
      <div className="flex flex-col gap-2 items-start">
        <Textarea
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          disabled={!comment || mutation.isLoading}
          onClick={handleComment}
        >
          {mutation.isLoading && (
            <Icons.loading className="h-4 w-4 mr-2 animate-spin" />
          )}
          Comment
        </Button>
      </div>
      {comments.isLoading && <Loader />}
      {!comments.isLoading && comments.isError && (
        <div>Failed to fetch comments</div>
      )}
      {!comments.isLoading &&
        !comments.isError &&
        comments.data.data.length === 0 && (
          <NoDataAlert message="No comments yet." />
        )}
      {!comments.isLoading &&
        !comments.isError &&
        comments.data.data.length > 0 && (
          <div className="flex flex-col gap-4">
            {comments.data.data.map((comment) => (
              <div className="flex items-center gap-2" key={comment.id}>
                <div className="p-2 md:p-3.5 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-full">
                  <Icons.user className="h-4 w-4 md:h-6 md:w-6" />
                  <span className="sr-only">User</span>
                </div>
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                    <span className="font-semibold">{comment.userId}</span> |{" "}
                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                  </p>
                  <p className="text-sm md:text-base">{comment.message}</p>
                </div>
              </div>
            ))}
            <ButtonPager
              page={page}
              perPage={perPage}
              total={comments.data.total}
              onNext={(newPage) => setPage(newPage)}
              onPrev={(newPage) => setPage(newPage)}
            />
          </div>
        )}
    </div>
  );
}
