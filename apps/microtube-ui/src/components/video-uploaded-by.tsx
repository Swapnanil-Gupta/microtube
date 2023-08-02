import Icons from "@/lib/icons";

export default function VideoUploadedBy({ userId }: { userId: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 md:p-3.5 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-full">
        <Icons.uploader className="h-4 w-4 md:h-6 md:w-6" />
        <span className="sr-only">User</span>
      </div>
      <div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Uploaded by
        </p>
        <p className="font-semibold text-sm md:text-base">{userId}</p>
      </div>
    </div>
  );
}
