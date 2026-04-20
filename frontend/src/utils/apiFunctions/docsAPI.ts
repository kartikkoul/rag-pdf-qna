import { StandardError } from "@/src/types/types";
import generateErrors from "./generateErrors";
import BASE_API_ROUTER from "./axiosRouter";

export const fetchDocsNames = async() => {
    try{
        const response = await BASE_API_ROUTER.get("/getdocsnames");
        return response.data;
    }catch (e: Error | StandardError | unknown) {
      return {
        type: "error",
        error: generateErrors(e as Error | StandardError),
      };
    }
}