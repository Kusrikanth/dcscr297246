export interface IRouteListReducerState {
        // routes
        routeRequestListResp: any;
        updateRouteDetailRequestResp: any;
        addRouteRequestResp: any;
        delRouteRequestResp: any;
        getRoutesListByIdResp: any;

        // slabs
        getSlabsListResp: any;
        createSlabsListResp: any;
        editSlabsListResp: any;
        deleteSlabsListResp: any;
        getSlabsListByIdResp: any;

        // vehicle type
        getVehicleTypeListResp: any;
        createVehicleTypeListResp: any;
        editVehicleTypeListResp: any;
        deleteVehicleTypeListResp: any;
        getVehicleTypeListByIdResp: any;

        // slabs terms

        getSlabsTermsListResp: any;
        getSlabsTermsListByIdResp: any;
        deleteSlabsTermsListResp: any;
        createSlabsTermListResp: any;
        editSlabsTermListResp: any;

        //Tranport Request
        getTransportRequestResp: any;
        createTransportRequestResp: any;

        // all stops
        getAllStopsListResp: any;
        deleteAllStopsListResp: any;
        stopsByRouteIdResp: any;
        createAllStopsResp: any;
        getRoutesALlStopsResp: any;
        getStopsByRouteResp: any;
        nearestStopResp: any;
        distanceFromStopResp: any;

        // stop schedules

        getStopScheduleListResp: any;
        updateTimeStopScheduleResp: any;

        // transport management

        getTransportManageListResp: any;
        getByIdTransportManageResp: any;
        getEmployeesBasedOnCategoryResp: any;
        editTransportManageResp: any;
        getStudentsBasedOnRouteResp: any;
        exportTransportManageResp: any;
        getVehicleTransManageResp: any;

        //error state
        transportationErrorAct: any;

        // transportation dashboard
        getTransportDashboardStatsResp: any;
        getVehicleCategoryResp: any;
        getRouteOccupancySummaryResp: any;
        getSlabOccupancySummaryResp: any;
        getLicenceRenewalResp: any;
        getInsuranceRenewalResp: any;
        getVehicleRegRenewalResp: any;
        getPermitRenewalResp: any;
        getPollutionRenewalResp: any;
        getFitnessRenewalResp: any;
        getTransportOptedResp: any;
        exportTransportOptedResp: any;
        exportRouteOccupancySummaryResp: any;
        exportSlabOccupancySummaryResp: any;
        exportUnpaidReportsResp: any;

        // transport registration
        getTransportRegistrationResp: any;
        exportTransportRegistrationResp: any;
}