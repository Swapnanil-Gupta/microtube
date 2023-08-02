import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ErrorResponse, GetVideoResponse } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { videoId } = params;
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      include: {
        metadata: true,
        videoUrls: true,
        _count: {
          select: {
            likes: true,
            dislikes: true,
          },
        },
      },
    });
    if (!video) {
      return NextResponse.json<ErrorResponse>(
        {
          error: "Video not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json<GetVideoResponse>({
      data: video,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json<ErrorResponse>(
      { error: "Unable to fetch video" },
      { status: 500 }
    );
  }
}
