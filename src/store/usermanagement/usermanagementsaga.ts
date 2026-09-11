import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setRoleTypeUsersAct,setSingleCreateUserRespAct, setUpdateRoleTypeUserAct,
    setDeleteRoleTypeUserAct, setChangePasswordRoleTypeUserAct,
    setDeactivateRoleTypeUserAct, setUserLoginActivityAct, setUserManagementErrorAct,
    setMultipleCreateUserAct, setRoleTypePermissionAct, setRoleTypeUserByIdAct,
    setLoginHistoryAct,
    setOSListAct,
    setExportLoginHistoryAct,
    setExportNotLoginUsersAct,
    setNotLoginUsersAct,
    setRoleTypeListAct,
    setIPRestrictionAct,
    deleteIPRestrictionAct,
    saveIPRestrictionAct,
    updateIPRestrictionAct,
    exportIPRestrictionAct
} from "./usermanagementslice";
import { UserManagementConstants } from "./usermanagementconstants";
import { deleteData, getData, postData, putData } from "../../api/apiactions";
import { ICreatedActionType } from "../types";

function* getRoleTypeUsersGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setRoleTypeUsersAct(response.data));
    }
}

function* singleCreateUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setSingleCreateUserRespAct(response.data));
    }
}

function* updateRoleTypeUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setUpdateRoleTypeUserAct(response.data));
    }
}

function* deleteRoleTypeUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setDeleteRoleTypeUserAct(response.data));
    }
}

function* getRoleTypeUserByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setRoleTypeUserByIdAct(response.data));
    }
}

function* changePasswordRoleTypeUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setChangePasswordRoleTypeUserAct({ statusCode: response.status }));
    }
}

function* deactivateRoleTypeUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setDeactivateRoleTypeUserAct(response.data));
    }
}

function* getUserLoginActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setUserLoginActivityAct(response.data));
    }
}
function* multipleCreateUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setMultipleCreateUserAct({ statusCode: response.status }));
    }
}

function* getRoleTypePermissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setRoleTypePermissionAct(response.data));
    }
}
function* getLoginHistoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setLoginHistoryAct(response.data));
    }
}
function* getOSListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setOSListAct(response.data));
    }
}

function* exportLoginHistoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setExportLoginHistoryAct(response.data));
    }
}
function* exportNotLoginUsersGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setExportNotLoginUsersAct(response.data));
    }
}
function* getNotLoginUsersGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setNotLoginUsersAct(response.data));
    }
}
function* getRoleTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setRoleTypeListAct(response.data));
    }
}
function* getIPRestrictionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(setIPRestrictionAct(response.data));
    }
}

function* deleteIPRestrictionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(deleteIPRestrictionAct({ statusCode: response.status }));
    }
}
function* saveIPRestrictionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(saveIPRestrictionAct({ statusCode: response.status }));
    }
}
function* exportIPRestrictionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(exportIPRestrictionAct(response.data));
    }
}

function* updateIPRestrictionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setUserManagementErrorAct(response.error));
    } else {
        yield put(updateIPRestrictionAct({ statusCode: response.status }));
    }
}


export default function* userManagementSaga() {
    yield takeLatest(UserManagementConstants.GET_ROLETYPE_USERS_REQUEST, getRoleTypeUsersGen);
    yield takeLatest(UserManagementConstants.SINGLE_CREATE_USER_REQUEST, singleCreateUserGen);

    yield takeLatest(UserManagementConstants.UPDATE_ROLETYPE_USER_REQUEST, updateRoleTypeUserGen);
    yield takeLatest(UserManagementConstants.DELETE_ROLETYPE_USER_REQUEST, deleteRoleTypeUserGen);
    yield takeLatest(UserManagementConstants.GET_ROLETYPE_USER_BYID_REQUEST, getRoleTypeUserByIdGen);

    yield takeLatest(UserManagementConstants.CHANGE_PASSWORD_ROLETYPE_USER_REQUEST, changePasswordRoleTypeUserGen);
    yield takeLatest(UserManagementConstants.DEACTIVATE_ROLETYPE_USER_REQUEST, deactivateRoleTypeUserGen);
    yield takeLatest(UserManagementConstants.GET_USER_LOGIN_ACTIVITY_REQUEST, getUserLoginActivityGen);
    yield takeLatest(UserManagementConstants.MULTIPLE_CREATE_USER_REQUEST, multipleCreateUserGen);
    yield takeLatest(UserManagementConstants.GET_ROLETYPE_PERMISSION_REQUEST, getRoleTypePermissionGen);
    yield takeLatest(UserManagementConstants.GET_LOGIN_HISTORY, getLoginHistoryGen);
    yield takeLatest(UserManagementConstants.GET_OS_LIST, getOSListGen);
    yield takeLatest(UserManagementConstants.EXPORT_LOGIN_HISTORY, exportLoginHistoryGen);
    yield takeLatest(UserManagementConstants.EXPORT_NOT_LOGIN_USERS, exportNotLoginUsersGen);
    yield takeLatest(UserManagementConstants.GET_NOT_LOGIN_USERS, getNotLoginUsersGen);
    yield takeLatest(UserManagementConstants.GET_ROLE_TYPE_LIST, getRoleTypeListGen);
    yield takeLatest(UserManagementConstants.GET_IP_RESTRICTION, getIPRestrictionGen);
    yield takeLatest(UserManagementConstants.DELETE_IP_RESTRICTION, deleteIPRestrictionGen);
    yield takeLatest(UserManagementConstants.SAVE_IP_RESTRICTION, saveIPRestrictionGen);
    yield takeLatest(UserManagementConstants.UPDATE_IP_RESTRICTION, updateIPRestrictionGen);
    yield takeLatest(UserManagementConstants.EXPORT_IP_RESTRICTION, exportIPRestrictionGen);
}