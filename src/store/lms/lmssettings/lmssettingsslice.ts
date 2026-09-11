import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISettingsListReducerState } from "./lmssettingstypes";

const initialState: ISettingsListReducerState = {
    getQuestionNoFormatResp: undefined,
    saveQuestionNoFormatResp: undefined,
    updateQuestionNoFormatResp: undefined,
    deleteQuestionNoFormatResp: undefined,

    getQuestionTypesResp: undefined,
    getQuestionTypesByIdResp: undefined,
    saveQuestionTypesResp: undefined,
    updateQuestionTypesResp: undefined,
    deleteQuestionTypesResp: undefined,

    getDifficultyLevelsResp: undefined,
    getDifficultyLevelsByIdResp: undefined,
    saveDifficultyLevelsResp: undefined,
    updateDifficultyLevelsResp: undefined,
    deleteDifficultyLevelsResp: undefined,

    getBloomTaxonomyResp: undefined,
    saveBloomTaxonomyResp: undefined,
    updateBloomTaxonomyResp: undefined,
    deleteBloomTaxonomyResp: undefined,

    //Academic Details
    getAcademicDetailsListResp: undefined,
    getAcademicDetailsByIdResp: undefined,
    savecademicDetailsResp: undefined,
    deleteAcademicDetailsResp: undefined,

    //Academic Term Details
    getAcademicTermDetailsListResp: undefined,
    getAcademicTermDetailsByIdResp: undefined,
    saveAcademicTermDetailsResp: undefined,
    deleteAcademicTermDetailsResp: undefined,

    //School Period Details
    getSchoolPeriodDetailsListResp: undefined,
    getSchoolPeriodDetailsByIdResp: undefined,
    saveSchoolPeriodDetailsResp: undefined,
    deleteSchoolPeriodDetailsResp: undefined,

    //School Holidays
    getSchoolHolidaysListResp: undefined,
    getSchoolHolidaysByIdResp: undefined,
    saveSchoolHolidaysResp: undefined,
    deleteSchoolHolidaysResp: undefined,

    //Digital Curriculum Validation's
    getDigitalCurriculumValidationListResp: undefined,
    saveDigitalCurriculumValidationResp: undefined,

    //Digital Curriculum Rules's
    getDigitalCurriculumRulesListResp: undefined,
    saveDigitalCurriculumRulesResp: undefined,
    
    //Error
    lmsSettingsErrorAct: undefined
}

export const lmsSettings = createSlice({
    name: "lmsSettings",
    initialState,
    reducers: {
        //Lms Settings
        setQuestionNoFormatAct: (state, action: PayloadAction<any>) => {
            state.getQuestionNoFormatResp = action.payload;
        },
        setSaveQuestionNoFormatAct: (state, action: PayloadAction<any>) => {
            state.saveQuestionNoFormatResp = action.payload;
        },
        setUpdateQuestionNoFormatAct: (state, action: PayloadAction<any>) => {
            state.updateQuestionNoFormatResp = action.payload;
        },
        setDeleteQuestionNoFormatAct: (state, action: PayloadAction<any>) => {
            state.deleteQuestionNoFormatResp = action.payload;
        },

        setQuestionTypesAct: (state, action: PayloadAction<any>) => {
            state.getQuestionTypesResp = action.payload;
        },
        setQuestionTypesByIdAct: (state, action: PayloadAction<any>) => {
            state.getQuestionTypesByIdResp = action.payload;
        },
        setSaveQuestionTypesAct: (state, action: PayloadAction<any>) => {
            state.saveQuestionTypesResp = action.payload;
        },
        setUpdateQuestionTypesAct: (state, action: PayloadAction<any>) => {
            state.updateQuestionTypesResp = action.payload;
        },
        setDeleteQuestionTypesAct: (state, action: PayloadAction<any>) => {
            state.deleteQuestionTypesResp = action.payload;
        },

        setDifficultyLevelsAct: (state, action: PayloadAction<any>) => {
            state.getDifficultyLevelsResp = action.payload;
        },
        setDifficultyLevelsByIdAct: (state, action: PayloadAction<any>) => {
            state.getDifficultyLevelsByIdResp = action.payload;
        },
        setSaveDifficultyLevelsAct: (state, action: PayloadAction<any>) => {
            state.saveDifficultyLevelsResp = action.payload;
        },
        setUpdateDifficultyLevelsAct: (state, action: PayloadAction<any>) => {
            state.updateDifficultyLevelsResp = action.payload;
        },
        setDeleteDifficultyLevelsAct: (state, action: PayloadAction<any>) => {
            state.deleteDifficultyLevelsResp = action.payload;
        },
        setBloomTaxonomyAct: (state, action: PayloadAction<any>) => {
            state.getBloomTaxonomyResp = action.payload;
        },
        setSaveBloomTaxonomyAct: (state, action: PayloadAction<any>) => {
            state.saveBloomTaxonomyResp = action.payload;
        },
        setUpdateBloomTaxonomyAct: (state, action: PayloadAction<any>) => {
            state.updateBloomTaxonomyResp = action.payload;
        },
        setDeleteBloomTaxonomyAct: (state, action: PayloadAction<any>) => {
            state.deleteBloomTaxonomyResp = action.payload;
        },

        //Academic Details
        setAcademicDetailsAct: (state, action: PayloadAction<any>) => {
            state.getAcademicDetailsListResp = action.payload;
        },
        setAcademicDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getAcademicDetailsByIdResp = action.payload;
        },
        setSaveAcademicDetailsAct: (state, action: PayloadAction<any>) => {
            state.savecademicDetailsResp = action.payload;
        },
        setDeleteAcademicDetailsAct: (state, action: PayloadAction<any>) => {
            state.deleteAcademicDetailsResp = action.payload;
        },

        //Academic Term Details

        setAcademicTermDetailsAct: (state, action: PayloadAction<any>) => {
            state.getAcademicTermDetailsListResp = action.payload;
        },

        setAcademicTermDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getAcademicTermDetailsByIdResp = action.payload;
        },

        setSaveAcademicTermDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveAcademicTermDetailsResp = action.payload;
        },

        setDeleteAcademicTermDetailsAct: (state, action: PayloadAction<any>) => {
            state.deleteAcademicTermDetailsResp = action.payload;
        },

        //School Period Details
        setSchoolPeriodDetailsAct: (state, action: PayloadAction<any>) => {
            state.getSchoolPeriodDetailsListResp = action.payload;
        },

        setSchoolPeriodDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getSchoolPeriodDetailsByIdResp = action.payload;
        },

        setSaveSchoolPeriodDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveSchoolPeriodDetailsResp = action.payload;
        },

        setDeleteSchoolPeriodDetailsAct: (state, action: PayloadAction<any>) => {
            state.deleteSchoolPeriodDetailsResp = action.payload;
        },

        //School Holidays
        setSchoolHolidaysAct: (state, action: PayloadAction<any>) => {
            state.getSchoolHolidaysListResp = action.payload;
        },

        setSchoolHolidaysByIdAct: (state, action: PayloadAction<any>) => {
            state.getSchoolHolidaysByIdResp = action.payload;
        },

        setSaveSchoolHolidaysAct: (state, action: PayloadAction<any>) => {
            state.saveSchoolHolidaysResp = action.payload;
        },

        setDeleteSchoolHolidaysAct: (state, action: PayloadAction<any>) => {
            state.deleteSchoolHolidaysResp = action.payload;
        },

        //Digital Curriculum Validation's
        setGetDigitalCurriculumValidationAct: (state, action: PayloadAction<any>) => {
            state.getDigitalCurriculumValidationListResp = action.payload;
        },
        setSaveDigitalCurriculumValidationAct: (state, action: PayloadAction<any>) => {
            state.saveDigitalCurriculumValidationResp = action.payload;
        },

        //Digital Curriculum Rules's
        setGetDigitalCurriculumRulesAct: (state, action: PayloadAction<any>) => {
            state.getDigitalCurriculumRulesListResp = action.payload;
        },
        setSaveDigitalCurriculumRulesAct: (state, action: PayloadAction<any>) => {
            state.saveDigitalCurriculumRulesResp = action.payload;
        },
        
        //Error
        lmsSettingsErrorAct: (state, action: PayloadAction<any>) => {
            state.lmsSettingsErrorAct = action.payload;
        },
    }
})

export const {
    //Lms Settings
    setQuestionNoFormatAct,
    setSaveQuestionNoFormatAct,
    setUpdateQuestionNoFormatAct,
    setDeleteQuestionNoFormatAct,

    setQuestionTypesAct,
    setQuestionTypesByIdAct,
    setSaveQuestionTypesAct,
    setUpdateQuestionTypesAct,
    setDeleteQuestionTypesAct,

    setDifficultyLevelsAct,
    setDifficultyLevelsByIdAct,
    setSaveDifficultyLevelsAct,
    setUpdateDifficultyLevelsAct,
    setDeleteDifficultyLevelsAct,

    setBloomTaxonomyAct,
    setSaveBloomTaxonomyAct,
    setUpdateBloomTaxonomyAct,
    setDeleteBloomTaxonomyAct,

    //Academic Details
    setAcademicDetailsAct,
    setAcademicDetailsByIdAct,
    setSaveAcademicDetailsAct,
    setDeleteAcademicDetailsAct,

    //Academic Term Details
    setAcademicTermDetailsAct,
    setAcademicTermDetailsByIdAct,
    setSaveAcademicTermDetailsAct,
    setDeleteAcademicTermDetailsAct,

    //School Period Details
    setSchoolPeriodDetailsAct,
    setSchoolPeriodDetailsByIdAct,
    setSaveSchoolPeriodDetailsAct,
    setDeleteSchoolPeriodDetailsAct,

    //School Holidays
    setSchoolHolidaysAct,
    setSchoolHolidaysByIdAct,
    setSaveSchoolHolidaysAct,
    setDeleteSchoolHolidaysAct,

    //Digital Curriculum Validation's
    setGetDigitalCurriculumValidationAct,
    setSaveDigitalCurriculumValidationAct,

    //Digital Curriculum Rules's
    setGetDigitalCurriculumRulesAct,
    setSaveDigitalCurriculumRulesAct,

    //Error
    lmsSettingsErrorAct,

} = lmsSettings.actions;

export default lmsSettings.reducer;
