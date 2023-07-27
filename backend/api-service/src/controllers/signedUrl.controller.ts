import { Request, Response } from "express";
import s3Client from "../lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { nanoid } from "nanoid";

export const generateSignedUrl = async (req: Request, res: Response) => {
  const querySchema = z.object({
    fileName: z.string(),
    fileType: z.string(),
  });
  const parsedQuery = querySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({
      error: "fileName and fileType are required to generate a signed url",
    });
  }

  const { fileName, fileType } = parsedQuery.data;
  const fileExtension = decodeURIComponent(fileName).split(".")[1];
  const fileMimeType = decodeURIComponent(fileType);
  const videoId = nanoid();
  const awsFileName = `${videoId}.${fileExtension}`;

  if (!fileExtension || !fileMimeType.includes("video")) {
    return res.status(400).json({
      error: "Invalid file type",
    });
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.VIDEO_BUCKET_NAME,
      Key: awsFileName,
      ContentType: fileMimeType,
    });
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 15 * 60,
    });
    res.status(200).json({ videoId, uploadUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to generate a signed url" });
  }
};
