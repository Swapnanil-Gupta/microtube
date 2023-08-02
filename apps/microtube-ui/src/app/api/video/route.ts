import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ErrorResponse, GetVideosResponse } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParams = {
    title: searchParams.get("title") || undefined,
    page: Number(searchParams.get("page")) || 1,
    perPage: Number(searchParams.get("per_page")) || 25,
  };

  try {
    const total = await prisma.video.count({
      where: {
        title: {
          contains: queryParams.title,
        },
        status: "PROCESSED",
      },
    });
    const videos = await prisma.video.findMany({
      where: {
        title: {
          contains: queryParams.title,
        },
        status: "PROCESSED",
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      include: {
        metadata: true,
        _count: {
          select: {
            likes: true,
            dislikes: true,
          },
        },
      },
      take: queryParams.perPage,
      skip: (queryParams.page - 1) * queryParams.perPage,
    });
    return NextResponse.json<GetVideosResponse>({
      total,
      page: queryParams.page,
      perPage: queryParams.perPage,
      data: videos,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json<ErrorResponse>(
      { error: "Unable to fetch videos" },
      { status: 500 }
    );
  }
}
