import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IAcademicYearInfo,
  IInstAcademicReducerState,
  IAddAcademicYearModel,
} from "./instacademictypes";
import { IModelWithPagination } from "../../types";

const initialState: IInstAcademicReducerState = {
  academicYearListResp: undefined,

  academicYearsDateListResp: undefined,
  addAcademicYearResp: undefined,
  updateAcademicYearResp: undefined,
  deleteAcademicYearResp: undefined,

  academicTermListResp: undefined,
  addAcademicTermResp: undefined,
  updateAcademicTermResp: undefined,
  deleteAcademicTermResp: undefined,

  termListResp: undefined,
  addTermResp: undefined,
  deleteTermResp: undefined,
  updateTermResp: undefined,

  instCurriculumResp: undefined,
  addCurriculumResp: undefined,
  updateCurriculumResp: undefined,
  deleteCurriculumResp: undefined,

  instClassResp: undefined,
  instClassForBranchResp: undefined,
  instSecondClassResp: undefined,
  addClassResp: undefined,
  updateClassResp: undefined,
  deleteClassResp: undefined,

  curriculumClassResp: undefined,
  addCurriculumClassResp: undefined,
  updateCurriculumClassResp: undefined,
  deleteCurriculumClassResp: undefined,

  modulesListResp: undefined,
  updateModuleResp: undefined,

  instAcademicErrorResp: undefined,
};

export const instAcademicsSlice = createSlice({
  name: "instacademics",
  initialState,
  reducers: {
    setInstAcademicYearAct: (
      state,
      action: PayloadAction<IModelWithPagination<any>>
    ) => {
      state.academicYearListResp = action.payload;
    },
    setInstAcademicYearsDateAct: (
      state,
      action: PayloadAction<IModelWithPagination<IAcademicYearInfo>>
    ) => {
      state.academicYearsDateListResp = action.payload;
    },
    setAddInstAcademicYearAct: (state, action: PayloadAction<any>) => {
      state.addAcademicYearResp = action.payload;
    },
    setUpdateInstAcademicYearAct: (state, action: PayloadAction<any>) => {
      state.updateAcademicYearResp = action.payload;
    },
    setDeleteAcademicYearAct: (state, action: PayloadAction<any>) => {
      state.deleteAcademicYearResp = action.payload;
    },
    setInstAcademicTermAct: (state, action: PayloadAction<any>) => {
      state.academicTermListResp = action.payload;
    },
    setInstTermAct: (state, action: PayloadAction<any>) => {
      state.termListResp = action.payload;
    },
    setAddInstAcademicTermAct: (state, action: PayloadAction<any>) => {
      state.addAcademicTermResp = action.payload;
    },
    setAddInstTermAct: (state, action: PayloadAction<any>) => {
      state.addTermResp = action.payload;
    },
    setUpdateInstAcademicTermAct: (state, action: PayloadAction<any>) => {
      state.updateAcademicTermResp = action.payload;
    },
    setUpdateInstTermAct: (state, action: PayloadAction<any>) => {
      state.updateTermResp = action.payload;
    },
    setDeleteAcademicTermAct: (state, action: PayloadAction<any>) => {
      state.deleteAcademicTermResp = action.payload;
    },
    setDeleteTermAct: (state, action: PayloadAction<any>) => {
      state.deleteTermResp = action.payload;
    },

    setInstCurriculumAct: (state, action: PayloadAction<any>) => {
      state.instCurriculumResp = action.payload;
    },
    setAddInstCurriculumAct: (state, action: PayloadAction<any>) => {
      state.addCurriculumResp = action.payload;
    },
    setUpdateInstCurriculumAct: (state, action: PayloadAction<any>) => {
      state.updateCurriculumResp = action.payload;
    },
    setDeleteCurriculumAct: (state, action: PayloadAction<any>) => {
      state.deleteCurriculumResp = action.payload;
    },

    setInstClassAct: (state, action: PayloadAction<any>) => {
      state.instClassResp = action.payload;
    },

    setInstClassForBranchAct: (state, action: PayloadAction<any>) => {
      state.instClassForBranchResp = action.payload;
    },
    setInstSecondClassAct: (state, action: PayloadAction<any>) => {
      state.instSecondClassResp = action.payload;
    },
    setAddInstClassAct: (state, action: PayloadAction<any>) => {
      state.addClassResp = action.payload;
    },
    setUpdateInstClassAct: (state, action: PayloadAction<any>) => {
      state.updateClassResp = action.payload;
    },
    setDeleteClassAct: (state, action: PayloadAction<any>) => {
      state.deleteClassResp = action.payload;
    },

    setCurriculumClassAct: (state, action: PayloadAction<any>) => {
      state.curriculumClassResp = action.payload;
    },
    resetCurriculumClassAct: (state, action: PayloadAction<any>) => {
      state.curriculumClassResp = action.payload;
    },
    setAddCurriculumClassAct: (state, action: PayloadAction<any>) => {
      state.addCurriculumClassResp = action.payload;
    },
    setUpdateCurriculumClassAct: (state, action: PayloadAction<any>) => {
      state.updateCurriculumClassResp = action.payload;
    },
    setDeleteCurriculumClassAct: (state, action: PayloadAction<any>) => {
      state.deleteCurriculumClassResp = action.payload;
    },
    setModulesListAct: (state, action: PayloadAction<any>) => {
      state.modulesListResp = action.payload;
    },
    setUpdateModuleAct: (state, action: PayloadAction<any>) => {
      state.updateModuleResp = action.payload;
    },

    setInstAcademicsErrorAct: (state, action: PayloadAction<any>) => {
      state.instAcademicErrorResp = action.payload;
    },
  },
});

export const {
  setInstAcademicYearAct,
  setInstAcademicYearsDateAct,
  setAddInstAcademicYearAct,
  setUpdateInstAcademicYearAct,
  setDeleteAcademicYearAct,
  setInstAcademicTermAct,
  setAddInstAcademicTermAct,
  setUpdateInstAcademicTermAct,
  setDeleteAcademicTermAct,

  setInstTermAct,
  setAddInstTermAct,
  setDeleteTermAct,
  setUpdateInstTermAct,

  setInstCurriculumAct,
  setAddInstCurriculumAct,
  setUpdateInstCurriculumAct,
  setDeleteCurriculumAct,
  setInstClassAct,
  setInstClassForBranchAct,
  setInstSecondClassAct,
  setAddInstClassAct,
  setUpdateInstClassAct,
  setDeleteClassAct,

  setCurriculumClassAct,
  setAddCurriculumClassAct,
  setUpdateCurriculumClassAct,
  setDeleteCurriculumClassAct,

  setModulesListAct,
  setUpdateModuleAct,

  resetCurriculumClassAct,

  setInstAcademicsErrorAct,
} = instAcademicsSlice.actions;

export default instAcademicsSlice.reducer;
