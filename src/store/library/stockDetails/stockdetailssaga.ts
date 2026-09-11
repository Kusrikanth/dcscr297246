import { call, put, takeLatest } from "redux-saga/effects";
import { getData, postData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { setExportStockCheckingAct, setStockVerificationListAct, setStockCheckingErrorAct, setStockCheckingListAct, setStockCheckingDetailsListAct, setStockRelocateListAct, setRelocateSaveListAct, setSaveRelocateStockListAct } from "./stockdetailsslice";
import { StockDetailsConstants } from "./stockdetailsconstants";

function* getStockCheckingListGen(action: ICreatedActionType): any {
    const { payload } = action;
    
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStockCheckingErrorAct(response.error));
    } else {
        yield put(setStockCheckingListAct(response.data));
    }
}
function* getStockCheckingDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStockCheckingErrorAct(response.error));
    } else {
        yield put(setStockCheckingDetailsListAct(response.data));
    }
}
function* getStockRelocateListGen(action: ICreatedActionType): any {
    const { payload } = action;
    
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStockCheckingErrorAct(response.error));
    } else {
        yield put(setStockRelocateListAct(response.data));
    }
}
function* getStockVerificationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStockCheckingErrorAct(response.error));
    } else {
        yield put(setStockVerificationListAct(response.data));
    }
}
function* exportStockCheckingGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStockCheckingErrorAct(response.error));
    } else {
        yield put(setExportStockCheckingAct(response.data));
    }
}
function* getRelocateSaveListGen(action: ICreatedActionType): any {
    const { payload } = action;
    
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStockCheckingErrorAct(response.error));
    } else {
        yield put(setRelocateSaveListAct(response.data));
    }
}
function* getSaveRelocateStockListGen(action: ICreatedActionType): any {
    const { payload } = action;
    
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStockCheckingErrorAct(response.error));
    } else {
        yield put(setSaveRelocateStockListAct({statusCode : response.status}));
    }
}
export default function* stockcheckingsaga() {

    yield takeLatest(StockDetailsConstants.GET_STOCK_CHECKING, getStockCheckingListGen);
    yield takeLatest(StockDetailsConstants.GET_STOCK_CHECKING_Details, getStockCheckingDetailsListGen);
    yield takeLatest(StockDetailsConstants.GET_STOCK_CHECKING_VERIFICATION, getStockVerificationListGen);
    yield takeLatest(StockDetailsConstants.GET_STOCK_CHECKING_RELOCATE, getStockRelocateListGen);
    yield takeLatest(StockDetailsConstants.EXPORT_STOCK_CHECKING, exportStockCheckingGen);
    yield takeLatest(StockDetailsConstants.GET_RELOCATE_SAVE, getRelocateSaveListGen);
    yield takeLatest(StockDetailsConstants.SAVE_RELOCATE_STOCK, getSaveRelocateStockListGen);
   }