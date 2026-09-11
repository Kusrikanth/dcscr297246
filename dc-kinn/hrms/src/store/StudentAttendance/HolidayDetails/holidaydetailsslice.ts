import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHolidayDetailsReducerState } from "./holidaydetailstypes";

const initialState: IHolidayDetailsReducerState = {
    getHolidayDetailsListResp: undefined,
    holidayClassesResp: undefined,
    addHolidayResp: undefined,
    getHoildayByIdResp: undefined,
    updateHolidayResp: undefined,
    deleteHolidayResp: undefined,
    exportHolidayResp: undefined,
    getBrchClassHolidaysResp : undefined,
    // error state

    holidayDetailsErrResp: undefined,

    //attendance holiday details

    getAttendanceHolidayDetailsListResp: undefined,
}
export const holidayDetails = createSlice({
    name: "holidayDetails",
    initialState,
    reducers: {
        setHolidayDetailsListAct: (state, action: PayloadAction<any>) => {
            state.getHolidayDetailsListResp = action.payload;
        },
        setHolidayClassesAct: (state, action: PayloadAction<any>) => {
            state.holidayClassesResp = action.payload;
        },
        setAddHolidayAct: (state, action: PayloadAction<any>) => {
            state.addHolidayResp = action.payload;
        },
        setHolidayByIdAct: (state, action: PayloadAction<any>) => {
            state.getHoildayByIdResp = action.payload;
        },
        setUpdateHolidayAct: (state, action: PayloadAction<any>) => {
            state.updateHolidayResp = action.payload;
        },
        setDeleteHolidayAct: (state, action: PayloadAction<any>) => {
            state.deleteHolidayResp = action.payload;
        },
        setExportHolidayAct: (state, action: PayloadAction<any>) => {
            state.exportHolidayResp = action.payload;
        },
        setBrchClassHolidaysAct: (state, action: PayloadAction<any>) => {
            state.getBrchClassHolidaysResp = action.payload;  
        },
        resetBrchClassHolidaysAct: (state, action: PayloadAction<any>) => {
            state.getBrchClassHolidaysResp = action.payload;  
        },
        //error state

        setHolidayDetailsErrAct: (state, action: PayloadAction<any>) => {
            state.holidayDetailsErrResp = action.payload;
        },

        //attendance holiday details

        setAttendanceHolidayDetailsListAct: (state, action: PayloadAction<any>) => {
            state.getAttendanceHolidayDetailsListResp = action.payload;
        },

    }
})
export const {
    setHolidayDetailsListAct,
    setHolidayClassesAct, setAddHolidayAct, setHolidayByIdAct, setUpdateHolidayAct, setDeleteHolidayAct,
    setExportHolidayAct,setBrchClassHolidaysAct,resetBrchClassHolidaysAct,
    //error state

    setHolidayDetailsErrAct,

    //attendance holiday details

    setAttendanceHolidayDetailsListAct

} = holidayDetails.actions;
export default holidayDetails.reducer;