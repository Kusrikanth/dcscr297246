import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAssignGroupReducerState } from "./classsubjectstypes";

const initialState: IAssignGroupReducerState = {
  academicSubjectsListResp: [],
  assignedClassSubjectsListResp: [],
  academicSubjectsListErrorResp: undefined,
  updateAcademicSubjectsListResp: undefined,
  updateAcademicSubjectsListErrorResp: undefined,
  deleteClassSubjectsListResp: undefined,

  studentAllocatedSubjectResp: undefined,
  assignSubjectToStudentResp: undefined,
  copyPreviousSubjectAllocationResp: undefined,
  copyToCurrentClassResp: undefined,
  copyToCurrentSectionResp: undefined,
  deleteStudentSubjectAllocationResp: undefined,

  getAssignTeacherListResp: undefined,
  saveSubjectTeacherResp: undefined,

  saveBranchClassLanguagesResp: undefined,
  deleteBranchClassLanguagesResp: undefined,

  classSubjectErrorResp: undefined,
};

export const classsubjectsslice = createSlice({
  name: "assigngroup",
  initialState,
  reducers: {
    setClassSubjectsListAct: (state, action: PayloadAction<any>) => {
      state.academicSubjectsListResp = action.payload;
    },
    setAssignedClassSubjectsListAct: (state, action: PayloadAction<any>) => {
      state.assignedClassSubjectsListResp = action.payload;
    },
    resetAssignedClassSubjectsListAct: (state, action: PayloadAction<any>) => {
      state.assignedClassSubjectsListResp = action.payload;
    },
    setClassSubjectsListErrorAct: (state, action: PayloadAction<any>) => {
      state.academicSubjectsListErrorResp = action.payload;
    },
    updateClassSubjectsListAct: (state, action: PayloadAction<any>) => {
      state.updateAcademicSubjectsListResp = action.payload;
    },
    updateClassSubjectsListErrorAct: (state, action: PayloadAction<any>) => {
      state.updateAcademicSubjectsListErrorResp = action.payload;
    },
    deleteClassSubjectsListAct: (state, action: PayloadAction<any>) => {
      state.deleteClassSubjectsListResp = action.payload;
    },

    setStudentAllocatedSubjectsAct: (state, action: PayloadAction<any>) => {
      state.studentAllocatedSubjectResp = action.payload;
    },
    setAssignSubjectToStudentAct: (state, action: PayloadAction<any>) => {
      state.assignSubjectToStudentResp = action.payload;
    },
    setCopyPreviousSubjectAllocationAct: (state, action: PayloadAction<any>) => {
      state.copyPreviousSubjectAllocationResp = action.payload;
    },

    setCopyToCurrentClassAct: (state, action: PayloadAction<any>) => {
      state.copyToCurrentClassResp = action.payload;
    },
    setCopyToCurrentSectionAct: (state, action: PayloadAction<any>) => {
      state.copyToCurrentSectionResp = action.payload;
    },
    setDeleteStudentSubjectAllocationAct: (state, action: PayloadAction<any>) => {
      state.deleteStudentSubjectAllocationResp = action.payload;
    },

    setAssignTeacherListAct: (state, action: PayloadAction<any>) => {
      state.getAssignTeacherListResp = action.payload;
    },
    setSaveSubjectTeacherAct: (state, action: PayloadAction<any>) => {
      state.saveSubjectTeacherResp = action.payload;
    },

    setSaveBranchClassLanguagesAct: (state, action: PayloadAction<any>) => {
      state.saveBranchClassLanguagesResp = action.payload;
    },
    setDeleteBranchClassLanguagesAct: (state, action: PayloadAction<any>) => {
      state.deleteBranchClassLanguagesResp = action.payload;
    },

    classSubjectErrorAct: (state, action: PayloadAction<any>) => {
      state.classSubjectErrorResp = action.payload;
    },
  },
});

export const {
  setClassSubjectsListAct,
  setAssignedClassSubjectsListAct,
  resetAssignedClassSubjectsListAct,
  setClassSubjectsListErrorAct,
  updateClassSubjectsListAct,
  updateClassSubjectsListErrorAct,
  deleteClassSubjectsListAct,

  setStudentAllocatedSubjectsAct,
  setAssignSubjectToStudentAct,
  setCopyPreviousSubjectAllocationAct,
  setCopyToCurrentClassAct, setCopyToCurrentSectionAct,
  setDeleteStudentSubjectAllocationAct,

  setAssignTeacherListAct,
  setSaveSubjectTeacherAct,

  setSaveBranchClassLanguagesAct,
  setDeleteBranchClassLanguagesAct,
  
  classSubjectErrorAct
} = classsubjectsslice.actions;

export default classsubjectsslice.reducer;
