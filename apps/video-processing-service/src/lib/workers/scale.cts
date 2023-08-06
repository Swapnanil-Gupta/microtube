import { parentPort } from "worker_threads";
import path from "path";
import { scaleVideo } from "../ffmpeg";
import { uploadFile, getFileUrl } from "../s3Client";
import prisma from "../prisma";
import { ScaleWorkerData } from "../../types";

parentPort?.on(
  "message",
  async ({
    videoFilename,
    origVideoPath,
    tempDir,
    quality,
  }: ScaleWorkerData) => {
    console.info(`Thread: Scaling video to ${quality}...`);

    const [videoId, ext] = videoFilename.split(".");
    const scaledVideoFilename = `${videoId}_${quality}.${ext}`;
    const scaledVideoPath = path.join(tempDir, scaledVideoFilename);
    await scaleVideo(origVideoPath, scaledVideoPath, quality);
    await uploadFile(scaledVideoFilename, scaledVideoPath);
    await prisma.videoUrl.create({
      data: {
        videoId,
        quality,
        url: getFileUrl(scaledVideoFilename),
      },
    });

    console.info(`Thread: Video scaling to ${quality} complete`);
    parentPort?.postMessage("done");
  }
);
