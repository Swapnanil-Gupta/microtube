import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { ErrorResponse, GetVideoEngagementResponse } from "@/types";

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
    const engagementPayloadSchema = z
      .object({
        liked: z.boolean(),
        disliked: z.boolean(),
      })
      .partial()
      .refine(
        ({ liked, disliked }) => liked !== undefined || disliked !== undefined,
        { message: "One of the fields (liked, disliked) must be defined" }
      );
    const result = engagementPayloadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ErrorResponse>(
        {
          error: "Invalid payload",
          issues: result.error.issues,
        },
        { status: 400 }
      );
    }

    const payload = result.data;
    if (typeof payload.liked !== "undefined") {
      if (payload.liked) {
        await prisma.like.create({
          data: {
            userId,
            videoId,
          },
        });
        await prisma.dislike.deleteMany({
          where: {
            userId,
            videoId,
          },
        });
        return NextResponse.json<GetVideoEngagementResponse>(
          { data: { liked: true, disliked: false } },
          { status: 201 }
        );
      } else {
        await prisma.like.delete({
          where: {
            userId_videoId: { userId, videoId },
          },
        });
        const disliked = await prisma.dislike.findUnique({
          where: {
            userId_videoId: { userId, videoId },
          },
        });
        return NextResponse.json(
          { data: { liked: false, disliked: Boolean(disliked) } },
          { status: 201 }
        );
      }
    }

    if (typeof payload.disliked !== "undefined") {
      if (payload.disliked) {
        await prisma.dislike.create({
          data: {
            userId,
            videoId,
          },
        });
        await prisma.like.deleteMany({
          where: {
            userId,
            videoId,
          },
        });
        return NextResponse.json<GetVideoEngagementResponse>(
          { data: { liked: false, disliked: true } },
          { status: 201 }
        );
      } else {
        await prisma.dislike.delete({
          where: {
            userId_videoId: { userId, videoId },
          },
        });
        const liked = await prisma.like.findUnique({
          where: {
            userId_videoId: { userId, videoId },
          },
        });
        return NextResponse.json<GetVideoEngagementResponse>(
          { data: { liked: Boolean(liked), disliked: false } },
          { status: 201 }
        );
      }
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json<ErrorResponse>(
      { error: "Unable to save video engagement" },
      { status: 500 }
    );
  }
}

export async function GET(
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

    const liked = await prisma.like.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });
    const disliked = await prisma.dislike.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });

    return NextResponse.json<GetVideoEngagementResponse>({
      data: {
        liked: Boolean(liked),
        disliked: Boolean(disliked),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json<ErrorResponse>(
      { error: "Unable to fetch video engagement" },
      { status: 500 }
    );
  }
}
