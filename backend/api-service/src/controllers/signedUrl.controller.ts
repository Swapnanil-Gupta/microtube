import { Request, Response } from "express";
import s3Client from "../lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { nanoid } from "nanoid";

export const generateSignedUrl = async (req: Request, res: Response) => {
  // TODO: separate validator
  const querySchema = z.object({
    title: z.string(),
    mimeType: z.string(),
  });
  const parsedQuery = querySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({
      error: "title and mimeType are required to generate a signed url",
    });
  }

  const title = decodeURIComponent(parsedQuery.data.title);
  const mimeType = decodeURIComponent(parsedQuery.data.mimeType);
  const ext = title.split(".")[1];
  const videoId = nanoid();
  const s3FileName = `${videoId}.${ext}`;

  if (!ext || !mimeType || !mimeType.includes("video")) {
    return res.status(400).json({
      error: "Invalid file type",
    });
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.VIDEO_BUCKET_NAME,
      Key: s3FileName,
      ContentType: mimeType,
      Metadata: {
        title,
        "uploaded-by": "12345", // TODO: add user id
      },
    });
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 15 * 60,
    });
    res.status(200).json({ title, videoId, uploadUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to generate a signed url" });
  }
};
