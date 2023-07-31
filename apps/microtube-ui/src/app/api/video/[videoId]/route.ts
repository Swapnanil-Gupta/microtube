import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;
  try {
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      include: {
        metadata: true,
      },
    });
    if (!video) {
      return NextResponse.json(
        {
          error: "video not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      data: video,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to fetch video" },
      { status: 500 }
    );
  }
}
