# MicroTube
![Untitled-2023-08-01-1635](https://github.com/Swapnanil-Gupta/microtube/assets/23559763/6fa86f6f-4764-4804-915c-7f27fb863ab3)

## What it is
MicroTube is a essentially a Youtube clone. However, I did not recreate only the UI of Youtube but also some of it's core features like video uploads, processing, likes/dislikes, comments etc. from scratch. It is a distributed and extensible system that offers a small subset of Youtube's functionality.

The UI and API is built using NextJS 13 and the video processing services are written in NodeJS and uses ffmpeg internally to scale videos to 360p/480p, generate thumbnails and read video metadata.

I have used AWS S3 to store raw/processed videos and generated thumbnails and AWS SQS as a message queue for asynchronous communication between API and video processing services.
## What it does
MicroTube offers the following features:
- Upload a new video
- Automatic thumbnail generation
- Video scaling to 360p/480p
- Browse and watch videos
- Search videos by title
- Change the quality of the video when watching (360p/480p)
- Download vidoes
- Like/Dislike a video. 
- Comment on a video.
- A private page for users to see all their uploads and likes in one place.

And,
- Optimistic updates (for likes/dislikes, using react-query)
- Light/Dark mode (using next-themes, Tailwind CSS and shadcn/ui)
- Beautiful and responsive UI (using Tailwind CSS and shadcn/ui)


## How the upload works
The most important functionality of the app is video upload and processing. The way it works is:

1. UI sends a request to the API to get a signed url. This way the UI can upload the video directly to S3 and not through the API.
2. The API forwards the request to S3, generates a signed url and sends it back to the UI.
3. The UI uploads the video to a raw videos bucket in S3. This bucket has been configured to send an upload notification to SQS.
4. The video pre-processor service that is listening to the video upload message queue, receives the notification and writes to DB that the video has been successfully uploaded and is ready to be processed. 
5. It then sends a message to the video processing queue.
6. The video processor service that is listening to the video processing message queue, receives the message. 
7. It then proceeds to download the video from the S3 raw videos bucket to a temporary location and then uses ffmpeg to scale the video to 360p and 480p.
8. Then it generates a thumbnail for the video and uses ffprobe to read the metadata of the video.
9. It then uploads the scaled videos and thumbnails to another processed videos S3 bucket.
10. Then it writes the metadata and the url of the S3 files uploaded in the previous step to the DB.
11. The video processing is now complete and the UI can now request the video by reading the DB entry via the API.
