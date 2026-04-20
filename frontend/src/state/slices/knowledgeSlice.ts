import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KnowledgeState{
    knowledge: Array<string> | null
}

const initialState: KnowledgeState = {
    knowledge: null
}

const knowledgeSlice = createSlice({
    name: "knowledge",
    initialState,
    reducers: {
        updateKnowledge: (state: KnowledgeState, action: PayloadAction<Array<string> | string>) => {
            if(state.knowledge === null) state.knowledge = []

            if (Array.isArray(action.payload)) {
                if (action.payload.length > 0) {
                    state?.knowledge?.push(...action.payload)
                }
                return
            }

            if(action.payload) state?.knowledge?.push(action.payload)
        },
        clearKnowledge: (state: KnowledgeState) => {
            state.knowledge = null
        }
    }
})

export const { updateKnowledge, clearKnowledge } = knowledgeSlice.actions
export default knowledgeSlice.reducer