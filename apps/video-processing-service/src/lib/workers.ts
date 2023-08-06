import path from "path";
import {
  ProbeWorkerData,
  ScaleWorkerData,
  ThumbnailWorkerData,
} from "../types";
import { Worker } from "worker_threads";

export async function runProbeWorker(workerData: ProbeWorkerData) {
  return new Promise<void>((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname + "/workers/probe.cjs"));
    worker.postMessage(workerData);
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (exitCode) => {
      if (exitCode === 0) resolve();
      else reject("Worker exited with non-zero exit code");
    });
  });
}

export async function runScaleWorker(workerData: ScaleWorkerData) {
  return new Promise<void>((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname + "/workers/scale.cjs"));
    worker.postMessage(workerData);
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (exitCode) => {
      if (exitCode === 0) resolve();
      else reject("Worker exited with non-zero exit code");
    });
  });
}

export async function runThumbnailWorker(workerData: ThumbnailWorkerData) {
  return new Promise<void>((resolve, reject) => {
    const worker = new Worker(
      path.resolve(__dirname + "/workers/thumbnail.cjs")
    );
    worker.postMessage(workerData);
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (exitCode) => {
      if (exitCode === 0) resolve();
      else reject("Worker exited with non-zero exit code");
    });
  });
}
