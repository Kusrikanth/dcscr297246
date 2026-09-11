import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IMasterFeeSettingsReducerState
} from "./masterfeesettingstypes";
import { IResponseErrorModel } from "../../types";
import { IModelWithPagination } from "../../types";

const initialState: IMasterFeeSettingsReducerState = {
    feeCategoriesResp: undefined,
    addFeeCategoryResp: undefined,
    updateFeeCategoryResp: undefined,
    deleteFeeCategoryResp: undefined,
    feeTypesResp: undefined,
    feeTypeByIdResp: undefined,
    addFeeTypesResp: undefined,
    updateFeeTypeResp: undefined,
    deleteFeeTypeResp: undefined,
    feeParticularsResp: undefined,
    feeParticularByIdResp: undefined,
    addFeeParticularResp: undefined,
    updateFeeParticularResp: undefined,
    deleteFeeParticularResp: undefined,

    specialFeesResp: undefined,
    specialFeeByIdResp: undefined,
    addSpecialFeeResp: undefined,
    updateSpecialFeeResp: undefined,
    deleteSpecialFeeResp: undefined,
    updateSpecialFeeStatusResp: undefined,

    specialfeeNamesResp:undefined,
    specialfeeNameByIdResp:undefined,
    addSpecialfeeNameItemsResp:undefined,
    updateSpecialfeeNameItemResp:undefined,
    delSpecialfeeNameItemResp:undefined,
    specialfFeeBulkUploadResp:undefined,

    feeFinesResp: undefined,
    addFeeFineResp: undefined,
    updateFeeFineResp: undefined,
    deleteFeeFineResp: undefined,

    feeConcessionsResp: undefined,
    addFeeConcessionResp: undefined,
    updateFeeConcessionResp: undefined,
    deleteFeeConcessionResp: undefined,

    transportFeeConcessionsResp: undefined,
    addTransportFeeConcessionResp: undefined,
    updateTransportFeeConcessionResp: undefined,
    deleteTransportFeeConcessionResp: undefined,

    feeStructuresResp: undefined,
    feeStructureByIdResp: undefined,
    feeStructureForClassResp: undefined,
    addFeeStructureResp: undefined,
    updateFeeStructureResp: undefined,
    deleteFeeStructureResp: undefined,

    feeReceiptsResp: undefined,
    addFeeReceiptResp: undefined,
    updateFeeReceiptesp: undefined,
    deleteFeeReceiptResp: undefined,

    getSpecialFeePaymentListResp: undefined,
    getSpecialFeeCategoryListResp: undefined,
    getConcessionDashboardDataListResp: undefined,
    getStudentConcessionListResp: undefined,
    exportStuConcessionDetailsResp: undefined,

    addFeeConcessionTypeResp: undefined,
    getFeeConcessionTypeListResp: undefined,
    updateFeeConcessionTypeResp: undefined,
    deleteFeeConcessionTypeResp: undefined,
    getJodoFeeStructureResp: undefined,

    masterFeeSettingsErrorResp: undefined,
};

export const masterFeeSettings = createSlice({
    name: "masterfeesettings",
    initialState,
    reducers: {
        setFeeCategoriesAct: (state, action: PayloadAction<any>) => {
            state.feeCategoriesResp = action.payload;
        },
        setAddFeeCategoryAct: (state, action: PayloadAction<any>) => {
            state.addFeeCategoryResp = action.payload;
        },
        setUpdateFeeCategoryAct: (state, action: PayloadAction<any>) => {
            state.updateFeeCategoryResp = action.payload;
        },
        setDeleteFeeCategoryAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeCategoryResp = action.payload;
        },
        setFeeTypesAct: (state, action: PayloadAction<any>) => {
            state.feeTypesResp = action.payload;
        },
        setFeeTypeByIdAct: (state, action: PayloadAction<any>) => {
            state.feeTypeByIdResp = action.payload;
        },
        setAddFeeTypesAct: (state, action: PayloadAction<any>) => {
            state.addFeeTypesResp = action.payload;
        },
        setUpdateFeeTypeAct: (state, action: PayloadAction<any>) => {
            state.updateFeeTypeResp = action.payload;
        },
        setDeleteFeeTypeAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeTypeResp = action.payload;
        },

        setFeeParticularsAct: (state, action: PayloadAction<any>) => {
            state.feeParticularsResp = action.payload;
        },
        setFeeParticularByIdAct: (state, action: PayloadAction<any>) => {
            state.feeParticularByIdResp = action.payload;
        },
        setAddFeeParticularAct: (state, action: PayloadAction<any>) => {
            state.addFeeParticularResp = action.payload;
        },
        setUpdateFeeParticularAct: (state, action: PayloadAction<any>) => {
            state.updateFeeParticularResp = action.payload;
        },
        setDeleteFeeParticularAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeParticularResp = action.payload;
        },
        setUpdateSpecialFeeStatusAct: (state, action: PayloadAction<any>) => {
            state.updateSpecialFeeStatusResp = action.payload;
        },

        setSpecialfeeNamesAct:(state, action: PayloadAction<any>) => {
            state.specialfeeNamesResp = action.payload
        },
        setSpecialfeeNameByIdAct:(state, action: PayloadAction<any>) => {
            state.specialfeeNameByIdResp = action.payload
        },
        setAddSpecialfeeNameItemsAct:(state,  action: PayloadAction<any>) => {
            state.addSpecialfeeNameItemsResp = action.payload
        },
        setUpdateSpecialfeeNameItemAct:(state,  action: PayloadAction<any>) => {
            state.updateSpecialfeeNameItemResp = action.payload
        },
        setDelSpecialfeeNameItemAct:(state,  action: PayloadAction<any>) => {
            state.delSpecialfeeNameItemResp = action.payload
        },
        setSpecialFeeBulkUploadAct:(state,action: PayloadAction<any>) => {
            state.specialfFeeBulkUploadResp = action.payload
        },

        setSpecialFeesAct: (state, action: PayloadAction<any>) => {
            state.specialFeesResp = action.payload;
        },
        setSpecialFeeByIdAct: (state, action: PayloadAction<any>) => {
            state.specialFeeByIdResp = action.payload;
        },
        setAddSpecialFeeAct: (state, action: PayloadAction<any>) => {
            state.addSpecialFeeResp = action.payload;
        },
        setUpdateSpecialFeeAct: (state, action: PayloadAction<any>) => {
            state.updateSpecialFeeResp = action.payload;
        },
        setDeleteSpecialFeeAct: (state, action: PayloadAction<any>) => {
            state.deleteSpecialFeeResp = action.payload;
        },


        setFeeFinesAct: (state, action: PayloadAction<any>) => {
            state.feeFinesResp = action.payload;
        },
        setAddFeeFineAct: (state, action: PayloadAction<any>) => {
            state.addFeeFineResp = action.payload;
        },
        setUpdateFeeFineAct: (state, action: PayloadAction<any>) => {
            state.updateFeeFineResp = action.payload;
        },
        setDeleteFeeFineAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeFineResp = action.payload;
        },

        setFeeConcessionsAct: (state, action: PayloadAction<any>) => {
            state.feeConcessionsResp = action.payload;
        },
        setAddFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.addFeeConcessionResp = action.payload;
        },
        setUpdateFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.updateFeeConcessionResp = action.payload;
        },
        setDeleteFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeConcessionResp = action.payload;
        },

        setTransportFeeConcessionsAct: (state, action: PayloadAction<any>) => {
            state.transportFeeConcessionsResp = action.payload;
        },
        setAddTransportFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.addTransportFeeConcessionResp = action.payload;
        },
        setUpdateTransportFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.updateTransportFeeConcessionResp = action.payload;
        },
        setDeleteTransportFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.deleteTransportFeeConcessionResp = action.payload;
        },

        setFeeStructuresAct: (state, action: PayloadAction<any>) => {
            state.feeStructuresResp = action.payload;
        },
        setFeeStructureByIdAct: (state, action: PayloadAction<any>) => {
            state.feeStructureByIdResp = action.payload;
        },
        setFeeStructureForClassAct: (state, action: PayloadAction<any>) => {
            state.feeStructureForClassResp = action.payload;
        },
        setAddFeeStructureAct: (state, action: PayloadAction<any>) => {
            state.addFeeStructureResp = action.payload;
        },
        setUpdateFeeStructureAct: (state, action: PayloadAction<any>) => {
            state.updateFeeStructureResp = action.payload;
        },
        setDeleteFeeStructureAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeStructureResp = action.payload;
        },

        setSpecialFeePaymentListAct: (state, action: PayloadAction<any>) => {
            state.getSpecialFeePaymentListResp = action.payload;
        },
        setSpecialFeeCategoryListAct: (state, action: PayloadAction<any>) => {
            state.getSpecialFeeCategoryListResp = action.payload;
        },
        setConcessionDashboardDataRespAct: (state, action: PayloadAction<any>) => {
            state.getConcessionDashboardDataListResp = action.payload;
        },
        setStudentConcessionListRespAct: (state, action: PayloadAction<any>) => {
            state.getStudentConcessionListResp = action.payload;
        },
        setExportStuConcessionDetailsAct: (state, action: PayloadAction<any>) => {
            state.exportStuConcessionDetailsResp = action.payload;
        },
        setAddFeeConcessionTypeAct: (state, action: PayloadAction<any>) => {
            state.addFeeConcessionTypeResp = action.payload;
        },
        setFeeConcessionTypeListAct: (state, action: PayloadAction<any>) => {
            state.getFeeConcessionTypeListResp = action.payload;
        },
        setUpdateFeeConcessionTypeAct: (state, action: PayloadAction<any>) => {
            state.updateFeeConcessionTypeResp = action.payload;
        },
        setDeleteFeeConcessionTypeAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeConcessionTypeResp = action.payload;
        },
        setJodoFeeStructureAct: (state, action: PayloadAction<any>) => {
            state.getJodoFeeStructureResp = action.payload;
        },

        setMasterFeeSettingsErrorAct: (
            state,
            action: PayloadAction<IResponseErrorModel>
        ) => {
            state.masterFeeSettingsErrorResp = action.payload;
        },
    },
});


export const {
    setFeeCategoriesAct, setAddFeeCategoryAct, setUpdateFeeCategoryAct,
    setDeleteFeeCategoryAct,
    setFeeTypesAct, setFeeTypeByIdAct, setAddFeeTypesAct, setUpdateFeeTypeAct, setDeleteFeeTypeAct,
    setFeeParticularsAct, setFeeParticularByIdAct, setAddFeeParticularAct, setUpdateFeeParticularAct, setDeleteFeeParticularAct,
    setSpecialFeesAct, setSpecialFeeByIdAct, setAddSpecialFeeAct, setUpdateSpecialFeeAct, setDeleteSpecialFeeAct,setUpdateSpecialFeeStatusAct,

    setSpecialfeeNamesAct,
    setSpecialfeeNameByIdAct,
    setAddSpecialfeeNameItemsAct,
    setUpdateSpecialfeeNameItemAct,
    setDelSpecialfeeNameItemAct,
    setSpecialFeeBulkUploadAct,

    setFeeFinesAct, setAddFeeFineAct, setUpdateFeeFineAct, setDeleteFeeFineAct,
    setFeeConcessionsAct, setAddFeeConcessionAct, setUpdateFeeConcessionAct, setDeleteFeeConcessionAct,

    setFeeStructuresAct, setFeeStructureByIdAct, setFeeStructureForClassAct, setAddFeeStructureAct, setUpdateFeeStructureAct, setDeleteFeeStructureAct,

    setAddTransportFeeConcessionAct,setDeleteTransportFeeConcessionAct,setTransportFeeConcessionsAct,setUpdateTransportFeeConcessionAct, setJodoFeeStructureAct,

    setSpecialFeePaymentListAct,setSpecialFeeCategoryListAct,
    setConcessionDashboardDataRespAct,setStudentConcessionListRespAct, setExportStuConcessionDetailsAct,
    setMasterFeeSettingsErrorAct,setAddFeeConcessionTypeAct, setFeeConcessionTypeListAct, setUpdateFeeConcessionTypeAct, setDeleteFeeConcessionTypeAct,
} = masterFeeSettings.actions;

export default masterFeeSettings.reducer;



