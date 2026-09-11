import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IFeeConcessionReducerState } from "./feeconcessiontypes";

const initialState: IFeeConcessionReducerState = {
    studentConcessionList: undefined,
    studentConcessionById: undefined,
    addStudentConcession: undefined,
    previousStudentConcessionResp: undefined,
    editStudentConcession: undefined,
    concessionLedgerDetails: undefined,
    tutionFeeConcessionList: undefined,
    tutionFeeConcessionById: undefined,
    addTutionFeeConcession: undefined,
    editTutionFeeConcession: undefined,
    employeeConcessionList: undefined,
    deleteFeeConcessionListResp: undefined,
    deleteStuConcessionListResp: undefined,
    bulkUploadConcessionResp: undefined,
    exportStuConcessionResp: undefined,
    exportTutionFeeConcessionResp: undefined,
    feeConcessionErrorState: undefined,

    // Student Concession Updated

    getStuConcessionListV2Resp : undefined,
    deleteStuConcessionListV2Resp : undefined,
    saveStuConcessionListV2Resp : undefined,
    editStuConcessionListV2Resp : undefined,
    getStuConcessionV2ByIdResp : undefined,
    exportStuConcessionV2Resp : undefined,
    bulkUploadConcessionV2Resp : undefined,
    getPrevStuConcessionListV2Resp : undefined,
    blukUploadConcessionErrorV2Resp: undefined,
};

export const feeConcessionSlice = createSlice({
    name: "feeconcession",
    initialState,
    reducers: {
        getStudentConcessionAct: (state, action: PayloadAction<any>) => {
            state.studentConcessionList = action.payload;
        },
        getStudentConcessionByIdAct: (state, action: PayloadAction<any>) => {
            state.studentConcessionById = action.payload;
        },
        setStudentConcessionAct: (state, action: PayloadAction<any>) => {
            state.addStudentConcession = action.payload;
        },
        setPreviousStudentConcessionAct: (state, action: PayloadAction<any>) => {
            state.previousStudentConcessionResp = action.payload;
        },
        setEditStudentConcessionResp: (state, action: PayloadAction<any>) => {
            state.editStudentConcession = action.payload;
        },
        getConcessionLedgerDetailsAct: (state, action: PayloadAction<any>) => {
            state.concessionLedgerDetails = action.payload;
        },
        getTutionFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.tutionFeeConcessionList = action.payload;
        },
        getTutionFeeConcessionByIdAct: (state, action: PayloadAction<any>) => {
            state.tutionFeeConcessionById = action.payload;
        },
        setTutionFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.addTutionFeeConcession = action.payload;
        },
        setEditTutionFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.editTutionFeeConcession = action.payload;
        },
        getEmployeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.employeeConcessionList = action.payload;
        },
        setDeleteFeeConcessionListAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeConcessionListResp = action.payload;
        },
        setDeleteStuConcessionListAct: (state, action: PayloadAction<any>) => {
            state.deleteStuConcessionListResp = action.payload;
        },
        setBulkUploadConcessionAct: (state, action: PayloadAction<any>) => {
            state.bulkUploadConcessionResp = action.payload;
        },
        setExportStuConcessionAct: (state, action: PayloadAction<any>) => {
            state.exportStuConcessionResp = action.payload;
        },
        setExportTutionFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.exportTutionFeeConcessionResp = action.payload;
        },

        // Student Concession Updated

        setStuConcessionListV2Act: (state, action: PayloadAction<any>) => {
            state.getStuConcessionListV2Resp = action.payload;
        },
        setDeleteStuConcessionListV2Act: (state, action: PayloadAction<any>) => {
            state.deleteStuConcessionListV2Resp = action.payload;
        },
        setSaveStuConcessionListV2Act: (state, action: PayloadAction<any>) => {
            state.saveStuConcessionListV2Resp = action.payload;
        },
        setEditStuConcessionListV2Act: (state, action: PayloadAction<any>) => {
            state.editStuConcessionListV2Resp = action.payload;
        },
        setStuConcessionV2ByIdAct: (state, action: PayloadAction<any>) => {
            state.getStuConcessionV2ByIdResp = action.payload;
        },
        setExportStuConcessionV2Act: (state, action: PayloadAction<any>) => {
            state.exportStuConcessionV2Resp = action.payload;
        },
        setBulkUploadConcessionV2Act: (state, action: PayloadAction<any>) => {
            state.bulkUploadConcessionV2Resp = action.payload;
        },
        setPrevStuConcessionListV2Act: (state, action: PayloadAction<any>) => {
            state.getPrevStuConcessionListV2Resp = action.payload;
        },

        feeConcessionError: (state, action: PayloadAction<any>) => {
            state.feeConcessionErrorState = action.payload;
        },
        blukUploadConcessionError: (state, action: PayloadAction<any>) => {
            state.blukUploadConcessionErrorV2Resp = action.payload;
        },
    }
})
export const {
    getStudentConcessionAct,
    getStudentConcessionByIdAct,
    setStudentConcessionAct,
    setPreviousStudentConcessionAct,
    setEditStudentConcessionResp,
    getConcessionLedgerDetailsAct,
    getTutionFeeConcessionAct,
    getTutionFeeConcessionByIdAct,
    setTutionFeeConcessionAct,
    setEditTutionFeeConcessionAct,
    getEmployeeConcessionAct,
    setDeleteFeeConcessionListAct,
    setDeleteStuConcessionListAct,
    setBulkUploadConcessionAct,
    setExportStuConcessionAct,
    setExportTutionFeeConcessionAct,

    // Student Concession Updated

    setStuConcessionListV2Act,
    setDeleteStuConcessionListV2Act,
    setSaveStuConcessionListV2Act,
    setEditStuConcessionListV2Act,
    setStuConcessionV2ByIdAct,
    setExportStuConcessionV2Act,
    setBulkUploadConcessionV2Act,
    setPrevStuConcessionListV2Act,

    feeConcessionError,
    blukUploadConcessionError
} = feeConcessionSlice.actions;

export default feeConcessionSlice.reducer;