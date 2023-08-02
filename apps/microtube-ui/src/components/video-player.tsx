"use client";

import { ForwardedRef, forwardRef } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";

type Props = {
  thumbnailUrl: string | null | undefined;
  videoUrl: string | null | undefined;
};

export default forwardRef(function VideoPlayer(
  { thumbnailUrl, videoUrl }: Props,
  ref: ForwardedRef<HTMLVideoElement>
) {
  const { toast } = useToast();
  return (
    <AspectRatio ratio={16 / 9}>
      <video
        className="h-full w-full"
        controls
        poster={thumbnailUrl || ""}
        ref={ref}
        onError={() =>
          toast({
            title: "Playback error",
            description: "There was an error playing the video",
            variant: "destructive",
          })
        }
      >
        <source src={videoUrl || ""} />
        <p>
          Your browser doesn&apos;t support HTML video. You can download the
          video from the link below.
        </p>
      </video>
    </AspectRatio>
  );
});
