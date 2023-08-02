import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import authOptions from "@/lib/authOptions";
import { GetVideosResponse } from "@/types";
import MyUploadsLayout from "@/components/my-uploads-layout";

export default async function MyUploads({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");

  const page =
    typeof searchParams?.page === "string" ? Number(searchParams.page) : 1;
  const perPage =
    typeof searchParams?.perPage === "string"
      ? Number(searchParams.perPage)
      : 25;

  const response = await fetch(
    `http://localhost:3000/api/user/uploads?page=${page}&per_page=${perPage}`,
    {
      headers: headers(),
      cache: "no-store",
    }
  );
  if (!response.ok) {
  } // TODO: Handle error
  const data = (await response.json()) as GetVideosResponse;
  // TODO: Handle empty error

  return (
    <main className="py-8">
      <h1 className="font-semibold text-3xl md:text-4xl mb-2">My Uploads</h1>
      <p className="text-neutral-500 mb-4">
        All the videos that you&apos;ve uploaded
      </p>
      <MyUploadsLayout initialData={data} page={page} perPage={perPage} />
    </main>
  );
}
