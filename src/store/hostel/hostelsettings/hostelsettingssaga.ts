import {call,put,takeLatest} from "redux-saga/effects";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { HostelSettingsConstants } from "./hostelsettingsconstants";
import { setDeleteHostelFeeStructureAct, setDelHostelBuildingListAct, setDelHostelDetailsListAct, setDelHostelFeeNameParticularsListAct, setDelHostelFloorListAct, setDelHostelRoomDetailsListAct, setDelHostelRoomTypeListAct, setEditHostelBuildingListAct, setEditHostelDetailsListAct, setEditHostelFacilityEligibilityAct, setEditHostelFeeNameParticularsListAct, setEditHostelFeeStructureAct, setEditHostelFloorListAct, setEditHostelRoomDetailsListAct, setEditHostelRoomTypeListAct, setHostelBuildingAct, setHostelBuildingListByIdAct, setHostelDetailsAct, setHostelDetailsListByIdAct, setHostelFacilityEligibilityAct, setHostelFeeNameAct, setHostelFeeNameParticularsListByIdAct, setHostelFeeParticularsAct, setHostelFeeStructureAct, setHostelFeeStructureByIdAct, setHostelFeeTermsAct, setHostelFloorAct, setHostelFloorListByIdAct, setHostelRoomDetailsAct, setHostelRoomDetailsListByIdAct, setHostelRoomTypeAct, setHostelRoomTypeListByIdAct, setHostelRoomTypesAct, setHostelSettingsErrAct, setSaveHostelBuildingAct, setSaveHostelDetailsAct, setSaveHostelFeeNameParticularsAct, setSaveHostelFeeStructureAct, setSaveHostelFloorAct, setSaveHostelRoomDetailsAct, setSaveHostelRoomTypeAct } from "./hostelsettingsslice";

 // Hostel Facility Eligibility

function* getHostelFacilityEligibilityGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelFacilityEligibilityAct(response.data));
    }
}

function* editHostelFacilityEligibilityGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setEditHostelFacilityEligibilityAct({statusCode : response.status}));
    }
}

// Hostel Fee Structure

function* getHostelFeeStructureGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelFeeStructureAct(response.data));
    }
}

function* getHostelFeeTermsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelFeeTermsAct(response.data));
    }
}

function* saveHostelFeeStructureGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setSaveHostelFeeStructureAct({statusCode : response.status}));
    }
}

function* getHostelFeeStructureByIdGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelFeeStructureByIdAct(response.data));
    }
}

function* editHostelFeeStructureGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setEditHostelFeeStructureAct({statusCode : response.status}));
    }
}

function* deleteHostelFeeStructureGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setDeleteHostelFeeStructureAct({statusCode : response.status}));
    }
}

// master settings api's

function* getHostelFeeNameGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelFeeNameAct(response.data));
    }
}


function* getHostelRoomTypesGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelRoomTypesAct(response.data));
    }
}

//hostel details
function* getHostelDetailsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelDetailsAct(response.data));
    }
}

function* saveHostelDetailsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setSaveHostelDetailsAct({statusCode : response.status}));
    }
}

function* editHostelDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setEditHostelDetailsListAct({statusCode : response.status}));
    }
}

function* deleteHostelDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setDelHostelDetailsListAct({status : response.statusCode}));
    }
}

function* getHostelDetailsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelDetailsListByIdAct(response.data));
    }
}

//hostel building
function* getHostelBuildingGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelBuildingAct(response.data));
    }
}

function* saveHostelBuildingGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setSaveHostelBuildingAct({statusCode : response.status}));
    }
}

function* editHostelBuildingListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setEditHostelBuildingListAct({statusCode : response.status}));
    }
}

function* deleteHostelBuildingListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setDelHostelBuildingListAct({status : response.statusCode}));
    }
}

function* getHostelBuildingListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelBuildingListByIdAct(response.data));
    }
}

//hostel floor
function* getHostelFloorGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelFloorAct(response.data));
    }
}

function* saveHostelFloorGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setSaveHostelFloorAct({statusCode : response.status}));
    }
}

function* editHostelFloorListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setEditHostelFloorListAct({statusCode : response.status}));
    }
}

function* deleteHostelFloorListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setDelHostelFloorListAct({status : response.statusCode}));
    }
}

function* getHostelFloorListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelFloorListByIdAct(response.data));
    }
}

//hostel room-type
function* getHostelRoomTypeGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelRoomTypeAct(response.data));
    }
}

function* saveHostelRoomTypeGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setSaveHostelRoomTypeAct({statusCode : response.status}));
    }
}

function* editHostelRoomTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setEditHostelRoomTypeListAct({statusCode : response.status}));
    }
}

function* deleteHostelRoomTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setDelHostelRoomTypeListAct({status : response.statusCode}));
    }
}

function* getHostelRoomTypeListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelRoomTypeListByIdAct(response.data));
    }
}

//hostel room-details
function* getHostelRoomDetailsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelRoomDetailsAct(response.data));
    }
}

function* saveHostelRoomDetailsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setSaveHostelRoomDetailsAct({statusCode : response.status}));
    }
}

function* editHostelRoomDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setEditHostelRoomDetailsListAct({statusCode : response.status}));
    }
}

function* deleteHostelRoomDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setDelHostelRoomDetailsListAct({status : response.statusCode}));
    }
}

function* getHostelRoomDetailsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelRoomDetailsListByIdAct(response.data));
    }
}

//hostel fee=particulars
function* getHostelFeeParticularsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelFeeParticularsAct(response.data));
    }
}

function* saveHostelFeeNameParticularsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setSaveHostelFeeNameParticularsAct({statusCode : response.status}));
    }
}

function* editHostelFeeNameParticularsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setEditHostelFeeNameParticularsListAct({statusCode : response.status}));
    }
}

function* deleteHostelFeeNameParticularsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setDelHostelFeeNameParticularsListAct({status : response.statusCode}));
    }
}

function* getHostelFeeNameParticularsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelSettingsErrAct(response.error));
    } else {
        yield put(setHostelFeeNameParticularsListByIdAct(response.data));
    }
}

export default function* hostelSettingsRequestSaga(){

     // Hostel Facility Eligibility
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_FACILITY_ELIGIBILITY ,getHostelFacilityEligibilityGen);
    yield takeLatest(HostelSettingsConstants.EDIT_HOSTEL_FACILITY_ELIGIBILITY ,editHostelFacilityEligibilityGen);

    // Hostel Fee Structure
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_FEE_STRUCTURE ,getHostelFeeStructureGen);
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_FEE_TERMS ,getHostelFeeTermsGen);
    yield takeLatest(HostelSettingsConstants.SAVE_HOSTEL_FEE_STRUCTURE ,saveHostelFeeStructureGen);
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_FEE_STRUCTURE_BY_ID ,getHostelFeeStructureByIdGen);
    yield takeLatest(HostelSettingsConstants.EDIT_HOSTEL_FEE_STRUCTURE ,editHostelFeeStructureGen);
    yield takeLatest(HostelSettingsConstants.DELETE_HOSTEL_FEE_STRUCTURE ,deleteHostelFeeStructureGen);

    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_FEE_NAME ,getHostelFeeNameGen);
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_ROOM_TYPES ,getHostelRoomTypesGen);

    //hostel details
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_DETAILS ,getHostelDetailsGen);
    yield takeLatest(HostelSettingsConstants.SAVE_HOSTEL_DETAILS ,saveHostelDetailsGen);
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_DETAILS_LIST_BY_ID, getHostelDetailsListByIdGen);
    yield takeLatest(HostelSettingsConstants.EDIT_HOSTEL_DETAILS_LIST, editHostelDetailsListGen);
    yield takeLatest(HostelSettingsConstants.DELETE_HOSTEL_DETAILS_LIST, deleteHostelDetailsListGen);

    //hostel building
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_BUILDING ,getHostelBuildingGen);
    yield takeLatest(HostelSettingsConstants.SAVE_HOSTEL_BUILDING ,saveHostelBuildingGen);
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_BUILDING_LIST_BY_ID, getHostelBuildingListByIdGen);
    yield takeLatest(HostelSettingsConstants.EDIT_HOSTEL_BUILDING_LIST, editHostelBuildingListGen);
    yield takeLatest(HostelSettingsConstants.DELETE_HOSTEL_BUILDING_LIST, deleteHostelBuildingListGen);
    
    //hostel floor
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_FLOOR ,getHostelFloorGen);
    yield takeLatest(HostelSettingsConstants.SAVE_HOSTEL_FLOOR ,saveHostelFloorGen);
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_FLOOR_LIST_BY_ID, getHostelFloorListByIdGen);
    yield takeLatest(HostelSettingsConstants.EDIT_HOSTEL_FLOOR_LIST, editHostelFloorListGen);
    yield takeLatest(HostelSettingsConstants.DELETE_HOSTEL_FLOOR_LIST, deleteHostelFloorListGen);
    
    //hostel room-type
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_ROOM_TYPE ,getHostelRoomTypeGen);
    yield takeLatest(HostelSettingsConstants.SAVE_HOSTEL_ROOM_TYPE ,saveHostelRoomTypeGen);
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_ROOM_TYPE_LIST_BY_ID, getHostelRoomTypeListByIdGen);
    yield takeLatest(HostelSettingsConstants.EDIT_HOSTEL_ROOM_TYPE_LIST, editHostelRoomTypeListGen);
    yield takeLatest(HostelSettingsConstants.DELETE_HOSTEL_ROOM_TYPE_LIST, deleteHostelRoomTypeListGen);

    //hostel room-details
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_ROOM_DETAILS ,getHostelRoomDetailsGen);
    yield takeLatest(HostelSettingsConstants.SAVE_HOSTEL_ROOM_DETAILS ,saveHostelRoomDetailsGen);
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_ROOM_DETAILS_LIST_BY_ID, getHostelRoomDetailsListByIdGen);
    yield takeLatest(HostelSettingsConstants.EDIT_HOSTEL_ROOM_DETAILS_LIST, editHostelRoomDetailsListGen);
    yield takeLatest(HostelSettingsConstants.DELETE_HOSTEL_ROOM_DETAILS_LIST, deleteHostelRoomDetailsListGen);

    //hostel particulars
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_FEE_PARTICULARS ,getHostelFeeParticularsGen);
    yield takeLatest(HostelSettingsConstants.GET_HOSTEL_FEE_PARTICULARS_BY_ID, getHostelFeeNameParticularsListByIdGen);
    yield takeLatest(HostelSettingsConstants.SAVE_HOSTEL_FEE_NAME_PARTICULARS ,saveHostelFeeNameParticularsGen);
    yield takeLatest(HostelSettingsConstants.EDIT_HOSTEL_FEE_NAME_PARTICULARS, editHostelFeeNameParticularsListGen);
    yield takeLatest(HostelSettingsConstants.DELETE_HOSTEL_FEE_NAME_PARTICULARS, deleteHostelFeeNameParticularsListGen);
    

}