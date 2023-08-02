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
  quality: VideoQuality | null | undefined;
  show360p: boolean;
  show480p: boolean;
  onChangeQuality: (newQuality: VideoQuality) => void;
};

export default function VideoQualitySelector({
  videoUrl,
  show360p,
  show480p,
  quality,
  onChangeQuality,
}: Props) {
  return (
    <div className="flex flex-row items-center gap-2">
      {quality && (
        <Select value={quality} onValueChange={onChangeQuality}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Quality" />
          </SelectTrigger>
          <SelectContent>
            {show480p && <SelectItem value="FSD">480p</SelectItem>}
            {show360p && <SelectItem value="SD">360p</SelectItem>}
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
