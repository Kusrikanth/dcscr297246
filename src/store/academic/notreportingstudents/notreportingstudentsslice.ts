import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotReportingStuReducerState } from "./notreportingstudentstypes";

const initialState: INotReportingStuReducerState = {
    getNotReportingStuListResp: undefined,
    addNotReportingStuResp: undefined,
    editNotReportingStuResp: undefined,
    deleteNotReportingStuResp: undefined,
    getByIdNotReportingStuResp: undefined,
    exportNotReportingListResp: undefined,

    //Id-Card
    getIdCardListResp: undefined,
    approveStuIdCardResp: undefined,
    payStuIdCardResp: undefined,
    getIdCardAmountResp: undefined,
    getIdCardLogsResp: undefined,
    sendIdCardNotifcationResp: undefined,
    idCardCollectedByParentResp: undefined,
    previewIssuedIdcardResp: undefined,
    getStuDetailsResp: undefined,
    exportStudentIdCardListResp: undefined,
    downloadStudentIdCardZipResp: undefined,
    requestReuploadIdCardResp: undefined,
    saveVlidateStudentStatusResp: undefined,

    // error state

    notReportingStuErrResp : undefined,
}
export const notReportingStu = createSlice({
    name: "notReportingStu",
    initialState,
    reducers: {
        setNotReportingStuListAct: (state, action: PayloadAction<any>) => {
            state.getNotReportingStuListResp = action.payload;
        },
        setAddNotReportingStuAct: (state, action: PayloadAction<any>) => {
            state.addNotReportingStuResp = action.payload;
        },
        setEditNotReportingStuAct: (state, action: PayloadAction<any>) => {
            state.editNotReportingStuResp = action.payload;
        },
        setDeleteNotReportingStuAct: (state, action: PayloadAction<any>) => {
            state.deleteNotReportingStuResp = action.payload;
        },
        setByIdNotReportingStuAct: (state, action: PayloadAction<any>) => {
            state.getByIdNotReportingStuResp = action.payload;
        },
       
        setExportNotReportingListAct: (state, action: PayloadAction<any>) => {
            state.exportNotReportingListResp = action.payload;
        },
       
        //Id-Card
        setIdCardListAct: (state, action: PayloadAction<any>) => {
            state.getIdCardListResp = action.payload;
        },
        setApproveStuIdCardAct: (state, action: PayloadAction<any>) => {
            state.approveStuIdCardResp = action.payload;
        },
        setPayStuIdCardAct: (state, action: PayloadAction<any>) => {
            state.payStuIdCardResp = action.payload;
        },
        setIdCardAmountAct: (state, action: PayloadAction<any>) => {
            state.getIdCardAmountResp = action.payload;
        },
        setIdCardLogsAct: (state, action: PayloadAction<any>) => {
            state.getIdCardLogsResp = action.payload;
        },
        setSendIdCardNotifcationAct: (state, action: PayloadAction<any>) => {
            state.sendIdCardNotifcationResp = action.payload;
        },
        setIdCardCollectedByParentAct: (state, action: PayloadAction<any>) => {
            if (state.idCardCollectedByParentResp?.statusCode !== action.payload.statusCode) {
                state.idCardCollectedByParentResp = action.payload;
            }
        },
        
        setPreviewIssuedIdcardAct: (state, action: PayloadAction<any>) => {
            state.previewIssuedIdcardResp = action.payload;
          },
          setStuDetailsAct: (state, action: PayloadAction<any>) => {
            state.getStuDetailsResp = action.payload;
        },
          setExportStudentIdCardListAct: (state, action: PayloadAction<any>) => {
            state.exportStudentIdCardListResp = action.payload;
        },
        setDownloadStudentIdCardZipAct: (state, action: PayloadAction<any>) => {
            state.downloadStudentIdCardZipResp = action.payload;
        },
        resetDownloadStudentIdCardZipAct: (state, action: PayloadAction<any>) => {
            state.downloadStudentIdCardZipResp = action.payload;
        },
        setRequestReuploadIdCardAct: (state, action: PayloadAction<any>) => {
            state.requestReuploadIdCardResp = action.payload;
        },
          setSaveVlidateStudentStatusAct: (state, action: PayloadAction<any>) => {
            state.saveVlidateStudentStatusResp = action.payload;
        },
        //error state

        setNotReportingStuErrAct: (state, action: PayloadAction<any>) => {
            state.notReportingStuErrResp = action.payload;
        },
      
   
    }
})
export const {
    setNotReportingStuListAct,
    setAddNotReportingStuAct,
    setEditNotReportingStuAct,
    setDeleteNotReportingStuAct,
    setByIdNotReportingStuAct,
    setExportNotReportingListAct,
    setRequestReuploadIdCardAct,

    //Id-Card
    setIdCardListAct,
    setApproveStuIdCardAct,
    setPayStuIdCardAct,
    setIdCardAmountAct,
    setIdCardLogsAct,
    setSendIdCardNotifcationAct,
    setIdCardCollectedByParentAct,
    setPreviewIssuedIdcardAct,
    setStuDetailsAct,
    setExportStudentIdCardListAct,
    setDownloadStudentIdCardZipAct,
    resetDownloadStudentIdCardZipAct,
    setSaveVlidateStudentStatusAct,
    //error state

    setNotReportingStuErrAct
    } = notReportingStu.actions;
export default notReportingStu.reducer;