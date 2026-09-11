import {createAction} from "@reduxjs/toolkit";
import {VehicleDetailsConstants} from "./vehicledetaileconstants";
import { INewActionType } from "../../../types";

export {resetVehicleDetailByIdAct, resetVehicleModelListAct, } from "./vehicledetaileslice"

export const getVehicleDetailesListAct=createAction<INewActionType | undefined>(VehicleDetailsConstants.GET_VEHICLE_DETAILES_REQUEST);
export const createVehicleDetailesAct=createAction<INewActionType |undefined>(VehicleDetailsConstants.ADD_VEHICLE_DETAILES_REQUEST);
export const getVehicleManufactureListAct=createAction<INewActionType |undefined>(VehicleDetailsConstants.GET_VEHICLE_MANUFACTURE_LIST);
export const getVehicleModelListAct=createAction<INewActionType |undefined>(VehicleDetailsConstants.GET_VEHICLE_MODEL_LIST);
export const updateVehicleDetailesAct=createAction<INewActionType |undefined>(VehicleDetailsConstants.UPDATE_VEHICLE_DETAILES_REQUEST);
export const deleteVehicleDetailesAct=createAction<INewActionType | undefined>(VehicleDetailsConstants.DELETE_VEHICLE_DETAILES_REQUEST);
export const addVehicleDetailesTypeAct=createAction<INewActionType | undefined>(VehicleDetailsConstants.ADD_VEHICLE_DETAILES_TYPE_REQUEST);
export const updateVehicleDetailesTypeAct=createAction<INewActionType | undefined>(VehicleDetailsConstants.UPDATE_VEHICLE_DETAILES_TYPE_REQUEST);
export const getVehicleDetailsByIdAct =createAction<INewActionType | undefined>(VehicleDetailsConstants.GET_VEHICLE_DETAILES_BYID_REQUEST);
export const getFuelTypeListAct =createAction<INewActionType | undefined>(VehicleDetailsConstants.GET_FUEL_TYPE_LIST);
export const exportVehicleDetailListAct =createAction<INewActionType | undefined>(VehicleDetailsConstants.EXPORT_VEHICLE_DETAILES_REQUEST);
export const getInsuranceCompanyListAct =createAction<INewActionType | undefined>(VehicleDetailsConstants.GET_INSURANCE_COMPANY_LIST);
export const getInsuranceTypesListAct =createAction<INewActionType | undefined>(VehicleDetailsConstants.GET_INSURANCE_TYPES_LIST);

//vehicle-manufacture
export const getVehicleManufactureDetailsListAct = createAction<INewActionType | undefined>(VehicleDetailsConstants.GET_VEHICLE_MANUFACTURE_DETAILS_LIST);
export const saveVehicleManufactureDetailsAct = createAction<INewActionType | undefined>(VehicleDetailsConstants.SAVE_VEHICLE_MANUFACTURE_DETAILS);
export const saveVehicleModelManufactureDetailsAct = createAction<INewActionType | undefined>(VehicleDetailsConstants.SAVE_VEHICLE_MODEL_MANUFACTURE_DETAILS);
export const getVehicleManufactureDetailsByIdAct = createAction<INewActionType | undefined>(VehicleDetailsConstants.GET_VEHICLE_MANUFACTURE_DETAILS_BY_ID);
export const getVehicleModelManufactureDetailsByIdAct = createAction<INewActionType | undefined>(VehicleDetailsConstants.GET_VEHICLE_MODEL_MANUFACTURE_DETAILS_BY_ID);