export default async function Watch({
  params,
}: {
  params: { videoId: string };
}) {
  const { videoId } = params;
  const response = await fetch(`http://localhost:3000/api/video/${videoId}`);
  const { data: video } = await response.json();

  return (
    <div className="flex flex-col gap-y-8">
      <p className="font-medium text-xl">{video.title}</p>
      <video controls width={900}>
        <source src={video.videoUrl} />
      </video>
    </div>
  );
}
