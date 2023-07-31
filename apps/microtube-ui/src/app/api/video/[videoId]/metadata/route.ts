import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;
  try {
    const metadata = await prisma.metadata.findUnique({
      where: {
        videoId,
      },
    });
    return NextResponse.json({
      data: metadata,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to fetch video metadata" },
      { status: 500 }
    );
  }
}
