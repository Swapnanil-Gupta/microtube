import { VideoQuality } from "@prisma/client";

export { VideoQuality };

export type ProbeWorkerData = {
  videoId: string;
  origVideoPath: string;
};

export type ScaleWorkerData = {
  videoFilename: string;
  origVideoPath: string;
  tempDir: string;
  quality: VideoQuality;
};

export type ThumbnailWorkerData = {
  videoFilename: string;
  origVideoPath: string;
  tempDir: string;
};
