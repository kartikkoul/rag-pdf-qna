import { GlobalError } from "@/src/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";

const initialState : GlobalError = {
    message: "",
    duration: 3000
}

let clearErrorTimeout: ReturnType<typeof setTimeout> | null = null;

const globalErrorSlice = createSlice({
    name:"globalError",
    initialState,
    reducers:{
        setGlobalErrorMessage: (state: GlobalError, action: PayloadAction<string>) => {
            state.message = action.payload;
        },

        clearGlobalError: (state: GlobalError) => {
            state.message = "";
        }
    }
})

const { setGlobalErrorMessage, clearGlobalError } = globalErrorSlice.actions;

export const setGlobalError = (message: string) => (dispatch: AppDispatch) => {
    if (clearErrorTimeout) {
        clearTimeout(clearErrorTimeout);
    }

    dispatch(setGlobalErrorMessage(message));
    clearErrorTimeout = setTimeout(() => {
        dispatch(clearGlobalError());
    }, initialState.duration);
};

export { clearGlobalError };
export default globalErrorSlice.reducer;