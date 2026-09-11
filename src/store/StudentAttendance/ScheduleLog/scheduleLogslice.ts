import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IScheduleTaskReducerState } from "./scheduleLogtypes";


const initialState: IScheduleTaskReducerState = {
    getScheduleLogListResp: undefined,


    // error state

    scheduleLogErrResp : undefined,
}
export const scheduleLog = createSlice({
    name: "scheduleLog",
    initialState,
    reducers: {
        setScheduleLogListAct: (state, action: PayloadAction<any>) => {
            state.getScheduleLogListResp = action.payload;
        },
        //error state

        setScheduleLogErrAct: (state, action: PayloadAction<any>) => {
            state.scheduleLogErrResp = action.payload;
        },
      
    }
})
export const {

    setScheduleLogListAct,

    //error state

    setScheduleLogErrAct,

    } = scheduleLog.actions;

export default scheduleLog.reducer;