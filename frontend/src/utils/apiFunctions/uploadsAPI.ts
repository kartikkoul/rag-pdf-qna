import { FastApiUploadResponse } from "@/src/types/backendResponseTypes";
import { StandardError } from "@/src/types/types";
import BASE_API_ROUTER from "./axiosRouter";
import generateErrors from "./generateErrors";

export const uploadFiles = async (files: File[]) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response : FastApiUploadResponse = await BASE_API_ROUTER.post("/upload", formData ,{
        headers:{
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
  } catch (e: unknown) {
    return {
      type: "error",
      errors: generateErrors(e as Error | StandardError),
    };
  }
};
