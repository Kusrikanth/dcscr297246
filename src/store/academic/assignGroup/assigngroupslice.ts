import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAssignGroupReducerState } from "./assigngrouptypes";

const initialState: IAssignGroupReducerState = {
  groupStudentListResp: undefined,
  groupStudentListErrorResp: undefined,
  academicDetailsResp: undefined,
  academicDetailsErrorResp: undefined,
  classDetailsResp: undefined,
  classDetailsErrorResp: undefined,
  unassignedGroupStudentListResp: [],
  unassignedGroupStudentListErrorResp: undefined,
  academicSubjectsListResp: undefined,
  academicSubjectsListErrorResp: undefined,
  streamListResp: undefined,
  streamByIdResp: undefined,
  streamListErrorResp: undefined,
  updateClassroomStudentsResp: undefined,
  updateClassroomStudentsErrorResp: undefined,
  removeClassroomStudentsResp: undefined,
  removeClassroomStudentsErrorResp: undefined,
  assignGroupErrorResp: undefined,
};

export const assingroupslice = createSlice({
  name: "assigngroup",
  initialState,
  reducers: {
    setGroupStudentListAct: (state, action: PayloadAction<any>) => {
      state.groupStudentListResp = action.payload;
    },
    clearStudentList: (state, action: PayloadAction<any>) => {
      state.groupStudentListResp = action.payload;
    },
    setGroupStudentListErrorAct: (state, action: PayloadAction<any>) => {
      state.groupStudentListErrorResp = action.payload;
    },
    setAcademicSubjectsListAct: (state, action: PayloadAction<any>) => {
      state.academicSubjectsListResp = action.payload;
    },
    setAcademicSubjectsListErrorAct: (state, action: PayloadAction<any>) => {
      state.academicSubjectsListErrorResp = action.payload;
    },
    setStreamListAct: (state, action: PayloadAction<any>) => {
      state.streamListResp = action.payload;
    },
    resetStreamList: (state, action: PayloadAction<any>) => {
      state.streamListResp = action.payload;
    },
    setStreamByIdAct: (state, action: PayloadAction<any>) => {
      state.streamByIdResp = action.payload;
    },
    setStreamListErrorAct: (state, action: PayloadAction<any>) => {
      state.streamListErrorResp = action.payload;
    },
    setAcademicDetailsAct: (state, action: PayloadAction<any>) => {
      state.academicDetailsResp = action.payload;
    },
    setAcademicDetailsErrorAct: (state, action: PayloadAction<any>) => {
      state.academicDetailsErrorResp = action.payload;
    },
    setClassDetailsAct: (state, action: PayloadAction<any>) => {
      state.classDetailsResp = action.payload;
    },
    setClassDetailsErrorAct: (state, action: PayloadAction<any>) => {
      state.classDetailsErrorResp = action.payload;
    },
    setUnassignedGroupStudentListAct: (state, action: PayloadAction<any>) => {
      state.unassignedGroupStudentListResp = action.payload;
    },
    setUnassignedGroupStudentListErrorAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.unassignedGroupStudentListErrorResp = action.payload;
    },
    setUpdateClassroomStudentsAct: (state, action: PayloadAction<any>) => {
      state.updateClassroomStudentsResp = action.payload;
    },
    setUpdateClassroomStudentsErrorAct: (state, action: PayloadAction<any>) => {
      state.updateClassroomStudentsErrorResp = action.payload;
    },
    setRemoveClassroomStudentsAct: (state, action: PayloadAction<any>) => {
      state.removeClassroomStudentsResp = action.payload;
    },
    setRemoveClassroomStudentsErrorAct: (state, action: PayloadAction<any>) => {
      state.removeClassroomStudentsErrorResp = action.payload;
    },
    resetAssigroupAct:(state, action: PayloadAction<any>) => {
      state.groupStudentListResp=action.payload;
      state.streamListResp=action.payload;
      state.streamByIdResp=action.payload;
      state.unassignedGroupStudentListResp=action.payload;
      state.updateClassroomStudentsResp=action.payload;
      state.removeClassroomStudentsResp=action.payload;
    },
    setAssignGroupErrorAct: (state, action: PayloadAction<any>) => {
      state.assignGroupErrorResp = action.payload;
    },
  },
});

export const {
  setGroupStudentListAct,
  clearStudentList,
  setGroupStudentListErrorAct,
  setAcademicSubjectsListAct,
  setAcademicSubjectsListErrorAct,
  setStreamListAct,
  resetStreamList,
  setStreamByIdAct,
  setStreamListErrorAct,
  setUnassignedGroupStudentListAct,
  setUnassignedGroupStudentListErrorAct,
  setUpdateClassroomStudentsAct,
  setUpdateClassroomStudentsErrorAct,
  setAcademicDetailsAct,
  setAcademicDetailsErrorAct,
  setClassDetailsAct,
  setClassDetailsErrorAct,
  setRemoveClassroomStudentsAct,
  setRemoveClassroomStudentsErrorAct,
  resetAssigroupAct,
  setAssignGroupErrorAct
} = assingroupslice.actions;

export default assingroupslice.reducer;
