import { StandardError } from "@/src/types/types";
import BASE_API_ROUTER from "./axiosRouter";
import generateErrors from "./generateErrors";

export const signUpUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await BASE_API_ROUTER.post("/auth/signup", userData);
    return response.data;
  } catch (e: unknown) {
    return {
      type: "error",
      error: generateErrors(e as Error | StandardError),
    };
  }
};


export const signInUser = async (userData: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await BASE_API_ROUTER.post("/auth/signin", userData);
      return response.data;
    } catch (e) {
      return {
        type: "error",
        error: generateErrors(e as Error | StandardError),
      };
    }
  };

export const signOutUser = async () => {
  try{
    const response = await BASE_API_ROUTER.post("/auth/signout");
    return response.data;
  }catch(e){
    return {
      type: "error",
      error: generateErrors(e as Error | StandardError)
    }
  }
}
