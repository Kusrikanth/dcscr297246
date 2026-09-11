import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRouteListReducerState } from "./transportationtypes";

const initialState: IRouteListReducerState = {
    //routes 
    routeRequestListResp: undefined,
    updateRouteDetailRequestResp: undefined,
    addRouteRequestResp: undefined,
    delRouteRequestResp: undefined,
    getRoutesListByIdResp: undefined,
    transportationErrorAct: undefined,

    // slabs 
    getSlabsListResp: undefined,
    createSlabsListResp: undefined,
    editSlabsListResp: undefined,
    deleteSlabsListResp: undefined,
    getSlabsListByIdResp: undefined,

    // vehicle type
    getVehicleTypeListResp: undefined,
    createVehicleTypeListResp: undefined,
    editVehicleTypeListResp: undefined,
    deleteVehicleTypeListResp: undefined,
    getVehicleTypeListByIdResp: undefined,

    // slabs terms
    getSlabsTermsListResp: undefined,
    getSlabsTermsListByIdResp: undefined,
    deleteSlabsTermsListResp: undefined,
    createSlabsTermListResp: undefined,
    editSlabsTermListResp: undefined,

    //Tranport Request
    getTransportRequestResp: undefined,
    createTransportRequestResp: undefined,


    // all stops
    getAllStopsListResp: undefined,
    deleteAllStopsListResp: undefined,
    stopsByRouteIdResp: undefined,
    createAllStopsResp: undefined,
    getRoutesALlStopsResp: undefined,
    getStopsByRouteResp: undefined,
    nearestStopResp: undefined,
    distanceFromStopResp: undefined,

    // stop schesdule
    getStopScheduleListResp: undefined,
    updateTimeStopScheduleResp: undefined,

    // transport management

    getTransportManageListResp: undefined,
    getByIdTransportManageResp: undefined,
    getEmployeesBasedOnCategoryResp: undefined,
    editTransportManageResp: undefined,
    exportTransportManageResp: undefined,
    getVehicleTransManageResp: undefined,
    getStudentsBasedOnRouteResp: undefined,

    // transport dashboard
    getTransportDashboardStatsResp: undefined,
    getVehicleCategoryResp: undefined,
    getRouteOccupancySummaryResp: undefined,
    getSlabOccupancySummaryResp: undefined,
    getLicenceRenewalResp: undefined,
    getInsuranceRenewalResp: undefined,
    getVehicleRegRenewalResp: undefined,
    getPermitRenewalResp: undefined,
    getPollutionRenewalResp: undefined,
    getFitnessRenewalResp: undefined,
    getTransportOptedResp: undefined,
    exportTransportOptedResp: undefined,
    exportRouteOccupancySummaryResp: undefined,
    exportSlabOccupancySummaryResp: undefined,
    exportUnpaidReportsResp: undefined,

    // transport registration
    getTransportRegistrationResp: undefined,
    exportTransportRegistrationResp: undefined,
}

export const transportRequest = createSlice({
    name: "transportrequest",
    initialState,
    reducers: {
        // Routes

        setTransportRouteListAct: (state, action: PayloadAction<any>) => {
            state.routeRequestListResp = action.payload;
        },
        setDelTranportRouteDetailAct: (state, action: PayloadAction<any>) => {
            state.delRouteRequestResp = action.payload;
        },
        setUpdateRouteDetailAct: (state, action: PayloadAction<any>) => {
            state.updateRouteDetailRequestResp = action.payload;
        },
        setCreateRouteDetailAct: (state, action: PayloadAction<any>) => {
            state.addRouteRequestResp = action.payload;
        },
        setRoutesListByIdAct: (state, action: PayloadAction<any>) => {
            state.getRoutesListByIdResp = action.payload;
        },

        // Slabs

        setSlabsListAct: (state, action: PayloadAction<any>) => {
            state.getSlabsListResp = action.payload;
        },
        setCreateSlabsListAct: (state, action: PayloadAction<any>) => {
            state.createSlabsListResp = action.payload;
        },
        setEditSlabsListAct: (state, action: PayloadAction<any>) => {
            state.editSlabsListResp = action.payload;
        },
        setDeleteSlabsListAct: (state, action: PayloadAction<any>) => {
            state.deleteSlabsListResp = action.payload;
        },
        setSlabsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getSlabsListByIdResp = action.payload;
        },

        // Vehicle Type

        setVehicleTypeListAct: (state, action: PayloadAction<any>) => {
            state.getVehicleTypeListResp = action.payload;
        },
        setCreateVehicleTypeListAct: (state, action: PayloadAction<any>) => {
            state.createVehicleTypeListResp = action.payload;
        },
        setEditVehicleTypeListAct: (state, action: PayloadAction<any>) => {
            state.editVehicleTypeListResp = action.payload;
        },
        setDeleteVehicleTypeListAct: (state, action: PayloadAction<any>) => {
            state.deleteVehicleTypeListResp = action.payload;
        },
        setVehicleTypeListByIdAct: (state, action: PayloadAction<any>) => {
            state.getVehicleTypeListByIdResp = action.payload;
        },

        // Slabs Terms

        setSlabsTermsListAct: (state, action: PayloadAction<any>) => {
            state.getSlabsTermsListResp = action.payload;
        },
        setSlabsTermsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getSlabsTermsListByIdResp = action.payload;
        },
        setDeleteSlabsTermsListAct: (state, action: PayloadAction<any>) => {
            state.deleteSlabsTermsListResp = action.payload;
        },
        setCreateSlabsTermListAct: (state, action: PayloadAction<any>) => {
            state.createSlabsTermListResp = action.payload;
        },
        setEditSlabsTermListAct: (state, action: PayloadAction<any>) => {
            state.editSlabsTermListResp = action.payload;
        },


        // All Stops

        setAllStopsListAct: (state, action: PayloadAction<any>) => {
            state.getAllStopsListResp = action.payload;
        },
        setDeleteAllStopsListAct: (state, action: PayloadAction<any>) => {
            state.deleteAllStopsListResp = action.payload;
        },
        setStopsByRouteIdAct: (state, action: PayloadAction<any>) => {
            state.stopsByRouteIdResp = action.payload;
        },
        setRoutesALlStopsAct: (state, action: PayloadAction<any>) => {
            state.getRoutesALlStopsResp = action.payload;
        },
        setStopsByRouteAct: (state, action: PayloadAction<any>) => {
            state.getStopsByRouteResp = action.payload;
        },
        resetStopsByRouteAct: (state, action: PayloadAction<any>) => {
            state.getStopsByRouteResp = action.payload;
        },
        setNearestStopsAct: (state, action: PayloadAction<any>) => {
            state.nearestStopResp = action.payload;
        },
        setDistanceFormStopAct: (state, action: PayloadAction<any>) => {
            state.distanceFromStopResp = action.payload;
        },
        resetDistanceFormStopAct: (state, action: PayloadAction<any>) => {
            state.distanceFromStopResp = action.payload;
        },




        //Transport Request
        setGetTransportRequestAct: (state, action: PayloadAction<any>) => {
            state.getTransportRequestResp = action.payload;
        },
        setCreateTransportRequestAct: (state, action: PayloadAction<any>) => {
            state.createTransportRequestResp = action.payload;
        },
        setCreateAllStopsAct: (state, action: PayloadAction<any>) => {
            state.createAllStopsResp = action.payload;
        },

        // Stop Schedule

        setStopScheduleListAct: (state, action: PayloadAction<any>) => {
            state.getStopScheduleListResp = action.payload;
        },
        setUpdateTimeStopScheduleAct: (state, action: PayloadAction<any>) => {
            state.updateTimeStopScheduleResp = action.payload;
        },

        // Transport Management

        setTransportManageListAct: (state, action: PayloadAction<any>) => {
            state.getTransportManageListResp = action.payload;
        },
        setByIdTransportManageAct: (state, action: PayloadAction<any>) => {
            state.getByIdTransportManageResp = action.payload;
        },
        setEmployeesBasedOnCategoryAct: (state, action: PayloadAction<any>) => {
            state.getEmployeesBasedOnCategoryResp = action.payload;
        },
        setEditTransportManageAct: (state, action: PayloadAction<any>) => {
            state.editTransportManageResp = action.payload;
        },
        setStudentsBasedOnRouteAct: (state, action: PayloadAction<any>) => {
            state.getStudentsBasedOnRouteResp = action.payload;
        },
        setExportTransportManageAct: (state, action: PayloadAction<any>) => {
            state.exportTransportManageResp = action.payload;
        },
        setVehicleTransManageAct: (state, action: PayloadAction<any>) => {
            state.getVehicleTransManageResp = action.payload;
        },

        // Error
        setTransportRouteErrorAct: (state, action: PayloadAction<any>) => {
            state.transportationErrorAct = action.payload;
        },

        // transportation dashboard

        setTransportDashboardStatsAct: (state, action: PayloadAction<any>) => {
            state.getTransportDashboardStatsResp = action.payload
        },
        setVehicleCategoryAct: (state, action: PayloadAction<any>) => {
            state.getVehicleCategoryResp = action.payload
        },
        setRouteOccupancySummaryAct: (state, action: PayloadAction<any>) => {
            state.getRouteOccupancySummaryResp = action.payload
        },
        resetRouteOccupancySummaryAct: (state, action: PayloadAction<any>) => {
            state.getRouteOccupancySummaryResp = action.payload
        },
        setSlabOccupancySummaryAct: (state, action: PayloadAction<any>) => {
            state.getSlabOccupancySummaryResp = action.payload
        },
        resetSlabOccupancySummaryAct: (state, action: PayloadAction<any>) => {
            state.getSlabOccupancySummaryResp = action.payload
        },
        setLicenceRenewalAct: (state, action: PayloadAction<any>) => {
            state.getLicenceRenewalResp = action.payload
        },
        setInsuranceRenewalAct: (state, action: PayloadAction<any>) => {
            state.getInsuranceRenewalResp = action.payload
        },
        setVehicleRegRenewalAct: (state, action: PayloadAction<any>) => {
            state.getVehicleRegRenewalResp = action.payload
        },
        setPermitRenewalAct: (state, action: PayloadAction<any>) => {
            state.getPermitRenewalResp = action.payload
        },
        setPollutionRenewalAct: (state, action: PayloadAction<any>) => {
            state.getPollutionRenewalResp = action.payload
        },
        setFitnessRenewalAct: (state, action: PayloadAction<any>) => {
            state.getFitnessRenewalResp = action.payload
        },
        setTransportOptedAct: (state, action: PayloadAction<any>) => {
            state.getTransportOptedResp = action.payload
        },
        setExportTransportOptedAct: (state, action: PayloadAction<any>) => {
            state.exportTransportOptedResp = action.payload
        },
        setExportRouteOccupancySummaryAct: (state, action: PayloadAction<any>) => {
            state.exportRouteOccupancySummaryResp = action.payload
        },
        setExportSlabOccupancySummaryAct: (state, action: PayloadAction<any>) => {
            state.exportSlabOccupancySummaryResp = action.payload
        },
        setExportUnpaidReportsAct: (state, action: PayloadAction<any>) => {
            state.exportUnpaidReportsResp = action.payload
        },

        // transport registration
        setTransportRegistrationAct: (state, action: PayloadAction<any>) => {
            state.getTransportRegistrationResp = action.payload;
        },
        setExportTransportRegistrationAct: (state, action: PayloadAction<any>) => {
            state.exportTransportRegistrationResp = action.payload;
        },
    }
})

export const {
    //Routes
    setTransportRouteListAct,
    setDelTranportRouteDetailAct,
    setUpdateRouteDetailAct,
    setCreateRouteDetailAct,
    setTransportRouteErrorAct,
    setRoutesListByIdAct,

    // Slabs
    setSlabsListAct,
    setCreateSlabsListAct,
    setEditSlabsListAct,
    setDeleteSlabsListAct,
    setSlabsListByIdAct,

    // Vehicle Type
    setVehicleTypeListAct,
    setCreateVehicleTypeListAct,
    setEditVehicleTypeListAct,
    setDeleteVehicleTypeListAct,
    setVehicleTypeListByIdAct,

    // Slabs Terms
    setSlabsTermsListAct,
    setSlabsTermsListByIdAct,
    setDeleteSlabsTermsListAct,
    setCreateSlabsTermListAct,
    setEditSlabsTermListAct,

    //Transport Request
    setGetTransportRequestAct,
    setCreateTransportRequestAct,

    //All Stops
    setAllStopsListAct,
    setDeleteAllStopsListAct,
    setStopsByRouteIdAct,
    setCreateAllStopsAct,
    setRoutesALlStopsAct,
    setStopsByRouteAct,
    setNearestStopsAct,
    resetStopsByRouteAct,
    setDistanceFormStopAct,
    resetDistanceFormStopAct,

    // Stop Schedule
    setStopScheduleListAct,
    setUpdateTimeStopScheduleAct,

    // Transport Management
    setTransportManageListAct,
    setByIdTransportManageAct,
    setEmployeesBasedOnCategoryAct,
    setStudentsBasedOnRouteAct,
    setVehicleTransManageAct,
    setExportTransportManageAct,
    setEditTransportManageAct,

    // transportation dashboard
    setTransportDashboardStatsAct,
    setVehicleCategoryAct,
    setRouteOccupancySummaryAct,
    resetRouteOccupancySummaryAct,
    setSlabOccupancySummaryAct,
    resetSlabOccupancySummaryAct,
    setLicenceRenewalAct,
    setInsuranceRenewalAct,
    setVehicleRegRenewalAct,
    setPermitRenewalAct,
    setPollutionRenewalAct,
    setFitnessRenewalAct,
    setTransportOptedAct,
    setExportTransportOptedAct,
    setExportRouteOccupancySummaryAct,
    setExportSlabOccupancySummaryAct,
    setExportUnpaidReportsAct,

    // transport registration
    setTransportRegistrationAct,
    setExportTransportRegistrationAct,
} = transportRequest.actions;

export default transportRequest.reducer;