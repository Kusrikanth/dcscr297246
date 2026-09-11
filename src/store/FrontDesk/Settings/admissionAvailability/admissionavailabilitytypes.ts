export interface IAdmissionAvailabilityReducerState {
    academicAvailabilityErrorResp:any,
    admissionAvailabilityListResp: any;
    admissionAvailabilityClassListResp: any;
    addadmissionAvailabilityResp: any;
    getadmissionAvailabilityByIdResp: any;
    editadmissionAvailabilityResp: any;
    ageCriteriaListResp: any;
    ageCriteriaByIdResp: any;
    generateAgeCriteriaResp: any;
    editAgeCriteriaByIdResp : any,
    examSubjectsListResp: any;
    getExamSubjectStreamResp:any,
    getExamSubjectsByClassResp:any,
    addExamSubjectsListResp:any,
    editExamSubjectsListResp:any,
    examSubjectListByIdResp:any,
    panelMembersListResp : any;
    panelEmployeesListResp:any,
    addPanelMemberResp:any,
    getPanelMemberByIdResp :any,
    editPanelMemberResp : any,
    getEvaluationProcessListResp : any;
    getInstituteEvaluationListResp : any;
    getClassesForEvaluationResp : any;
    addEvaluationProcessResp : any;
    classesForAddEvaluationResp : any;
    getEvaluationProcessByIdResp : any;
    editEvaluationProcessByIdResp : any;
    exportPanelMemberListResp : any;

    //Master-Documents
    getMasterDocumentsListResp : any;
    saveMasterDocumentsResp : any;
    getMasterDocumentsByIdResp : any;
    editMasterDocumentsRequestResp : any;
    delMasterDocumentsRequestResp : any;

    //Class-Wise-Documents
    getClassWiseDocumentsListResp : any;
    getClassWiseDocumentsListByIdResp : any;
    getUnassignClassWiseDocumentsListResp : any;
    saveClassWiseDocumentsResp : any;
    getClassWiseDocumentsByIdResp : any;
    editClassWiseDocumentsResp : any;
    delClassWiseDocumentsRequestResp : any;

    //Admission Facility
    getAdmissionFacilitysListResp : any;
    getAdmissionFacilitysListByIdResp : any;
    saveAdmissionFacilityResp : any;
    editAdmissionFacilityResp : any;
    delAdmissionFacilityRequestResp : any;

    //application-sale
    getRegistrationInstructionResp : any;
    getRegistrationInstructionSecondResp : any;
    getApplicationDetailsByCurriculumResp : any;

    getStuAppTrackerListResp : any;
    getStuListAppTrackerResp : any;
    getOtpSettingKeyResp : any;

    // optionalSubjects
    getOptionalSubjectsListResp:any;
    getOptionalSubjectItemByIdResp:any;
    saveOptionalSubjectItemsResp:any;
    editOptionalSubjectItemResp:any;
    delOptionalSubjectItemResp:any;

    //Application-Banner
    getApplicationBannerResp:any;
    saveApplicationBannerResp:any;
    
    //Signature
    getAdmissionSignatureListResp: any;
    saveAdmissionSignatureResp: any;
    updateAdmissionSignatureResp: any;
    getAdmissionSignatureByIdResp: any;
    delAdmissionSignatureResp: any;
}