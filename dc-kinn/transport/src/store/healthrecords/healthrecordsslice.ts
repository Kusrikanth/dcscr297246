import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHealthRecordsReducerState } from "./healthrecordstypes";


const initialState: IHealthRecordsReducerState = {

    // Health Records

    getHealthRecordsListResp : undefined,
    getStuHealthDetailsResp: undefined,
    getEmpHealthDetailsResp: undefined,
    getStuAlimentListResp: undefined,
    saveHealthRecordsListResp : undefined,
    getHealthRecordsListByIdResp : undefined,
    editHealthRecordsListResp : undefined,
    exportHealthRecordsResp: undefined,
    exportEmpHealthRecordsResp: undefined,

    // mi rooms

    getMiRoomListResp : undefined,
    getMiRoomListByIdResp : undefined,
    editMiRoomListResp : undefined,
    saveMiRoomListResp : undefined,
    deleteMiRoomListResp : undefined,

    getStuHealthIssueListResp : undefined,
    exportStudentHealthIssuesResp : undefined,
    getRegistrationHealthIssueListResp:undefined,

    //settings
    //sub-alingments

    getSubAlingmentsListResp : undefined,
    saveSubAlingmentsResp : undefined,
    editSubAlingmentsResp : undefined,
    deleteSubAlingmentsListResp : undefined,

    // Medicen

    getMedicenListResp : undefined,
    getMedicenListByIdResp : undefined,
    editMedicenListResp : undefined,
    saveMedicenListResp : undefined,
    deleteMedicenListResp : undefined,
    // error state

    healthRecordsErrResp: undefined,
}
export const healthRecords = createSlice({
    name: "healthRecords",
    initialState,
    reducers: {

        // Health Records

        setHealthRecordsListAct: (state, action: PayloadAction<any>) => {
            state.getHealthRecordsListResp = action.payload;
        },
        setStuHealthDetailsAct: (state, action: PayloadAction<any>) => {
            state.getStuHealthDetailsResp = action.payload;
        },
        setEmpHealthDetailsAct: (state, action: PayloadAction<any>) => {
            state.getEmpHealthDetailsResp = action.payload;
        },
        setStuAlimentListAct: (state, action: PayloadAction<any>) => {
            state.getStuAlimentListResp = action.payload;
        },
        setSaveHealthRecordsListAct: (state, action: PayloadAction<any>) => {
            state.saveHealthRecordsListResp = action.payload;
        },
        setHealthRecordsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getHealthRecordsListByIdResp = action.payload;
        },
        resetHealthRecordsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getHealthRecordsListByIdResp = action.payload;
        },
        setEditHealthRecordsListAct: (state, action: PayloadAction<any>) => {
            state.editHealthRecordsListResp = action.payload;
        },
        setExportHealthRecordsAct: (state, action: PayloadAction<any>) => {
            state.exportHealthRecordsResp = action.payload;
        },
        setExportEmpHealthRecordsAct: (state, action: PayloadAction<any>) => {
            state.exportEmpHealthRecordsResp = action.payload;
        },
        
        // mi rooms
        
        setMiRoomListAct: (state, action: PayloadAction<any>) => {
            state.getMiRoomListResp = action.payload;
        },
        setMiRoomListByIdAct: (state, action: PayloadAction<any>) => {
            state.getMiRoomListByIdResp = action.payload;
        },
        setEditMiRoomListAct: (state, action: PayloadAction<any>) => {
            state.editMiRoomListResp = action.payload;
        },
        setSaveMiRoomListAct: (state, action: PayloadAction<any>) => {
            state.saveMiRoomListResp = action.payload;
        },
        setDeleteMiRoomListAct: (state, action: PayloadAction<any>) => {
            state.deleteMiRoomListResp = action.payload;
        },


        setStuHealthIssueListAct: (state, action: PayloadAction<any>) => {
            state.getStuHealthIssueListResp = action.payload;
        },
        setExportStudentHealthIssuesAct: (state, action: PayloadAction<any>) => {
            state.exportStudentHealthIssuesResp = action.payload;
        },
        setRegistrationHealthIssueListAct: (state, action: PayloadAction<any>) => {
        state.getRegistrationHealthIssueListResp = action.payload;
        },

        //settings
        //sub-alingments

        setSubAlingmentsListAct: (state, action: PayloadAction<any>) => {
            state.getSubAlingmentsListResp = action.payload;
        },
        setSaveSubAlingmentsListAct: (state, action: PayloadAction<any>) => {
            state.saveSubAlingmentsResp = action.payload;
        },
        setEditSubAlingmentsListAct: (state, action: PayloadAction<any>) => {
            state.editSubAlingmentsResp = action.payload;
        },
        setDeleteSubAlingmentsListAct: (state, action: PayloadAction<any>) => {
            state.deleteSubAlingmentsListResp = action.payload;
        },
        
        // Medicen
        
        setMedicenListAct: (state, action: PayloadAction<any>) => {
            state.getMedicenListResp = action.payload;
        },
        setMedicenListByIdAct: (state, action: PayloadAction<any>) => {
            state.getMedicenListByIdResp = action.payload;
        },
        setEditMedicenListAct: (state, action: PayloadAction<any>) => {
            state.editMedicenListResp = action.payload;
        },
        setSaveMedicenListAct: (state, action: PayloadAction<any>) => {
            state.saveMedicenListResp = action.payload;
        },
        setDeleteMedicenListAct: (state, action: PayloadAction<any>) => {
            state.deleteMedicenListResp = action.payload;
        },

        //error state

        setHealthRecordsErrResp: (state, action: PayloadAction<any>) => {
            state.healthRecordsErrResp = action.payload;
        },

    }
})
export const {

    // Health Records

    setHealthRecordsListAct,
    setStuHealthDetailsAct,
    setEmpHealthDetailsAct,
    setStuAlimentListAct,
    setSaveHealthRecordsListAct,
    setHealthRecordsListByIdAct,
    resetHealthRecordsListByIdAct,
    setEditHealthRecordsListAct,
    setExportHealthRecordsAct,
    setExportEmpHealthRecordsAct,
    // mi rooms

    setMiRoomListAct,
    setMiRoomListByIdAct,
    setEditMiRoomListAct,
    setSaveMiRoomListAct,
    setDeleteMiRoomListAct,

    setStuHealthIssueListAct,
    setExportStudentHealthIssuesAct,
    setRegistrationHealthIssueListAct,

    //settings
    //subAlingments

    setSubAlingmentsListAct,
    setSaveSubAlingmentsListAct,
    setEditSubAlingmentsListAct,
    setDeleteSubAlingmentsListAct,

    // Medicen

    setMedicenListAct,
    setMedicenListByIdAct,
    setEditMedicenListAct,
    setSaveMedicenListAct,
    setDeleteMedicenListAct,

    //error state

    setHealthRecordsErrResp,

} = healthRecords.actions;
export default healthRecords.reducer;