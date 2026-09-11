import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IExaminationInitialState
} from "./examinationtypes";

const initialState: IExaminationInitialState = {
    examinationSchedulesListResp: undefined,
    studentsForExaminationScheduleResp: undefined,
    scheduleExaminationResp: undefined,
    examinationDetailsResp: undefined,
    updateExaminationDetailsResp: undefined,
    delExaminationResp: undefined,
    exportExaminationDataResp: undefined,
    examinationErrorResp: undefined
};


export const feeApprovals = createSlice({
    name: "examination",
    initialState,
    reducers: {
        setExaminationSchedulesListAct: (state, action: PayloadAction<any>) => {
            state.examinationSchedulesListResp = action.payload;
        },
        setStudentsForExaminationScheduleAct: (state, action: PayloadAction<any>) => {
            state.studentsForExaminationScheduleResp = action.payload;
        },
        resetStudentsForExaminationScheduleAct: (state, action: PayloadAction<any>) => {
            state.studentsForExaminationScheduleResp = action.payload;
        },
        setScheduleExaminationAct: (state, action: PayloadAction<any>) => {
            state.scheduleExaminationResp = action.payload;
        },
        setExaminationDetailsAct: (state, action: PayloadAction<any>) => {
            state.examinationDetailsResp = action.payload;
        },
        setUpdateExaminationDetailsAct: (state, action: PayloadAction<any>) => {
            state.updateExaminationDetailsResp = action.payload;
        },
        setDelExaminationAct: (state, action: PayloadAction<any>) => {
            state.delExaminationResp = action.payload;
        },
        setExportExaminationDataAct: (state, action: PayloadAction<any>) => {
            state.exportExaminationDataResp = action.payload;
        },
        setExaminationErrorAct: (state, action: PayloadAction<any>) => {
            state.examinationErrorResp = action.payload;
        },
    },
});


export const {
    setExaminationSchedulesListAct,
    setStudentsForExaminationScheduleAct,
    resetStudentsForExaminationScheduleAct,
    setScheduleExaminationAct, setExaminationDetailsAct, setUpdateExaminationDetailsAct,
    setDelExaminationAct, setExaminationErrorAct,setExportExaminationDataAct
} = feeApprovals.actions;

export default feeApprovals.reducer;



