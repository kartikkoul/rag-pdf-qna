import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    username: string | null;
}

const initialState: AuthState = {
    username: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state: AuthState, action: PayloadAction<AuthState>) => {
            state.username = action.payload.username
        },
        clearAuth: (state: AuthState) => {
            state.username = null
        }
    }
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer