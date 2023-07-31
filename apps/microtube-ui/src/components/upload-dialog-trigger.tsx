"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icons from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";

export default function UploadDialogTrigger() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const file = formData.get("video") as File;

    if (!title || !file) {
      toast({
        title: "Invalid input",
        description: "Title and video file are required",
        variant: "destructive",
      });
    }

    try {
      const signedUrlResponse = await fetch(
        `/api/signed-url?title=${title}&file_name=${file.name}&mime_type=${file.type}`
      );
      if (!signedUrlResponse.ok) throw new Error("Failed to fetch signed url");
      const { signedUrl } = await signedUrlResponse.json();
      const fileUploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      if (!fileUploadResponse.ok) throw new Error("Failed to upload video");
      toast({
        title: "Video uploaded successfully",
        description: "It should be available within a few minutes",
      });
      setLoading(false);
      setDialogOpen(false);
      router.push("/my-uploads");
    } catch (err) {
      toast({
        title: "Unable to upload the video",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)}>
          <Icons.upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a new video</DialogTitle>
        </DialogHeader>
        <form id="video-upload-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-4">
              <Label htmlFor="title">Title</Label>
              <Input name="title" id="title" placeholder="Title" required />
            </div>
            <div className="flex flex-col gap-y-4">
              <Label htmlFor="video">Video</Label>
              <Input
                name="video"
                id="video"
                type="file"
                accept="video/*"
                required
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="video-upload-form" disabled={loading}>
            {loading && <Icons.loading className="h-4 w-4 mr-2 animate-spin" />}
            Upload
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
