export interface ISettingsListReducerState {
    //Cbse Settings

    // Examination-Tab
    getCbseExaminationRequestListResp: any;
    getExaminationTermRequestListResp: any;
    getCbseExaminationListByIdResp: any;
    editCbseExaminationRequestResp: any;
    saveCbseExaminationListResp: any;
    delCbseExaminationRequestResp: any;
    changeDisplayOrderExamResp: any;
    getExamCategoryResp: any;

    // Examination-Weightage
    getCbseWeightageRequestListResp: any;
    getCbseWeightageListByIdResp: any;
    editCbseWeightageRequestResp: any;
    saveCbseWeightageListResp: any;
    delCbseWeightageRequestResp: any;

    // Examination-Subjects
    getCbseExaminationSubjectsRequestListResp: any;
    changeDisplayOrderExaminationSubjectsListResp: any;
    getSubjectsRequestListResp: any;
    getCbseExaminationSubjectsListByIdResp: any;
    editCbseExaminationSubjectsRequestResp: any;
    saveCbseExaminationSubjectsListResp: any;
    delCbseExaminationSubjectsRequestResp: any;

    // subject order
    getCbseExaminationSubjectOrderResp: any;
    getCBSEAllSubjectsOrderResp: any;
    saveCbseExaminationSubjectOrderResp: any;
    updateCbseExaminationSubjectOrderResp: any;

    // Examination-Coscholastic-Grades
    getCbseExaminationCoscholasticGradesRequestListResp: any;
    getCoscholasticSubjectsRequestListResp: any;
    getCbseExaminationCoscholasticGradesListByIdResp: any;
    editCbseExaminationCoscholasticGradesRequestResp: any;
    saveCbseExaminationCoscholasticGradesListResp: any;
    delCbseExaminationCoscholasticGradesRequestResp: any;
    copyCbseExaminationCoscholasticGradesResp: any;

    // AddMultipleExam Marks
    getCbseExaminationMultipleExamMarksResp: any,
    getCbseExaminationMultipleExamMarksByIdResp: any,
    saveCbseExaminationMultipleExamMarksResp: any,
    editCbseExaminationMultipleExamMarksByIdResp: any,
    deleteCbseExaminationMultipleExamMarksByIdResp: any,

    // OverAllGrades
    getCbseExaminationOverAllGradesResp: any;
    getCbseExaminationOverAllGradesByIdResp: any;
    saveCbseExaminationOverAllGradesResp: any;
    editCbseExaminationOverAllGradesByIdResp: any;
    deleteCbseExaminationOverAllGradesByIdResp: any;
    copyCbseExaminationOverAllGradesResp: any;
    getOverallGradeColorListResp: any;
    saveOverallGradeColorResp: any;

    // Examination-Marks
    getCbseExaminationMarksListResp: any;
    getCbseExaminationMarksByIdResp: any;
    saveCbseExaminationMarksResp: any;
    editCbseExaminationMarksByIdResp: any;
    deleteCbseExaminationMarksByIdResp: any;

    // Skill Entry
    getSkillEntryListResp: any;
    saveSkillEntryResp: any;
    deleteSkillEntryResp: any;
    getSkillEntryByIdResp: any;
    updateSkillEntryResp: any;


    // Ao Mapping
    getSubjectListResp: any;
    getAoMappingSubjectResp: any;
    saveAoMappingSubjectResp: any;
    deleteAoMappingSubjectResp: any;
    updateAoMappingSubjectResp: any;
    getAoMappingSubjectByIdResp: any;
    getModelSubjectListResp: any;

    // signature
    getSignatureListResp: any;
    saveSignatureResp: any;
    updateSignatureResp: any;
    deleteSignatureResp: any;

    // IGSE Settings
    //Term Name
    getIgseTermNameListResp: any;
    getCopyIgseTermNameListResp: any;
    saveIgseTermNameResp: any;
    getIgseTermNameByIdResp: any;
    updateIgseTermNameByIdResp: any;
    deleteIgseTermNameByIdResp: any;

    //Term Details
    getIgseTermDetailsListResp: any;
    getIgseTermDetailsByIdResp: any;
    saveIgseTermDetailsResp: any;
    updateIgseTermDetailsByIdResp: any;
    deleteIgseTermDetailsByIdResp: any;
    //error state
    cbseExaminationErrorAct: any;

    // Internal Subject Grades

    getCbseInternalSubjectsGradesListResp: any;
    saveCbseInternalSubjectsGradesListResp: any;
    editCbseInternalSubjectsGradesListResp: any;
    deleteCbseInternalSubjectsGradesListResp: any;
    getCbseInternalSubjectsGradesListByIdResp: any;
    copyCbseInternalSubjectsGradesListResp: any;

    // percentage slabs
    getPercentageSlabsListResp: any;
    savePercentageSlabsListResp: any;
    editPercentageSlabsListResp: any;
    deletePercentageSlabsListResp: any;

    getExaminationListResp: any;

    //Area Strength Focus
    getAreaofStrengthFocusListResp: any;
    getAreaofStrengthFocusByIdResp: any;
    saveAreaofStrengthFocusResp: any;
    updateAreaofStrengthFocusResp: any;

    //holistics domain
    getHolisticDomainResp: any;
    getHolisticDomainModelResp: any;
    saveHolisticDomainResp: any;
    updateHolisticDomainResp: any;
    saveDomainOrderResp: any;
    deleteHolisticDomainResp: any;

    //holistic Activity
    getHolisticActivityResp: any;
    saveHolisticActivityResp: any;
    updateHolisticActivityResp: any;
    deleteHolisticActivityResp: any;
    getClassInstituteIdResp: any;
    getActivityBranchResp: any;
    getActivityClassResp: any;
    getActivityByIdResp: any;
    getInstituteClassResp: any;
    getClassesByStageResp: any;
    getCopyClassesByStageResp: any;
    copyHolisticActivityResp: any;

    //holistic domain activity
    getHolisticDomainActivityResp: any;
    saveHolisticDomainActivityResp: any;
    deleteHolisticDomainActivityResp: any;

    //holistic Curriculum Goals
    getHolisticCurriculumGoalsResp: any;
    saveHolisticCurriculumGoalsResp: any;
    updateHolisticCurriculumGoalsResp: any;

    //Report Card Settings
    getReportCardSettingsResp: any;
    reportCardConfigResp: any;
    saveReportCardSettingsResp: any;
    deleteReportCardSettingsResp: any;

    // -----Preparatory-----

    //Preparatory domain
    getPreparatoryDomainResp: any;
    getPreparatoryDomainModelResp: any;
    savePreparatoryDomainResp: any;
    updatePreparatoryDomainResp: any;
    savePreparatoryDomainOrderResp: any;
    deletePreparatoryDomainResp: any;

    //preparatory Curriculum Goals
    getPreparatoryCurriculumGoalsResp: any;
    savePreparatoryCurriculumGoalsResp: any;
    updatePreparatoryCurriculumGoalsResp: any;

    //preparatory grade entry
    getPreparatoryGradeEntryListResp: any;
    savePreparatoryGradeEntryListResp: any;
    getPreparatoryGradeEntryListByIdResp: any;
    updatePreparatoryGradeEntryListResp: any;
    exportPreparatoryGradeEntryListResp: any;
    copyPreparatoryGradeEntryStudentDetailsResp: any;

    //preparatory student surrounding
    savePreparatoryStudentSurroundingResp: any;
    savePreparatoryStudentFeedbackResp: any;
    savePreparatoryParentFeedbackResp: any;

    //preparatory activity
    getPreparatoryActivityResp: any;
    savePreparatoryActivityResp: any;
    updatePreparatoryActivityResp: any;
    deletePreparatoryActivityResp: any;
    getPreparatoryActivityByIdResp: any;
    copyPreparatoryActivityResp: any;

    //preparatory domain assessment
    getPreparatoryDomainStudentsResp: any;
    savePreparatoryDomainStudentsResp: any;
    updatePreparatoryDomainStudentsResp: any;
    getPreparatorySummaryByIdResp: any;
    savePreparatorySummaryResp: any;

    getPreparatoryStatusResp: any;
    savePrepartoryParentCollectionResp: any;


    // IGSE Skill Attribute Settings
    getSkillAttributeSettingsListResp: any;
    getSkillAttributeSettingsItemByIdResp: any;
    saveSkillAttributeSettingsItemResp: any;
    updateSkillAttributeSettingsItemResp: any;
    deleteSkillAttributeSettingsItemResp: any;
    saveSetSkillOrderResp:any;
    saveSetSkillAttributeOrderResp:any
}