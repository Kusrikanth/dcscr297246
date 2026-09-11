import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStudentLongLeavesReducerState } from "./studentlongleavestypes";


const initialState: IStudentLongLeavesReducerState = {
    getStuLongLeavesListResp: undefined,
    saveStuLongLeavesResp: undefined,
    deleteStuLongLeavesResp: undefined,
    editStuLongLeavesResp: undefined,
    getStuLongLeavesByIdResp: undefined,
    searchStuLongLeavesResp: undefined,
    approveStuLongLeavesResp: undefined,

    // error state

    stuLongLeavesErrResp : undefined,
}
export const studentLongLeaves = createSlice({
    name: "studentLongLeaves",
    initialState,
    reducers: {
        setStuLongLeavesListAct: (state, action: PayloadAction<any>) => {
            state.getStuLongLeavesListResp = action.payload;
        },
        setSaveStuLongLeavesAct: (state, action: PayloadAction<any>) => {
            state.saveStuLongLeavesResp = action.payload;
        },
        setDeleteStuLongLeavesAct: (state, action: PayloadAction<any>) => {
            state.deleteStuLongLeavesResp = action.payload;
        },
        setEditStuLongLeavesAct: (state, action: PayloadAction<any>) => {
            state.editStuLongLeavesResp = action.payload;
        },
        setStuLongLeavesByIdAct: (state, action: PayloadAction<any>) => {
            state.getStuLongLeavesByIdResp = action.payload;
        }, 
        setSearchStuLongLeavesAct: (state, action: PayloadAction<any>) => {
            state.searchStuLongLeavesResp = action.payload;
        },
        setApproveStuLongLeavesAct: (state, action: PayloadAction<any>) => {
            state.approveStuLongLeavesResp = action.payload;
        },

        //error state

        setStuLongLeavesErrAct: (state, action: PayloadAction<any>) => {
            state.stuLongLeavesErrResp = action.payload;
        },
      
    }
})
export const {
    setStuLongLeavesListAct,
    setSaveStuLongLeavesAct,
    setDeleteStuLongLeavesAct,
    setEditStuLongLeavesAct,
    setStuLongLeavesByIdAct,
    setSearchStuLongLeavesAct,
    setApproveStuLongLeavesAct,

    //error state

    setStuLongLeavesErrAct,

    } = studentLongLeaves.actions;

export default studentLongLeaves.reducer;