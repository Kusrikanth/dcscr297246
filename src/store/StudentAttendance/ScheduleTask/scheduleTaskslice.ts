import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IScheduleTaskReducerState } from "./scheduleTasktypes";


const initialState: IScheduleTaskReducerState = {
    getScheduleListResp: undefined,
    addScheduleTaskResp: undefined,
    deleteScheduleTaskResp: undefined,
    editScheduleTaskResp: undefined,
    updateStatusScheduleTaskResp: undefined,

    // error state

    scheduleTaskErrResp : undefined,
}
export const scheduleTask = createSlice({
    name: "scheduleTask",
    initialState,
    reducers: {
        setScheduleListAct: (state, action: PayloadAction<any>) => {
            state.getScheduleListResp = action.payload;
        },
        setAddScheduleTaskAct: (state, action: PayloadAction<any>) => {
            state.addScheduleTaskResp = action.payload;
        },
        setDeleteScheduleTaskAct: (state, action: PayloadAction<any>) => {
            state.deleteScheduleTaskResp = action.payload;
        },
        setEditScheduleTaskAct: (state, action: PayloadAction<any>) => {
            state.editScheduleTaskResp = action.payload;
        },
        setUpdateStatusScheduleTaskAct: (state, action: PayloadAction<any>) => {
            state.updateStatusScheduleTaskResp = action.payload;
        },
        //error state

        setScheduleTaskErrAct: (state, action: PayloadAction<any>) => {
            state.scheduleTaskErrResp = action.payload;
        },
      
    }
})
export const {

    setScheduleListAct,
    setAddScheduleTaskAct,
    setDeleteScheduleTaskAct,
    setEditScheduleTaskAct,
    setUpdateStatusScheduleTaskAct,

    //error state

    setScheduleTaskErrAct,

    } = scheduleTask.actions;

export default scheduleTask.reducer;