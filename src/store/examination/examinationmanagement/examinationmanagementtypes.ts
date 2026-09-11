export interface IExaminationManagementReducerState {

    // Admit Card

    getAdmitCardDetailsResp: any;
    generateAdmitCardResp : any;
    downloadAdmitCardResp : any;

    // Admit card - Fetch Exam Details For Parent
    getAdmitCardExamDetailsResp: any;

    //change Student Subjects
    changeStudentSubjectsDetailsResp: any;
    changeStudentSubjectsDetailsByIdResp: any;
    saveChangeStudentSubjectsResp: any;
    updateChangeStudentSubjectsResp: any;
    deleteChangeStudentSubjectsResp: any;
    deleteChangeStudentSubjectsByIdResp: any;


    //mark entry
    getStudentDetailsResp: any;
    getExaminationClassesResp: any;
    getExaminationClassSubjectResp: any;
    saveEntryMarksResp: any;
    getCoscholasticGradesListResp: any;
    downloadMarksEntryResp: any;
    uploadMarksEntryResp: any;

    //Stident Remarks
    getStudentRemarksListResp: any;
    getExaminationInstituteListResp: any;
    getStudentRemarksDescriptionListResp: any;
    getStudentRemarksByIdResp: any;
    saveStudentRemarksResp: any;
    editStudentRemarksByIdResp: any;
    deleteStudentRemarksByIdResp: any;

    //Ao Selection
    getAoTermSubjectsResp: any;
    getAoInsideSubjectsResp: any;
    saveAoTermSubjectsResp: any;
    getAoTermSubjectsByIdResp: any;
    deleteAoTermSubjectsResp: any;
    updateAoTermSubjectsResp: any;

    //Ao Grade Entry
    getAoGradeEntryListResp:any;
    saveAoGradeEntryListResp :any;
    examinationSubjectsListResp: any;
    aoGradeEntryErrorResp: any;

    //Ey Grade Entry
    getEyGradeEntryListResp: any;
    getEntryLearnerSkillDetailsResp: any;
    saveEyGradeEntryListResp: any;

    //Progress Card
    getProgressCardListResp: any;
    generateProgressCardActResp: any;
    downloadProgressCardActResp: any;
    previewProgressCardActResp: any;
    downloadAllProgressCardsActResp: any;
    downloadCbseProgressCardsActResp: any;
    getFilterListForCbseResp : any;
    getCbseProgressCardStudentActResp: any;

    //Internal Subjects Marks Entry
    getInternalSubjectsMarksListResp: any;
    saveInternalSubjectsMarksListResp: any;
    getSubjectsForInternalMarksEntryResp: any;

    //student_grade_book
    getStudentGradeReportBookListResp: any;
    exportStudentGradeReportBookResp: any;

    //marks entry report
    getMarksEntryReportListResp: any;
    exportMarksEntryReportResp: any;
    

    //dashboard
    getExaminationDashboardDataResp: any;
    getBranchWiseMarksRangeResp: any;
    getSubjectAndGradeWiseResp: any;
    getMarksRangeListResp: any;
    getSubjectListForDashboardResp: any;
    getSubjectGradeWiseAnalysisResp: any;
    exportSectionWiseAnalysisResp: any;
    getClassGradeWiseAnalysisResp: any;

    getClassTeacherListResp: any;
    getClassAnalysisReportResp: any;
    

    //holistic reports
    getFoundationStudentsProfilesResp:any;
    saveGeneralInformationResp: any;
    saveGeneralStudentPhotoResp: any;
    getGeneralInformationByIdResp: any;
    updateGeneralInformationResp: any;
    uploadStudentSurroundingPhotoResp: any;
    uploadFamilySurroundingPhotoResp: any;
    saveSurroundingResp: any;
    updateSurroundingResp: any;
    getDomainDetailsStudentResp: any;
    saveDaominStudentDetailsResp: any;
    updateDomainDetailsStudentResp: any;
    saveDomainSummaryResp: any;
    getLogActivityStatusResp: any;
    saveParentCollectedStatusResp: any;
    getStudentSummaryByIdResp: any;
    copyFoundationStageGradeEntryStudentDetailsResp: any;

    //holistic progress card
    getHolisticProgressCardResp: any;
    exportFondationStageGradeEntryResp: any;

    // igcse skill attribute entry
    getIgcseStudentSkillsAttributesDetailsResp:any;
    saveIgcseStudentSkillsAttributesDetailsResp:any;
    
    //error state

    examinationManagementErrorResp: any;
}