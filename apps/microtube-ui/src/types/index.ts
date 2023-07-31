import { Video, VideoStatus, Metadata, Comment } from "@prisma/client";

export type { Video, VideoStatus, Metadata };

export type VideoWithMetadata = Video & {
  metadata: Metadata | null;
};

export type ApiResponse<T> = {
  data: T;
};

export type PaginatedApiResponse<T> = ApiResponse<T[]> & {
  total: number;
  page: number;
  perPage: number;
};

export type GetVideoResponse = ApiResponse<VideoWithMetadata>;

export type GetVideosResponse = PaginatedApiResponse<VideoWithMetadata>;

export type GetVideoMetadataResponse = ApiResponse<Metadata>;

export type GetCommentsResponse = PaginatedApiResponse<Comment>;

export type GetSignedUrlResponse = ApiResponse<{ signedUrl: string }>;
