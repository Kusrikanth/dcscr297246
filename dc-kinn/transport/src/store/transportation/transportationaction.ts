import { createAction } from "@reduxjs/toolkit";
import { TransportConstants } from "./transportationconstants";
import { ICreatedActionType, INewActionType, ITestActionType } from "../types";

export { setGetTransportRequestAct, setNearestStopsAct, resetStopsByRouteAct, resetRouteOccupancySummaryAct } from "./transportationslice";
//Routes
export const getRouteListAct = createAction<INewActionType | undefined>(TransportConstants.GET_ROUTES_REQUEST_TRANSPORT);
export const createRouteAct = createAction<INewActionType | undefined>(TransportConstants.CREATE_ROUTE_REQUEST);
export const updateRouteDetailAct = createAction<INewActionType | undefined>(TransportConstants.UPDATE_ROUTE_REQUEST);
export const deleteRouteDetailAct = createAction<INewActionType | undefined>(TransportConstants.DELETE_ROUTE_REQUEST);
export const getRoutesListByIdAct = createAction<INewActionType | undefined>(TransportConstants.GET_ROUTES_BY_ID);

// Slabs
export const getSlabsListAct = createAction<INewActionType | undefined>(TransportConstants.GET_SLABS_LIST);
export const createSlabsListAct = createAction<INewActionType | undefined>(TransportConstants.CREATE_SLABS_LIST);
export const editSlabsListAct = createAction<INewActionType | undefined>(TransportConstants.EDIT_SLABS_LIST);
export const deleteSlabsListAct = createAction<INewActionType | undefined>(TransportConstants.DELETE_SLABS_LIST);
export const getSlabsListByIdAct = createAction<INewActionType | undefined>(TransportConstants.GET_SLABS_LIST_BY_ID);

// Vehicle Type
export const getVehicleTypeListAct = createAction<INewActionType | undefined>(TransportConstants.GET_VEHICLE_TYPE_LIST);
export const createVehicleTypeListAct = createAction<INewActionType | undefined>(TransportConstants.CREATE_VEHICLE_TYPE_LIST);
export const editVehicleTypeListAct = createAction<INewActionType | undefined>(TransportConstants.EDIT_VEHICLE_TYPE_LIST);
export const deleteVehicleTypeListAct = createAction<INewActionType | undefined>(TransportConstants.DELETE_VEHICLE_TYPE_LIST);
export const getVehicleTypeListByIdAct = createAction<INewActionType | undefined>(TransportConstants.GET_VEHICLE_TYPE_LIST_BY_ID);

// Slabs Terms
export const getSlabsTermsListAct = createAction<INewActionType | undefined>(TransportConstants.GET_SLABS_TERMS_LIST);
export const getSlabsTermsListByIdAct = createAction<INewActionType | undefined>(TransportConstants.GET_SLABS_TERMS_LIST_BY_ID);
export const deleteSlabsTermsListAct = createAction<INewActionType | undefined>(TransportConstants.DELETE_SLABS_TERMS_LIST);
export const createSlabsTermListAct = createAction<INewActionType | undefined>(TransportConstants.CREATE_SLABS_TERMS_LIST);
export const editSlabsTermListAct = createAction<INewActionType | undefined>(TransportConstants.EDIT_SLABS_TERMS_LIST);


//Transport Request
export const createTransportRequestAct = createAction<INewActionType | undefined>(TransportConstants.CREATE_TRANSPORT_DETAILS_REQUEST);
export const getTransportRequestAct = createAction<INewActionType | undefined>(TransportConstants.GET_TRANSPORT_DETAILS_REQUEST);

// All Stops
export const getAllStopsListAct = createAction<INewActionType | undefined>(TransportConstants.GET_ALL_STOPS_LIST);
export const deleteAllStopsListAct = createAction<INewActionType | undefined>(TransportConstants.DELETE_ALL_STOPS_LIST);
export const getStopsByRouteidAct = createAction<INewActionType | undefined>(TransportConstants.GET_STOPS_BYROUTEID_REQUEST);
export const createAllStopsListAct = createAction<INewActionType | undefined>(TransportConstants.CREATE_ALL_STOPS);
export const getRoutesALlStopsAct = createAction<INewActionType | undefined>(TransportConstants.GET_ROUTES_ALL_STOPS);
export const getStopsByRouteAct = createAction<INewActionType | undefined>(TransportConstants.GET_STOPS_BY_ROUTEID);
export const getNearestStopsAct = createAction<INewActionType | undefined>(TransportConstants.GET_NEAREST_STOPS_REQUEST);
export const getDistanceFormStopAct = createAction<INewActionType | undefined>(TransportConstants.GET_DISTANCE_FROM_STOP_REQUEST);


// Stop Schedule

export const getStopScheduleListAct = createAction<INewActionType | undefined>(TransportConstants.GET_STOP_SCHEDULE_LIST);
export const updateTimeStopScheduleAct = createAction<INewActionType | undefined>(TransportConstants.EDIT_STOP_SCHEDULE_LIST);

// Transport Management

export const getTransportManageListAct = createAction<INewActionType | undefined>(TransportConstants.GET_TRANSPORT_MANAGEMENT_LIST);
export const getByIdTransportManageAct = createAction<INewActionType | undefined>(TransportConstants.GET_BY_ID_TRANSPORT_MANAGEMENT);
export const getEmployeesBasedOnCategoryAct = createAction<INewActionType | undefined>(TransportConstants.GET_EMPLOYEES_BASED_ON_CATEGORY);
export const editTransportManageAct = createAction<INewActionType | undefined>(TransportConstants.EDIT_TRANSPORT_MANAGE);
export const exportTransportManageAct = createAction<INewActionType | undefined>(TransportConstants.EXPORT_TRANSPORT_MANAGE);
export const getStudentsBasedOnRouteAct = createAction<INewActionType | undefined>(TransportConstants.GET_STUDENTS_BASED_ON_ROUTE);
export const getVehicleTransManageAct = createAction<INewActionType | undefined>(TransportConstants.GET_VEHICLE_FOR_TRANS_MANAGE);


// Transport dashboard
export const getTransportDashboardStatsAct = createAction<INewActionType | undefined>(TransportConstants.GET_TRANSPORT_DASHBOARD_STATS);
export const getVehicleCategoryAct = createAction<INewActionType | undefined>(TransportConstants.GET_VEHICLE_CATEGORY);
export const getRouteOccupancySummaryAct = createAction<INewActionType | undefined>(TransportConstants.GET_ROUTE_OCCUPANCY_SUMMARY);
export const getSlabOccupancySummaryAct = createAction<INewActionType | undefined>(TransportConstants.GET_SLAB_OCCUPANCY_SUMMARY);
export const getLicenceRenewalAct = createAction<INewActionType | undefined>(TransportConstants.GET_LICENSE_RENEWAL);
export const getInsuranceRenewalAct = createAction<INewActionType | undefined>(TransportConstants.GET_INSURANCE_RENEWAL);
export const getVehicleRegRenewalAct = createAction<INewActionType | undefined>(TransportConstants.GET_VEHICLE_REG_RENEWAL);
export const getPermitRenewalAct = createAction<INewActionType | undefined>(TransportConstants.GET_PERMIT_RENEWAL);
export const getPollutionRenewalAct = createAction<INewActionType | undefined>(TransportConstants.GET_POLLUTION_RENEWAL);
export const getFitnessRenewalAct = createAction<INewActionType | undefined>(TransportConstants.GET_FITNESS_RENEWAL);
export const getTransportOptedAct = createAction<INewActionType | undefined>(TransportConstants.GET_TRANSPORT_OPTED);
export const exportTransportOptedAct = createAction<INewActionType | undefined>(TransportConstants.EXPORT_ROUTE_TRANSPORT_OPTED);
export const exportRouteOccupancySummaryAct = createAction<INewActionType | undefined>(TransportConstants.EXPORT_ROUTE_OCCUPANCY_SUMMARY);
export const exportSlabOccupancySummaryAct = createAction<INewActionType | undefined>(TransportConstants.EXPORT_SLAB_OCCUPANCY_SUMMARY);
export const exportUnpaidReportsAct = createAction<INewActionType | undefined>(TransportConstants.EXPORT_UNPAID_REPORTS);

// transport registration
export const getTransportRegistrationAct = createAction<INewActionType | undefined>(TransportConstants.GET_TRANSPORT_REGISTRATION);
export const exportTransportRegistrationAct = createAction<INewActionType | undefined>(TransportConstants.EXPORT_TRANSPORT_REGISTRATION);