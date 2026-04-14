import { createSlice } from "@reduxjs/toolkit";

interface ConversationState {
    messages: Array<{
        role: string;
        content: string;
    }>
}

const initialState : ConversationState = {
    messages:[]
}

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        addMessage: (state: ConversationState, action) => {
            if (action.payload.length > 0){
                state.messages.push(...action.payload)
            }else{
                state.messages.push(action.payload)
            }
        },
        clearMessages: (state: ConversationState) => {
            state.messages = []
        }
    }
})

export const { addMessage, clearMessages } = conversationSlice.actions
export default conversationSlice.reducer