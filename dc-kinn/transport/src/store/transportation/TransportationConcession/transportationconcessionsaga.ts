import { call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { getData, deleteData, postData, putData } from "../../../api/apiactions";
import { TransportConcessionConstants } from "./transportationconcessionconstants";
import { setCreateTransportConcessionAct, setDeleteTransportConcessionAct, setEditTransportConcessionAct, setExportTransportConcessionAct, setTransportConcessionByIdAct, setTransportConcessionListAct, setTransportationConcessionErrorAct } from "./transportationconcessionslice";


function* getTransportConcessionListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationConcessionErrorAct(response.error));
    } else {
        yield put(setTransportConcessionListAct(response.data));
    }
}

function* deleteTransportConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationConcessionErrorAct(response.error));
    } else {
        yield put(setDeleteTransportConcessionAct({statusCode : response.status}));
    }
}
function* createTransportConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationConcessionErrorAct(response.error));
    } else {
        yield put(setCreateTransportConcessionAct({statusCode : response.status}));
    }
}
function* editTransportConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationConcessionErrorAct(response.error));
    } else {
        yield put(setEditTransportConcessionAct({statusCode : response.status}));
    }
}

function* getTransportConcessionByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationConcessionErrorAct(response.error));
    } else {
        yield put(setTransportConcessionByIdAct(response.data));
    }
}

function* exportTransportConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationConcessionErrorAct(response.error));
    } else {
        yield put(setExportTransportConcessionAct(response.data));
    }
}


export default function* transportConcessionSaga() {

    yield takeLatest(TransportConcessionConstants.GET_TRANPORT_CONCESSION_LIST, getTransportConcessionListGen);
    yield takeLatest(TransportConcessionConstants.DELETE_TRANPORT_CONCESSION_LIST, deleteTransportConcessionGen);
    yield takeLatest(TransportConcessionConstants.CREATE_TRANPORT_CONCESSION, createTransportConcessionGen);
    yield takeLatest(TransportConcessionConstants.EDIT_TRANPORT_CONCESSION, editTransportConcessionGen);
    yield takeLatest(TransportConcessionConstants.GET_TRANPORT_CONCESSION_BY_ID, getTransportConcessionByIdGen);
    yield takeLatest(TransportConcessionConstants.EXPORT_TRANPORT_CONCESSION, exportTransportConcessionGen);

}