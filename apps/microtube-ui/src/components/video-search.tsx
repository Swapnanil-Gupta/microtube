"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export default function VideoSearch() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get("search");
    if (!searchTerm) return;
    router.push(`/search/${searchTerm}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="search"
        name="search"
        id="search"
        placeholder="Search by video title"
      />
    </form>
  );
}
