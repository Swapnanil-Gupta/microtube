import { Message } from "@aws-sdk/client-sqs";
import path from "path";
import fs from "fs";
import { downloadFile, getFileUrl, uploadFile } from "./lib/s3Client";
import { generateThumbnail, getVideoMetadata, scaleVideo } from "./lib/ffmpeg";
import prisma from "./lib/prisma";

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

  const [videoId, ext] = videoFilename.split(".");
  const tempDir = `./temp/${videoId}`;
  await prisma.video.update({
    data: {
      status: "PROCESSING",
    },
    where: {
      id: videoId,
    },
  });

  // TODO: Handle Error
  try {
    console.info("Downloading video...");
    const { savedPath: origVideoPath } = await downloadFile(
      videoFilename,
      tempDir
    );

    // metadata
    console.info("Probing video for metadata...");
    const meta = await getVideoMetadata(origVideoPath);
    await prisma.metadata.create({
      data: {
        videoId,
        duration: meta.format.duration || null,
      },
    });

    // 480p scaling
    console.info("Scaling video...");
    const video480pFilename = `${videoId}_480p.${ext}`;
    const video480pPath = path.join(tempDir, video480pFilename);
    await scaleVideo(origVideoPath, video480pPath, 480);
    await uploadFile(video480pFilename, video480pPath);
    await prisma.videoUrl.create({
      data: {
        videoId,
        quality: "FSD",
        url: getFileUrl(video480pFilename),
      },
    });

    const video360pFilename = `${videoId}_360p.${ext}`;
    const video360pPath = path.join(tempDir, video360pFilename);
    await scaleVideo(origVideoPath, video360pPath, 360);
    await uploadFile(video360pFilename, video360pPath);
    await prisma.videoUrl.create({
      data: {
        videoId,
        quality: "SD",
        url: getFileUrl(video360pFilename),
      },
    });

    // Thumbnail generation
    // TODO: FIX BLACK BARS
    console.info("Generating thumbnail...");
    const thumbnailFilename = `${videoId}_thumbnail.jpeg`;
    const thumbnailPath = path.join(tempDir, thumbnailFilename);
    await generateThumbnail(origVideoPath, thumbnailPath);
    await uploadFile(`thumbnails/${thumbnailFilename}`, thumbnailPath);
    await prisma.video.update({
      data: {
        thumbnailUrl: getFileUrl(`thumbnails/${thumbnailFilename}`),
        status: "PROCESSED",
      },
      where: {
        id: videoId,
      },
    });
  } catch (err) {
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
    // cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
