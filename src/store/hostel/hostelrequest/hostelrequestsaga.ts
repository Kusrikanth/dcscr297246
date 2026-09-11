import { call, put, takeLatest } from "redux-saga/effects";
import { deleteData, getData, postData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import {
    setHostelNotOptedStudentsAct, setHostelOptedStudentsAct,
    setSaveHostelOptedStudentsAct, setDeleteHostelOptedStudentAct,
    setHostelRequestErrorAct,
    setExportHostelShortlistStuListAct,
    setHostelPromoteStuListAct,
    setSaveHostelPromoteStuListAct,
    setSaveHostelPromoteStuAct,
    setReActiveHostelShortlistByIdAct,

    setHigherClassEligibilityStudAct, setHostelEligibleClassesAct,
    setEligibleStudForPromoteAct, setSaveEligibleStudForPromoteAct,
    setRevertRemoveHostelPromotionAct,
    setHostelBedAllocationListAct,
    setDeallocateHostelBedAct,
    setHostelTerminationListAct,
    setTerminationStuLedgersAct,
    setSaveHostelTerminationAct,
    setRevertHostelTerminationByIdAct,
    setHostelTransferRequestAct, setUpdateHostelTransferStatusAct,
    setStuListForAllocateBedAct,
    setNotAllocateBedListAct,
    setAddHostelBedAllocationAct,
    setExportHostelBedAllocationAct
} from "./hostelrequestslice";
import { HostelStudentLedgerConstants } from "./hostelrequestconstants";


function* getHostelNotOptedStudentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setHostelNotOptedStudentsAct(response.data));
    }
}

function* getHostelOptedStudentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setHostelOptedStudentsAct(response.data));
    }
}

function* saveHostelOptedStudentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setSaveHostelOptedStudentsAct(response.data));
    }
}

function* deleteHostelOptedStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setDeleteHostelOptedStudentAct({ statusCode: response.status }));
    }
}

function* exportHostelShortlistStuListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setExportHostelShortlistStuListAct(response.data));
    }
}


function* reActivateHostelShortlistByIdGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setReActiveHostelShortlistByIdAct({statusCode:response.status}))
    } 
}

// promote students 

function* getHostelPromoteStuListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setHostelPromoteStuListAct(response.data));
    }
}

function* getSaveHostelPromoteStuListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setSaveHostelPromoteStuListAct(response.data));
    }
}

function* saveHostelPromoteStuGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setSaveHostelPromoteStuAct({ statusCode: response.status }));
    }
}

function* getHigherClassEligibilityStudGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setHigherClassEligibilityStudAct(response.data));
    }
}

function* getHostelEligibleClassesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setHostelEligibleClassesAct(response.data));
    }
}

function* getEligibleStudForPromoteGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setEligibleStudForPromoteAct(response.data));
    }
}

function* saveEligibleStudForPromoteGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setSaveEligibleStudForPromoteAct(response.data));
    }
}

function* revertRemoveHostelPromotionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setRevertRemoveHostelPromotionAct({ statusCode: response.status }));
    }
}

// Hostel Bed Allocation

function* getHostelBedAllocationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setHostelBedAllocationListAct(response.data));
    }
}

function* getStuListForAllocateBedGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setStuListForAllocateBedAct(response.data));
    }
}

function* getNotAllocateBedListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setNotAllocateBedListAct(response.data));
    }
}

function* deallocateHostelBedGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setDeallocateHostelBedAct({ statusCode: response.status }));
    }
}

function* addHostelBedAllocationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setAddHostelBedAllocationAct({ statusCode: response.status }));
    }
}

// Hostel Termination

function* getHostelTerminationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setHostelTerminationListAct(response.data));
    }
}

function* getTerminationStuLedgersGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setTerminationStuLedgersAct(response.data));
    }
}

function* saveHostelTerminationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setSaveHostelTerminationAct({ statusCode: response.status }));
    }
}

function* revertHostelTerminationByIdGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setRevertHostelTerminationByIdAct({statusCode: response.status}))
    }
}


function* hostelTransferRequestGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setHostelTransferRequestAct(response.data));
    }
}

function* updateHostelTransferStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setUpdateHostelTransferStatusAct({ statusCode: response.status }));
    }
}
function* exportHostelBedAllocationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelRequestErrorAct(response.error));
    } else {
        yield put(setExportHostelBedAllocationAct(response.data));
    }
}

export default function* hostelRequestSaga() {
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_NOTOPTED_STUDENTS_REQUEST, getHostelNotOptedStudentsGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_OPTED_STUDENTS_REQUEST, getHostelOptedStudentsGen);
    yield takeLatest(HostelStudentLedgerConstants.SAVE_HOSTEL_OPTED_STUDENTS_REQUEST, saveHostelOptedStudentsGen);
    yield takeLatest(HostelStudentLedgerConstants.DELETE_HOSTEL_OPTED_STUDENT_REQUEST, deleteHostelOptedStudentGen);
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_SHORTLIST_STU_LIST, exportHostelShortlistStuListGen);
    yield takeLatest(HostelStudentLedgerConstants.RE_ACTIVATE_HOSETL_SHORTLIST_BY_ID,reActivateHostelShortlistByIdGen)


    // promote students

    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_PROMOTE_STU_LIST, getHostelPromoteStuListGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_SAVE_HOSTEL_PROMOTE_STU_LIST, getSaveHostelPromoteStuListGen);
    yield takeLatest(HostelStudentLedgerConstants.SAVE_HOSTEL_PROMOTE_STU, saveHostelPromoteStuGen);

    //higher class eligibility

    yield takeLatest(HostelStudentLedgerConstants.GET_HIGHERCLASS_ELIGIBILTYSTUD_REQUEST, getHigherClassEligibilityStudGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_ELIGIBLECLASSES_REQUEST, getHostelEligibleClassesGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_ELIGIBLESTUD_FORPROMOTE_REQUEST, getEligibleStudForPromoteGen);
    yield takeLatest(HostelStudentLedgerConstants.SAVE_ELIGIBLESTUD_FORPROMOTE_REQUEST, saveEligibleStudForPromoteGen);
    yield takeLatest(HostelStudentLedgerConstants.REVERT_REMOVE_HOSTELPROMOTION_REQUEST, revertRemoveHostelPromotionGen);

    // Hostel Bed Allocation

    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_BED_ALLOCATION_LIST, getHostelBedAllocationListGen);
    yield takeLatest(HostelStudentLedgerConstants.DEALLOCATE_BED_REQUEST, deallocateHostelBedGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_STU_LIST_FOR_ALLOCATE_BED, getStuListForAllocateBedGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_NOT_ALLOCATE_BED_LIST, getNotAllocateBedListGen);
    yield takeLatest(HostelStudentLedgerConstants.ADD_HOSTEL_BED_ALLOCATION, addHostelBedAllocationGen);
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_BED_ALLOCATION, exportHostelBedAllocationGen);

    // Hostel Termination

    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_TERMINATION_LIST, getHostelTerminationListGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_TERMINATION_STU_LEDGERS, getTerminationStuLedgersGen);
    yield takeLatest(HostelStudentLedgerConstants.SAVE_HOSTEL_TERMINATION_LIST, saveHostelTerminationGen);
    yield takeLatest(HostelStudentLedgerConstants.REVERT_HOSTEL_TERMINATION_BY_ID,revertHostelTerminationByIdGen)

    //Hostel Transfer Request
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_TRANSFER_REQUEST, hostelTransferRequestGen);
    yield takeLatest(HostelStudentLedgerConstants.UPDATE_HOSTEL_TRANSFER_STATUS_REQUEST, updateHostelTransferStatusGen);

}