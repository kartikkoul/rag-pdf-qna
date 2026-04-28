import { configureStore } from "@reduxjs/toolkit";
import knowledgeSlice from "./slices/knowledgeSlice";
import authSlice from "./slices/authSlice"
import conversationSlice from "./slices/conversationSlice";
import globalErrorSlice from "./slices/globalErrorsSlice"
import generalContextSlice from "./slices/generalContext";

export const store = configureStore({
    reducer: {
        knowledge: knowledgeSlice,
        auth: authSlice,
        conversation: conversationSlice,
        globalError: globalErrorSlice,
        generalContext: generalContextSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch