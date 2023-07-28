import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

async function getObjectMetadata(fileName: string) {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.UNPROCESSED_VIDEO_BUCKET_NAME,
      Key: fileName,
    });
    const { Metadata } = await s3Client.send(command);
    return Metadata;
  } catch (err) {
    throw err;
  }
}

export default s3Client;
export { getObjectMetadata };
