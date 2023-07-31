import { NextResponse } from "next/server";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { nanoid } from "nanoid";
import s3Client from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const fileName = searchParams.get("file_name");
  const mimeType = searchParams.get("mime_type");

  if (!title || !fileName || !mimeType) {
    return NextResponse.json(
      { error: "title, file_name and mime_type are required" },
      { status: 400 }
    );
  }
  if (!mimeType.includes("video")) {
    return NextResponse.json({ error: "Invalid mime-type" }, { status: 400 });
  }

  try {
    const videoId = nanoid();
    const extension = fileName.split(".")[1];
    const s3FileName = `${videoId}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.UNPROCESSED_VIDEO_BUCKET_NAME,
      Key: s3FileName,
      ContentType: mimeType,
      Metadata: {
        title,
        userid: session.user?.email!,
      },
    });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 15 * 60,
    });
    return NextResponse.json({ signedUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate a signed url" },
      { status: 500 }
    );
  }
}
