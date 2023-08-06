"use client";

import { useRef, useState } from "react";
import { FullVideo, VideoQuality } from "@/types";
import VideoQualitySelector from "./video-quality-selector";
import VideoPlayer from "./video-player";
import VideoComments from "./video-comments";
import VideoUploadedBy from "./video-uploaded-by";
import VideoLikeDislike from "./video-like-dislike";

export default function PlayVideoLayout({ video }: { video: FullVideo }) {
  const { videoUrls } = video;
  const videoQualities = videoUrls?.map((q) => q.quality);

  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const [selectedVideoQuality, setSelectedVideoQuality] =
    useState<VideoQuality | null>(videoQualities ? videoQualities[0] : null);
  const videoUrl = selectedVideoQuality
    ? videoUrls?.find((v) => v.quality === selectedVideoQuality)?.url
    : null;

  function handleQualityChange(value: VideoQuality) {
    setSelectedVideoQuality(value);
    const videoPlayer = videoPlayerRef.current;
    if (!videoPlayer) return;
    videoPlayer.load();
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <VideoPlayer
        ref={videoPlayerRef}
        thumbnailUrl={video?.thumbnailUrl}
        videoUrl={videoUrl}
      />
      <div className="flex justify-between gap-4 items-center flex-wrap">
        <VideoUploadedBy userId={video.userId} />
        <div className="flex items-center gap-2 flex-wrap">
          <VideoLikeDislike videoId={video.id} />
          <VideoQualitySelector
            videoUrl={videoUrl}
            qualities={videoQualities}
            selectedQuality={selectedVideoQuality}
            onChangeQuality={handleQualityChange}
          />
        </div>
      </div>
      <VideoComments videoId={video.id} />
    </div>
  );
}
