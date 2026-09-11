import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PvaReportsTypes } from "./pvaReportsTypes";

const initialState: PvaReportsTypes = {
  // settings
  getPvaSubjectResp: undefined,
  savePvaSubjectResp: undefined,
  updatePvaSubjectResp: undefined,
  getPvaSubjectByIdResp: undefined,
  deletePvaSubjectResp: undefined,
  getPvaGradeEntrySubjectResp: undefined,

  // PVA Skill Area
  getPvaSkillAreaResp: undefined,
  savePvaSkillAreaResp: undefined,
  getPvaSkillAreaByIdResp: undefined,
  deletePvaSkillAreaResp: undefined,

  //PVA Grades
  getPvaGradesResp: undefined,
  savePvaGradesResp: undefined,
  updatePvaGradesResp: undefined,
  getPvaGradesByIdResp: undefined,
  deletePvaGradesResp: undefined,

  //PVA Subject to Class Mapping
  getPvaSubjecttoClassMappingResp: undefined,
  savePvaSubjecttoClassMappingResp: undefined,
  updatePvaSubjecttoClassMappingResp: undefined,
  getPvaSubjecttoClassMappingByIdResp: undefined,
  deletePvaSubjecttoClassMappingResp: undefined,

  //Management

  //Grade Entry
  getPvaStudentGradeEntryListResp: undefined,
  savePvaStudentGradeEntryListResp: undefined,

  // Green Report Card grade config
  getGreenReportCardGradeConfigResp: undefined,
  getGreenReportCardGradeConfigByIdResp: undefined,
  saveGreenReportCardGradeConfigResp: undefined,
  deleteGreenReportCardGradeConfigResp: undefined,

  // Green Report Card Category
  getGreenReportCardCategoryListResp: undefined,
  getGreenReportCardCategoryByIdResp: undefined,
  saveGreenReportCardCategoryItemResp: undefined,
  updateGreenReportCardCategoryItemResp: undefined,
  deleteGreenReportCardCategoryItemResp: undefined,

  // Green Report Card Management
  getCategorySelectionListResp: undefined,
  saveCategorySelectionResp: undefined,
  getCategorySelectionByIdResp: undefined,
  updateCategorySelectionResp: undefined,
  deleteCategorySelectionResp: undefined,

  //Green Grade Entry
  getAllGreenReportGradeEntryStntsListResp: undefined,
  getGreenReportGradeEntryStntByIdResp: undefined,
  saveGreenReportGradeResp: undefined,

  // --->>> DISCIPLE <<<---

  // Domains
  getDisciplineSettingsDomainsResp:undefined,
  getDisciplineSettingsDomainItemByIdResp:undefined,
  saveDisciplineSettingsDomainItemByIdResp:undefined,
  updateDisciplineSettingsDomainItemByIdResp:undefined,
  delDisciplineSettingsDomainItemByIdResp:undefined,
  
  // Sub Domains
  getDisciplineSettingsSubDomainsResp:undefined,
  getDisciplineSettingsSubDomainItemByIdResp:undefined,
  saveDisciplineSettingsSubDomainItemByIdResp:undefined,
  updateDisciplineSettingsSubDomainItemByIdResp:undefined,
  delDisciplineSettingsSybDomainItemByIdResp:undefined,

  // Grade config
  getDisciplineGradeConfigListResp:undefined,
  saveDisciplineGradeConfigListResp:undefined, 
  delDisciplineGradeConfigListResp:undefined, 

  //Error
  pvaReportsErrorAct: undefined,
};

export const pvaReportsSlice = createSlice({
  name: "pvaReports",
  initialState,
  reducers: {
    //Settings
    setPvaSubjectAct: (state, action: PayloadAction<any>) => {
      state.getPvaSubjectResp = action.payload;
    },
    resetPvaSubjectAct: (state, action: PayloadAction<any>) => {
      state.getPvaSubjectResp = action.payload;
    },
    setSavePvaSubjectAct: (state, action: PayloadAction<any>) => {
      state.savePvaSubjectResp = action.payload;
    },
    setUpdatePvaSubjectAct: (state, action: PayloadAction<any>) => {
      state.updatePvaSubjectResp = action.payload;
    },
    setGetPvaSubjectByIdAct: (state, action: PayloadAction<any>) => {
      state.getPvaSubjectByIdResp = action.payload;
    },
    setDeletePvaSubjectAct: (state, action: PayloadAction<any>) => {
      state.deletePvaSubjectResp = action.payload;
    },
    setPvaGradeEntrySubjectAct: (state, action: PayloadAction<any>) => {
      state.getPvaGradeEntrySubjectResp = action.payload;
    },

    //PVA Skill Area
    setPvaSkillAreaAct: (state, action: PayloadAction<any>) => {
      state.getPvaSkillAreaResp = action.payload;
    },
    resetPvaSkillAreaAct: (state, action: PayloadAction<any>) => {
      state.getPvaSkillAreaResp = action.payload;
    },
    setSavePvaSkillAreaAct: (state, action: PayloadAction<any>) => {
      state.savePvaSkillAreaResp = action.payload;
    },
    setGetPvaSkillAreaByIdAct: (state, action: PayloadAction<any>) => {
      state.getPvaSkillAreaByIdResp = action.payload;
    },
    setDeletePvaSkillAreaAct: (state, action: PayloadAction<any>) => {
      state.deletePvaSkillAreaResp = action.payload;
    },

    //PVA Grades
    setPvaGradesAct: (state, action: PayloadAction<any>) => {
      state.getPvaGradesResp = action.payload;
    },
    setSavePvaGradesAct: (state, action: PayloadAction<any>) => {
      state.savePvaGradesResp = action.payload;
    },
    setUpdatePvaGradesAct: (state, action: PayloadAction<any>) => {
      state.updatePvaGradesResp = action.payload;
    },
    setGetPvaGradesByIdAct: (state, action: PayloadAction<any>) => {
      state.getPvaGradesByIdResp = action.payload;
    },
    setDeletePvaGradesAct: (state, action: PayloadAction<any>) => {
      state.deletePvaGradesResp = action.payload;
    },

    //PVA Subject to Class Mapping
    setPvaSubjecttoClassMappingAct: (state, action: PayloadAction<any>) => {
      state.getPvaSubjecttoClassMappingResp = action.payload;
    },
    resetPvaSubjecttoClassMappingAct: (state, action: PayloadAction<any>) => {
      state.getPvaSubjecttoClassMappingResp = action.payload;
    },
    setSavePvaSubjecttoClassMappingAct: (state, action: PayloadAction<any>) => {
      state.savePvaSubjecttoClassMappingResp = action.payload;
    },
    setUpdatePvaSubjecttoClassMappingAct: (state, action: PayloadAction<any>) => {
      state.updatePvaSubjecttoClassMappingResp = action.payload;
    },
    setGetPvaSubjecttoClassMappingByIdAct: (state, action: PayloadAction<any>) => {
      state.getPvaSubjecttoClassMappingByIdResp = action.payload;
    },
    setDeletePvaSubjecttoClassMappingAct: (state, action: PayloadAction<any>) => {
      state.deletePvaSubjecttoClassMappingResp = action.payload;
    },

    //Management

    //Grade Entry
    setPvaStudentGradeEntryListAct: (state, action: PayloadAction<any>) => {
      state.getPvaStudentGradeEntryListResp = action.payload;
    },
    resetPvaStudentGradeEntryListAct: (state, action: PayloadAction<any>) => {
      state.getPvaStudentGradeEntryListResp = action.payload;
    },
    setSavePvaStudentGradeEntryListAct: (state, action: PayloadAction<any>) => {
      state.savePvaStudentGradeEntryListResp = action.payload;
    },

    setGreenReportCardGradeConfigListAct: (state, action: PayloadAction<any>) => {
      state.getGreenReportCardGradeConfigResp = action.payload;
    },
    setGreenReportCardGradeConfigByIdAct: (state, action: PayloadAction<any>) => {
      state.getGreenReportCardGradeConfigByIdResp = action.payload;
    },
    setSaveGreenReportCardGradeConfigAct: (state, action: PayloadAction<any>) => {
      state.saveGreenReportCardGradeConfigResp = action.payload;
    },
    setDeleteGreenReportCardGradeConfigAct: (state, action: PayloadAction<any>) => {
      state.deleteGreenReportCardGradeConfigResp = action.payload;
    },

    // Green Report Card Category
    setGreenReportCardCategoryListAct: (state, action: PayloadAction<any>) => {
      state.getGreenReportCardCategoryListResp = action.payload;
    },
    setGreenReportCardCategoryByIdAct: (state, action: PayloadAction<any>) => {
      state.getGreenReportCardCategoryByIdResp = action.payload;
    },
    setSaveGreenReportCardCategoryItemAct: (state, action: PayloadAction<any>) => {
      state.saveGreenReportCardCategoryItemResp = action.payload;
    },
    setUpdateGreenReportCardCategoryItemAct: (state, action: PayloadAction<any>) => {
      state.updateGreenReportCardCategoryItemResp = action.payload;
    },
    setDeleteGreenReportCardCategoryItemAct: (state, action: PayloadAction<any>) => {
      state.deleteGreenReportCardCategoryItemResp = action.payload;
    },
    setCategorySelectionListAct: (state, action: PayloadAction<any>) => {
      state.getCategorySelectionListResp = action.payload;
    },
    resetCategorySelectionListAct: (state, action: PayloadAction<any>) => {
      state.getCategorySelectionListResp = action.payload;
    },
    setSaveCategorySelectionAct: (state, action: PayloadAction<any>) => {
      state.saveCategorySelectionResp = action.payload;
    },
    setCategorySelectionByIdAct: (state, action: PayloadAction<any>) => {
      state.getCategorySelectionByIdResp = action.payload;
    },
    setUpdateCategorySelectionAct: (state, action: PayloadAction<any>) => {
      state.updateCategorySelectionResp = action.payload;
    },
    setDeleteCategorySelectionAct: (state, action: PayloadAction<any>) => {
      state.deleteCategorySelectionResp = action.payload;
    },

    setAllGreenReportGradeEntryStntsListAct: (state, action: PayloadAction<any>) => {
      state.getAllGreenReportGradeEntryStntsListResp = action.payload
    },
    resetAllGreenReportGradeEntryStntsListAct: (state, action: PayloadAction<any>) => {
      state.getAllGreenReportGradeEntryStntsListResp = action.payload
    },
    setGreenReportGradeEntryStntByIdAct:(state, action: PayloadAction<any>) => {
      state.getGreenReportGradeEntryStntByIdResp = action.payload
    },
    setSaveGreenReportGradeAct:(state, action: PayloadAction<any>) => {
      state.saveGreenReportGradeResp = action.payload
    },

    setDisciplineSettingsDomainsAct : (state, action: PayloadAction<any>)=>{
      state.getDisciplineSettingsDomainsResp = action.payload
    },
    setDisciplineSettingsDomainItemByIdAct : (state, action: PayloadAction<any>)=>{
      state.getDisciplineSettingsDomainItemByIdResp = action.payload
    },
    setSaveDisciplineSettingsDomainItemByIdAct : (state, action: PayloadAction<any>)=>{
      state.saveDisciplineSettingsDomainItemByIdResp = action.payload
    },
    setUpdateDisciplineSettingsDomainItemByIdAct : (state, action: PayloadAction<any>)=>{
      state.updateDisciplineSettingsDomainItemByIdResp = action.payload
    },
    setDelDisciplineSettingsDomainItemByIdAct : (state, action: PayloadAction<any>)=>{
      state.delDisciplineSettingsDomainItemByIdResp = action.payload
    },

    setDisciplineSettingsSubDomainsAct : (state, action: PayloadAction<any>)=>{
      state.getDisciplineSettingsSubDomainsResp = action.payload
    },
    setDisciplineSettingsSubDomainItemByIdAct : (state, action: PayloadAction<any>)=>{
      state.getDisciplineSettingsSubDomainItemByIdResp = action.payload
    },
    setSaveDisciplineSettingsSubDomainItemByIdAct : (state, action: PayloadAction<any>)=>{
      state.saveDisciplineSettingsSubDomainItemByIdResp = action.payload
    },
    setUpdateDisciplineSettingsSubDomainItemByIdAct : (state, action: PayloadAction<any>)=>{
      state.updateDisciplineSettingsSubDomainItemByIdResp = action.payload
    },
    setDelDisciplineSettingsSubDomainItemByIdAct : (state, action: PayloadAction<any>)=>{
      state.delDisciplineSettingsSybDomainItemByIdResp = action.payload
    },
    setDisciplineGradeConfigListAct : (state, action: PayloadAction<any>)=>{
      state.getDisciplineGradeConfigListResp = action.payload
    },
    setSaveDisciplineGradeConfigListAct : (state, action: PayloadAction<any>)=>{
      state.saveDisciplineGradeConfigListResp = action.payload
    },
    setDelDisciplineGradeConfigListAct : (state, action: PayloadAction<any>)=>{
      state.delDisciplineGradeConfigListResp = action.payload
    },

    //Error
    setPvaReportsErrAct: (state, action: PayloadAction<any>) => {
      state.pvaReportsErrorAct = action.payload;
    },
  },
});

export const {
  //Settings
  setPvaSubjectAct,
  setSavePvaSubjectAct,
  setUpdatePvaSubjectAct,
  setGetPvaSubjectByIdAct,
  setDeletePvaSubjectAct,
  setPvaGradeEntrySubjectAct,

  //PVA Skill Area

  setPvaSkillAreaAct,
  setSavePvaSkillAreaAct,
  setGetPvaSkillAreaByIdAct,
  setDeletePvaSkillAreaAct,

  //PVA Grades
  setPvaGradesAct,
  setSavePvaGradesAct,
  setUpdatePvaGradesAct,
  setGetPvaGradesByIdAct,
  setDeletePvaGradesAct,

  //PVA Subject to Class Mapping
  setPvaSubjecttoClassMappingAct,
  setSavePvaSubjecttoClassMappingAct,
  setUpdatePvaSubjecttoClassMappingAct,
  setGetPvaSubjecttoClassMappingByIdAct,
  setDeletePvaSubjecttoClassMappingAct,
  resetPvaSubjectAct,
  resetPvaSkillAreaAct,
  resetPvaSubjecttoClassMappingAct,
  resetPvaStudentGradeEntryListAct,
  //Management

  //Grade Entry
  setPvaStudentGradeEntryListAct,
  setSavePvaStudentGradeEntryListAct,

  // Green Report Card grade config
  setGreenReportCardGradeConfigListAct,
  setGreenReportCardGradeConfigByIdAct,
  setSaveGreenReportCardGradeConfigAct,
  setDeleteGreenReportCardGradeConfigAct,

  // green report card category
  setGreenReportCardCategoryListAct,
  setGreenReportCardCategoryByIdAct,
  setSaveGreenReportCardCategoryItemAct,
  setUpdateGreenReportCardCategoryItemAct,
  setDeleteGreenReportCardCategoryItemAct,

  // Green Report Card Management
  setCategorySelectionListAct,
  resetCategorySelectionListAct,
  setSaveCategorySelectionAct,
  setCategorySelectionByIdAct,
  setUpdateCategorySelectionAct,
  setDeleteCategorySelectionAct,

  //Green Grade Entry
  setAllGreenReportGradeEntryStntsListAct,
  resetAllGreenReportGradeEntryStntsListAct,
  setGreenReportGradeEntryStntByIdAct,
  setSaveGreenReportGradeAct,

  // --->>> DISCIPLE <<<---

  // Domains
  setDisciplineSettingsDomainsAct,
  setDisciplineSettingsDomainItemByIdAct,
  setSaveDisciplineSettingsDomainItemByIdAct,
  setUpdateDisciplineSettingsDomainItemByIdAct,
  setDelDisciplineSettingsDomainItemByIdAct,

  // Sub Domains
  setDisciplineSettingsSubDomainsAct,
  setDisciplineSettingsSubDomainItemByIdAct,
  setSaveDisciplineSettingsSubDomainItemByIdAct,
  setUpdateDisciplineSettingsSubDomainItemByIdAct,
  setDelDisciplineSettingsSubDomainItemByIdAct,

  // Grade Config
  setDisciplineGradeConfigListAct,
  setSaveDisciplineGradeConfigListAct,
  setDelDisciplineGradeConfigListAct,

  //Error
  setPvaReportsErrAct,

} = pvaReportsSlice.actions;
export default pvaReportsSlice.reducer;
