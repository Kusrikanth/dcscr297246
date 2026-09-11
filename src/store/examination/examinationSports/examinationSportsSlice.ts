import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExaminationSportsTypes } from "./examinationSportsTypes";

const initialState: ExaminationSportsTypes = {
  // settings
  getSportsNamesResp: undefined,
  getSportsNameByIdResp: undefined,
  saveSportsNameItemResp: undefined,
  editSportsNameItemResp: undefined,
  delSportsNameItemResp: undefined,

  getSportsAttributesListResp: undefined,
  getSportsAttributeByIdResp: undefined,
  saveSportsAttributeItemResp: undefined,
  editSportsAttributeItemResp: undefined,
  delSportsAttributeItemResp: undefined,

  getSportsGradesListResp: undefined,
  getSportsGradeByIdResp: undefined,
  saveSportsGradeItemResp: undefined,
  editSportsGradeItemResp: undefined,
  delSportsGradeItemResp: undefined,

  // Management
  getSportsClassMappingListResp: undefined,
  getSportsClassMappingByIdResp: undefined,
  saveSportsClassMappingItemResp: undefined,
  editSportsClassMappingItemResp: undefined,
  deleteSportsClassMappingResp: undefined,

  getSportsSubAttributeListResp: undefined,
  getSportsSubAttributeItemByIdResp: undefined,
  saveSportsSubAttributeItemResp: undefined,
  editSportsSubAttributeItemResp: undefined,
  delSportsSubAttributeItemResp: undefined,

  getSportsDiscriptionsListResp: undefined,
  saveSportsDiscriptionsListResp: undefined,
  delSportsDiscriptionsItemResp:undefined,

  getSportsClassesListResp: undefined,
  getSubAttributesItemsListResp: undefined,
  getSubAttributesCommonListResp: undefined,
  getSportsunAssignedClassesResp:undefined,

  getAssignSportsToStudentsListResp: undefined,
  getAssignSportsToStudentItemByIdResp: undefined,
  saveAssignSportsToStudentsResp: undefined,
  editAssignSportsToStudentsResp:undefined,
  getNotAssignedStudentsListResp: undefined,

  getExaminationSportsErrResp: undefined,

  // Grade Entry
    getStudentSportsGradeEntryResp : undefined,
    getStudentSportsGradeEntryByIdResp : undefined,
    editStudentSportsGradeEntryResp : undefined,
    saveStudentSportsGradeEntryResp : undefined,
    getSportsMainAttributesWithSubAttributesResp : undefined,

    getSportsClassesListByIdResp : undefined,
  
  // BMI Details
  saveStudentBmiDetailsResp: undefined,

  // sports teacher
  getSportsTeacherListResp: undefined,
  getSportsTeacherByIdResp: undefined,
  saveSportsTeacherResp: undefined,
  editSportsTeacherResp:undefined,
  unAssignSportsTeacherResp: undefined,

  // Sports Progress Card
  getSportsProgressCardListResp: undefined,
  downloadSportsProgressCardResp: undefined,
  getOtherProgressCardAccessResp: undefined,
};

export const examinationSportsSlice = createSlice({
  name: "examinationSports",
  initialState,
  reducers: {
    setSportsNamesAct: (state, action: PayloadAction<any>) => {
      state.getSportsNamesResp = action.payload;
    },
    reSetSportsNamesAct: (state, action: PayloadAction<any>) => {
      state.getSportsNamesResp = action.payload;
    },
    setSportsNameByIdAct: (state, action: PayloadAction<any>) => {
      state.getSportsNameByIdResp = action.payload;
    },
    setSaveSportsNameItemAct: (state, action: PayloadAction<any>) => {
      state.saveSportsNameItemResp = action.payload;
    },
    setEditSportsNameItemAct: (state, action: PayloadAction<any>) => {
      state.editSportsNameItemResp = action.payload;
    },
    setDelSportsNameItemAct: (state, action: PayloadAction<any>) => {
      state.delSportsNameItemResp = action.payload;
    },

    setSportsAttributesListAct: (state, action: PayloadAction<any>) => {
      state.getSportsAttributesListResp = action.payload;
    },
    setSportsAttributeByIdAct: (state, action: PayloadAction<any>) => {
      state.getSportsAttributeByIdResp = action.payload;
    },
    setSaveSportsAttributeItemAct: (state, action: PayloadAction<any>) => {
      state.saveSportsAttributeItemResp = action.payload;
    },
    setEditSportsAttributeItemAct: (state, action: PayloadAction<any>) => {
      state.editSportsAttributeItemResp = action.payload;
    },
    setDelSportsAttributeItemAct: (state, action: PayloadAction<any>) => {
      state.delSportsAttributeItemResp = action.payload;
    },

    setSportsGradesListAct: (state, action: PayloadAction<any>) => {
      state.getSportsGradesListResp = action.payload;
    },
    setSportsGradeItemByIdAct: (state, action: PayloadAction<any>) => {
      state.getSportsGradeByIdResp = action.payload;
    },
    setSaveSportsGradeItemAct: (state, action: PayloadAction<any>) => {
      state.saveSportsGradeItemResp = action.payload;
    },
    setEditSportsGradeItemAct: (state, action: PayloadAction<any>) => {
      state.editSportsGradeItemResp = action.payload;
    },
    setDelSportsGradeItemAct: (state, action: PayloadAction<any>) => {
      state.delSportsGradeItemResp = action.payload;
    },

    // management
    setSportsClassMappingListAct: (state, action: PayloadAction<any>) => {
      state.getSportsClassMappingListResp = action.payload;
    },
    setSportsClassMappingByIdAct: (state, action: PayloadAction<any>) => {
      state.getSportsClassMappingByIdResp = action.payload;
    },
    setSaveSportsClassMappingItemAct: (state, action: PayloadAction<any>) => {
      state.saveSportsClassMappingItemResp = action.payload;
    },
    setEditSportsClassMappingItemAct: (state, action: PayloadAction<any>) => {
      state.editSportsClassMappingItemResp = action.payload;
    },
    setDeleteSportsClassMappingAct: (state, action: PayloadAction<any>) => {
      state.deleteSportsClassMappingResp = action.payload;
    },

    setSportsSubAttributeListAct: (state, action: PayloadAction<any>) => {
      state.getSportsSubAttributeListResp = action.payload;
    },
    setSportsSubAttributeItemByIdAct: (state, action: PayloadAction<any>) => {
      state.getSportsSubAttributeItemByIdResp = action.payload;
    },
    setSaveSportsSubAttributeItemAct: (state, action: PayloadAction<any>) => {
      state.saveSportsSubAttributeItemResp = action.payload;
    },
    setEditSportsSubAttributeItemAct: (state, action: PayloadAction<any>) => {
      state.editSportsSubAttributeItemResp = action.payload;
    },
    setDeleteSportsSubAttributeItemAct:(state,action:PayloadAction<any>) => {
      state.delSportsSubAttributeItemResp = action.payload
    },

    setSportsDiscriptionsListAct: (state, action: PayloadAction<any>) => {
      state.getSportsDiscriptionsListResp = action.payload;
    },
    setSaveSportsDiscriptionsListAct: (state, action: PayloadAction<any>) => {
      state.saveSportsDiscriptionsListResp = action.payload;
    },
    setDelSportsDiscriptionsItemAct: (state, action: PayloadAction<any>) => {
      state.delSportsDiscriptionsItemResp = action.payload;
    },

    // assign sports to students
    setGetAssignSportsToStudentsListAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getAssignSportsToStudentsListResp = action.payload;
    },
    setGetAssignSportsToStudentItemByIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.getAssignSportsToStudentItemByIdResp = action.payload;
    },
    setSaveAssignSportsToStudentsAct: (state, action: PayloadAction<any>) => {
      state.saveAssignSportsToStudentsResp = action.payload;
    },
    setEditAssignSportsToStudentsAct: (state, action: PayloadAction<any>) => {
      state.editAssignSportsToStudentsResp = action.payload;
    },
    setNotAssignedStudentsListAct: (state, action: PayloadAction<any>) => {
      state.getNotAssignedStudentsListResp = action.payload;
    },
    resetNotAssignedStudentsListAct: (state, action: PayloadAction<any>) => {
      state.getNotAssignedStudentsListResp = action.payload;
    },

    setSportsClassesListAct: (state, action: PayloadAction<any>) => {
      state.getSportsClassesListResp = action.payload;
    },
    resetSportsClassesListAct: (state, action: PayloadAction<any>) => {
      state.getSportsClassesListResp = action.payload;
    },
    setSportsClassesListByIdAct : (state, action: PayloadAction<any>) => {
      state.getSportsClassesListByIdResp = action.payload;
    },
    resetSportsClassesListByIdAct : (state, action: PayloadAction<any>) => {
      state.getSportsClassesListByIdResp = action.payload;
    },
    //Grade Entry
    setStudentSportsGradeEntryAct: (state, action: PayloadAction<any>) => {
        state.getStudentSportsGradeEntryResp = action.payload;
    },
    resetStudentSportsGradeEntryAct: (state, action: PayloadAction<any>) => {
        state.getStudentSportsGradeEntryResp = action.payload;
    },
    setStudentSportsGradeEntryByIdAct: (state, action: PayloadAction<any>) => {
        state.getStudentSportsGradeEntryByIdResp = action.payload;
    },
    setEditStudentSportsGradeEntryAct: (state, action: PayloadAction<any>) => {
        state.editStudentSportsGradeEntryResp = action.payload;
    },
    setSaveStudentSportsGradeEntryAct: (state, action: PayloadAction<any>) => {
        state.saveStudentSportsGradeEntryResp = action.payload;
    },
    setSportsMainAttributesWithSubAttributesAct: (state, action: PayloadAction<any>) => {
      state.getSportsMainAttributesWithSubAttributesResp = action.payload;
    },
    resetSportsMainAttributesWithSubAttributesAct: (state, action: PayloadAction<any>) => {
      state.getSportsMainAttributesWithSubAttributesResp = action.payload;
    },
    setSubAttributesItemsListAct: (state, action: PayloadAction<any>) => {
      state.getSubAttributesItemsListResp = action.payload;
    },
    setSubAttributesCommonListAct:(state,action:PayloadAction<any>)=>{
      state.getSubAttributesCommonListResp = action .payload;
    },
    setSportsunAssignedClassesAct : (state, action: PayloadAction<any>) => {
      state.getSportsunAssignedClassesResp = action.payload;
    },
    resetSetSportsunAssignedClassesAct : (state, action: PayloadAction<any>) => {
      state.getSportsunAssignedClassesResp = action.payload;
    },

    setExaminationSportsErrAct: (state, action: PayloadAction<any>) => {
      state.getExaminationSportsErrResp = action.payload;
    },

    setSaveStudentBmiDetailsAct :(state, action: PayloadAction<any>) => {
      state.saveStudentBmiDetailsResp = action.payload;
    },

    // sports teacher
    setSportsTeacherListAct: (state, action: PayloadAction<any>) => {
      state.getSportsTeacherListResp = action.payload;
    },
    setSportsTeacherByIdAct: (state, action: PayloadAction<any>) => {
      state.getSportsTeacherByIdResp = action.payload;
    },
    setSaveSportsTeacherAct: (state, action: PayloadAction<any>) => {
      state.saveSportsTeacherResp = action.payload;
    },
    setEditSportsTeacherAct: (state, action: PayloadAction<any>) => {
      state.editSportsTeacherResp = action.payload;
    },
    setUnAssignSportsTeacherAct: (state, action: PayloadAction<any>) => {
      state.unAssignSportsTeacherResp = action.payload;
    },

    // Sports Progress Card
    setSportsProgressCardListAct: (state, action: PayloadAction<any>) => {
      state.getSportsProgressCardListResp = action.payload;
    },
    setDownloadSportsProgressCardAct: (state, action: PayloadAction<any>) => {
      state.downloadSportsProgressCardResp = action.payload;
    },
    setOtherProgressCardAccessAct: (state, action: PayloadAction<any>) => {
      state.getOtherProgressCardAccessResp = action.payload;
    },

  },
});

export const {
  setSportsNamesAct,
  reSetSportsNamesAct,
  setSportsNameByIdAct,
  setSaveSportsNameItemAct,
  setEditSportsNameItemAct,
  setDelSportsNameItemAct,

  setSportsAttributesListAct,
  setSportsAttributeByIdAct,
  setSaveSportsAttributeItemAct,
  setEditSportsAttributeItemAct,
  setDelSportsAttributeItemAct,

  setSportsGradesListAct,
  setSportsGradeItemByIdAct,
  setSaveSportsGradeItemAct,
  setEditSportsGradeItemAct,
  setDelSportsGradeItemAct,

  setSportsClassMappingListAct,
  setSportsClassMappingByIdAct,
  setSaveSportsClassMappingItemAct,
  setEditSportsClassMappingItemAct,
  setDeleteSportsClassMappingAct,

  setSportsSubAttributeListAct,
  setSportsSubAttributeItemByIdAct,
  setSaveSportsSubAttributeItemAct,
  setEditSportsSubAttributeItemAct,
  setDeleteSportsSubAttributeItemAct,
  setSportsClassesListAct,
  resetSportsClassesListAct,
  setSportsClassesListByIdAct,
  resetSportsClassesListByIdAct,

  setSubAttributesItemsListAct,
  setSubAttributesCommonListAct,
  setSportsunAssignedClassesAct,
  resetSetSportsunAssignedClassesAct,

  setSportsDiscriptionsListAct,
  setSaveSportsDiscriptionsListAct,
  setDelSportsDiscriptionsItemAct,

  // assign sports to students
  setGetAssignSportsToStudentsListAct,
  setGetAssignSportsToStudentItemByIdAct,
  setSaveAssignSportsToStudentsAct,
  setEditAssignSportsToStudentsAct,
  setNotAssignedStudentsListAct,
  resetNotAssignedStudentsListAct,
  setExaminationSportsErrAct,
   // Grade Entry
      setStudentSportsGradeEntryAct,
      resetStudentSportsGradeEntryAct,
      setStudentSportsGradeEntryByIdAct,
      setEditStudentSportsGradeEntryAct,
      setSaveStudentSportsGradeEntryAct,
      setSportsMainAttributesWithSubAttributesAct,
      resetSportsMainAttributesWithSubAttributesAct,
  // BMI Details
  setSaveStudentBmiDetailsAct,

  // sports teacher
  setSportsTeacherListAct,
  setSportsTeacherByIdAct,
  setSaveSportsTeacherAct,
  setEditSportsTeacherAct,
  setUnAssignSportsTeacherAct,

  // Sports Progress Card
  setSportsProgressCardListAct,
  setDownloadSportsProgressCardAct,
  setOtherProgressCardAccessAct,
} = examinationSportsSlice.actions;
export default examinationSportsSlice.reducer;
