import axios from 'axios';

const generateErrors = (e: unknown) => {

    if (axios.isAxiosError(e)) {
      const err = e.response?.data.error;
      if (err.type === "validation_error") {
        const validationErrors = (err.message as Array<object>).map((error) => (error as {message:string}).message);
        return validationErrors;
      }
    }

    return ["An unexpected error occurred. Please try again later."];
}

export default generateErrors