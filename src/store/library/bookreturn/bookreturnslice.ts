import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBookReturnReducerState } from "./bookreturntypes"; 

const initialState: IBookReturnReducerState = {
    //Book Returns  
    bookReturnListResp : undefined,
    getBookReturnStuListResp : undefined,
    saveLibraryBookReturnResp : undefined,
    getBookReturnEmployeeListResp : undefined,
    getBookReturnRecommendListResp : undefined,
    getBookListReturnForStudentResp : undefined,
    getBookListReturnForEmployeeResp : undefined,
    getBookListReturnForRecommendResp : undefined,
    getExportBookReturnResp : undefined,
    getBookReturnListByAccessionNoResp: undefined,
    getBookReturnSaveResp: undefined,
    //library tc
    libraryTcDetailsRequestListResp: undefined,

    //Error
    bookReturnErrorResp: undefined,
}

export const libraryBookReturn = createSlice({
    name: "libraryBookReturn",
    initialState,
    reducers: {
        // Book Returns 

        setBookReturnListAct: (state, action: PayloadAction<any>) => {
            state.bookReturnListResp = action.payload;
        },
        setBookReturnStuListAct: (state, action: PayloadAction<any>) => {
            state.getBookReturnStuListResp = action.payload;
        },
        setSaveLibraryBookReturnAct: (state, action: PayloadAction<any>) => {
            state.saveLibraryBookReturnResp = action.payload;
        },
        setBookReturnEmployeeListAct: (state, action: PayloadAction<any>) => {
            state.getBookReturnEmployeeListResp = action.payload;
        },
        setBookReturnRecommendListAct: (state, action: PayloadAction<any>) => {
            state.getBookReturnRecommendListResp = action.payload;
        },
        setBookListReturnForStudentAct: (state, action: PayloadAction<any>) => {
            state.getBookListReturnForStudentResp = action.payload;
        },
        setBookListReturnForEmployeeAct: (state, action: PayloadAction<any>) => {
            state.getBookListReturnForEmployeeResp = action.payload;
        },
        setBookListReturnForRecommendAct: (state, action: PayloadAction<any>) => {
            state.getBookListReturnForRecommendResp = action.payload;
        },
        setExportBookReturnAct: (state, action: PayloadAction<any>) => {
            state.getExportBookReturnResp = action.payload;
        },
        setBookReturnListByAccessionNoAct: (state, action: PayloadAction<any>) => {
            state.getBookReturnListByAccessionNoResp = action.payload;
        },
        setBookReturnSaveListAct: (state, action: PayloadAction<any>) => {
            state.getBookReturnSaveResp = action.payload;
        },
    
        //library tc
        setLibraryTcDetailsListAct: (state, action: PayloadAction<any>) => {
            state.libraryTcDetailsRequestListResp = action.payload;
        },
        // Error
        setBookReturnErrorAct: (state, action: PayloadAction<any>) => {
            state.bookReturnErrorResp = action.payload;
        }
    }
})

export const {

    //Book Returns 
    setBookReturnListAct,
    setBookReturnStuListAct,
    setSaveLibraryBookReturnAct,
    setBookReturnEmployeeListAct,
    setBookReturnRecommendListAct,
    setBookListReturnForStudentAct,
    setBookListReturnForEmployeeAct,
    setBookListReturnForRecommendAct,
    setExportBookReturnAct,
    setBookReturnListByAccessionNoAct,
    setBookReturnSaveListAct,
    //library tc
    setLibraryTcDetailsListAct,
    //Error
    setBookReturnErrorAct,

} = libraryBookReturn.actions;

export default libraryBookReturn.reducer;