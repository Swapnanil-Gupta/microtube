import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParams = {
    title: searchParams.get("title") || undefined,
    page: Number(searchParams.get("page")) || 1,
    perPage: Number(searchParams.get("per_page")) || 25,
    sortBy: searchParams.get("sort_by") || "likeCount",
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
        [queryParams.sortBy]: "desc",
      },
      include: {
        metadata: true,
      },
      take: queryParams.perPage,
      skip: (queryParams.page - 1) * queryParams.perPage,
    });
    return NextResponse.json({
      total,
      page: queryParams.page,
      perPage: queryParams.perPage,
      data: videos,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to fetch videos" },
      { status: 500 }
    );
  }
}
