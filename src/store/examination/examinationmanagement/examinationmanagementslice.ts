import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IModelWithPagination } from "../../types";
import { IExaminationManagementReducerState } from "./examinationmanagementtypes";

const initialState: IExaminationManagementReducerState = {
    // Admit Card
    getAdmitCardDetailsResp: undefined,
    generateAdmitCardResp: undefined,
    downloadAdmitCardResp: undefined,

    // Admit card - Fetch Exam Details For Parent
    getAdmitCardExamDetailsResp: undefined,

    //change student subjects
    changeStudentSubjectsDetailsResp: undefined,
    changeStudentSubjectsDetailsByIdResp: undefined,
    saveChangeStudentSubjectsResp: undefined,
    updateChangeStudentSubjectsResp: undefined,
    deleteChangeStudentSubjectsResp: undefined,
    deleteChangeStudentSubjectsByIdResp: undefined,


    //mark entry
    getStudentDetailsResp: undefined,
    getExaminationClassesResp: undefined,
    getExaminationClassSubjectResp: undefined,
    saveEntryMarksResp: undefined,
    getCoscholasticGradesListResp: undefined,
    downloadMarksEntryResp: undefined,
    uploadMarksEntryResp: undefined,

    //mark entry
    getStudentRemarksListResp: undefined,
    getExaminationInstituteListResp: undefined,
    getStudentRemarksDescriptionListResp: undefined,
    getStudentRemarksByIdResp: undefined,
    saveStudentRemarksResp: undefined,
    editStudentRemarksByIdResp: undefined,
    deleteStudentRemarksByIdResp: undefined,

    //Ao Selection
    getAoTermSubjectsResp: undefined,
    getAoInsideSubjectsResp: undefined,
    saveAoTermSubjectsResp: undefined,
    getAoTermSubjectsByIdResp: undefined,
    deleteAoTermSubjectsResp: undefined,
    updateAoTermSubjectsResp: undefined,
    
    //Ao Grade Entry
    getAoGradeEntryListResp: undefined,
    saveAoGradeEntryListResp: undefined,
    examinationSubjectsListResp: undefined,
    aoGradeEntryErrorResp: undefined,

    //Ey Grade Entry
    getEyGradeEntryListResp: undefined,
    getEntryLearnerSkillDetailsResp: undefined,
    saveEyGradeEntryListResp: undefined,

    // marks entry report
    getMarksEntryReportListResp: undefined,
    exportMarksEntryReportResp: undefined,

    //Progress Card
    getProgressCardListResp: undefined,
    generateProgressCardActResp: undefined,
    downloadProgressCardActResp: undefined,
    previewProgressCardActResp: undefined,
    downloadAllProgressCardsActResp: undefined,
    downloadCbseProgressCardsActResp: undefined,
    getFilterListForCbseResp: undefined,
    getCbseProgressCardStudentActResp: undefined,

    //Internal Subjects Marks Entry
    getInternalSubjectsMarksListResp: undefined,
    saveInternalSubjectsMarksListResp: undefined,
    getSubjectsForInternalMarksEntryResp: undefined,

    //student_grade_book
    getStudentGradeReportBookListResp: undefined,
    exportStudentGradeReportBookResp: undefined,

    //dashboard
    getExaminationDashboardDataResp: undefined,
    getBranchWiseMarksRangeResp: undefined,
    getMarksRangeListResp: undefined,
    getSubjectAndGradeWiseResp: undefined,
    getSubjectListForDashboardResp: undefined,
    getSubjectGradeWiseAnalysisResp: undefined,
    exportSectionWiseAnalysisResp: undefined,
    getClassGradeWiseAnalysisResp: undefined,
    getClassAnalysisReportResp: undefined,


    getClassTeacherListResp: undefined,
    //holistic reports
    getFoundationStudentsProfilesResp:undefined,
    saveGeneralInformationResp: undefined,
    saveGeneralStudentPhotoResp: undefined,
    getGeneralInformationByIdResp: undefined,
    updateGeneralInformationResp: undefined,
    uploadStudentSurroundingPhotoResp: undefined,
    uploadFamilySurroundingPhotoResp: undefined,
    saveSurroundingResp: undefined,
    updateSurroundingResp: undefined,
    getDomainDetailsStudentResp: undefined,
    saveDaominStudentDetailsResp: undefined,
    updateDomainDetailsStudentResp: undefined,
    saveDomainSummaryResp: undefined,
    getLogActivityStatusResp: undefined,
    saveParentCollectedStatusResp: undefined,
    getStudentSummaryByIdResp: undefined,
    copyFoundationStageGradeEntryStudentDetailsResp: undefined,

    //holistic Progress Card
    getHolisticProgressCardResp: undefined,
    exportFondationStageGradeEntryResp: undefined,

    // igcse skill attribute entry
    getIgcseStudentSkillsAttributesDetailsResp: undefined,
    saveIgcseStudentSkillsAttributesDetailsResp: undefined, 

    //Error
    examinationManagementErrorResp: undefined,
}

export const examinationManagement = createSlice({
    name: "examinationManagement",
    initialState,
    reducers: {
        // Admit Card

        setAdmitCardDetailsAct: (state, action: PayloadAction<any>) => {
            state.getAdmitCardDetailsResp = action.payload;
        },
        setGenerateAdmitCardAct: (state, action: PayloadAction<any>) => {
            state.generateAdmitCardResp = action.payload;
        },
        setDownloadAdmitCardAct: (state, action: PayloadAction<any>) => {
            state.downloadAdmitCardResp = action.payload;
        },
        resetsetDownloadAdmitCardAct: (state, action: PayloadAction<any>) => {
            state.downloadAdmitCardResp = action.payload;
        },
        setAdmitCardExamDetailsAct: (state, action: PayloadAction<any>) => {
            state.getAdmitCardExamDetailsResp = action.payload;
        },

        // Change Studen Subjects
        setChangeStudentSubjectsDetailsAct: (state, action: PayloadAction<any>) => {
            state.changeStudentSubjectsDetailsResp = action.payload;
        },
        setChangeStudentSubjectsDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.changeStudentSubjectsDetailsByIdResp = action.payload;
        },
        setSaveChangeStudentSubjectsDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveChangeStudentSubjectsResp = action.payload;
        },
        setUpdateChangeStudentSubjectsDetailsAct: (state, action: PayloadAction<any>) => {
            state.updateChangeStudentSubjectsResp = action.payload;
        },
        setDeleteChangeStudentSubjectsDetailsAct: (state, action: PayloadAction<any>) => {
            state.deleteChangeStudentSubjectsResp = action.payload;
        },
        setDeleteChangeStudentSubjectsByIdDetailsAct: (state, action: PayloadAction<any>) => {
            state.deleteChangeStudentSubjectsByIdResp = action.payload;
        },
        setStudentDetailsAct: (state, action: PayloadAction<any>) => {
            state.getStudentDetailsResp = action.payload;
        },
        setExaminationClassesAct: (state, action: PayloadAction<any>) => {
            state.getExaminationClassesResp = action.payload;
        },
        setExaminationClassSubjectAct: (state, action: PayloadAction<any>) => {
            state.getExaminationClassSubjectResp = action.payload;
        },
        setSaveEntryMarksAct: (state, action: PayloadAction<any>) => {
            state.saveEntryMarksResp = action.payload;
        },
        setCoscholasticGradesListAct: (state, action: PayloadAction<any>) => {
            state.getCoscholasticGradesListResp = action.payload;
        },

        //Student-Remarks
        setStudentRemarksAct: (state, action: PayloadAction<any>) => {
            state.getStudentRemarksListResp = action.payload;
        },
        setExaminationInstituteTermsAct: (state, action: PayloadAction<any>) => {
            state.getExaminationInstituteListResp = action.payload;
        },
        setStudentRemarksDecriptionAct: (state, action: PayloadAction<any>) => {
            state.getStudentRemarksDescriptionListResp = action.payload;
        },
        setStudentRemarksByIdAct: (state, action: PayloadAction<any>) => {
            state.getStudentRemarksByIdResp = action.payload;
        },
        setSaveStudentRemarksAct: (state, action: PayloadAction<any>) => {
            state.saveStudentRemarksResp = action.payload;
        },
        setEditStudentRemarksAct: (state, action: PayloadAction<any>) => {
            state.editStudentRemarksByIdResp = action.payload;
        },
        setDeleteStudentRemarksAct: (state, action: PayloadAction<any>) => {
            state.deleteStudentRemarksByIdResp = action.payload;
        },
        setDownloadMarksEntryAct: (state, action: PayloadAction<any>) => {
            state.downloadMarksEntryResp = action.payload;
        },
        setUploadMarksEntryAct: (state, action: PayloadAction<any>) => {
            state.uploadMarksEntryResp = action.payload;
        },
        setAoTermSubjectsAct: (state, action: PayloadAction<any>) => {
            state.getAoTermSubjectsResp = action.payload;
        },
        resetAoTermSubjectsAct: (state, action: PayloadAction<any>) => {
            state.getAoTermSubjectsResp = action.payload;
        },
        setAoInsideSubjectsAct: (state, action: PayloadAction<any>) => {
            state.getAoInsideSubjectsResp = action.payload;
        },
        resetAoInsideSubjectsAct: (state, action: PayloadAction<any>) => {
            state.getAoInsideSubjectsResp = action.payload;
        },
        setSaveAoTermSubjectsAct: (state, action: PayloadAction<any>) => {
            state.saveAoTermSubjectsResp = action.payload;
        },
        setAoTermSubjectsByIdAct: (state, action: PayloadAction<any>) => {
            state.getAoTermSubjectsByIdResp = action.payload;
        },
        setDeleteAoTermSubjectsAct: (state, action: PayloadAction<any>) => {
            state.deleteAoTermSubjectsResp = action.payload;
        },
        setUpdateAoTermSubjectsAct: (state, action: PayloadAction<any>) => {
            state.updateAoTermSubjectsResp = action.payload;
        },

        // Ao Grade Entry
        setAoGradeEntryListAct: (state, action: PayloadAction<any>) => {
            state.getAoGradeEntryListResp = action.payload;
        },
        resetAoGradeEntryListAct: (state, action: PayloadAction<any>) => {
            state.getAoGradeEntryListResp = action.payload;
        },

        // Ao Grade Entry
        setProgressCardListAct: (state, action: PayloadAction<any>) => {
            state.getProgressCardListResp = action.payload;
        },
        setAoGradeEntryErrorAct: (state, action: PayloadAction<any>) => {
            state.aoGradeEntryErrorResp = action.payload;
        },

        // Error
        setExaminationManagementErrorAct: (state, action: PayloadAction<any>) => {
            state.examinationManagementErrorResp = action.payload;
        },
        setSaveAoGradeEntryListAct: (state, action: PayloadAction<any>) => {
            state.saveAoGradeEntryListResp = action.payload;
        },
        //Languages_api
        setExaminationSubjectsListAct: (state, action: PayloadAction<any>) => {
            state.examinationSubjectsListResp = action.payload;
        },
        //Ey Grade Entry
        setEyGradeEntryAct: (state, action: PayloadAction<any>) => {
            state.getEyGradeEntryListResp = action.payload;
        },
        setEntryLearnerSkillDetailsAct: (state, action: PayloadAction<any>) => {
            state.getEntryLearnerSkillDetailsResp = action.payload;
        },
        setSaveEyGradeEntryListAct: (state, action: PayloadAction<any>) => {
            state.saveEyGradeEntryListResp = action.payload;
        },
        setFilterListForCbseAct: (state, action: PayloadAction<any>) => {
            state.getFilterListForCbseResp = action.payload;
        },

        //Internal Subjects Marks Entry
        setInternalSubjectsMarksEntryAct: (state, action: PayloadAction<any>) => {
            state.getInternalSubjectsMarksListResp = action.payload;
        },
        setSaveInternalSubjectsMarksListAct: (state, action: PayloadAction<any>) => {
            state.saveInternalSubjectsMarksListResp = action.payload;
        },
        setGenerateProgressCardAct: (state, action: PayloadAction<any>) => {
            state.generateProgressCardActResp = action.payload;
        },
        setDownloadAllProgressCardsAct: (state, action: PayloadAction<any>) => {
            state.downloadAllProgressCardsActResp = action.payload;
        },
        setDownloadCbseProgressCardsAct: (state, action: PayloadAction<any>) => {
            state.downloadCbseProgressCardsActResp = action.payload;
        },
        setCbseProgressCardStudentAct:(state, action: PayloadAction<any>) => {
            state.getCbseProgressCardStudentActResp = action.payload;
        },
        setDownloadProgressCard: (state, action: PayloadAction<any>) => {
            state.downloadProgressCardActResp = action.payload;
        },
        setPreviewProgressCard: (state, action: PayloadAction<any>) => {
            state.previewProgressCardActResp = action.payload;
        },
        setSubjectsForInternalMarksEntryAct: (state, action: PayloadAction<any>) => {
            state.getSubjectsForInternalMarksEntryResp = action.payload;
        },

        //student_grade_book
        setStudentGradeReportBookAct: (state, action: PayloadAction<any>) => {
            state.getStudentGradeReportBookListResp = action.payload;
        },
        setExportStudentGradeReportBookAct: (state, action: PayloadAction<any>) => {
            state.exportStudentGradeReportBookResp = action.payload;
        },

        //marks entry report
        setMarksEntryReportListAct: (state, action: PayloadAction<any>) => {
            state.getMarksEntryReportListResp = action.payload;
        },
        setExportMarksEntryReportAct: (state, action: PayloadAction<any>) => {
            state.exportMarksEntryReportResp = action.payload;
        },

        //dashboard
        setExaminationDashboardDataAct: (state, action: PayloadAction<any>) => {
            state.getExaminationDashboardDataResp = action.payload;
        },
        setBranchWiseMarksRangeAct: (state, action: PayloadAction<any>) => {
            state.getBranchWiseMarksRangeResp = action.payload;
        },
        setMarksRangeListAct: (state, action: PayloadAction<any>) => {
            state.getMarksRangeListResp = action.payload;
        },
        setSubjectAndGradeWiseAct: (state, action: PayloadAction<any>) => {
            state.getSubjectAndGradeWiseResp = action.payload;
        },
        setSubjectListForDashboardAct: (state, action: PayloadAction<any>) => {
            state.getSubjectListForDashboardResp = action.payload;
        },
        setClassTeacherListAct: (state, action: PayloadAction<any>) => {
            state.getClassTeacherListResp = action.payload;
        },
        setClassGradeWiseAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getClassGradeWiseAnalysisResp = action.payload;
        },
        setFoundationStudentsProfilesAct:(state,action:PayloadAction<any>) => {
            state.getFoundationStudentsProfilesResp = action.payload
        },
        setSubjectGradeWiseAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getSubjectGradeWiseAnalysisResp = action.payload;
        },
        setExportSectionWiseAnalysisAct: (state, action: PayloadAction<any>) => {
            state.exportSectionWiseAnalysisResp = action.payload;
        },
        setSaveGeneralInformationAct: (state, action: PayloadAction<any>) => {
            state.saveGeneralInformationResp = action.payload;
        },
        resetSaveGeneralInformationAct: (state, action: PayloadAction<any>) => {
            state.saveGeneralInformationResp = action.payload;
        },
        setSaveGeneralStudentPhotoAct: (state, action: PayloadAction<any>) => {
            state.saveGeneralStudentPhotoResp = action.payload;
        },
        resetSaveGeneralStudentPhotoAct: (state, action: PayloadAction<any>) => {
            state.saveGeneralStudentPhotoResp = action.payload;
        },
        setGeneralInformationByIdAct: (state, action: PayloadAction<any>) => {
            state.getGeneralInformationByIdResp = action.payload;
        },
        resetGeneralInformationByIdAct: (state, action: PayloadAction<any>) => {
            state.getGeneralInformationByIdResp = action.payload;
        },
        setUpdateGeneralInformationAct: (state, action: PayloadAction<any>) => {
            state.updateGeneralInformationResp = action.payload;
        },
        setUploadStudentSurroundingPhotoAct: (state, action: PayloadAction<any>) => {
            state.uploadStudentSurroundingPhotoResp = action.payload;
        },
        setUploadFamilySurroundingPhotoAct: (state, action: PayloadAction<any>) => {
            state.uploadFamilySurroundingPhotoResp = action.payload;
        },
        setSaveSurroundingAct: (state, action: PayloadAction<any>) => {
            state.saveSurroundingResp = action.payload;
        },
        setUpdateSurroundingAct: (state, action: PayloadAction<any>) => {
            state.updateSurroundingResp = action.payload;
        },
        setDomainDetailsStudentAct: (state, action: PayloadAction<any>) => {
            state.getDomainDetailsStudentResp = action.payload;
        },
        setSaveDaominStudentDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveDaominStudentDetailsResp = action.payload;
        },
        setUpdateDomainDetailsStudentAct: (state, action: PayloadAction<any>) => {
            state.updateDomainDetailsStudentResp = action.payload;
        },
        setSaveDomainSummaryAct: (state, action: PayloadAction<any>) => {
            state.saveDomainSummaryResp = action.payload;
        },
        setLogActivityStatusAct: (state, action: PayloadAction<any>) => {
            state.getLogActivityStatusResp = action.payload;
        },
        setSaveParentCollectedStatusAct: (state, action: PayloadAction<any>) => {
            state.saveParentCollectedStatusResp = action.payload;
        },
        setStudentSummaryByIdAct: (state, action: PayloadAction<any>) => {
            state.getStudentSummaryByIdResp = action.payload;
        },
        setCopyFoundationStageGradeEntryStudentDetailsAct: (state, action: PayloadAction<any>) => {
            state.copyFoundationStageGradeEntryStudentDetailsResp = action.payload;
        },
        exportFondationStageGradeEntryAct: (state, action: PayloadAction<any>) => {
            state.exportFondationStageGradeEntryResp = action.payload;
        },

        //holistic Progress Card
        setHolisticProgressCardAct: (state, action: PayloadAction<any>) => {
            state.getHolisticProgressCardResp = action.payload;
        },

        // igcse skill attribute entry
        setIgcseStudentSkillsAttributesDetailsAct: (state, action: PayloadAction<any>) => {
            state.getIgcseStudentSkillsAttributesDetailsResp = action.payload;
        },
        setSaveIgcseStudentSkillsAttributesDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveIgcseStudentSkillsAttributesDetailsResp = action.payload;
        },
        setClassAnalysisReportAct: (state, action: PayloadAction<any>) => {
            state.getClassAnalysisReportResp = action.payload;
        }
    }
})

export const {
    // Admit Card
    setAdmitCardDetailsAct,
    setGenerateAdmitCardAct,
    setDownloadAdmitCardAct,
    resetsetDownloadAdmitCardAct,
    setAdmitCardExamDetailsAct,
    
    //change student subjects
    setChangeStudentSubjectsDetailsAct, setChangeStudentSubjectsDetailsByIdAct, setSaveChangeStudentSubjectsDetailsAct, setUpdateChangeStudentSubjectsDetailsAct, setDeleteChangeStudentSubjectsDetailsAct, setDeleteChangeStudentSubjectsByIdDetailsAct,
    setStudentRemarksAct,
    setExaminationInstituteTermsAct,
    setStudentRemarksDecriptionAct,
    setStudentRemarksByIdAct,
    setSaveStudentRemarksAct,
    setEditStudentRemarksAct,
    setDeleteStudentRemarksAct,
    
    //mark entry
    setStudentDetailsAct, setExaminationClassesAct,setExaminationClassSubjectAct,setSaveEntryMarksAct, setCoscholasticGradesListAct, setDownloadMarksEntryAct, setUploadMarksEntryAct,

    //Ao Selection
    setAoTermSubjectsAct, setAoInsideSubjectsAct,resetAoInsideSubjectsAct, setSaveAoTermSubjectsAct, setAoTermSubjectsByIdAct, setDeleteAoTermSubjectsAct, setUpdateAoTermSubjectsAct, resetAoTermSubjectsAct,

    // Ao Grade Entry
    setAoGradeEntryListAct, setSaveAoGradeEntryListAct, setAoGradeEntryErrorAct, resetAoGradeEntryListAct, setExaminationSubjectsListAct,

    //marks entry report
    setMarksEntryReportListAct, setExportMarksEntryReportAct,
    
    //Ey Grade ENtry
    setEyGradeEntryAct,
    setEntryLearnerSkillDetailsAct,
    setSaveEyGradeEntryListAct,
    setDownloadProgressCard, setPreviewProgressCard,

    //Progress Card
    setProgressCardListAct, setGenerateProgressCardAct, setDownloadAllProgressCardsAct, setDownloadCbseProgressCardsAct,
    setFilterListForCbseAct,
    setCbseProgressCardStudentAct,

    //Internal Subjects Marks Entry
    setInternalSubjectsMarksEntryAct, setSaveInternalSubjectsMarksListAct,setSubjectsForInternalMarksEntryAct,
    
    //student_grade_book
    setStudentGradeReportBookAct, setExportStudentGradeReportBookAct,

    //dashboard
    setExaminationDashboardDataAct, setBranchWiseMarksRangeAct, setMarksRangeListAct,setSubjectAndGradeWiseAct,setSubjectListForDashboardAct, setClassTeacherListAct, setSubjectGradeWiseAnalysisAct, setExportSectionWiseAnalysisAct, setClassGradeWiseAnalysisAct,

    // holistic reports
    setFoundationStudentsProfilesAct,
    setSaveGeneralInformationAct,
    resetSaveGeneralInformationAct,
    setSaveGeneralStudentPhotoAct,
    resetSaveGeneralStudentPhotoAct,
    setGeneralInformationByIdAct,
    resetGeneralInformationByIdAct,
    setUpdateGeneralInformationAct,
    setUploadStudentSurroundingPhotoAct,
    setUploadFamilySurroundingPhotoAct,
    setSaveSurroundingAct,
    setUpdateSurroundingAct,
    setDomainDetailsStudentAct,
    setSaveDaominStudentDetailsAct,
    setUpdateDomainDetailsStudentAct,
    setSaveDomainSummaryAct,
    setLogActivityStatusAct,
    setSaveParentCollectedStatusAct,
    setStudentSummaryByIdAct,
    setCopyFoundationStageGradeEntryStudentDetailsAct,
    exportFondationStageGradeEntryAct,
    
    //holistic Progress Card
    setHolisticProgressCardAct,

    // igcse skill attribute entry
    setIgcseStudentSkillsAttributesDetailsAct,
    setSaveIgcseStudentSkillsAttributesDetailsAct,
    setClassAnalysisReportAct,
    
    //Error
    setExaminationManagementErrorAct, 


} = examinationManagement.actions;

export default examinationManagement.reducer;