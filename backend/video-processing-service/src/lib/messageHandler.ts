import { Message } from "@aws-sdk/client-sqs";
import path from "path";
import fs from "fs";
import { downloadFile, uploadFile } from "./s3Client";
import { generateThumbnail, getVideoMetadata, scaleVideo } from "./ffmpeg";

export default async function messageHandler(message: Message) {
  if (!message.Body) {
    console.error("Empty message received from SQS. Aborting.");
    return;
  }

  const body = JSON.parse(message.Body);
  const s3Record = body?.Records?.[0];
  const videoBucket = s3Record?.s3?.bucket?.name as string;
  const videoFilename = s3Record?.s3?.object?.key as string;

  if (!videoBucket || !videoFilename) {
    console.error("Bucket or file key is missing. Aborting.");
    return;
  }

  const [videoId, ext] = videoFilename.split(".");
  const tempDir = `./temp/${videoId}`;

  // TODO: Handle Error
  try {
    const destBucket = process.env.PROCESSED_VIDEO_BUCKET_NAME!;
    const origVideoPath = await downloadFile(
      videoFilename,
      videoBucket,
      tempDir
    );

    // 480p scaling
    const video480pFilename = `${videoId}_480p.${ext}`;
    const video480pPath = path.join(tempDir, video480pFilename);
    await scaleVideo(origVideoPath, video480pPath);
    await uploadFile(video480pFilename, destBucket, video480pPath);

    // Thumbnail generation
    const thumbnailFilename = `${videoId}_thumbnail.jpeg`;
    const thumbnailPath = path.join(tempDir, thumbnailFilename);
    await generateThumbnail(origVideoPath, thumbnailPath);
    await uploadFile(
      `thumbnails/${thumbnailFilename}`,
      destBucket,
      thumbnailPath
    );

    // TODO: duration
    const meta = await getVideoMetadata(origVideoPath);
    console.log(meta.format.duration);
  } catch (err) {
    throw err;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
