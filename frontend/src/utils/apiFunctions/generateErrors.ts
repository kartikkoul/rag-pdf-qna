import axios from 'axios';

interface StandardError {
  type?: string;
  message: string | Array<object>;
}

const generateErrors = (e: Error | unknown) => {
    if (axios.isAxiosError(e)) {
      const err = e.response?.data.error as StandardError || e.response?.data as StandardError;
      if (err?.type === "validation_error") {
        const validationErrors = (err.message as Array<object>).map((error) => (error as {message:string}).message);
        return validationErrors;
      }else if (err?.message) {
        return [err.message];
      }
    }

    return ["An unexpected error occurred. Please try again later."];
}

export default generateErrors