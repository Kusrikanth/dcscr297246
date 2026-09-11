import {call,put,takeLatest} from "redux-saga/effects";
import { VehicleDetailsConstants } from "./vehicledetaileconstants";
import { deleteData,getData,postData,putData } from "../../../../api/apiactions";
import { ICreatedActionType } from "../../../types";
import { setVehicleDetailByIdAct,setCreateVehicleDetailAct,setDelVehicleDetailAct,setUpdateVehicleDetailAct,setVehicleDetailListAct,setVehicleDetailErrorAct, setFuelTypeListAct, setExportVehicleDetailListAct, setVehicleManufactureListAct, setVehicleModelListAct, setVehicleManufactureDetailsAct, setSaveVehicleManufactureDetailsAct, setSaveVehicleModelManufactureDetailsAct, setVehicleManufactureDetailsByIdAct, setVehicleModelManufactureDetailsByIdAct, setInsuranceCompanyListAct, setInsuranceTypesListAct } from "./vehicledetaileslice";

function* getVehicleDetailListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setVehicleDetailListAct(response.data));
    }
}

function* getVehicleDetailByIdGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setVehicleDetailByIdAct(response.data));
    }
}

function* addVehicleDetailListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setCreateVehicleDetailAct(response.data));
    }
}

function* getVehicleManufactureListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setVehicleManufactureListAct(response.data));
    }
}

function* getVehicleModelListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setVehicleModelListAct(response.data));
    }
}

function* delVehicleDetailListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setDelVehicleDetailAct(response));
    }
}

function* updateVehicleDetailListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setUpdateVehicleDetailAct(response));
    }
}
function* updateVehicleTypeDetailResp(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setUpdateVehicleDetailAct(response.data));
    }
}

function* setVehicleTypeAct(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setCreateVehicleDetailAct(response.data));
    }
}

function* getFuelTypeListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setFuelTypeListAct(response.data));
    }
}
function* exportVehicleDetailListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setExportVehicleDetailListAct(response.data));
    }
}

function* getInsuranceCompanyListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setInsuranceCompanyListAct(response.data));
    }
}

function* getInsuranceTypesListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setInsuranceTypesListAct(response.data));
    }
}
//Vehicle-Manufacture
function* getVehicleManufactureDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setVehicleManufactureDetailsAct(response.data));
    }
}


function* saveVehicleManufactureDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setSaveVehicleManufactureDetailsAct({ statusCode: response.status }));
    }
}

function* saveVehicleModelManufactureDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setSaveVehicleModelManufactureDetailsAct({ statusCode: response.status }));
    }
}

function* getVehicleManufactureDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setVehicleManufactureDetailsByIdAct(response.data));
    }
}

function* getVehicleModelManufactureDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setVehicleDetailErrorAct(response.error));
    } else {
        yield put(setVehicleModelManufactureDetailsByIdAct(response.data));
    }
}

export default function* vehicleDetailRequestSaga(){
    yield takeLatest(VehicleDetailsConstants.GET_VEHICLE_DETAILES_REQUEST,getVehicleDetailListGen);
    yield takeLatest(VehicleDetailsConstants.GET_VEHICLE_DETAILES_BYID_REQUEST,getVehicleDetailByIdGen);
    yield takeLatest(VehicleDetailsConstants.ADD_VEHICLE_DETAILES_REQUEST,addVehicleDetailListGen);
    yield takeLatest(VehicleDetailsConstants.GET_VEHICLE_MANUFACTURE_LIST,getVehicleManufactureListGen);
    yield takeLatest(VehicleDetailsConstants.GET_VEHICLE_MODEL_LIST,getVehicleModelListGen);
    yield takeLatest(VehicleDetailsConstants.DELETE_VEHICLE_DETAILES_REQUEST,delVehicleDetailListGen);
    yield takeLatest(VehicleDetailsConstants.UPDATE_VEHICLE_DETAILES_REQUEST,updateVehicleDetailListGen)
    yield takeLatest(VehicleDetailsConstants.ADD_VEHICLE_DETAILES_TYPE_REQUEST,setVehicleTypeAct)
    yield takeLatest(VehicleDetailsConstants.UPDATE_VEHICLE_DETAILES_TYPE_REQUEST,updateVehicleTypeDetailResp)
    yield takeLatest(VehicleDetailsConstants.GET_FUEL_TYPE_LIST,getFuelTypeListGen)
    yield takeLatest(VehicleDetailsConstants.EXPORT_VEHICLE_DETAILES_REQUEST,exportVehicleDetailListGen)
    yield takeLatest(VehicleDetailsConstants.GET_INSURANCE_COMPANY_LIST, getInsuranceCompanyListGen)
    yield takeLatest(VehicleDetailsConstants.GET_INSURANCE_TYPES_LIST, getInsuranceTypesListGen)

    //vehicle-manufacture
    yield takeLatest(VehicleDetailsConstants.GET_VEHICLE_MANUFACTURE_DETAILS_LIST, getVehicleManufactureDetailsGen);
    yield takeLatest(VehicleDetailsConstants.SAVE_VEHICLE_MANUFACTURE_DETAILS, saveVehicleManufactureDetailsGen);
    yield takeLatest(VehicleDetailsConstants.SAVE_VEHICLE_MODEL_MANUFACTURE_DETAILS, saveVehicleModelManufactureDetailsGen);
    yield takeLatest(VehicleDetailsConstants.GET_VEHICLE_MANUFACTURE_DETAILS_BY_ID, getVehicleManufactureDetailsByIdGen);
    yield takeLatest(VehicleDetailsConstants.GET_VEHICLE_MODEL_MANUFACTURE_DETAILS_BY_ID, getVehicleModelManufactureDetailsByIdGen);
}