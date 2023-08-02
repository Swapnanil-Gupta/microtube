import { Message } from "@aws-sdk/client-sqs";
import { getObjectMetadata } from "./lib/s3Client";
import { sendMessage } from "./lib/sqsClient";
import prisma from "./lib/prisma";

export default async function messageHandler(message: Message) {
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

  const [videoId] = videoFilename.split(".");

  // TODO: handle error
  await prisma.video.create({
    data: {
      id: videoId,
      title,
      userId,
      status: "UPLOADED",
    },
  });

  await sendMessage({ videoFilename });
}
