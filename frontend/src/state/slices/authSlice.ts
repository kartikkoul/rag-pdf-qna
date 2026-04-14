import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    authToken: string | null;
    username: string | null;
}

const initialState: AuthState = {
    authToken: null,
    username: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state: AuthState, action: PayloadAction<AuthState>) => {
            state = {...action.payload}
        },
        clearAuth: (state: AuthState) => {
            state.authToken = null
            state.username = null
        }
    }
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer