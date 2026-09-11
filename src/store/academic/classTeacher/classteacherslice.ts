import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClassTeacherReducerState } from "./classteachertypes";

const initialState: IClassTeacherReducerState = {
  deleteSubjectOfTeacherResp: undefined,
  deleteSubjectOfTeacherErrorResp: undefined,
  subjectTeacherTableData: undefined,
  subjectTeacherTableDataErrorResp: undefined,
  assignSubjectToTeacherResp: undefined,
  updateAssignSubjectToTeacherResp:undefined,
  assignSubjectToTeacherErrorResp: undefined,
};

export const classteacherslice = createSlice({
  name: "classteacher",
  initialState,
  reducers: {
    setDeleteSubjectOfTeacherAct: (state, action: PayloadAction<any>) => {
      state.deleteSubjectOfTeacherResp = action.payload;
    },
    setDeleteSubjectOfTeacherErrorAct: (state, action: PayloadAction<any>) => {
      state.deleteSubjectOfTeacherErrorResp = action.payload;
    },
    setSubjectsOfTeacherTableData: (state, action: PayloadAction<any>) => {
      state.subjectTeacherTableData = action.payload;
    },
    clearSubjectsOfTeacherTableData: (state, action: PayloadAction<any>) => {
      state.subjectTeacherTableData = action.payload;
    },

    setSubjectsOfTeacherTableDataErrorAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.subjectTeacherTableDataErrorResp = action.payload;
    },
    setSubjectToTeacherAct: (state, action: PayloadAction<any>) => {
      state.assignSubjectToTeacherResp = action.payload;
    },
    updateAssignedSubjectToTeacherAct: (state, action: PayloadAction<any>) => {
      state.updateAssignSubjectToTeacherResp = action.payload;
    },

    setSubjectToTeacherErrorAct: (state, action: PayloadAction<any>) => {
      state.assignSubjectToTeacherErrorResp = action.payload;
    },
  },
});

export const {
  setDeleteSubjectOfTeacherAct,
  setDeleteSubjectOfTeacherErrorAct,
  setSubjectsOfTeacherTableData,
  clearSubjectsOfTeacherTableData,
  setSubjectsOfTeacherTableDataErrorAct,
  setSubjectToTeacherAct,
  updateAssignedSubjectToTeacherAct,
  setSubjectToTeacherErrorAct,
} = classteacherslice.actions;

export default classteacherslice.reducer;
