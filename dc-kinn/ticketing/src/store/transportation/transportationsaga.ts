import axios, { AxiosError, AxiosResponse } from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { TransportConstants } from "./transportationconstants";
import { deleteData, getData, postData, putData } from "../../api/apiactions";

import { ICreatedActionType, INewActionType } from "../types";
import {
    setCreateRouteDetailAct, setCreateSlabsListAct, setCreateSlabsTermListAct,
    setCreateVehicleTypeListAct, setDelTranportRouteDetailAct, setDeleteSlabsListAct,
    setDeleteSlabsTermsListAct, setDeleteVehicleTypeListAct, setEditSlabsListAct,
    setEditSlabsTermListAct, setEditVehicleTypeListAct, setRoutesListByIdAct,
    setSlabsListAct, setSlabsListByIdAct, setSlabsTermsListAct, setSlabsTermsListByIdAct,
    setTransportRouteErrorAct, setTransportRouteListAct, setUpdateRouteDetailAct,
    setVehicleTypeListAct, setVehicleTypeListByIdAct,
    setGetTransportRequestAct,
    setAllStopsListAct, setStopsByRouteIdAct, setNearestStopsAct, setDistanceFormStopAct,
    setCreateTransportRequestAct, setDeleteAllStopsListAct, setCreateAllStopsAct, setStopScheduleListAct, setUpdateTimeStopScheduleAct, setRoutesALlStopsAct, setTransportManageListAct, setByIdTransportManageAct, setEmployeesBasedOnCategoryAct, setEditTransportManageAct, setStopsByRouteAct, setStudentsBasedOnRouteAct, setExportTransportManageAct,
    setVehicleTransManageAct,
    setTransportDashboardStatsAct,
    setVehicleCategoryAct,
    setRouteOccupancySummaryAct,
    setLicenceRenewalAct,
    setVehicleRegRenewalAct,
    setPermitRenewalAct,
    setPollutionRenewalAct,
    setFitnessRenewalAct,
    setTransportOptedAct,
    setExportRouteOccupancySummaryAct,
    setExportUnpaidReportsAct,
    setTransportRegistrationAct,
    setExportSlabOccupancySummaryAct,
    setSlabOccupancySummaryAct,
    setExportTransportOptedAct,
    setExportTransportRegistrationAct,
    setInsuranceRenewalAct
} from "./transportationslice";

//Routes

function* getRouteRequestListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error));
    } else {
        yield put(setTransportRouteListAct(response.data));
    }
}

function* addTransportRouteRequestGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error));
    } else {
        yield put(setCreateRouteDetailAct(response.data));
    }
}

function* updateTransportRouteDetailGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setUpdateRouteDetailAct({ statusCode: response.status }))
    }
}
function* delTransportRouteDetailGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setDelTranportRouteDetailAct(response))
    }
}
function* getRoutesListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setRoutesListByIdAct(response.data))
    }
}

// Slabs

function* getSlabsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setSlabsListAct(response.data))
    }
}

function* createSlabsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setCreateSlabsListAct(response.data))
    }
}

function* editSlabsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setEditSlabsListAct({ statusCode: response.status }))
    }
}

function* deleteSlabsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setDeleteSlabsListAct(response))
    }
}

function* slabsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setSlabsListByIdAct(response.data))
    }
}

// Vehicle Type

function* getVehicleTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setVehicleTypeListAct(response.data))
    }
}

function* createVehicleTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setCreateVehicleTypeListAct(response.data))
    }
}

function* editVehicleTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setEditVehicleTypeListAct({ statusCode: response.status }))
    }
}

function* deleteVehicleTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setDeleteVehicleTypeListAct(response))
    }
}

function* vehicleTypeListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setVehicleTypeListByIdAct(response.data))
    }
}

// Slabs Terms

function* getSlabsTermsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setSlabsTermsListAct(response.data))
    }
}

function* getSlabsTermsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setSlabsTermsListByIdAct(response.data))
    }
}

function* deleteSlabsTermsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setDeleteSlabsTermsListAct(response))
    }
}

function* createSlabsTermListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setCreateSlabsTermListAct(response))
    }
}

function* editSlabsTermListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setEditSlabsTermListAct({ statusCode: response.status }))
    }
}


//Transport Request Saga
function* getTransportRequestGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setGetTransportRequestAct(response.data))
    }
}

function* createTransportRequestGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error));
    } else {
        yield put(setCreateTransportRequestAct(response.data));
    }
}
// All Stops

function* getAllStopsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setAllStopsListAct(response.data))
    }
}
function* getRoutesALlStopsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setRoutesALlStopsAct(response.data))
    }
}
function* deleteAllStopsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setDeleteAllStopsListAct({ statusCode: response.status }))
    }
}

function* getStopsByRouteidGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setStopsByRouteIdAct(response.data))
    }
}

function* getNearestStopsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setNearestStopsAct(response.data))
    }
}
function* getDistanceFormStopGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setDistanceFormStopAct(response.data))
    }
}



function* createAllStopsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setCreateAllStopsAct({ statusCode: response.status, data: response.data }))
    }
}

function* getStopsByRouteGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setStopsByRouteAct(response.data))
    }
}

// Stop Schedule

function* getStopScheduleListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setStopScheduleListAct(response.data))
    }
}

function* updateTimeStopScheduleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setUpdateTimeStopScheduleAct({ statusCode: response.status }))
    }
}

// Transport Management

function* getTransportManageListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setTransportManageListAct(response.data))
    }
}

function* getByIdTransportManageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setByIdTransportManageAct(response.data))
    }
}
function* getEmployeesBasedOnCategoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setEmployeesBasedOnCategoryAct(response.data))
    }
}

function* editTransportManageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setEditTransportManageAct({ statusCode: response.status }))
    }
}
function* getStudentsBasedOnRouteGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setStudentsBasedOnRouteAct(response.data))
    }
}
function* exportTransportManageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setExportTransportManageAct(response.data))
    }
}
function* getVehicleTransManageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setVehicleTransManageAct(response.data))
    }
}
function* getTransportDashboardStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setTransportDashboardStatsAct(response.data))
    }
}
function* getVehicleCategoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setVehicleCategoryAct(response.data))
    }
}
function* getRouteOccupancySummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setRouteOccupancySummaryAct(response.data))
    }
}

function* getSlabOccupancySummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setSlabOccupancySummaryAct(response.data))
    }
}

function* getLicenceRenewalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setLicenceRenewalAct(response.data))
    }
}

function* getInsuranceRenewalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setInsuranceRenewalAct(response.data))
    }
}
function* getVehicleRegRenewalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setVehicleRegRenewalAct(response.data))
    }
}
function* getPermitRenewalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setPermitRenewalAct(response.data))
    }
}

function* getPollutionRenewalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setPollutionRenewalAct(response.data))
    }
}
function* getFitnessRenewalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setFitnessRenewalAct(response.data))
    }
}
function* getTransportOptedGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setTransportOptedAct(response.data))
    }
}

function* exportTransportOptedGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setExportTransportOptedAct(response.data))
    }
}

function* exportRouteOccupancySummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setExportRouteOccupancySummaryAct(response.data))
    }
}

function* exportSlabOccupancySummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setExportSlabOccupancySummaryAct(response.data))
    }
}

function* exportUnpaidReportsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setExportUnpaidReportsAct({ statusCode: response.status, data: response.data }))
    }
}

// Transport Registration
function* getTransportRegistrationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error))
    } else {
        yield put(setTransportRegistrationAct(response.data))
    }
}

function* exportTransportRegistrationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportRouteErrorAct(response.error));
    } else {
        yield put(setExportTransportRegistrationAct(response.data));
    }
}
export default function* transportRequestSaga() {
    //Routes

    yield takeLatest(TransportConstants.GET_ROUTES_REQUEST_TRANSPORT, getRouteRequestListGen);
    yield takeLatest(TransportConstants.DELETE_ROUTE_REQUEST, delTransportRouteDetailGen);
    yield takeLatest(TransportConstants.UPDATE_ROUTE_REQUEST, updateTransportRouteDetailGen);
    yield takeLatest(TransportConstants.CREATE_ROUTE_REQUEST, addTransportRouteRequestGen);
    yield takeLatest(TransportConstants.GET_ROUTES_BY_ID, getRoutesListByIdGen);

    //Slabs

    yield takeLatest(TransportConstants.GET_SLABS_LIST, getSlabsListGen);
    yield takeLatest(TransportConstants.CREATE_SLABS_LIST, createSlabsListGen);
    yield takeLatest(TransportConstants.EDIT_SLABS_LIST, editSlabsListGen);
    yield takeLatest(TransportConstants.DELETE_SLABS_LIST, deleteSlabsListGen);
    yield takeLatest(TransportConstants.GET_SLABS_LIST_BY_ID, slabsListByIdGen);

    // Vehicle Type

    yield takeLatest(TransportConstants.GET_VEHICLE_TYPE_LIST, getVehicleTypeListGen);
    yield takeLatest(TransportConstants.CREATE_VEHICLE_TYPE_LIST, createVehicleTypeListGen);
    yield takeLatest(TransportConstants.EDIT_VEHICLE_TYPE_LIST, editVehicleTypeListGen);
    yield takeLatest(TransportConstants.DELETE_VEHICLE_TYPE_LIST, deleteVehicleTypeListGen);
    yield takeLatest(TransportConstants.GET_VEHICLE_TYPE_LIST_BY_ID, vehicleTypeListByIdGen);

    // Slabs Terms

    yield takeLatest(TransportConstants.GET_SLABS_TERMS_LIST, getSlabsTermsListGen);
    yield takeLatest(TransportConstants.GET_SLABS_TERMS_LIST_BY_ID, getSlabsTermsListByIdGen);
    yield takeLatest(TransportConstants.DELETE_SLABS_TERMS_LIST, deleteSlabsTermsListGen);
    yield takeLatest(TransportConstants.CREATE_SLABS_TERMS_LIST, createSlabsTermListGen);
    yield takeLatest(TransportConstants.EDIT_SLABS_TERMS_LIST, editSlabsTermListGen);


    //Transport Request
    yield takeLatest(TransportConstants.GET_TRANSPORT_DETAILS_REQUEST, getTransportRequestGen);
    yield takeLatest(TransportConstants.CREATE_TRANSPORT_DETAILS_REQUEST, createTransportRequestGen);

    // All Stops

    yield takeLatest(TransportConstants.GET_ALL_STOPS_LIST, getAllStopsListGen);
    yield takeLatest(TransportConstants.DELETE_ALL_STOPS_LIST, deleteAllStopsListGen);
    yield takeLatest(TransportConstants.GET_STOPS_BYROUTEID_REQUEST, getStopsByRouteidGen);
    yield takeLatest(TransportConstants.GET_NEAREST_STOPS_REQUEST, getNearestStopsGen);


    yield takeLatest(TransportConstants.CREATE_ALL_STOPS, createAllStopsGen);
    yield takeLatest(TransportConstants.GET_ROUTES_ALL_STOPS, getRoutesALlStopsGen);
    yield takeLatest(TransportConstants.GET_STOPS_BY_ROUTEID, getStopsByRouteGen);
    yield takeLatest(TransportConstants.GET_DISTANCE_FROM_STOP_REQUEST, getDistanceFormStopGen);

    // Stop Schedule

    yield takeLatest(TransportConstants.GET_STOP_SCHEDULE_LIST, getStopScheduleListGen);
    yield takeLatest(TransportConstants.EDIT_STOP_SCHEDULE_LIST, updateTimeStopScheduleGen);

    // Transport Management

    yield takeLatest(TransportConstants.GET_TRANSPORT_MANAGEMENT_LIST, getTransportManageListGen);
    yield takeLatest(TransportConstants.GET_BY_ID_TRANSPORT_MANAGEMENT, getByIdTransportManageGen);
    yield takeLatest(TransportConstants.GET_EMPLOYEES_BASED_ON_CATEGORY, getEmployeesBasedOnCategoryGen);
    yield takeLatest(TransportConstants.EDIT_TRANSPORT_MANAGE, editTransportManageGen);
    yield takeLatest(TransportConstants.GET_STUDENTS_BASED_ON_ROUTE, getStudentsBasedOnRouteGen);
    yield takeLatest(TransportConstants.EXPORT_TRANSPORT_MANAGE, exportTransportManageGen);
    yield takeLatest(TransportConstants.GET_VEHICLE_FOR_TRANS_MANAGE, getVehicleTransManageGen);

    // Transport dashboard
    yield takeLatest(TransportConstants.GET_TRANSPORT_DASHBOARD_STATS, getTransportDashboardStatsGen);
    yield takeLatest(TransportConstants.GET_VEHICLE_CATEGORY, getVehicleCategoryGen);
    yield takeLatest(TransportConstants.GET_ROUTE_OCCUPANCY_SUMMARY, getRouteOccupancySummaryGen);
    yield takeLatest(TransportConstants.GET_SLAB_OCCUPANCY_SUMMARY, getSlabOccupancySummaryGen);
    yield takeLatest(TransportConstants.GET_LICENSE_RENEWAL, getLicenceRenewalGen);
    yield takeLatest(TransportConstants.GET_INSURANCE_RENEWAL, getInsuranceRenewalGen);
    yield takeLatest(TransportConstants.GET_VEHICLE_REG_RENEWAL, getVehicleRegRenewalGen);
    yield takeLatest(TransportConstants.GET_PERMIT_RENEWAL, getPermitRenewalGen);
    yield takeLatest(TransportConstants.GET_POLLUTION_RENEWAL, getPollutionRenewalGen);
    yield takeLatest(TransportConstants.GET_FITNESS_RENEWAL, getFitnessRenewalGen);
    yield takeLatest(TransportConstants.GET_TRANSPORT_OPTED, getTransportOptedGen);
    yield takeLatest(TransportConstants.EXPORT_ROUTE_TRANSPORT_OPTED, exportTransportOptedGen);
    yield takeLatest(TransportConstants.EXPORT_ROUTE_OCCUPANCY_SUMMARY, exportRouteOccupancySummaryGen);
    yield takeLatest(TransportConstants.EXPORT_SLAB_OCCUPANCY_SUMMARY, exportSlabOccupancySummaryGen);
    yield takeLatest(TransportConstants.EXPORT_UNPAID_REPORTS, exportUnpaidReportsGen);

    // Transport Registration
    yield takeLatest(TransportConstants.GET_TRANSPORT_REGISTRATION, getTransportRegistrationGen);
    yield takeLatest(TransportConstants.EXPORT_TRANSPORT_REGISTRATION, exportTransportRegistrationGen);
}