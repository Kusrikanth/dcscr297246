
import { all, call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, putData } from "../../../api/apiactions";
import { LibraryBookRenewalConstants } from "./bookrenewalconstants";
import { setLibraryBookRenewalErrorAct, setLibraryBookRenewalRequestListAct } from "./bookrenewalslice";

//library Book Renewal

function* getLibraryBookRenewalListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookRenewalErrorAct(response.error));
    } else {
        yield put(setLibraryBookRenewalRequestListAct(response.data));
    }
}


export default function* bookrenewalsaga() {
    //Library Book Renewal

    yield takeLatest(LibraryBookRenewalConstants.GET_LIBRARY_BOOK_RENEWAL, getLibraryBookRenewalListGen);
   
}