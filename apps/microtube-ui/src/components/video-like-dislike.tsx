import { useSession } from "next-auth/react";
import { Toggle } from "@/components/ui/toggle";
import useFetchStats from "@/hooks/useFetchStats";
import Icons from "@/lib/icons";
import useFetchEngagement from "@/hooks/useFetchEngagement";
import useMutateEngagement from "@/hooks/useMutateEngagement";
import { useToast } from "@/hooks/use-toast";

export default function VideoLikeDislike({ videoId }: { videoId: string }) {
  const session = useSession();
  const user = session.data?.user;

  const { toast } = useToast();
  const stats = useFetchStats(videoId);
  const engagement = useFetchEngagement(videoId, user?.email);
  const mutation = useMutateEngagement({
    videoId,
    userId: user?.email,
    onSuccess: () => {
      stats.refetch();
      engagement.refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post the comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  function handleLike(liked: boolean) {
    if (engagement.isFetching || mutation.isLoading) return;
    if (!user) {
      toast({
        title: "Not allowed",
        description: "You must be signed in to like a video",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({ videoId, payload: { liked } });
  }

  function handleDislike(disliked: boolean) {
    if (engagement.isFetching || mutation.isLoading) return;
    if (!user) {
      toast({
        title: "Not allowed",
        description: "You must be signed in to dislike a video",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({ videoId, payload: { disliked } });
  }

  return (
    <div className="flex items-center gap-1">
      <Toggle
        variant="outline"
        className="flex items-center gap-2"
        disabled={engagement.isFetching || mutation.isLoading}
        pressed={Boolean(engagement.data?.data.liked)}
        onPressedChange={handleLike}
      >
        <Icons.like className="h-5 w-5" />
        <span className="sr-only">Like video</span>
        <span>
          {stats.isLoading && (
            <Icons.loading className="h-4 w-4 animate-spin" />
          )}
          {!stats.isLoading && stats.isError && "N/A"}
          {!stats.isLoading && !stats.isError && stats.data.data.likes}
        </span>
      </Toggle>
      <Toggle
        variant="outline"
        className="flex items-center gap-2"
        disabled={engagement.isFetching || mutation.isLoading}
        pressed={Boolean(engagement.data?.data.disliked)}
        onPressedChange={handleDislike}
      >
        <Icons.dislike className="h-5 w-5" />
        <span className="sr-only">Dislike video</span>
        <span>
          {stats.isLoading && (
            <Icons.loading className="h-4 w-4 animate-spin" />
          )}
          {!stats.isLoading && stats.isError && "N/A"}
          {!stats.isLoading && !stats.isError && stats.data.data.dislikes}
        </span>
      </Toggle>
    </div>
  );
}
