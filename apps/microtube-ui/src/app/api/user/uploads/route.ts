import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/authOptions";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ErrorResponse, GetVideosResponse } from "@/types";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json<ErrorResponse>(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user?.email;
  if (!userId) {
    return NextResponse.json<ErrorResponse>(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const queryParams = {
    page: Number(searchParams.get("page")) || 1,
    perPage: Number(searchParams.get("per_page")) || 25,
  };
  try {
    const total = await prisma.video.count({
      where: {
        userId,
      },
    });
    const uploads = await prisma.video.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        uploadedAt: "desc",
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
      data: uploads,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json<ErrorResponse>(
      { error: "Unable to fetch user uploads" },
      { status: 500 }
    );
  }
}
