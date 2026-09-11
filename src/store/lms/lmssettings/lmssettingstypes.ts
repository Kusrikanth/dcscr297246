export interface ISettingsListReducerState {
    // question no format
    getQuestionNoFormatResp: any;
    saveQuestionNoFormatResp: any;
    updateQuestionNoFormatResp: any;
    deleteQuestionNoFormatResp: any;

    getQuestionTypesResp: any;
    getQuestionTypesByIdResp: any;
    saveQuestionTypesResp: any;
    updateQuestionTypesResp: any;
    deleteQuestionTypesResp: any;

    getDifficultyLevelsResp: any;
    getDifficultyLevelsByIdResp: any;
    saveDifficultyLevelsResp: any;
    updateDifficultyLevelsResp: any;
    deleteDifficultyLevelsResp: any;
   
    getBloomTaxonomyResp: any
    saveBloomTaxonomyResp: any;
    updateBloomTaxonomyResp: any;
    deleteBloomTaxonomyResp: any;
    
    //Academic Details
    getAcademicDetailsListResp: any;
    getAcademicDetailsByIdResp: any;
    savecademicDetailsResp: any;
    deleteAcademicDetailsResp: any;

    //Academic Term Details
    getAcademicTermDetailsListResp: any
    getAcademicTermDetailsByIdResp: any
    saveAcademicTermDetailsResp: any
    deleteAcademicTermDetailsResp: any

    //School Period Details
    getSchoolPeriodDetailsListResp: any
    getSchoolPeriodDetailsByIdResp: any
    saveSchoolPeriodDetailsResp: any
    deleteSchoolPeriodDetailsResp: any

    //School Holidays
    getSchoolHolidaysListResp: any
    getSchoolHolidaysByIdResp: any
    saveSchoolHolidaysResp: any
    deleteSchoolHolidaysResp: any

    //Digital Curriculum Validation's
    getDigitalCurriculumValidationListResp: any
    saveDigitalCurriculumValidationResp: any

    //Digital Curriculum Rules's
    getDigitalCurriculumRulesListResp: any
    saveDigitalCurriculumRulesResp: any

    //error
    lmsSettingsErrorAct: any
}