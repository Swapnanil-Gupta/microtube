import Loader from "@/components/loader";

export default function Loading() {
  return (
    <main>
      <h1 className="font-semibold text-3xl md:text-4xl mb-2">Browse Videos</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-12">
        Discover the most liked videos
      </p>
      <Loader />
    </main>
  );
}
