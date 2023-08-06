"use client";

import { VideoQuality } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Icons from "@/lib/icons";

type Props = {
  videoUrl: string | null | undefined;
  selectedQuality: VideoQuality | null | undefined;
  qualities: VideoQuality[] | undefined;
  onChangeQuality: (newQuality: VideoQuality) => void;
};

export default function VideoQualitySelector({
  videoUrl,
  selectedQuality,
  qualities,
  onChangeQuality,
}: Props) {
  return (
    <div className="flex flex-row items-center gap-2">
      {selectedQuality && (
        <Select value={selectedQuality} onValueChange={onChangeQuality}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Quality" />
          </SelectTrigger>
          <SelectContent>
            {qualities &&
              qualities.map((q) => (
                <SelectItem key={q} value={q}>
                  {q}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
      {videoUrl && (
        <Link
          target="_blank"
          download
          href={videoUrl}
          className={buttonVariants({
            variant: "secondary",
          })}
        >
          <Icons.download className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
