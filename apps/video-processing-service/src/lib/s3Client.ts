import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

async function uploadFile(filename: string, filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: process.env.PROCESSED_VIDEO_BUCKET_NAME,
    Key: filename,
    Body: fileStream,
  });
  await s3Client.send(command);
}

async function downloadFile(filename: string, destDir: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.UNPROCESSED_VIDEO_BUCKET_NAME,
    Key: filename,
  });

  try {
    const { Body: body, Metadata: meta } = await s3Client.send(command);
    const data = await body?.transformToByteArray();
    if (!data) {
      throw new Error(
        "Failed to download the file. Received empty data from S3"
      );
    }
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const savedPath = path.join(destDir, filename);
    fs.writeFileSync(savedPath, data);
    return { savedPath, meta };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function getFileUrl(fileName: string) {
  return `https://${process.env.PROCESSED_VIDEO_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
}

export default s3Client;
export { uploadFile, downloadFile, getFileUrl };
