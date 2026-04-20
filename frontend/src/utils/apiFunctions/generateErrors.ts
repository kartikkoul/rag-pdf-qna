import { StandardError } from '@/src/types/types';
import axios from 'axios';



const generateErrors = (e: Error | StandardError) => {
    if (axios.isAxiosError(e)) {
      const err = e.response?.data.error || e.response?.data ;
      if (err?.type === "validation_error") {
        const validationErrors = (err.message as Array<object>).map((error) => (error as {message:string}).message);
        return {errors: validationErrors, type: err.type};
      }else if (err?.message) {
        return {errors: [err.message]};
      } else if (err?.detail) {
        /* OpenAPI format: detail could be array from Pydantic or custom object */
        const detail = err.detail;
        const errors = Array.isArray(detail) ? Array.from(new Set(detail.map((item) => item?.msg))) : [detail?.message];

        const errType = err?.detail?.type;

        const returnError : {
          errors: string[],
          type?: string
        } = {
          errors: errors
        }

        if(errType) returnError["type"] = errType
        
        return returnError;
      }
    }

    if ((e as Error).name === "AbortError") {
      return {errors: ["You stopped the streaming manually."], type: "abort_error"};
    }

    return {errors: ["An unexpected error occurred. Please try again later."]};
}

export default generateErrors