import { StandardError } from '@/src/types/types';
import axios from 'axios';



const generateErrors = (e: Error | StandardError) => {
    if (axios.isAxiosError(e)) {
      const err = e.response?.data.error || e.response?.data ;
      if (err?.type === "validation_error") {
        const validationErrors = (err.message as Array<object>).map((error) => (error as {message:string}).message);
        return validationErrors;
      }else if (err?.message) {
        return [err.message];
      } else if (err?.detail) {
        /* OpenAPI format: detail is an array of { msg, loc, ... } */
        const detail = err.detail as ReadonlyArray<{ msg?: string }>;
        const errors = Array.from(new Set(detail.map((item) => item?.msg)));
        return errors;
      }
    }

    if ((e as Error).name === "AbortError") {
      return ["You stopped the streaming manually."];
    }

    return ["An unexpected error occurred. Please try again later."];
}

export default generateErrors