import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ErrorResponse, GetVideoStatsResponse } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { videoId } = params;
    const videoStats = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        _count: {
          select: {
            likes: true,
            dislikes: true,
          },
        },
      },
    });
    if (!videoStats) {
      return NextResponse.json<ErrorResponse>(
        {
          error: "Video not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<GetVideoStatsResponse>({
      data: videoStats._count,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json<ErrorResponse>(
      { error: "Unable to fetch video stats" },
      { status: 500 }
    );
  }
}
