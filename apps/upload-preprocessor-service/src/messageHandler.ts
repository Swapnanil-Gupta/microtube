import { Message } from "@aws-sdk/client-sqs";
import { getObjectMetadata } from "./lib/s3Client";
import { sendMessage } from "./lib/sqsClient";
import prisma from "./lib/prisma";

export default async function messageHandler(message: Message) {
  try {
    if (!message.Body) {
      console.error("Empty message received from SQS. Aborting.");
      return;
    }

    const body = JSON.parse(message.Body);
    const s3Record = body?.Records?.[0];
    const videoFilename = s3Record?.s3?.object?.key as string;

    if (!videoFilename) {
      console.error("Bucket or file key is missing. Aborting.");
      return;
    }

    const metadata = await getObjectMetadata(videoFilename);
    if (!metadata) {
      console.error(
        "Video does not have the metadata required for processing. Aborting."
      );
      return;
    }

    const title = metadata.title;
    const userId = metadata.userid;
    if (!title || !userId) {
      console.error(
        "Video does not have the metadata required for processing. Aborting."
      );
      return;
    }

    console.info("Video upload notification recived");
    const [videoId] = videoFilename.split(".");
    await prisma.video.create({
      data: {
        id: videoId,
        title,
        userId,
        status: "UPLOADED",
      },
    });

    console.info("Sending notification to video processing service");
    await sendMessage({ videoFilename });
    console.info("Notified video processing service");
  } catch (err) {
    console.error("Failed to process video upload notification");
    console.error(err);
    throw err;
  }
}
