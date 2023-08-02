import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  ErrorResponse,
  GetCommentResponse,
  GetCommentsResponse,
} from "@/types";
import { z } from "zod";

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
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

  try {
    const { videoId } = params;
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
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

    const body = await request.json();
    const commentPayloadSchema = z.object({
      message: z.string().min(3).max(100),
    });
    const result = commentPayloadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ErrorResponse>(
        {
          error: "Invalid payload",
          issues: result.error.issues,
        },
        { status: 400 }
      );
    }

    const message = result.data.message;
    const newComment = await prisma.comment.create({
      data: {
        message,
        userId,
        videoId,
      },
    });
    return NextResponse.json<GetCommentResponse>(
      { data: newComment },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json<ErrorResponse>(
      { error: "Unable to create comment" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const { searchParams } = new URL(request.url);
  const queryParams = {
    page: Number(searchParams.get("page")) || 1,
    perPage: Number(searchParams.get("per_page")) || 50,
  };

  try {
    const { videoId } = params;
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
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

    const total = await prisma.comment.count({
      where: {
        videoId,
      },
    });
    const comments = await prisma.comment.findMany({
      where: {
        videoId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: queryParams.perPage,
      skip: (queryParams.page - 1) * queryParams.perPage,
    });
    return NextResponse.json<GetCommentsResponse>({
      total,
      page: queryParams.page,
      perPage: queryParams.perPage,
      data: comments,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json<ErrorResponse>(
      { error: "Unable to fetch video comments" },
      { status: 500 }
    );
  }
}
