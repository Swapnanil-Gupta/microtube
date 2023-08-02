import ffmpeg, { FfprobeData, ffprobe } from "fluent-ffmpeg";

// TODO: env var
ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");
ffmpeg.setFfprobePath("C:/ffmpeg/bin/ffprobe.exe");

function scaleVideo(inputPath: string, outputPath: string, quality: 360 | 480) {
  return new Promise<string>((resolve, reject) => {
    ffmpeg(inputPath)
      .size(`?x${quality}`)
      .save(outputPath)
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function generateThumbnail(inputPath: string, outputPath: string) {
  return new Promise<string>((resolve, reject) => {
    ffmpeg(inputPath)
      .thumbnail({
        count: 1,
        filename: outputPath,
        size: "?x720",
      })
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function getVideoMetadata(inputPath: string) {
  return new Promise<FfprobeData>((resolve, reject) => {
    ffprobe(inputPath, (err, meta) => {
      if (err) reject(err);
      else resolve(meta);
    });
  });
}

export default ffmpeg;
export { scaleVideo, generateThumbnail, getVideoMetadata };
