import { createAction } from "@reduxjs/toolkit";
import { MasterFeeSettingsConstants } from "./masterfeesettingsconstants";
import { INewActionType } from "../../types";

export { setFeeParticularsAct, setFeeStructureByIdAct } from "./masterfeesettingsslice";
export const getFeeCategoriesAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_CATEGORIES_REQUEST);

export const addFeeCategoryAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_FEE_CATEGORIES_REQUEST);

export const updateFeeCategoryAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_FEE_CATEGORIES_REQUEST);

export const deleteFeeCategoryAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DELETE_FEE_CATEGORIES_REQUEST);

export const getFeeTypesAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_TYPES_REQUEST);

export const getFeeTypeByIdAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_TYPE_BYID_REQUEST);

export const addFeeTypesAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_FEE_TYPES_REQUEST);

export const updateFeeTypeAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_FEE_TYPE_REQUEST);

export const deleteFeeTypeAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DELETE_FEE_TYPE_REQUEST);

export const getFeeParticularsAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_PARTICULARS_REQUEST);

export const getFeeParticularByIdAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_PARTICULAR_BYID_REQUEST);

export const addFeeParticularAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_FEE_PARTICULAR_REQUEST);

export const updateFeeParticularAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_FEE_PARTICULAR_REQUEST);

export const deleteFeeParticularAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DELETE_FEE_PARTICULAR_REQUEST);


export const getSpecialFeesAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_SPECIAL_FEES_REQUEST);
export const getSpecialFeeByIdAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_SPECIAL_FEE_BYID_REQUEST);
export const addSpecialFeeAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_SPECIAL_FEE_REQUEST);
export const updateSpecialFeeAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_SPECIAL_FEE_REQUEST);
export const deleteSpecialFeeAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DELETE_SPECIAL_FEE_REQUEST);
export const updateSpecialFeeStatusAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_SPECIAL_FEE_STATUS);

export const getSpecialFeeNamesListAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_SPECIAL_FEE_NAMES_REQUEST)
export const getSpecialFeeNameItemByIdAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_SPECIAL_FEE_NAME_BY_ID_REQUEST)
export const addSpecialFeeNameItemsAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_SPECIAL_FEE_NAME_ITEMS_REQUEST)
export const updateSpecialFeeNameItemAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_SPECIAL_FEE_NAME_ITEM_REQUEST)
export const delSpecialFeeNameItemAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DEL_SPECIAL_FEE_NAME_ITEM_REQUEST)
export const bulkUploadSpecialFeeAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.BULK_UPLOAD_SPECIAL_FEE)


export const getFeeFinesAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_FINES_REQUEST);
export const addFeeFineAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_FEE_FINE_REQUEST);
export const updateFeeFineAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_FEE_FINE_REQUEST);
export const deleteFeeFineAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DELETE_FEE_FINE_REQUEST);

export const getFeeConcessionsAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_CONCESSIONS_REQUEST);
export const addFeeConcessionAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_FEE_CONCESSION_REQUEST);
export const updateFeeConcessionAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_FEE_CONCESSION_REQUEST);
export const deleteFeeConcessionAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DELETE_FEE_CONCESSION_REQUEST);

export const getTransportFeeConcessionsAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_TRANSPORT_FEE_CONCESSIONS_REQUEST);
export const addTransportFeeConcessionAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_TRANSPORT_FEE_CONCESSION_REQUEST);
export const updateTransportFeeConcessionAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_TRANSPORT_FEE_CONCESSION_REQUEST);
export const deleteTransportFeeConcessionAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DELETE_TRANSPORT_FEE_CONCESSION_REQUEST);

export const getFeeStructuresAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_STRUCTURES_REQUEST);
export const getFeeStructureByIdAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_STRUCTURE_BYID_REQUEST);
export const getFeeStructureForClassAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_STRUCTURE_FORCLASS_REQUEST);
export const addFeeStructureAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_FEE_STRUCTURE_REQUEST);
export const updateFeeStructureAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_FEE_STRUCTURE_REQUEST);
export const deleteFeeStructureAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DELETE_FEE_STRUCTURE_REQUEST);

export const getSpecialFeePaymentListAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_SPECIAL_FEE_PAYMENT_LIST);
export const getSpecialFeeCategoryListAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_SPECIAL_FEE_CATEGORY_LIST);


export const addFeeConcessionTypeAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.ADD_FEE_CONCESSION_TYPE);
export const getFeeConcessionTypeListAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_FEE_CONCESSION_TYPE);
export const updateFeeConcessionTypeAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.UPDATE_FEE_CONCESSION_TYPE);
export const deleteFeeConcessionTypeAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.DELETE_FEE_CONCESSION_TYPE);
export const getJodoFeeStructureAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_JODO_FEE_STRUCTURE);

//concession-dashboard
export const getConcessionDashboardDataListAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_CONCESSION_DASHBOARD_DATA_LIST);
export const getStudentConcessionListAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.GET_STUDENT_CONCESSION_DETALS_LIST);
export const exportStuConcessiondetailsAct = createAction<INewActionType | undefined>(MasterFeeSettingsConstants.EXPORT_STU_CONCESSION_LIST_Details);
