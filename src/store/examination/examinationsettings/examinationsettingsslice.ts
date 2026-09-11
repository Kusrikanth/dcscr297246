import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISettingsListReducerState } from "./examinationsettingstypes";

const initialState: ISettingsListReducerState = {
  //Cbse Settings

  // Examination-Tab
  getCbseExaminationRequestListResp: undefined,
  getExaminationTermRequestListResp: undefined,
  getCbseExaminationListByIdResp: undefined,
  editCbseExaminationRequestResp: undefined,
  saveCbseExaminationListResp: undefined,
  delCbseExaminationRequestResp: undefined,
  changeDisplayOrderExamResp: undefined,
  getExamCategoryResp: undefined,

  // Examination-Weightage
  getCbseWeightageRequestListResp: undefined,
  getCbseWeightageListByIdResp: undefined,
  editCbseWeightageRequestResp: undefined,
  saveCbseWeightageListResp: undefined,
  delCbseWeightageRequestResp: undefined,

  // Examination-Subjects
  getCbseExaminationSubjectsRequestListResp: undefined,
  changeDisplayOrderExaminationSubjectsListResp: undefined,
  getSubjectsRequestListResp: undefined,
  getCbseExaminationSubjectsListByIdResp: undefined,
  editCbseExaminationSubjectsRequestResp: undefined,
  saveCbseExaminationSubjectsListResp: undefined,
  delCbseExaminationSubjectsRequestResp: undefined,

  // Examination-Coscholastic-Grades
  getCbseExaminationCoscholasticGradesRequestListResp: undefined,
  getCoscholasticSubjectsRequestListResp: undefined,
  getCbseExaminationCoscholasticGradesListByIdResp: undefined,
  editCbseExaminationCoscholasticGradesRequestResp: undefined,
  saveCbseExaminationCoscholasticGradesListResp: undefined,
  delCbseExaminationCoscholasticGradesRequestResp: undefined,
  copyCbseExaminationCoscholasticGradesResp: undefined,

  // AddMultipleExam Marks
  getCbseExaminationMultipleExamMarksResp: undefined,
  getCbseExaminationMultipleExamMarksByIdResp: undefined,
  saveCbseExaminationMultipleExamMarksResp: undefined,
  editCbseExaminationMultipleExamMarksByIdResp: undefined,
  deleteCbseExaminationMultipleExamMarksByIdResp: undefined,

  // OverAllGrades
  getCbseExaminationOverAllGradesResp: undefined,
  getCbseExaminationOverAllGradesByIdResp: undefined,
  saveCbseExaminationOverAllGradesResp: undefined,
  editCbseExaminationOverAllGradesByIdResp: undefined,
  deleteCbseExaminationOverAllGradesByIdResp: undefined,
  copyCbseExaminationOverAllGradesResp: undefined,
  getOverallGradeColorListResp: undefined,
  saveOverallGradeColorResp: undefined,

  // Examination-Marks
  getCbseExaminationMarksListResp: undefined,
  getCbseExaminationMarksByIdResp: undefined,
  saveCbseExaminationMarksResp: undefined,
  editCbseExaminationMarksByIdResp: undefined,
  deleteCbseExaminationMarksByIdResp: undefined,

  //subject order
  getCbseExaminationSubjectOrderResp: undefined,
  getCBSEAllSubjectsOrderResp: undefined,
  saveCbseExaminationSubjectOrderResp: undefined,
  updateCbseExaminationSubjectOrderResp: undefined,

  // Skill Entry
  getSkillEntryListResp: undefined,
  saveSkillEntryResp: undefined,
  deleteSkillEntryResp: undefined,
  getSkillEntryByIdResp: undefined,
  updateSkillEntryResp: undefined,

  // Ao Mapping
  getSubjectListResp: undefined,
  getAoMappingSubjectResp: undefined,
  saveAoMappingSubjectResp: undefined,
  deleteAoMappingSubjectResp: undefined,
  updateAoMappingSubjectResp: undefined,
  getAoMappingSubjectByIdResp: undefined,
  getModelSubjectListResp: undefined,

  //signature
  getSignatureListResp: undefined,
  saveSignatureResp: undefined,
  updateSignatureResp: undefined,
  deleteSignatureResp: undefined,

  //IGSE
  //Term Name
  getIgseTermNameListResp: undefined,
  getCopyIgseTermNameListResp: undefined,
  saveIgseTermNameResp: undefined,
  getIgseTermNameByIdResp: undefined,
  updateIgseTermNameByIdResp: undefined,
  deleteIgseTermNameByIdResp: undefined,
  //Term Details
  getIgseTermDetailsListResp: undefined,
  getIgseTermDetailsByIdResp: undefined,
  saveIgseTermDetailsResp: undefined,
  updateIgseTermDetailsByIdResp: undefined,
  deleteIgseTermDetailsByIdResp: undefined,

  // Internal Subject Grades
  getCbseInternalSubjectsGradesListResp: undefined,
  saveCbseInternalSubjectsGradesListResp: undefined,
  editCbseInternalSubjectsGradesListResp: undefined,
  deleteCbseInternalSubjectsGradesListResp: undefined,
  getCbseInternalSubjectsGradesListByIdResp: undefined,
  copyCbseInternalSubjectsGradesListResp: undefined,

  getExaminationListResp: undefined,
  getPercentageSlabsListResp: undefined,
  savePercentageSlabsListResp: undefined,
  editPercentageSlabsListResp: undefined,
  deletePercentageSlabsListResp: undefined,

  //Area Strength Focus
  getAreaofStrengthFocusListResp: undefined,
  saveAreaofStrengthFocusResp: undefined,
  getAreaofStrengthFocusByIdResp: undefined,
  updateAreaofStrengthFocusResp: undefined,

  //Holistics Domains
  getHolisticDomainResp: undefined,
  getHolisticDomainModelResp: undefined,
  saveHolisticDomainResp: undefined,
  updateHolisticDomainResp: undefined,
  saveDomainOrderResp: undefined,
  deleteHolisticDomainResp: undefined,

  //Holistics Activity
  getHolisticActivityResp: undefined,
  saveHolisticActivityResp: undefined,
  updateHolisticActivityResp: undefined,
  deleteHolisticActivityResp: undefined,
  getClassInstituteIdResp: undefined,
  getActivityBranchResp: undefined,
  getActivityClassResp: undefined,
  getActivityByIdResp: undefined,
  getInstituteClassResp: undefined,
  getClassesByStageResp: undefined,
  getCopyClassesByStageResp: undefined,
  copyHolisticActivityResp: undefined,

  //holistics domains activity
  getHolisticDomainActivityResp: undefined,
  saveHolisticDomainActivityResp: undefined,
  deleteHolisticDomainActivityResp: undefined,

  //holistic Curriculum Goals
  getHolisticCurriculumGoalsResp: undefined,
  saveHolisticCurriculumGoalsResp: undefined,
  updateHolisticCurriculumGoalsResp: undefined,

  //Report Card Settings
  getReportCardSettingsResp: undefined,
  reportCardConfigResp: undefined,
  saveReportCardSettingsResp: undefined,
  deleteReportCardSettingsResp: undefined,

  // -----Preparatory-----

  //Preparatory domain
  getPreparatoryDomainResp: undefined,
  getPreparatoryDomainModelResp:undefined,
  savePreparatoryDomainResp: undefined,
  updatePreparatoryDomainResp: undefined,
  savePreparatoryDomainOrderResp: undefined,
  deletePreparatoryDomainResp: undefined,

  //preparatory Curriculum Goals
  getPreparatoryCurriculumGoalsResp: undefined,
  savePreparatoryCurriculumGoalsResp: undefined,
  updatePreparatoryCurriculumGoalsResp: undefined,

  //preparatory grade entry
  getPreparatoryGradeEntryListResp: undefined,
  savePreparatoryGradeEntryListResp: undefined,
  getPreparatoryGradeEntryListByIdResp: undefined,
  updatePreparatoryGradeEntryListResp: undefined,
  exportPreparatoryGradeEntryListResp: undefined,
  copyPreparatoryGradeEntryStudentDetailsResp: undefined,

  //preparatory student surrounding
  savePreparatoryStudentSurroundingResp: undefined,
  savePreparatoryStudentFeedbackResp: undefined,
  savePreparatoryParentFeedbackResp: undefined,

  //preparatory activity
  getPreparatoryActivityResp: undefined,
  savePreparatoryActivityResp: undefined,
  updatePreparatoryActivityResp: undefined,
  deletePreparatoryActivityResp: undefined,
  getPreparatoryActivityByIdResp: undefined,
  copyPreparatoryActivityResp: undefined,

  //preparatory domain activity
  getPreparatoryDomainStudentsResp: undefined,
  savePreparatoryDomainStudentsResp: undefined,
  updatePreparatoryDomainStudentsResp: undefined,
  getPreparatorySummaryByIdResp: undefined,
  savePreparatorySummaryResp: undefined,

  getPreparatoryStatusResp: undefined,
  savePrepartoryParentCollectionResp: undefined,

  // IGSE Skill Attribute Settings
  getSkillAttributeSettingsListResp: undefined,
  getSkillAttributeSettingsItemByIdResp: undefined,
  saveSkillAttributeSettingsItemResp: undefined,
  updateSkillAttributeSettingsItemResp: undefined,
  deleteSkillAttributeSettingsItemResp: undefined,
  saveSetSkillOrderResp: undefined,
  saveSetSkillAttributeOrderResp: undefined,

  //Error
  cbseExaminationErrorAct: undefined,
};

export const examinationSettings = createSlice({
  name: "examinationSettings",
  initialState,
  reducers: {
    //Cbse Settings

    // Examination-Tab
    setCbseExaminationListAct: (state, action: PayloadAction<any>) => {
      state.getCbseExaminationRequestListResp = action.payload;
    },
    setExaminationTermListAct: (state, action: PayloadAction<any>) => {
      state.getExaminationTermRequestListResp = action.payload;
    },
    setCbseExaminationListByIdAct: (state, action: PayloadAction<any>) => {
      state.getCbseExaminationListByIdResp = action.payload;
    },
    setSaveCbseExaminationListAct: (state, action: PayloadAction<any>) => {
      state.saveCbseExaminationListResp = action.payload;
    },
    setEditCbseExaminationListAct: (state, action: PayloadAction<any>) => {
      state.editCbseExaminationRequestResp = action.payload;
    },
    setDelCbseExaminationListAct: (state, action: PayloadAction<any>) => {
      state.delCbseExaminationRequestResp = action.payload;
    },
    setChangeDisplayOrderExamAct: (state, action: PayloadAction<any>) => {
      state.changeDisplayOrderExamResp = action.payload;
    },
    setExamCategoryAct: (state, action: PayloadAction<any>) => {
      state.getExamCategoryResp = action.payload;
    },

    // Examination-Weightage
    setCbseWeightageListAct: (state, action: PayloadAction<any>) => {
      state.getCbseWeightageRequestListResp = action.payload;
    },
    setCbseWeightageListByIdAct: (state, action: PayloadAction<any>) => {
      state.getCbseWeightageListByIdResp = action.payload;
    },
    setSaveCbseWeightageListAct: (state, action: PayloadAction<any>) => {
      state.saveCbseWeightageListResp = action.payload;
    },
    setEditCbseWeightageListAct: (state, action: PayloadAction<any>) => {
      state.editCbseWeightageRequestResp = action.payload;
    },
    setDelCbseWeightageListAct: (state, action: PayloadAction<any>) => {
      state.delCbseWeightageRequestResp = action.payload;
    },

    // Examination-Subjects
    setCbseExaminationSubjectsListAct: (state, action: PayloadAction<any>) => {
      state.getCbseExaminationSubjectsRequestListResp = action.payload;
    },
    setChangeDisplayOrderExaminationSubjectsListAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.changeDisplayOrderExaminationSubjectsListResp = action.payload;
    },
    setSubjectsListAct: (state, action: PayloadAction<any>) => {
      state.getSubjectsRequestListResp = action.payload;
    },
    setCbseExaminationSubjectsListByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCbseExaminationSubjectsListByIdResp = action.payload;
    },
    setSaveCbseExaminationSubjectsListAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.saveCbseExaminationSubjectsListResp = action.payload;
    },
    setEditCbseExaminationSubjectsListAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.editCbseExaminationSubjectsRequestResp = action.payload;
    },
    setDelCbseExaminationSubjectsListAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.delCbseExaminationSubjectsRequestResp = action.payload;
    },

    // Examination-Coscholastic-Grades
    setCbseExaminationCoscholasticGradesListAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCbseExaminationCoscholasticGradesRequestListResp =
        action.payload;
    },
    setCoscholasticSubjectsListAct: (state, action: PayloadAction<any>) => {
      state.getCoscholasticSubjectsRequestListResp = action.payload;
    },
    setCbseExaminationCoscholasticGradesListByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCbseExaminationCoscholasticGradesListByIdResp = action.payload;
    },
    setSaveCbseExaminationCoscholasticGradesListAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.saveCbseExaminationCoscholasticGradesListResp = action.payload;
    },
    setEditCbseExaminationCoscholasticGradesListAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.editCbseExaminationCoscholasticGradesRequestResp = action.payload;
    },
    setDelCbseExaminationCoscholasticGradesListAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.delCbseExaminationCoscholasticGradesRequestResp = action.payload;
    },
    setCopyCbseExaminationCoscholasticGradesAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.copyCbseExaminationCoscholasticGradesResp = action.payload;
    },

    // Add Multiple Exam Marks Actions
    setCbseExamiantionMultipleExamMarksAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCbseExaminationMultipleExamMarksResp = action.payload;
    },
    setCbseExamiantionMultipleExamMarksByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCbseExaminationMultipleExamMarksByIdResp = action.payload;
    },
    setSaveCbseExamiantionMultipleExamMarksAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.saveCbseExaminationMultipleExamMarksResp = action.payload;
    },
    setEditCbseExamiantionMultipleExamMarksByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.editCbseExaminationMultipleExamMarksByIdResp = action.payload;
    },
    setDeleteCbseExamiantionMultipleExamMarksByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.deleteCbseExaminationMultipleExamMarksByIdResp = action.payload;
    },

    //OverAllGrades
    setCbseExaminationOverAllGradesAct: (state, action: PayloadAction<any>) => {
      state.getCbseExaminationOverAllGradesResp = action.payload;
    },
    setCbseExaminationOverAllGradesByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCbseExaminationOverAllGradesByIdResp = action.payload;
    },
    setSaveCbseExaminationOverAllGradesByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.saveCbseExaminationOverAllGradesResp = action.payload;
    },
    setEditCbseExaminationOverAllGradesByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.editCbseExaminationOverAllGradesByIdResp = action.payload;
    },
    setDeleteCbseExaminationOverAllGradesByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.deleteCbseExaminationOverAllGradesByIdResp = action.payload;
    },
    setCopyCbseExaminationOverAllGradesAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.copyCbseExaminationOverAllGradesResp = action.payload;
    },
    setOverallGradeColorListAct: (state, action: PayloadAction<any>) => {
      state.getOverallGradeColorListResp = action.payload;
    },
    setSaveOverallGradeColorAct: (state, action: PayloadAction<any>) => {
      state.saveOverallGradeColorResp = action.payload;
    },

    //Examination-Marks
    setCbseExaminationMarksAct: (state, action: PayloadAction<any>) => {
      state.getCbseExaminationMarksListResp = action.payload;
    },
    setCbseExaminationMarksByIdAct: (state, action: PayloadAction<any>) => {
      state.getCbseExaminationMarksByIdResp = action.payload;
    },
    setSaveCbseExaminationMarksByIdAct: (state, action: PayloadAction<any>) => {
      state.saveCbseExaminationMarksResp = action.payload;
    },
    setEditCbseExaminationMarksByIdAct: (state, action: PayloadAction<any>) => {
      state.editCbseExaminationMarksByIdResp = action.payload;
    },
    setDeleteCbseExaminationMarksByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.deleteCbseExaminationMarksByIdResp = action.payload;
    },
    setCbseExaminationSubjectOrderAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCbseExaminationSubjectOrderResp = action.payload;
    },
    setCBSEAllSubjectsOrderAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCBSEAllSubjectsOrderResp = action.payload;
    },
    setSaveCbseExaminationSubjectOrderAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.saveCbseExaminationSubjectOrderResp = action.payload;
    },
    setUpdateCbseExaminationSubjectOrderAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.updateCbseExaminationSubjectOrderResp = action.payload;
    },

    //Skill Entry
    setSkillEntryListAct: (state, action: PayloadAction<any>) => {
      state.getSkillEntryListResp = action.payload;
    },

    setSaveSkillEntryAct: (state, action: PayloadAction<any>) => {
      state.saveSkillEntryResp = action.payload;
    },
    setDeleteSkillEntryAct: (state, action: PayloadAction<any>) => {
      state.deleteSkillEntryResp = action.payload;
    },
    setSkillEntryByIdAct: (state, action: PayloadAction<any>) => {
      state.getSkillEntryByIdResp = action.payload;
    },
    setUpdateSkillEntryAct: (state, action: PayloadAction<any>) => {
      state.updateSkillEntryResp = action.payload;
    },

    //Ao Mapping
    setSubjectListAct: (state, action: PayloadAction<any>) => {
      state.getSubjectListResp = action.payload;
    },
    resetSubjectListAct: (state, action: PayloadAction<any>) => {
      state.getSubjectListResp = action.payload;
    },
    setAoMappingSubjectAct: (state, action: PayloadAction<any>) => {
      state.getAoMappingSubjectResp = action.payload;
    },
    setSaveAoMappingSubjectAct: (state, action: PayloadAction<any>) => {
      state.saveAoMappingSubjectResp = action.payload;
    },
    setDeleteAoMappingSubjectAct: (state, action: PayloadAction<any>) => {
      state.deleteAoMappingSubjectResp = action.payload;
    },
    setUpdateAoMappingSubjectAct: (state, action: PayloadAction<any>) => {
      state.updateAoMappingSubjectResp = action.payload;
    },
    setAoMappingSubjectByIdAct: (state, action: PayloadAction<any>) => {
      state.getAoMappingSubjectByIdResp = action.payload;
    },
    setModelSubjectListAct: (state, action: PayloadAction<any>) => {
      state.getModelSubjectListResp = action.payload;
    },

    //signature
    setSignatureListAct: (state, action: PayloadAction<any>) => {
      state.getSignatureListResp = action.payload;
    },
    setSaveSignatureAct: (state, action: PayloadAction<any>) => {
      state.saveSignatureResp = action.payload;
    },
    setUpdateSignatureAct: (state, action: PayloadAction<any>) => {
      state.updateSignatureResp = action.payload;
    },
    setDeleteSignatureAct: (state, action: PayloadAction<any>) => {
      state.deleteSignatureResp = action.payload;
    },

    // IGSE Settings

    //Term Name
    setIgseTermNameListAct: (state, action: PayloadAction<any>) => {
      state.getIgseTermNameListResp = action.payload;
    },
    setCopyIgseTermNameListAct: (state, action: PayloadAction<any>) => {
      state.getCopyIgseTermNameListResp = action.payload;
    },
    resetIgseTermNameListAct: (state, action: PayloadAction<any>) => {
      state.getIgseTermNameListResp = action.payload;
    },
    setSaveIgseTermNameAct: (state, action: PayloadAction<any>) => {
      state.saveIgseTermNameResp = action.payload;
    },
    setIgseTermNameByIdAct: (state, action: PayloadAction<any>) => {
      state.getIgseTermNameByIdResp = action.payload;
    },
    setUpdateIgseTermNameByIdAct: (state, action: PayloadAction<any>) => {
      state.updateIgseTermNameByIdResp = action.payload;
    },
    setDeleteIgseTermNameByIdAct: (state, action: PayloadAction<any>) => {
      state.deleteIgseTermNameByIdResp = action.payload;
    },

    //Term Details
    setIgseTermDetailsListAct: (state, action: PayloadAction<any>) => {
      state.getIgseTermDetailsListResp = action.payload;
    },
    setIgseTermDetailsByIdAct: (state, action: PayloadAction<any>) => {
      state.getIgseTermDetailsByIdResp = action.payload;
    },
    setSaveIgseTermDetailsAct: (state, action: PayloadAction<any>) => {
      state.saveIgseTermDetailsResp = action.payload;
    },
    setUpdateIgseTermDetailsByIdAct: (state, action: PayloadAction<any>) => {
      state.updateIgseTermDetailsByIdResp = action.payload;
    },
    setDeleteIgseTermDetailsByIdAct: (state, action: PayloadAction<any>) => {
      state.deleteIgseTermDetailsByIdResp = action.payload;
    },

    // Internal Subject Grades
    setCbseInternalSubjectsGradesListResp: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCbseInternalSubjectsGradesListResp = action.payload;
    },
    setSaveCbseInternalSubjectsGradesListResp: (
      state,
      action: PayloadAction<any>
    ) => {
      state.saveCbseInternalSubjectsGradesListResp = action.payload;
    },
    setEditCbseInternalSubjectsGradesListResp: (
      state,
      action: PayloadAction<any>
    ) => {
      state.editCbseInternalSubjectsGradesListResp = action.payload;
    },
    setDeleteCbseInternalSubjectsGradesListResp: (
      state,
      action: PayloadAction<any>
    ) => {
      state.deleteCbseInternalSubjectsGradesListResp = action.payload;
    },
    setCbseInternalSubjectsGradesListByIdResp: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getCbseInternalSubjectsGradesListByIdResp = action.payload;
    },
    setCopyCbseInternalSubjectsGradesListResp: (
      state,
      action: PayloadAction<any>
    ) => {
      state.copyCbseInternalSubjectsGradesListResp = action.payload;
    },
    setExaminationListAct: (state, action: PayloadAction<any>) => {
      state.getExaminationListResp = action.payload;
    },
    setPercentageSlabsListAct: (state, action: PayloadAction<any>) => {
      state.getPercentageSlabsListResp = action.payload;
    },
    setSavePercentageSlabsListAct: (state, action: PayloadAction<any>) => {
      state.savePercentageSlabsListResp = action.payload;
    },
    setEditPercentageSlabsListAct: (state, action: PayloadAction<any>) => {
      state.editPercentageSlabsListResp = action.payload;
    },
    setDeletePercentageSlabsListAct: (state, action: PayloadAction<any>) => {
      state.deletePercentageSlabsListResp = action.payload;
    },

    //Area of Strength Focus
    setAreaofStrengthFocusListAct: (state, action: PayloadAction<any>) => {
      state.getAreaofStrengthFocusListResp = action.payload;
    },
    setSaveAreaofStrengthFocusAct: (state, action: PayloadAction<any>) => {
      state.saveAreaofStrengthFocusResp = action.payload;
    },
    setAreaofStrengthFocusByIdAct: (state, action: PayloadAction<any>) => {
      state.getAreaofStrengthFocusByIdResp = action.payload;
    },
    setUpdateAreaofStrengthFocusAct: (state, action: PayloadAction<any>) => {
      state.updateAreaofStrengthFocusResp = action.payload;
    },
    setHolisticDomainAct: (state, action: PayloadAction<any>) => {
      state.getHolisticDomainResp = action.payload;
    },
    setHolisticDomainModelAct: (state, action: PayloadAction<any>) => {
      state.getHolisticDomainModelResp = action.payload;
    },
    setSaveHolisticDomainAct: (state, action: PayloadAction<any>) => {
      state.saveHolisticDomainResp = action.payload;
    },
    setUpdateHolisticDomainAct: (state, action: PayloadAction<any>) => {
      state.updateHolisticDomainResp = action.payload;
    },
    setSaveDomainOrderAct: (state, action: PayloadAction<any>) => {
      state.saveDomainOrderResp = action.payload;
    },
    setDeleteHolisticDomainAct: (state, action: PayloadAction<any>) => {
      state.deleteHolisticDomainResp = action.payload;
    },

    //holistic activity
    setHolisticActivityAct: (state, action: PayloadAction<any>) => {
      state.getHolisticActivityResp = action.payload;
    },
    setSaveHolisticActivityAct: (state, action: PayloadAction<any>) => {
      state.saveHolisticActivityResp = action.payload;
    },
    setUpdateHolisticActivityAct: (state, action: PayloadAction<any>) => {
      state.updateHolisticActivityResp = action.payload;
    },
    setDeleteHolisticActivityAct: (state, action: PayloadAction<any>) => {
      state.deleteHolisticActivityResp = action.payload;
    },
    setClassInstituteIdAct: (state, action: PayloadAction<any>) => {
      state.getClassInstituteIdResp = action.payload;
    },
    setActivityClassAct: (state, action: PayloadAction<any>) => {
      state.getActivityClassResp = action.payload;
    },
    setInstituteClassAct: (state, action: PayloadAction<any>) => {
      state.getInstituteClassResp = action.payload;
    },
    setClassesByStageAct: (state, action: PayloadAction<any>) => {
      state.getClassesByStageResp = action.payload;
    },
    setCopyClassesByStageAct: (state, action: PayloadAction<any>) => {
      state.getCopyClassesByStageResp = action.payload;
    },

    //holistic domain activity
    setHolisticDomainActivityAct: (state, action: PayloadAction<any>) => {
      state.getHolisticDomainActivityResp = action.payload;
    },
    setSaveHolisticDomainActivityAct: (state, action: PayloadAction<any>) => {
      state.saveHolisticDomainActivityResp = action.payload;
    },
    setDeleteHolisticDomainActivityAct: (state, action: PayloadAction<any>) => {
      state.deleteHolisticDomainActivityResp = action.payload;
    },
    setActivityBranchAct: (state, action: PayloadAction<any>) => {
      state.getActivityBranchResp = action.payload;
    },
    setActivityByIdAct: (state, action: PayloadAction<any>) => {
      state.getActivityByIdResp = action.payload;
    },
    setCopyHolisticActivityAct: (state, action: PayloadAction<any>) => {
      state.copyHolisticActivityResp = action.payload;
    },

    //holistic Curriculum Goals

    setHolisticCurriculumGoalsAct: (state, action: PayloadAction<any>) => {
      state.getHolisticCurriculumGoalsResp = action.payload;
    },
    setSaveHolisticCurriculumGoalsAct: (state, action: PayloadAction<any>) => {
      state.saveHolisticCurriculumGoalsResp = action.payload;
    },
    setUpdateHolisticCurriculumGoalsAct: (state, action: PayloadAction<any>) => {
      state.updateHolisticCurriculumGoalsResp = action.payload;
    },


    //Report Card Settings
    setReportCardSettingsAct: (state, action: PayloadAction<any>) => {
      state.getReportCardSettingsResp = action.payload;
    },
    setReportCardConfigAct: (state, action: PayloadAction<any>) => {
      state.reportCardConfigResp = action.payload;
    },
    setSaveReportCardSettingsAct: (state, action: PayloadAction<any>) => {
      state.saveReportCardSettingsResp = action.payload;
    },
    setDeleteReportCardSettingsAct: (state, action: PayloadAction<any>) => {
      state.deleteReportCardSettingsResp = action.payload;
    },


    // -----Preparatory-----

    //Preparatory domain
    setPreparatoryDomainAct:(state, action: PayloadAction<any>) => {
      state.getPreparatoryDomainResp = action.payload
    },
    setPreparatoryDomainModelAct:(state, action: PayloadAction<any>) => {
      state.getPreparatoryDomainModelResp = action.payload
    },
    setSavePreparatoryDomainAct: (state, action: PayloadAction<any>) => {
      state.savePreparatoryDomainResp = action.payload;
    },
    setUpdatePreparatoryDomainAct: (state, action: PayloadAction<any>) => {
      state.updatePreparatoryDomainResp = action.payload;
    },
    setSavePreparatoryDomainOrderAct: (state, action: PayloadAction<any>) => {
      state.savePreparatoryDomainOrderResp = action.payload;
    },
    setDeletePreparatoryDomainAct: (state, action: PayloadAction<any>) => {
      state.deletePreparatoryDomainResp = action.payload;
    },

    //preparatory Curriculum Goals
    setPreparatoryCurriculumGoalsAct: (state, action: PayloadAction<any>) => {
      state.getPreparatoryCurriculumGoalsResp = action.payload;
    },
    setSavePreparatoryCurriculumGoalsAct: (state, action: PayloadAction<any>) => {
      state.savePreparatoryCurriculumGoalsResp = action.payload;
    },
    setUpdatePreparatoryCurriculumGoalsAct: (state, action: PayloadAction<any>) => {
      state.updatePreparatoryCurriculumGoalsResp = action.payload;
    },
    
    //garde entry
    setPreparatoryGradeEntryListAct: (state, action: PayloadAction<any>) => {
      state.getPreparatoryGradeEntryListResp = action.payload;
    },
    setSavePreparatoryGradeEntryListAct: (state, action: PayloadAction<any>) => {
      state.savePreparatoryGradeEntryListResp = action.payload;
    },
    setPreparatoryGradeEntryListByIdAct: (state, action: PayloadAction<any>) => {
      state.getPreparatoryGradeEntryListByIdResp = action.payload;
    },
    setUpdatePreparatoryGradeEntryListAct: (state, action: PayloadAction<any>) => {
      state.updatePreparatoryGradeEntryListResp = action.payload;
    },
    
    //preparatory student surrounding
    setSavePreparatoryStudentSurroundingAct: (state, action: PayloadAction<any>) => {
      state.savePreparatoryStudentSurroundingResp = action.payload;
    },
    setSavePreparatoryStudentFeedbackAct: (state, action: PayloadAction<any>) => {
      state.savePreparatoryStudentFeedbackResp = action.payload;
    },
    setSavePreparatoryParentFeedbackAct: (state, action: PayloadAction<any>) => {
      state.savePreparatoryParentFeedbackResp = action.payload;
    },

    //preparatory activity
    setPreparatoryActivityAct: (state, action: PayloadAction<any>) => {
      state.getPreparatoryActivityResp = action.payload;
    },
    setSavePreparatoryActivityAct: (state, action: PayloadAction<any>) => {
      state.savePreparatoryActivityResp = action.payload;
    },
    setUpdatePreparatoryActivityAct: (state, action: PayloadAction<any>) => {
      state.updatePreparatoryActivityResp = action.payload;
    },
    setDeletePreparatoryActivityAct: (state, action: PayloadAction<any>) => {
      state.deletePreparatoryActivityResp = action.payload;
    },
    setPreparatoryActivityByIdAct: (state, action: PayloadAction<any>) => {
      state.getPreparatoryActivityByIdResp = action.payload;
    },
     setPreparatoryDomainStudentsAct: (state, action: PayloadAction<any>) => {
      state.getPreparatoryDomainStudentsResp = action.payload;
    },
     setSavePreparatoryDomainStudentsAct: (state, action: PayloadAction<any>) => {
      state.savePreparatoryDomainStudentsResp = action.payload;
    },
     setUpdatePreparatoryDomainStudentsAct: (state, action: PayloadAction<any>) => {
      state.updatePreparatoryDomainStudentsResp = action.payload;
     },
     setPreparatorySummaryByIdAct: (state, action: PayloadAction<any>) => {
      state.getPreparatorySummaryByIdResp = action.payload;
     },
     setSavePreparatorySummaryAct: (state, action: PayloadAction<any>) => {
      state.savePreparatorySummaryResp = action.payload;
     },
     setPreparatoryStatusAct: (state, action: PayloadAction<any>) => {
      state.getPreparatoryStatusResp = action.payload;
     },
     setSavePrepartoryParentCollectionAct: (state, action: PayloadAction<any>) => {
      state.savePrepartoryParentCollectionResp = action.payload;
     },
     setExportPreparatoryGradeEntryListAct: (state, action: PayloadAction<any>) => {
      state.exportPreparatoryGradeEntryListResp = action.payload;
     },
     setCopyPreparatoryGradeEntryStudentDetailsAct: (state, action: PayloadAction<any>) => {
      state.copyPreparatoryGradeEntryStudentDetailsResp = action.payload;
     },
     setCopyPreparatoryActivityAct: (state, action: PayloadAction<any>) => {
      state.copyPreparatoryActivityResp = action.payload;
     },

    // IGSE Skill Attribute Settings
    setSkillAttributeSettingsListAct: (state, action: PayloadAction<any>) => {
      state.getSkillAttributeSettingsListResp = action.payload;
    },

    setSkillAttributeSettingsItemByIdAct: (state, action: PayloadAction<any>) => {
      state.getSkillAttributeSettingsItemByIdResp = action.payload;
    },
    setSaveSkillAttributeSettingsItemAct: (state, action: PayloadAction<any>) => {
      state.saveSkillAttributeSettingsItemResp = action.payload;
    },
    setUpdateSkillAttributeSettingsItemAct: (state, action: PayloadAction<any>) => {
      state.updateSkillAttributeSettingsItemResp = action.payload;
    },
    setDeleteSkillAttributeSettingsItemAct: (state, action: PayloadAction<any>) => {
      state.deleteSkillAttributeSettingsItemResp = action.payload;
    },
    setSaveSetSkillOrderAct: (state, action: PayloadAction<any>) => {
      state.saveSetSkillOrderResp = action.payload;
    },
    setSaveSetSkillAttributeOrderAct: (state, action: PayloadAction<any>) => {
      state.saveSetSkillAttributeOrderResp = action.payload;
    },
    // Error
    setCbseExaminationErrorAct: (state, action: PayloadAction<any>) => {
      state.cbseExaminationErrorAct = action.payload;
    },
  },
});

export const {
  //Cbse Settings

  // Examination-Tab
  setCbseExaminationListAct,
  setExaminationTermListAct,
  setCbseExaminationListByIdAct,
  setSaveCbseExaminationListAct,
  setEditCbseExaminationListAct,
  setDelCbseExaminationListAct,
  setChangeDisplayOrderExamAct,
  setExamCategoryAct,

  // Examination-Weightage
  setCbseWeightageListAct,
  setCbseWeightageListByIdAct,
  setSaveCbseWeightageListAct,
  setEditCbseWeightageListAct,
  setDelCbseWeightageListAct,

  // Examination-Subjects
  setCbseExaminationSubjectsListAct,
  setChangeDisplayOrderExaminationSubjectsListAct,
  setSubjectsListAct,
  setCbseExaminationSubjectsListByIdAct,
  setSaveCbseExaminationSubjectsListAct,
  setEditCbseExaminationSubjectsListAct,
  setDelCbseExaminationSubjectsListAct,

  // Examination-Coscholastic-Grades
  setCbseExaminationCoscholasticGradesListAct,
  setCoscholasticSubjectsListAct,
  setCbseExaminationCoscholasticGradesListByIdAct,
  setSaveCbseExaminationCoscholasticGradesListAct,
  setEditCbseExaminationCoscholasticGradesListAct,
  setDelCbseExaminationCoscholasticGradesListAct,
  setCopyCbseExaminationCoscholasticGradesAct,

  //Add multiple exam marks
  setCbseExamiantionMultipleExamMarksAct,
  setCbseExamiantionMultipleExamMarksByIdAct,
  setSaveCbseExamiantionMultipleExamMarksAct,
  setEditCbseExamiantionMultipleExamMarksByIdAct,
  setDeleteCbseExamiantionMultipleExamMarksByIdAct,

  // OverAllGrades
  setCbseExaminationOverAllGradesAct,
  setCbseExaminationOverAllGradesByIdAct,
  setSaveCbseExaminationOverAllGradesByIdAct,
  setEditCbseExaminationOverAllGradesByIdAct,
  setDeleteCbseExaminationOverAllGradesByIdAct,
  setCopyCbseExaminationOverAllGradesAct,
  setOverallGradeColorListAct,
  setSaveOverallGradeColorAct,

  // Examination-Marks
  setCbseExaminationMarksAct,
  setCbseExaminationMarksByIdAct,
  setSaveCbseExaminationMarksByIdAct,
  setEditCbseExaminationMarksByIdAct,
  setDeleteCbseExaminationMarksByIdAct,

  // Skill Entry
  setSkillEntryListAct,
  setSaveAoMappingSubjectAct,
  setSaveSkillEntryAct,
  setDeleteSkillEntryAct,
  setSkillEntryByIdAct,
  setUpdateSkillEntryAct,

  // Ao Mapping
  setSubjectListAct,
  resetSubjectListAct,
  setAoMappingSubjectAct,
  setDeleteAoMappingSubjectAct,
  setUpdateAoMappingSubjectAct,
  setAoMappingSubjectByIdAct,
  setModelSubjectListAct,

  //signature
  setSignatureListAct,
  setSaveSignatureAct,
  setUpdateSignatureAct,
  setDeleteSignatureAct,

  // IGSE Settings
  //Term Name
  setIgseTermNameListAct,
  setCopyIgseTermNameListAct,
  setSaveIgseTermNameAct,
  resetIgseTermNameListAct,
  setIgseTermNameByIdAct,
  setUpdateIgseTermNameByIdAct,
  setDeleteIgseTermNameByIdAct,

  //Term Details
  setIgseTermDetailsListAct,
  setIgseTermDetailsByIdAct,
  setSaveIgseTermDetailsAct,
  setUpdateIgseTermDetailsByIdAct,
  setDeleteIgseTermDetailsByIdAct,

  //Internal Subject Grades
  setCopyCbseInternalSubjectsGradesListResp,
  setDeleteCbseInternalSubjectsGradesListResp,
  setEditCbseInternalSubjectsGradesListResp,
  setCbseInternalSubjectsGradesListByIdResp,
  setCbseInternalSubjectsGradesListResp,
  setSaveCbseInternalSubjectsGradesListResp,

  setExaminationListAct,
  setPercentageSlabsListAct,
  setSavePercentageSlabsListAct,
  setEditPercentageSlabsListAct,
  setDeletePercentageSlabsListAct,

  //Area of Strength Focus
  setAreaofStrengthFocusListAct,
  setAreaofStrengthFocusByIdAct,
  setSaveAreaofStrengthFocusAct,
  setUpdateAreaofStrengthFocusAct,

  // Holistic Domain
  setHolisticDomainAct,
  setHolisticDomainModelAct,
  setSaveHolisticDomainAct,
  setUpdateHolisticDomainAct,
  setSaveDomainOrderAct,
  setDeleteHolisticDomainAct,
  setCbseExaminationSubjectOrderAct,
  setCBSEAllSubjectsOrderAct,
  setSaveCbseExaminationSubjectOrderAct,
  setUpdateCbseExaminationSubjectOrderAct,

  //holistic Activity
  setHolisticActivityAct,
  setSaveHolisticActivityAct,
  setUpdateHolisticActivityAct,
  setDeleteHolisticActivityAct,
  setClassInstituteIdAct,
  setActivityBranchAct,
  setActivityClassAct,
  setActivityByIdAct,
  setInstituteClassAct,
  setClassesByStageAct,
  setCopyClassesByStageAct,
  setCopyHolisticActivityAct,

  // holistic domain activity
  setHolisticDomainActivityAct,
  setSaveHolisticDomainActivityAct,
  setDeleteHolisticDomainActivityAct,

  //holistic Curriculum Goals
  setHolisticCurriculumGoalsAct,
  setSaveHolisticCurriculumGoalsAct,
  setUpdateHolisticCurriculumGoalsAct,

  //report card settings
  setReportCardSettingsAct,
  setReportCardConfigAct,
  setSaveReportCardSettingsAct,
  setDeleteReportCardSettingsAct,

  // -----Preparatory-----

  //Preparatory domain
  setPreparatoryDomainAct,
  setPreparatoryDomainModelAct,
  setSavePreparatoryDomainAct,
  setUpdatePreparatoryDomainAct,
  setSavePreparatoryDomainOrderAct,
  setDeletePreparatoryDomainAct,

  //preparatory Curriculum Goals
  setPreparatoryCurriculumGoalsAct,
  setSavePreparatoryCurriculumGoalsAct,
  setUpdatePreparatoryCurriculumGoalsAct,

  //preparatory grade entry
  setPreparatoryGradeEntryListAct,
  setSavePreparatoryGradeEntryListAct,
  setPreparatoryGradeEntryListByIdAct,
  setUpdatePreparatoryGradeEntryListAct,
  setExportPreparatoryGradeEntryListAct,
  setCopyPreparatoryGradeEntryStudentDetailsAct,

  //preparatory student surrounding
  setSavePreparatoryStudentSurroundingAct,
  setSavePreparatoryStudentFeedbackAct,
  setSavePreparatoryParentFeedbackAct,

  //preparatory activity
  setPreparatoryActivityAct,
  setSavePreparatoryActivityAct,
  setUpdatePreparatoryActivityAct,
  setDeletePreparatoryActivityAct,
  setPreparatoryActivityByIdAct,
  setCopyPreparatoryActivityAct,

  //preparatory domain activity
  setPreparatoryDomainStudentsAct,
  setSavePreparatoryDomainStudentsAct,
  setUpdatePreparatoryDomainStudentsAct,
  setPreparatorySummaryByIdAct,
  setSavePreparatorySummaryAct,

  setPreparatoryStatusAct,
  setSavePrepartoryParentCollectionAct,

  // IGSE Skill Attribute Settings
  setSkillAttributeSettingsListAct,
  setSkillAttributeSettingsItemByIdAct,
  setSaveSkillAttributeSettingsItemAct,
  setUpdateSkillAttributeSettingsItemAct,
  setDeleteSkillAttributeSettingsItemAct,
  setSaveSetSkillOrderAct,
  setSaveSetSkillAttributeOrderAct,

  //Error
  setCbseExaminationErrorAct,


} = examinationSettings.actions;

export default examinationSettings.reducer;
