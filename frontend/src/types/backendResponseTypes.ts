export type FastApiUploadResults = Array<{
  filename: string;
  status: "failed" | "success";
  error?: string;
  data?: {
    filename: string;
    chunk_count: number;
  };
}>;

export type FastApiUploadResponse = {
  message: string;
  data: {
    summary: {
      total: number;
      success: number;
      failed: number;
    };
    results: FastApiUploadResults;
  };
};
