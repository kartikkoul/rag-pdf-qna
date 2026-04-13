import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KnowledgeState{
    knowledge: Array<string>
}

const initialState: KnowledgeState = {
    knowledge: []
}

const knowledgeSlice = createSlice({
    name: "knowledge",
    initialState,
    reducers: {
        fetchKnowledge: (state: KnowledgeState) => {
                // Fetch knowledge from API and update state
                // This is a placeholder, you would replace this with an actual API call
                state.knowledge = ["Document 1.pdf", "Document 2.pdf", "Document 3.pdf"]
        },
        updateKnowledge: (state: KnowledgeState, action: PayloadAction<string>) => {
            state.knowledge.push(action.payload)
        },
        clearKnowledge: (state: KnowledgeState) => {
            state.knowledge = []
        }
    }
})

export const { fetchKnowledge, updateKnowledge, clearKnowledge } = knowledgeSlice.actions
export default knowledgeSlice.reducer