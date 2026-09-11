import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITransportationConcessionReducerState } from "./transportationconcessiontypes";

const initialState: ITransportationConcessionReducerState = {

    getTransportConcessionListResp : undefined,
    deleteTransportConcessionResp:undefined,
    createTransportConcessionResp:undefined,
    editTransportConcessionResp:undefined,
    getTransportConcessionByIdResp:undefined,
    exportTransportConcessionResp:undefined,

    //error state
    transportationConcessionErrorAct: undefined,
}

export const transportConcession = createSlice({
    name: "transportconcession",
    initialState,
    reducers: {

        setTransportConcessionListAct: (state, action: PayloadAction<any>) => {
            state.getTransportConcessionListResp = action.payload;
        },

        setDeleteTransportConcessionAct: (state, action: PayloadAction<any>) => {
            state.deleteTransportConcessionResp = action.payload;
        },
        setCreateTransportConcessionAct: (state, action: PayloadAction<any>) => {
            state.createTransportConcessionResp = action.payload;
        },
        setEditTransportConcessionAct: (state, action: PayloadAction<any>) => {
            state.editTransportConcessionResp = action.payload;
        },
        setTransportConcessionByIdAct: (state, action: PayloadAction<any>) => {
            state.getTransportConcessionByIdResp = action.payload;
        },
        setExportTransportConcessionAct: (state, action: PayloadAction<any>) => {
            state.exportTransportConcessionResp = action.payload;
        },
      

        // Error
        setTransportationConcessionErrorAct: (state, action: PayloadAction<any>) => {
            state.transportationConcessionErrorAct = action.payload;
        }
        
        
    }
})

export const {
    setTransportConcessionListAct,
    setDeleteTransportConcessionAct,
    setCreateTransportConcessionAct,
    setEditTransportConcessionAct,
    setTransportConcessionByIdAct,
    setExportTransportConcessionAct,

    setTransportationConcessionErrorAct,

} = transportConcession.actions;

export default transportConcession.reducer;