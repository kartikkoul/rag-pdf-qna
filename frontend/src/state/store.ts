import { configureStore } from "@reduxjs/toolkit";
import knowledgeSlice from "./slices/knowledgeSlice";
import authSlice from "./slices/authSlice"
import conversationSlice from "./slices/conversationSlice";

export const store = configureStore({
    reducer: {
        knowledge: knowledgeSlice,
        auth: authSlice,
        conversation: conversationSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch