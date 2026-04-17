import BASE_API_ROUTER from "./axiosRouter";
import generateErrors from "./generateErrors";

export const uploadFiles = async (files: File[]) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await BASE_API_ROUTER.post("/upload", formData ,{
        headers:{
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
  } catch (e: Error | unknown) {
    return {
      type: "error",
      errors: generateErrors(e),
    };
  }
};
