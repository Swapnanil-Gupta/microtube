import { Message } from "@aws-sdk/client-sqs";
import fs from "fs";
import { downloadFile } from "./lib/s3Client";
import prisma from "./lib/prisma";
import {
  runProbeWorker,
  runScaleWorker,
  runThumbnailWorker,
} from "./lib/workers";

export default async function messageHandler(message: Message) {
  if (!message.Body) {
    console.error("Empty message received from SQS. Aborting.");
    return;
  }

  const body = JSON.parse(message.Body);
  const videoFilename = body?.videoFilename as string;

  if (!videoFilename) {
    console.error("Invalid message received from queue. Aborting.");
    return;
  }

  const [videoId] = videoFilename.split(".");
  const tempDir = `./temp/${videoId}`;
  await prisma.video.update({
    data: {
      status: "PROCESSING",
    },
    where: {
      id: videoId,
    },
  });

  try {
    console.info("Downloading video for processing...");
    const { savedPath: origVideoPath } = await downloadFile(
      videoFilename,
      tempDir
    );
    console.info("Video downloaded. Starting video processing...");

    await Promise.all([
      runProbeWorker({
        origVideoPath,
        videoId,
      }),
      runScaleWorker({
        origVideoPath,
        tempDir,
        videoFilename,
        quality: "SD",
      }),
      runScaleWorker({
        origVideoPath,
        tempDir,
        videoFilename,
        quality: "FSD",
      }),
      runScaleWorker({
        origVideoPath,
        tempDir,
        videoFilename,
        quality: "HD",
      }),
      runThumbnailWorker({
        origVideoPath,
        tempDir,
        videoFilename,
      }),
    ]);

    console.info("Video processing completed");
    await prisma.video.update({
      data: {
        status: "PROCESSED",
      },
      where: {
        id: videoId,
      },
    });
  } catch (err) {
    console.error("Video processing failed");
    console.error(err);
    await prisma.video.update({
      data: {
        status: "FAILED",
      },
      where: {
        id: videoId,
      },
    });
    throw err;
  } finally {
    console.info("Cleaning up...");
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
