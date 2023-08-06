import Loader from "@/components/loader";

export default function Loading() {
  return (
    <main className="py-8">
      <h1 className="font-semibold text-3xl md:text-4xl mb-2">Browse Videos</h1>
      <p className="text-neutral-500 mb-12">Discover the most liked videos</p>
      <Loader />
    </main>
  );
}
