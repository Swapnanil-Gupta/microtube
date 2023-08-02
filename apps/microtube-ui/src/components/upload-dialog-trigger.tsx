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
import { GetSignedUrlResponse } from "@/types";
import axios from "axios";
import { Progress } from "./ui/progress";

export default function UploadDialogTrigger() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // TODO: ZOD FORM VALIDATION
    event.preventDefault();
    setLoading(true);

    if (!title || !file) {
      toast({
        title: "Invalid input",
        description: "Title and video file are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const signedUrlResponse = await fetch(
        `http://localhost:3000/api/signed-url?title=${encodeURIComponent(
          title
        )}&file_name=${encodeURIComponent(
          file.name
        )}&mime_type=${encodeURIComponent(file.type)}`
      );
      if (!signedUrlResponse.ok) throw new Error("Failed to fetch signed url");
      const { data: signedUrl } =
        (await signedUrlResponse.json()) as GetSignedUrlResponse;

      // Axios for upload progress
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progress) => {
          if (progress.total) {
            setUploadProgress(
              Math.ceil((progress.loaded / progress.total) * 100)
            );
          }
        },
      });

      toast({
        title: "Video uploaded successfully",
        description: "It should be available within a few minutes",
      });
      setFile(null);
      setTitle("");
      setUploadProgress(0);
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setTitle(file.name);
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        console.log(open);
        setDialogOpen(open);
      }}
    >
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
              <Label htmlFor="video">Video</Label>
              <Input
                name="video"
                id="video"
                type="file"
                accept="video/*"
                required
                onChange={handleFileChange}
              />
            </div>
            <div className="flex flex-col gap-y-4">
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                id="title"
                placeholder="Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <Progress value={uploadProgress} />
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
