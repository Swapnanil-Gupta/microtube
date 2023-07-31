import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;
  const { searchParams } = new URL(request.url);
  const queryParams = {
    page: Number(searchParams.get("page")) || 1,
    perPage: Number(searchParams.get("per_page")) || 50,
    sortBy: searchParams.get("sort_by") || "likeCount",
  };

  try {
    const total = prisma.comment.count({
      where: {
        videoId,
      },
    });
    const comments = await prisma.comment.findMany({
      where: {
        videoId,
      },
      orderBy: {
        [queryParams.sortBy]: "desc",
      },
      take: queryParams.perPage,
      skip: (queryParams.page - 1) * queryParams.perPage,
    });
    return NextResponse.json({
      total,
      page: queryParams.page,
      perPage: queryParams.perPage,
      data: comments,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to fetch video comments" },
      { status: 500 }
    );
  }
}
