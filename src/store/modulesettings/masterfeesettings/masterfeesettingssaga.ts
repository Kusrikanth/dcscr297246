import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setFeeCategoriesAct, setAddFeeCategoryAct, setUpdateFeeCategoryAct,
    setDeleteFeeCategoryAct,
    setFeeTypesAct, setFeeTypeByIdAct, setAddFeeTypesAct, setUpdateFeeTypeAct, setDeleteFeeTypeAct,
    setFeeParticularsAct, setAddFeeParticularAct, setUpdateFeeParticularAct, setDeleteFeeParticularAct,
    setSpecialFeesAct, setSpecialFeeByIdAct, setAddSpecialFeeAct, setUpdateSpecialFeeAct, setDeleteSpecialFeeAct,


    setFeeFinesAct, setAddFeeFineAct, setUpdateFeeFineAct, setDeleteFeeFineAct,
    setFeeConcessionsAct, setAddFeeConcessionAct, setUpdateFeeConcessionAct, setDeleteFeeConcessionAct,
    setFeeStructuresAct, setFeeStructureByIdAct, setFeeStructureForClassAct,
    setAddFeeStructureAct, setUpdateFeeStructureAct, setDeleteFeeStructureAct,
    setMasterFeeSettingsErrorAct,
    setFeeParticularByIdAct,
    setSpecialFeePaymentListAct,
    setSpecialFeeCategoryListAct,
    setUpdateSpecialFeeStatusAct,
    setConcessionDashboardDataRespAct,
    setStudentConcessionListRespAct,
    setExportStuConcessionDetailsAct,
    setAddFeeConcessionTypeAct,
    setFeeConcessionTypeListAct,
    setUpdateFeeConcessionTypeAct,
    setDeleteFeeConcessionTypeAct,
    setTransportFeeConcessionsAct,
    setAddTransportFeeConcessionAct,
    setUpdateTransportFeeConcessionAct,
    setDeleteTransportFeeConcessionAct,
    setSpecialfeeNamesAct,
    setAddSpecialfeeNameItemsAct,
    setSpecialfeeNameByIdAct,
    setUpdateSpecialfeeNameItemAct,
    setDelSpecialfeeNameItemAct,
    setSpecialFeeBulkUploadAct,
    setJodoFeeStructureAct,
    // setBranchesAct,
} from "./masterfeesettingsslice";
import { MasterFeeSettingsConstants } from "./masterfeesettingsconstants";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getFeeCategoriesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeCategoriesAct(response.data));
    }
}

function* addFeeCategoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddFeeCategoryAct({ statusCode: response.status }));
    }
}

function* updateFeeCategoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateFeeCategoryAct(response.data));
    }
}

function* deleteFeeCategoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteFeeCategoryAct({ statusCode: response.status }));
    }
}


function* getFeeTypesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeTypesAct(response.data));
    }
}

function* getFeeTypeByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeTypeByIdAct(response.data));
    }
}

function* addFeeTypesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddFeeTypesAct({ statusCode: response.status }));
    }
}

function* updateFeeTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateFeeTypeAct({ statusCode: response.status }));
    }
}

function* deleteFeeTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteFeeTypeAct({ statusCode: response.status }));
    }
}


function* getFeeParticularsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeParticularsAct(response.data));
    }
}

function* getFeeParticularByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeParticularByIdAct(response.data));
    }
}

function* addFeeParticularGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddFeeParticularAct({ statusCode: response.status }));
    }
}

function* updateFeeParticularGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateFeeParticularAct({ statusCode: response.status }));
    }
}

function* deleteFeeParticularGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteFeeParticularAct({ statusCode: response.status }));
    }
}

function* updateSpecialFeeStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateSpecialFeeStatusAct({ statusCode: response.status }));
    }
}

function* getSpecialfeeNamesGen(action: ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(getData, payload.endpoint,payload.payload,payload.optionalConfig)
    
    if(response && response.error){
        yield put(setMasterFeeSettingsErrorAct(response.error))
    }
    else {
        yield put(setSpecialfeeNamesAct(response.data))
    }
}

function* getSpecialfeeNameByIdGen(action: ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if(response && response.error){
        yield put(setMasterFeeSettingsErrorAct(response.error))
    }else {
        yield put(setSpecialfeeNameByIdAct(response.data))
    }
}


function* addSpecialfeeNamesGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if(response && response.error){
        yield put(setMasterFeeSettingsErrorAct(response.error))
    }
    else {
        yield put(setAddSpecialfeeNameItemsAct({statusCode: response.status}))
    }
}

function* updateSpecialfeeNameItemGen(action: ICreatedActionType):any
{
    const {payload} = action;
    const response = yield call(putData, payload.endpoint,payload.payload,payload.optionalConfig)

    if(response && response.error){
        yield put(setMasterFeeSettingsErrorAct(response.error))
    }else {
        yield put(setUpdateSpecialfeeNameItemAct({statusCode: response.status}))
    }
}

function* delSpecialfeeNameItemGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if(response && response.error){
        yield put(setMasterFeeSettingsErrorAct(response.error))
    }else {
        yield put(setDelSpecialfeeNameItemAct({ statusCode: response.status }))
    }
}

function* bulkUploadSpecialFeeGen(action:ICreatedActionType):any{
    const {payload} = action;
    const response = yield call(postData, payload.endpoint,payload.payload,payload.optionalConfig)
    if(response && response.error){
        yield put(setMasterFeeSettingsErrorAct(response.error))
    }
    else {
        yield put(setSpecialFeeBulkUploadAct({statusCode : response.status}))
    }
}



function* getSpecialFeesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSpecialFeesAct(response.data));
    }
}

function* getSpecialFeeByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSpecialFeeByIdAct(response.data));
    }
}

function* addSpecialFeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddSpecialFeeAct({ statusCode: response.status }));
    }
}

function* updateSpecialFeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateSpecialFeeAct({ statusCode: response.status }));
    }
}

function* deleteSpecialFeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteSpecialFeeAct({ statusCode: response.status }));
    }
}

function* getFeeFinesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeFinesAct(response.data));
    }
}

function* addFeeFineGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddFeeFineAct({ statusCode: response.status }));
    }
}

function* updateFeeFineGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateFeeFineAct({ statusCode: response.status }));
    }
}

function* deleteFeeFineGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteFeeFineAct({ statusCode: response.status }));
    }
}


function* getFeeConcessionsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeConcessionsAct(response.data));
    }
}

function* addFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddFeeConcessionAct({ statusCode: response.status }));
    }
}

function* updateFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateFeeConcessionAct({ statusCode: response.status }));
    }
}

function* deleteFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteFeeConcessionAct({ statusCode: response.status }));
    }
}


function* transportFeeConcessionsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setTransportFeeConcessionsAct(response.data));
    }
}

function* addTransportFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddTransportFeeConcessionAct({ statusCode: response.status }));
    }
}

function* updateTransportFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateTransportFeeConcessionAct({ statusCode: response.status }));
    }
}

function* deleteTransportFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteTransportFeeConcessionAct({ statusCode: response.status }));
    }
}

function* getFeeStructuresGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeStructuresAct(response.data));
    }
}

function* getFeeStructureByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeStructureByIdAct(response.data));
    }
}


function* getFeeStructureForClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeStructureForClassAct(response.data));
    }
}



function* addFeeStructureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddFeeStructureAct({ statusCode: response.status }));
    }
}

function* updateFeeStructureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateFeeStructureAct({ statusCode: response.status }));
    }
}

function* deleteFeeStructureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteFeeStructureAct({ statusCode: response.status }));
    }
}

function* getSpecialFeePaymentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSpecialFeePaymentListAct(response.data));
    }
}

function* getSpecialFeeCategoryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSpecialFeeCategoryListAct(response.data));
    }
}

function* getConcessionDashboardDataGen(action: ICreatedActionType): any{
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
     if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setConcessionDashboardDataRespAct(response.data));
    }
}

function* getStudentConcessionListGen(action: ICreatedActionType): any{
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
     if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setStudentConcessionListRespAct(response.data));
    }
}
function* addFeeConcessionTypeGen(action: ICreatedActionType): any{
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
     if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddFeeConcessionTypeAct({ statusCode: response.status }));
    }
}

function* getFeeConcessionTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeConcessionTypeListAct(response.data));
    }
}
function* updateFeeConcessionTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateFeeConcessionTypeAct({ statusCode: response.status }));
    }
}
function* deleteFeeConcessionTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteFeeConcessionTypeAct({ statusCode: response.status }));
    }
}
function* getExportStuConcessionDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setExportStuConcessionDetailsAct(response.data));
    }
}
function* getJodoFeeStructureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setJodoFeeStructureAct(response.data));
    }
}
export default function* masterFeeSettingsSaga() {
    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_CATEGORIES_REQUEST, getFeeCategoriesGen);
    yield takeLatest(MasterFeeSettingsConstants.ADD_FEE_CATEGORIES_REQUEST, addFeeCategoryGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_FEE_CATEGORIES_REQUEST, updateFeeCategoryGen);
    yield takeLatest(MasterFeeSettingsConstants.DELETE_FEE_CATEGORIES_REQUEST, deleteFeeCategoryGen);

    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_TYPES_REQUEST, getFeeTypesGen);
    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_TYPE_BYID_REQUEST, getFeeTypeByIdGen);
    yield takeLatest(MasterFeeSettingsConstants.ADD_FEE_TYPES_REQUEST, addFeeTypesGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_FEE_TYPE_REQUEST, updateFeeTypeGen);
    yield takeLatest(MasterFeeSettingsConstants.DELETE_FEE_TYPE_REQUEST, deleteFeeTypeGen);


    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_PARTICULARS_REQUEST, getFeeParticularsGen);
    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_PARTICULAR_BYID_REQUEST, getFeeParticularByIdGen);
    yield takeLatest(MasterFeeSettingsConstants.ADD_FEE_PARTICULAR_REQUEST, addFeeParticularGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_FEE_PARTICULAR_REQUEST, updateFeeParticularGen);
    yield takeLatest(MasterFeeSettingsConstants.DELETE_FEE_PARTICULAR_REQUEST, deleteFeeParticularGen);

    yield takeLatest(MasterFeeSettingsConstants.GET_SPECIAL_FEE_NAMES_REQUEST, getSpecialfeeNamesGen)
    yield takeLatest(MasterFeeSettingsConstants.GET_SPECIAL_FEE_NAME_BY_ID_REQUEST, getSpecialfeeNameByIdGen)
    yield takeLatest(MasterFeeSettingsConstants.ADD_SPECIAL_FEE_NAME_ITEMS_REQUEST, addSpecialfeeNamesGen)
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_SPECIAL_FEE_NAME_ITEM_REQUEST, updateSpecialfeeNameItemGen)
    yield takeLatest(MasterFeeSettingsConstants.DEL_SPECIAL_FEE_NAME_ITEM_REQUEST, delSpecialfeeNameItemGen)
    yield takeLatest(MasterFeeSettingsConstants.BULK_UPLOAD_SPECIAL_FEE, bulkUploadSpecialFeeGen)

    yield takeLatest(MasterFeeSettingsConstants.GET_SPECIAL_FEES_REQUEST, getSpecialFeesGen);
    yield takeLatest(MasterFeeSettingsConstants.GET_SPECIAL_FEE_BYID_REQUEST, getSpecialFeeByIdGen);
    yield takeLatest(MasterFeeSettingsConstants.ADD_SPECIAL_FEE_REQUEST, addSpecialFeeGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_SPECIAL_FEE_REQUEST, updateSpecialFeeGen);
    yield takeLatest(MasterFeeSettingsConstants.DELETE_SPECIAL_FEE_REQUEST, deleteSpecialFeeGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_SPECIAL_FEE_STATUS, updateSpecialFeeStatusGen);

    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_FINES_REQUEST, getFeeFinesGen);
    yield takeLatest(MasterFeeSettingsConstants.ADD_FEE_FINE_REQUEST, addFeeFineGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_FEE_FINE_REQUEST, updateFeeFineGen);
    yield takeLatest(MasterFeeSettingsConstants.DELETE_FEE_FINE_REQUEST, deleteFeeFineGen);

    yield takeLatest(MasterFeeSettingsConstants.GET_TRANSPORT_FEE_CONCESSIONS_REQUEST, transportFeeConcessionsGen);
    yield takeLatest(MasterFeeSettingsConstants.ADD_TRANSPORT_FEE_CONCESSION_REQUEST, addTransportFeeConcessionGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_TRANSPORT_FEE_CONCESSION_REQUEST, updateTransportFeeConcessionGen);
    yield takeLatest(MasterFeeSettingsConstants.DELETE_TRANSPORT_FEE_CONCESSION_REQUEST, deleteTransportFeeConcessionGen);

    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_CONCESSIONS_REQUEST, getFeeConcessionsGen);
    yield takeLatest(MasterFeeSettingsConstants.ADD_FEE_CONCESSION_REQUEST, addFeeConcessionGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_FEE_CONCESSION_REQUEST, updateFeeConcessionGen);
    yield takeLatest(MasterFeeSettingsConstants.DELETE_FEE_CONCESSION_REQUEST, deleteFeeConcessionGen);

    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_STRUCTURES_REQUEST, getFeeStructuresGen);
    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_STRUCTURE_BYID_REQUEST, getFeeStructureByIdGen);
    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_STRUCTURE_FORCLASS_REQUEST, getFeeStructureForClassGen);
    yield takeLatest(MasterFeeSettingsConstants.ADD_FEE_STRUCTURE_REQUEST, addFeeStructureGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_FEE_STRUCTURE_REQUEST, updateFeeStructureGen);
    yield takeLatest(MasterFeeSettingsConstants.DELETE_FEE_STRUCTURE_REQUEST, deleteFeeStructureGen);

    yield takeLatest(MasterFeeSettingsConstants.GET_SPECIAL_FEE_PAYMENT_LIST, getSpecialFeePaymentListGen); 
    yield takeLatest(MasterFeeSettingsConstants.GET_SPECIAL_FEE_CATEGORY_LIST, getSpecialFeeCategoryListGen);

    yield takeLatest(MasterFeeSettingsConstants.ADD_FEE_CONCESSION_TYPE, addFeeConcessionTypeGen);
    yield takeLatest(MasterFeeSettingsConstants.GET_FEE_CONCESSION_TYPE, getFeeConcessionTypeListGen);
    yield takeLatest(MasterFeeSettingsConstants.UPDATE_FEE_CONCESSION_TYPE, updateFeeConcessionTypeGen);
    yield takeLatest(MasterFeeSettingsConstants.DELETE_FEE_CONCESSION_TYPE, deleteFeeConcessionTypeGen);

    yield takeLatest(MasterFeeSettingsConstants.GET_CONCESSION_DASHBOARD_DATA_LIST, getConcessionDashboardDataGen);
    yield takeLatest(MasterFeeSettingsConstants.GET_STUDENT_CONCESSION_DETALS_LIST, getStudentConcessionListGen);
    yield takeLatest(MasterFeeSettingsConstants.EXPORT_STU_CONCESSION_LIST_Details, getExportStuConcessionDetailsGen);
    yield takeLatest(MasterFeeSettingsConstants.GET_JODO_FEE_STRUCTURE, getJodoFeeStructureGen);
}