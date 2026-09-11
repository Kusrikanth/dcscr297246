import { call, put, takeLatest } from "redux-saga/effects";
import { deleteData, getData, postData, putData } from "../../api/apiactions";
import { ICreatedActionType } from "../types";
import {
    setRoleTypesAct, setAddRoleTypeAct, setUpdateRoleTypeAct, setDeleteRoleTypeAct,
    setFeatureListAct, setMutateFeatureAct, setDeleteFeatureAct,
    setPermissionListAct, setMutatePermissionAct, setDeletePermissionAct,

    setRootFeaturesAct, setSubFeatureOfRootFeatureAct, setMutateFeaturePermissionAct,

    setAccessManagementErrorAct
} from "./accessmanagementslice";
import { AccessManagementConstants } from "./accessmanagementconstants";

function* getRoleTypesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setRoleTypesAct(response.data));
    }
}

function* addRoleTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setAddRoleTypeAct(response.data));
    }
}

function* updateRoleTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setUpdateRoleTypeAct(response.data));
    }
}

function* deleteRoleTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setDeleteRoleTypeAct(response.data));
    }
}

function* getPermissionsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setPermissionListAct(response.data));
    }
}

function* mutatePermissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setMutatePermissionAct({ ...response.data, optionalConfig: payload.optionalConfig }));
    }
}

function* deletePermissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setDeletePermissionAct(response.data));
    }
}

function* getFeaturesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setFeatureListAct(response.data));
    }
}

function* mutateFeatureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setMutateFeatureAct({ ...response.data, optionalConfig: payload.optionalConfig }));
    }
}

function* deleteFeatureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setDeleteFeatureAct(response.data));
    }
}

function* rootFeaturesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setRootFeaturesAct(response.data));
    }
}

function* subFeatureOfRootFeatureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setSubFeatureOfRootFeatureAct(response.data));
    }
}

function* mutateFeaturePermissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAccessManagementErrorAct(response.error));
    } else {
        yield put(setMutateFeaturePermissionAct(response.data));
    }
}

export default function* accessManagementSaga() {
    yield takeLatest(AccessManagementConstants.GET_ROLE_TYPES_LIST_REQUEST, getRoleTypesGen);
    yield takeLatest(AccessManagementConstants.ADD_ROLE_TYPE_REQUEST, addRoleTypeGen);
    yield takeLatest(AccessManagementConstants.UPDATE_ROLE_TYPE_REQUEST, updateRoleTypeGen);
    yield takeLatest(AccessManagementConstants.DELETE_ROLE_TYPE_REQUEST, deleteRoleTypeGen);


    yield takeLatest(AccessManagementConstants.GET_PERMISSIONS_LIST_REQUEST, getPermissionsGen);
    yield takeLatest(AccessManagementConstants.MUTATE_PERMISSION_REQUEST, mutatePermissionGen);
    yield takeLatest(AccessManagementConstants.DELETE_PERMISSION_REQUEST, deletePermissionGen);


    yield takeLatest(AccessManagementConstants.GET_FEATURES_LIST_REQUEST, getFeaturesGen);
    yield takeLatest(AccessManagementConstants.MUTATE_FEATURE_REQUEST, mutateFeatureGen);
    yield takeLatest(AccessManagementConstants.DELETE_FEATURE_REQUEST, deleteFeatureGen);


    yield takeLatest(AccessManagementConstants.GET_ROOT_FEATURE_REQUEST, rootFeaturesGen);
    yield takeLatest(AccessManagementConstants.GET_SUBFEATURE_OFROOTFEATURE_REQUEST, subFeatureOfRootFeatureGen);
    yield takeLatest(AccessManagementConstants.MUTATE_FEATURE_PERMISSION_REQUEST, mutateFeaturePermissionGen);


}