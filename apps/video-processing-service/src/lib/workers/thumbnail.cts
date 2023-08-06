import { parentPort } from "worker_threads";
import path from "path";
import { generateThumbnail } from "../ffmpeg";
import { uploadFile, getFileUrl } from "../s3Client";
import prisma from "../prisma";
import { ThumbnailWorkerData } from "../../types";

parentPort?.on(
  "message",
  async ({ videoFilename, origVideoPath, tempDir }: ThumbnailWorkerData) => {
    console.info("Thread: Generating thumbnail...");

    const [videoId] = videoFilename.split(".");
    const thumbnailFilename = `${videoId}_thumbnail.jpeg`;
    const thumbnailPath = path.join(tempDir, thumbnailFilename);
    await generateThumbnail(origVideoPath, thumbnailPath);
    await uploadFile(`thumbnails/${thumbnailFilename}`, thumbnailPath);
    await prisma.video.update({
      data: {
        thumbnailUrl: getFileUrl(`thumbnails/${thumbnailFilename}`),
      },
      where: {
        id: videoId,
      },
    });

    console.info("Thread: Thumbnail generation complete");
    parentPort?.postMessage("done");
  }
);
