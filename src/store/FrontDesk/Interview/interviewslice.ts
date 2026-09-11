import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IInterviewInitialState
} from "./interviewtypes";

const initialState: IInterviewInitialState = {
    interviewSchedulesListResp: undefined,
    getObservationInterviewSubjectsResp: undefined,
    studentsForInterviewScheduleResp: undefined,
    scheduleInterviewResp: undefined,
    evaluationClassList: undefined,
    interviewDetailsResp: undefined,
    updateInterviewDetailsResp: undefined,
    panelInterviewResultListWhileSavingResp: undefined,
    delInterviewResp: undefined,
    savePanelIntResultResp: undefined,
    editObsAndIntReportResp: undefined,
    panIntResCancelAdmissionResp: undefined,
    observationAndInterviewerReportResp: undefined,
    observationAndInterviewerReportByIdResp: undefined,
    saveObservationReportResp: undefined,
    getPanIntResByIdResp: undefined,
    sendNotifiPanIntResResp: undefined,
    exportPanIntResListResp: undefined,
    observationAndInterviewerReportListWhileSavingResp: undefined,
    panelInterviewResultListResp: undefined,
    editPanIntResResp: undefined,
    exportPanIntListResp: undefined,
    exportObsIntListResp: undefined,
    registrationPaymentDetailsResp: undefined,
    interviewErrorResp: undefined
};


export const feeApprovals = createSlice({
    name: "interview",
    initialState,
    reducers: {
        setInterviewSchedulesListAct: (state, action: PayloadAction<any>) => {
            state.interviewSchedulesListResp = action.payload;
        },
        setStudentsForInterviewScheduleAct: (state, action: PayloadAction<any>) => {
            state.studentsForInterviewScheduleResp = action.payload;
        },
        setScheduleInterviewAct: (state, action: PayloadAction<any>) => {
            state.scheduleInterviewResp = action.payload;
        },
        setEvaluationClassList: (state, action: PayloadAction<any>) => {
            state.evaluationClassList = action.payload;
        },
        resetEvaluationClassList: (state, action: PayloadAction<any>) => {
            state.evaluationClassList = action.payload;
        },
        setInterviewDetailsAct: (state, action: PayloadAction<any>) => {
            state.interviewDetailsResp = action.payload;
        },
        setUpdateInterviewDetailsAct: (state, action: PayloadAction<any>) => {
            state.updateInterviewDetailsResp = action.payload;
        },
        setDelInterviewAct: (state, action: PayloadAction<any>) => {
            state.delInterviewResp = action.payload;
        },
        setObservationAndInterviewReportAct: (state, action: PayloadAction<any>) => {
            state.observationAndInterviewerReportResp = action.payload;
        },
        setSaveObservationReportAct: (state, action: PayloadAction<any>) => {
            state.saveObservationReportResp = action.payload;
        },
        resetObservationAndInterviewerReportListWhileSavingAct: (state, action: PayloadAction<any>) => {
            state.observationAndInterviewerReportListWhileSavingResp = action.payload;
        },
        setObservationAndInterviewerReportListWhileSavingAct: (state, action: PayloadAction<any>) => {
            state.observationAndInterviewerReportListWhileSavingResp = action.payload;
        },
        setObservationInterviewSubjectsAct: (state, action: PayloadAction<any>) => {
            state.getObservationInterviewSubjectsResp = action.payload;
        },
        resetObservationInterviewSubjectsAct: (state, action: PayloadAction<any>) => {
            state.getObservationInterviewSubjectsResp = action.payload;
        },
        setPanelInterviewResultListWhileSavingAct: (state, action: PayloadAction<any>) => {
            state.panelInterviewResultListWhileSavingResp = action.payload;
        },
        resetPanelInterviewResultListWhileSavingAct: (state, action: PayloadAction<any>) => {
            state.panelInterviewResultListWhileSavingResp = action.payload;
        },
        setPanIntResCancelAdmissionAct: (state, action: PayloadAction<any>) => {
            state.panIntResCancelAdmissionResp = action.payload;
        },
        setObservationAndInterviewReportByIdAct: (state, action: PayloadAction<any>) => {
            state.observationAndInterviewerReportByIdResp = action.payload;
        },
        resetObservationAndInterviewReportByIdAct: (state, action: PayloadAction<any>) => {
            state.observationAndInterviewerReportByIdResp = action.payload;
        },
        setSavePanelIntResultAct: (state, action: PayloadAction<any>) => {
            state.savePanelIntResultResp = action.payload;
        },
        setEditObsAndIntReportAct: (state, action: PayloadAction<any>) => {
            state.editObsAndIntReportResp = action.payload;
        },
        setEditPanIntResAct: (state, action: PayloadAction<any>) => {
            state.editPanIntResResp = action.payload;
        },
        resetEditPanIntResAct: (state, action: PayloadAction<any>) => {
            state.editPanIntResResp = action.payload;
        },
        setPanIntResByIdAct: (state, action: PayloadAction<any>) => {
            state.getPanIntResByIdResp = action.payload;
        },
        setPanelInterviewResultListAct: (state, action: PayloadAction<any>) => {
            state.panelInterviewResultListResp = action.payload;
        },
        setSendNotifiPanIntResAct: (state, action: PayloadAction<any>) => {
            state.sendNotifiPanIntResResp = action.payload;
        },
        setExportPanIntListAct: (state, action: PayloadAction<any>) => {
            state.exportPanIntListResp = action.payload;
        },
        setExportObsIntListAct: (state, action: PayloadAction<any>) => {
            state.exportObsIntListResp = action.payload;
        },
        setExportPanIntResListAct: (state, action: PayloadAction<any>) => {
            state.exportPanIntResListResp = action.payload;
        },
        setRegistrationPaymentDetailsAct: (state, action: PayloadAction<any>) => {
            state.registrationPaymentDetailsResp = action.payload;
        },
        setInterviewErrorAct: (state, action: PayloadAction<any>) => {
            state.interviewErrorResp = action.payload;
        },
    },
});


export const {
    setInterviewSchedulesListAct,
    setStudentsForInterviewScheduleAct,
    setEvaluationClassList,
    resetEvaluationClassList, resetEditPanIntResAct,
    setScheduleInterviewAct, setInterviewDetailsAct, setUpdateInterviewDetailsAct,
    setDelInterviewAct, setObservationAndInterviewReportAct, setInterviewErrorAct,
    setSaveObservationReportAct, resetObservationAndInterviewReportByIdAct,
    setObservationAndInterviewReportByIdAct, setPanelInterviewResultListAct
    , setObservationAndInterviewerReportListWhileSavingAct, setExportPanIntResListAct,
    resetObservationAndInterviewerReportListWhileSavingAct, setExportObsIntListAct,
    resetObservationInterviewSubjectsAct, setSavePanelIntResultAct, setExportPanIntListAct,
    setPanIntResCancelAdmissionAct, setEditObsAndIntReportAct, setEditPanIntResAct,
    resetPanelInterviewResultListWhileSavingAct, setPanIntResByIdAct, setSendNotifiPanIntResAct,
    setPanelInterviewResultListWhileSavingAct, setObservationInterviewSubjectsAct,
    setRegistrationPaymentDetailsAct
} = feeApprovals.actions;

export default feeApprovals.reducer;



