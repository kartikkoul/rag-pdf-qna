import { Message } from "@/src/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConversationState {
    messages: Array<Message>
}

const initialState : ConversationState = {
    messages:[]
}

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        addMessage: (state: ConversationState, action: PayloadAction<Array<Message> | Message>) => {
            if (Array.isArray(action.payload)) {
                if (action.payload.length > 0) {
                    state.messages.push(...action.payload)
                }
                return
            }
            state.messages.push(action.payload)
        },
        clearMessages: (state: ConversationState) => {
            state.messages = []
        }
    }
})

export const { addMessage, clearMessages } = conversationSlice.actions
export default conversationSlice.reducer