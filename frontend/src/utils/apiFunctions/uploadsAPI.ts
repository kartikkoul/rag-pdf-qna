import { FastApiUploadResponse } from "@/src/types/backendResponseTypes";
import { StandardError } from "@/src/types/types";
import BASE_API_ROUTER from "./axiosRouter";
import generateErrors from "./generateErrors";

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const response = await BASE_API_ROUTER.post("/upload", formData ,{
        headers:{
            "Content-Type": "multipart/form-data"
        }
    });


    return response.data as FastApiUploadResponse;
  } catch (e: unknown) {
    return {
      type: "error",
      error: generateErrors(e as Error | StandardError),
    };
  }
};
