import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type GeneralContextType = {
    filesUploading: boolean;
}


const initialState : GeneralContextType = {
    filesUploading: false
};

const generalContextSlice = createSlice({
    name:"generalContext",
    initialState: initialState,
    reducers:{
        updateFilesUploading: (state: GeneralContextType, action: PayloadAction<boolean>) => {
            state.filesUploading = action.payload
        }
    }
});

export const {updateFilesUploading} = generalContextSlice.actions;
export default generalContextSlice.reducer;