import {
  Video,
  VideoStatus,
  VideoUrl,
  VideoQuality,
  Metadata,
  Comment,
} from "@prisma/client";
import { ZodIssue } from "zod";

export type { Video, VideoStatus, Metadata, VideoUrl, VideoQuality, Comment };

export type VideoStats = {
  likes: number;
  dislikes: number;
};

export type VideoEngagement = {
  liked: boolean;
  disliked: boolean;
};

export type FullVideo = Video & {
  metadata?: Metadata | null;
  videoUrls?: VideoUrl[] | null;
  _count: VideoStats;
};

export type ApiResponse<T> = {
  data: T;
};

export type ErrorResponse = {
  error: string;
  issues?: ZodIssue[];
};

export type PaginatedApiResponse<T> = ApiResponse<T[]> & {
  total: number;
  page: number;
  perPage: number;
};

export type GetVideoResponse = ApiResponse<FullVideo>;

export type GetVideosResponse = PaginatedApiResponse<FullVideo>;

export type GetCommentResponse = ApiResponse<Comment>;

export type GetCommentsResponse = PaginatedApiResponse<Comment>;

export type GetVideoStatsResponse = ApiResponse<VideoStats>;

export type GetVideoEngagementResponse = ApiResponse<VideoEngagement>;

export type GetSignedUrlResponse = ApiResponse<string>;
