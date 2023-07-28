import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

async function uploadFile(filename: string, bucket: string, filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: filename,
    Body: fileStream,
  });
  await s3Client.send(command);
}

async function downloadFile(filename: string, bucket: string, destDir: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: filename,
  });

  try {
    const item = await s3Client.send(command);
    const data = await item.Body?.transformToByteArray();
    if (!data) {
      throw new Error(
        "Failed to download the file. Received empty data from S3"
      );
    }
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const savePath = path.join(destDir, filename);
    fs.writeFileSync(savePath, data);
    return savePath;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default s3Client;
export { uploadFile, downloadFile };
