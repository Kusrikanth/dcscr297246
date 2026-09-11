import {createAction} from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { HostelSettingsConstants } from "./hostelsettingsconstants";

export { resetHostelFeeStructureByIdAct , resetHostelRoomDetailsListAct, setHostelFeeParticularsAct,setHostelRoomDetailsListByIdAct } from "./hostelsettingsslice";

// Hostel Facility Eligibility

export const getHostelFacilityEligibilityAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_FACILITY_ELIGIBILITY);
export const editHostelFacilityEligibilityAct =createAction<INewActionType | undefined>(HostelSettingsConstants.EDIT_HOSTEL_FACILITY_ELIGIBILITY);

// Hostel Fee Structure

export const getHostelFeeStructureAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_FEE_STRUCTURE);
export const getHostelFeeStructureByIdAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_FEE_STRUCTURE_BY_ID);
export const getHostelFeeTermsAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_FEE_TERMS);
export const saveHostelFeeStructureAct =createAction<INewActionType | undefined>(HostelSettingsConstants.SAVE_HOSTEL_FEE_STRUCTURE);
export const editHostelFeeStructureAct =createAction<INewActionType | undefined>(HostelSettingsConstants.EDIT_HOSTEL_FEE_STRUCTURE);
export const deleteHostelFeeStructureAct =createAction<INewActionType | undefined>(HostelSettingsConstants.DELETE_HOSTEL_FEE_STRUCTURE);

export const getHostelFeeNameAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_FEE_NAME);
export const getHostelRoomTypesAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_ROOM_TYPES);

//hostel details
export const getHostelDetailsAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_DETAILS);
export const saveHostelDetailsAct =createAction<INewActionType | undefined>(HostelSettingsConstants.SAVE_HOSTEL_DETAILS);
export const getHostelDetailsListByIdAct = createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_DETAILS_LIST_BY_ID);
export const editHostelDetailsListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.EDIT_HOSTEL_DETAILS_LIST);
export const deleteHostelDetailsListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.DELETE_HOSTEL_DETAILS_LIST);

//hostel building
export const getHostelBuildingAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_BUILDING);
export const saveHostelBuildingAct =createAction<INewActionType | undefined>(HostelSettingsConstants.SAVE_HOSTEL_BUILDING);
export const getHostelBuildingListByIdAct = createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_BUILDING_LIST_BY_ID);
export const editHostelBuildingListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.EDIT_HOSTEL_BUILDING_LIST);
export const deleteHostelBuildingListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.DELETE_HOSTEL_BUILDING_LIST);

//hostel floor
export const getHostelFloorAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_FLOOR);
export const saveHostelFloorAct =createAction<INewActionType | undefined>(HostelSettingsConstants.SAVE_HOSTEL_FLOOR);
export const getHostelFloorListByIdAct = createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_FLOOR_LIST_BY_ID);
export const editHostelFloorListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.EDIT_HOSTEL_FLOOR_LIST);
export const deleteHostelFloorListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.DELETE_HOSTEL_FLOOR_LIST);

//hostel room-type
export const getHostelRoomTypeAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_ROOM_TYPE);
export const saveHostelRoomTypeAct =createAction<INewActionType | undefined>(HostelSettingsConstants.SAVE_HOSTEL_ROOM_TYPE);
export const getHostelRoomTypeListByIdAct = createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_ROOM_TYPE_LIST_BY_ID);
export const editHostelRoomTypeListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.EDIT_HOSTEL_ROOM_TYPE_LIST);
export const deleteHostelRoomTypeListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.DELETE_HOSTEL_ROOM_TYPE_LIST);

//hostel room-details
export const getHostelRoomDetailsAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_ROOM_DETAILS);
export const saveHostelRoomDetailsAct =createAction<INewActionType | undefined>(HostelSettingsConstants.SAVE_HOSTEL_ROOM_DETAILS);
export const getHostelRoomDetailsListByIdAct = createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_ROOM_DETAILS_LIST_BY_ID);
export const editHostelRoomDetailsListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.EDIT_HOSTEL_ROOM_DETAILS_LIST);
export const deleteHostelRoomDetailsListAct = createAction<INewActionType | undefined>(HostelSettingsConstants.DELETE_HOSTEL_ROOM_DETAILS_LIST);

//hostel particulars
export const getHostelFeeParticularsAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_FEE_PARTICULARS);
export const getHostelFeeParticularsByIdAct =createAction<INewActionType | undefined>(HostelSettingsConstants.GET_HOSTEL_FEE_PARTICULARS_BY_ID);
export const saveHostelFeeNameParticularsAct =createAction<INewActionType | undefined>(HostelSettingsConstants.SAVE_HOSTEL_FEE_NAME_PARTICULARS);
export const editHostelFeeNameParticularsAct =createAction<INewActionType | undefined>(HostelSettingsConstants.EDIT_HOSTEL_FEE_NAME_PARTICULARS);
export const delHostelFeeNameParticularsAct =createAction<INewActionType | undefined>(HostelSettingsConstants.DELETE_HOSTEL_FEE_NAME_PARTICULARS);
