import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IInstituteDetails,
  IInstinfoReducerState,
  IInstDepartmentInfo,
  IUpdateInstDepartmentResp,
} from "./instituteinfotypes";
import { IResponseErrorModel } from "../../types";
import { IModelWithPagination } from "../../types";

const initialState: IInstinfoReducerState = {
  instituteListResp: undefined,
  createInstituteResp: undefined,
  instDetailsResp: undefined,
  updateInstResp: undefined,
  approvingInstResp: undefined,
  deleteInstResp: undefined,
  uploadInstLogoResp: undefined,

  instDepartmentResp: undefined,
  addInstDepartmentResp: undefined,
  updateInstDepartmentResp: undefined,
  deleteInstDepartmentResp: undefined,
  instMasterFieldsResp: undefined,

  formsAssignedToBranchResp: undefined,
  assignFormToBranchResp: undefined,
  updateFormToBranchResp: undefined,
  deleteFormAssignedToBranchResp: undefined,

  instRoleTypeListResp: undefined,
  addInstRoleTypeResp: undefined,
  updateInstRoleTypeResp: undefined,
  deleteInstRoleTypeResp: undefined,

  getInstRoleTypeV2Resp:undefined,
  addInstRoleTypeV2Resp:undefined,
  updateInstRoleTypeV2Resp:undefined,
  deleteInstRoleTypeV2Resp:undefined,

  getInstRoleV2Resp:undefined,
  addInstRoleV2Resp:undefined,
  updateInstRoleV2Resp:undefined,
  deleteInstRoleV2Resp:undefined,

  globalRecordData: undefined,
  // branchData: undefined,
  numberingSeriesListByBranchId: undefined,
  academicLanguages: undefined,
  addAcademicLanguagesRep: undefined,
  updateAcademicLanguagesRep: undefined,
  deleteAcademicLanguagesRep: undefined,

  instDocumentTypeResp: undefined,

  // academicYearData: undefined,

  // Inst_Subjects
  saveInstSubjectRep: undefined,
  editInstSubjectsRep: undefined,
  getInstSubjectsByIdResp: undefined,
  instInfoError: undefined,
};

export const instituteInfoSlice = createSlice({
  name: "instituteinfo",
  initialState,
  reducers: {
    setInstituteListAct: (state, action: PayloadAction<any>) => {
      state.instituteListResp = action.payload;
    },
    setCreateInstituteAct: (state, action: PayloadAction<any>) => {
      state.createInstituteResp = action.payload;
    },
    setInstituteByIdAct: (state, action: PayloadAction<IInstituteDetails>) => {
      state.instDetailsResp = action.payload;
    },
    setUpdateInstByIdAct: (state, action: PayloadAction<IInstituteDetails>) => {
      state.updateInstResp = action.payload;
    },
    setApprovingInstAct: (state, action: PayloadAction<IInstituteDetails>) => {
      state.approvingInstResp = action.payload;
    },
    setDeleteInstByIdAct: (state, action: PayloadAction<any>) => {
      state.deleteInstResp = action.payload;
    },
    setUploadInstLogoAct: (state, action: PayloadAction<any>) => {
      state.uploadInstLogoResp = action.payload;
    },
    setInstDepartmentAct: (
      state,
      action: PayloadAction<IModelWithPagination<IInstDepartmentInfo>>
    ) => {
      state.instDepartmentResp = action.payload;
    },
    setAddInstDepartmentAct: (
      state,
      action: PayloadAction<IInstDepartmentInfo>
    ) => {
      state.addInstDepartmentResp = action.payload;
    },
    setUpdateInstDepartmentAct: (
      state,
      action: PayloadAction<IUpdateInstDepartmentResp>
    ) => {
      state.updateInstDepartmentResp = action.payload;
    },
    setDeleteInstDepartmentAct: (state, action: PayloadAction<any>) => {
      state.deleteInstDepartmentResp = action.payload;
    },
    setInstMasterFieldsAct: (state, action: PayloadAction<any>) => {
      state.instMasterFieldsResp = action.payload;
    },
    setFormsAssignedToBranchAct: (state, action: PayloadAction<any>) => {
      state.formsAssignedToBranchResp = action.payload;
    },
    setAssignFormToBranchAct: (state, action: PayloadAction<any>) => {
      state.assignFormToBranchResp = action.payload;
    },
    setUpdateFormToBranchAct: (state, action: PayloadAction<any>) => {
      state.updateFormToBranchResp = action.payload;
    },
    setDeleteFormAssignedToBranchAct: (state, action: PayloadAction<any>) => {
      state.deleteFormAssignedToBranchResp = action.payload;
    },
    setInstRoleTypeAct: (state, action: PayloadAction<any>) => {
      state.instRoleTypeListResp = action.payload;
    },
    setAddInstRoleTypeAct: (state, action: PayloadAction<any>) => {
      state.addInstRoleTypeResp = action.payload;
    },
    setUpdateInstRoleTypeAct: (state, action: PayloadAction<any>) => {
      state.updateInstRoleTypeResp = action.payload;
    },
    setDeleteInstRoleTypeAct: (state, action: PayloadAction<any>) => {
      state.deleteInstRoleTypeResp = action.payload;
    },
    setGlobalRecordDataAct: (state, action: PayloadAction<any>) => {
      state.globalRecordData = action.payload;
    },

    setInstRoleTypeV2Act: (state, action: PayloadAction<any>) => {
      state.getInstRoleTypeV2Resp = action.payload;
    },
    setAddInstRoleTypeV2Act: (state, action: PayloadAction<any>) => {
      state.addInstRoleTypeV2Resp = action.payload;
    },
    setUpdateInstRoleTypeV2Act: (state, action: PayloadAction<any>) => {
      state.updateInstRoleTypeV2Resp = action.payload;
    },
    setDeleteInstRoleTypeV2Act: (state, action: PayloadAction<any>) => {
      state.deleteInstRoleTypeV2Resp = action.payload;
    },

    setInstRoleV2Act: (state, action: PayloadAction<any>) => {
      state.getInstRoleV2Resp = action.payload;
    },
    setAddInstRoleV2Act: (state, action: PayloadAction<any>) => {
      state.addInstRoleV2Resp = action.payload;
    },
    setUpdateInstRoleV2Act: (state, action: PayloadAction<any>) => {
      state.updateInstRoleV2Resp = action.payload;
    },
    setDeleteInstRoleV2Act: (state, action: PayloadAction<any>) => {
      state.deleteInstRoleV2Resp = action.payload;
    },
    // setBranchesAct: (state, action: PayloadAction<any>) => {
    //   state.branchData = action.payload;
    // },
    setNumberingSeriesListByBranchIdAct: (
      state,
      action: PayloadAction<any>
    ) => {
      state.numberingSeriesListByBranchId = action.payload;
    },
    setAcademicLanguagesAct: (state, action: PayloadAction<any>) => {
      state.academicLanguages = action.payload;
    },
    addAcademicLanguagesAct: (state, action: PayloadAction<any>) => {
      state.addAcademicLanguagesRep = action.payload;
    },
    updateAcademicLanguagesAct: (state, action: PayloadAction<any>) => {
      state.updateAcademicLanguagesRep = action.payload;
    },
    deleteAcademicLanguagesAct: (state, action: PayloadAction<any>) => {
      state.deleteAcademicLanguagesRep = action.payload;
    }, setInstDocumentTypeAct: (state, action: PayloadAction<any>) => {
      state.instDocumentTypeResp = action.payload;
    },

    //Inst_subjects
    setSaveInstSubjectsResp: (state, action: PayloadAction<any>) => {
      state.saveInstSubjectRep = action.payload;
    },
    setEditInstSubjectsResp: (state, action: PayloadAction<any>) => {
      state.editInstSubjectsRep = action.payload;
    }, setGetInstSubjectsByIdResp: (state, action: PayloadAction<any>) => {
      state.getInstSubjectsByIdResp = action.payload;
    },

    // setAcademicYearAct: (state, action: PayloadAction<any>) => {
    //   state.academicYearData = action.payload;
    // },
    setInstInfoErrorAct: (
      state,
      action: PayloadAction<IResponseErrorModel>
    ) => {
      state.instInfoError = action.payload;
    },
  },
});

export const {
  setInstituteListAct,
  setInstituteByIdAct,
  setCreateInstituteAct,
  setUpdateInstByIdAct,
  setApprovingInstAct,
  setDeleteInstByIdAct,
  setUploadInstLogoAct,
  setInstDepartmentAct,
  setAddInstDepartmentAct,
  setUpdateInstDepartmentAct,
  setDeleteInstDepartmentAct,
  setInstMasterFieldsAct,
  setFormsAssignedToBranchAct,
  setAssignFormToBranchAct,
  setUpdateFormToBranchAct,
  setDeleteFormAssignedToBranchAct,
  setInstRoleTypeAct,
  setAddInstRoleTypeAct,
  setUpdateInstRoleTypeAct,
  setDeleteInstRoleTypeAct,
  setGlobalRecordDataAct,

  setInstRoleTypeV2Act,
  setAddInstRoleTypeV2Act,
  setUpdateInstRoleTypeV2Act,
  setDeleteInstRoleTypeV2Act,

  setInstRoleV2Act,
  setAddInstRoleV2Act,
  setDeleteInstRoleV2Act,
  setUpdateInstRoleV2Act,

  // setBranchesAct,
  setNumberingSeriesListByBranchIdAct,
  setAcademicLanguagesAct,
  addAcademicLanguagesAct,
  updateAcademicLanguagesAct,
  deleteAcademicLanguagesAct,
  // setAcademicYearAct,
  setInstDocumentTypeAct,

  //Inst_Subjects
  setGetInstSubjectsByIdResp,
  setSaveInstSubjectsResp,
  setEditInstSubjectsResp,

  setInstInfoErrorAct,
} = instituteInfoSlice.actions;

export default instituteInfoSlice.reducer;
