import { parentPort } from "worker_threads";
import { getVideoMetadata } from "../ffmpeg";
import prisma from "../prisma";
import { ProbeWorkerData } from "../../types";

parentPort?.on(
  "message",
  async ({ videoId, origVideoPath }: ProbeWorkerData) => {
    console.info("Thread: Probing video for metadata...");

    const meta = await getVideoMetadata(origVideoPath);
    await prisma.metadata.create({
      data: {
        videoId,
        duration: meta.format.duration || null,
      },
    });

    console.info("Thread: Metadata processing complete");
    parentPort?.postMessage("done");
  }
);
