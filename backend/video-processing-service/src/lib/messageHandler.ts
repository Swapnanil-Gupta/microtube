import { Message } from "@aws-sdk/client-sqs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client";
import fs from "fs";
import path from "path";
import ffmpeg from "./ffmpeg";

export default async function messageHandler(message: Message) {
  if (!message.Body) return;

  const body = JSON.parse(message.Body);
  const record = body?.Records[0];
  const uploadBucket = record?.s3?.bucket.name;
  const uploadedVideoKey = record?.s3?.object.key;

  if (!uploadBucket || !uploadedVideoKey) return;

  console.info(
    `Attempting to download file (${uploadedVideoKey}) from bucket: (${uploadBucket})`
  );
  const command = new GetObjectCommand({
    Bucket: uploadBucket,
    Key: uploadedVideoKey,
  });

  const item = await s3Client.send(command);
  const data = await item.Body?.transformToByteArray();

  if (!data) {
    console.error("empty body received from aws s3 instead of the file");
    return;
  }

  let outDir = "./downloads/";
  const savePath = path.join(outDir, uploadedVideoKey);
  console.info("Out Directory" + outDir);

  if (!fs.existsSync(outDir)) {
    console.info("Creating directory");
    fs.mkdirSync(outDir);
  } else {
    console.info("Directory already exist");
  }

  console.info(`Saving video to path: ${savePath}`);
  await fs.writeFile(savePath, data, (err) => {
    if (err) {
      console.error("Failed to save the file to disk");
      return;
    }
    console.info("File saved successfully");
    ffmpeg(savePath).outputOptions("-vf", "scale=-1:360").save("test.mp4");
  });
}
