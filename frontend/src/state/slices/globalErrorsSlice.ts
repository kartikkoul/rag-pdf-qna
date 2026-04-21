import { GlobalError } from "@/src/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState : GlobalError = {
    message: "",
    duration: 3000
}

const globalErrorSlice = createSlice({
    name:"globalError",
    initialState,
    reducers:{
        setGlobalError: (state: GlobalError, action: PayloadAction<string>) => {
            state.message = action.payload;
        },

        clearGlobalError: (state: GlobalError) => {
            state.message = "";
        }
    }
})

export const { setGlobalError, clearGlobalError } = globalErrorSlice.actions;
export default globalErrorSlice.reducer;