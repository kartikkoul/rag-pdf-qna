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
  } catch (e) {
    return {
      type: "error",
      errors: generateErrors(e),
    };
  }
};


export const signInUser = async (userData: {
    usernameOrEmail: string;
    password: string;
  }) => {
    try {
      const response = await BASE_API_ROUTER.post("/auth/signin", userData);
      return response.data;
    } catch (e) {
      return {
        type: "error",
        errors: generateErrors(e),
      };
    }
  };
