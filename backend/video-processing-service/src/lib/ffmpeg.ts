import ffmpeg, { ffprobe } from "fluent-ffmpeg";

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");
ffmpeg.setFfprobePath("C:/ffmpeg/bin/ffprobe.exe");

export default ffmpeg;
export { ffprobe };
