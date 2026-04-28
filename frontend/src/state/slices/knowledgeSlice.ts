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
        prependKnowledge: (state: KnowledgeState, action: PayloadAction<Array<string> | string>) => {
            if (state.knowledge === null) state.knowledge = []

            const incomingItems = Array.isArray(action.payload)
                ? action.payload.filter(Boolean)
                : action.payload
                ? [action.payload]
                : []

            if (incomingItems.length === 0) return

            const existingItems = state.knowledge.filter(
                (item) => !incomingItems.includes(item)
            )
            state.knowledge = [...incomingItems, ...existingItems]
        },
        clearKnowledge: (state: KnowledgeState) => {
            state.knowledge = null
        }
    }
})

export const { updateKnowledge, prependKnowledge, clearKnowledge } = knowledgeSlice.actions
export default knowledgeSlice.reducer