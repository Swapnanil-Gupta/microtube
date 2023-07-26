import { Request, Response } from "express";
import { GetSignedUrlConfig } from "@google-cloud/storage";
import { nanoid } from "nanoid";
// @ts-ignore
import fileExtension from "file-extension";
import { z } from "zod";
import { unprocessedVideosBucket } from "../lib/storage";

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
  const extension = fileExtension(fileName);
  const key = `${nanoid()}.${extension}`;
  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000,
    contentType: fileType,
  } satisfies GetSignedUrlConfig;

  try {
    const [url] = await unprocessedVideosBucket.file(key).getSignedUrl(options);
    res.status(200).json({ signUrl: url });
  } catch (err) {
    res.status(500).json({ error: "Unable to generate a signed url" });
  }
};
