import { configureStore } from "@reduxjs/toolkit";
import knowledgeSlice from "./slices/knowledgeSlice";

export const store = configureStore({
    reducer: {
        knowledge: knowledgeSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch