import axios, { AxiosError, AxiosResponse } from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
    setUserDetailsAct,
    setLoginUserAct, setUserMeAct, setForgotPasswordAct, setValidateOtpAct, setResetPasswordAct,
    setChangePasswordAct,
    setLoginErrorAct,
    setLogoutUserAct, setUpdateUserDetailAct, setLoggedInUserDetailAct,
    setSaveUserSettingsAct,
    setGetUserSettingsAct
} from "./loginslice";
import { IUserList, IUserError } from "./logintypes";
import { LoginConstants } from "./loginconstants";
import { getData, postData, putData } from "../../api/apiactions";
import { IApiResponse, IActionType, INewActionType, ICreatedActionType } from "../types";

function* fetchUserDetails(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setUserDetailsAct(response.data));
    }
}

function* loginUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setLoginUserAct(response.data));
    }
}


function* getUserMeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setUserMeAct(response.data));
    }
}

function* forgotPasswordGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setForgotPasswordAct(response.data));
    }
}
function* resetPasswordGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setResetPasswordAct(response.data));
    }
}

function* validateOtpGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setValidateOtpAct(response.data));
    }
}

function* changePasswordGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setChangePasswordAct({ statusCode: response.status }));
    }
}

function* logoutUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setLogoutUserAct({ statusCode: response.status }));
    }
}


function* getLoggedInUserDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setLoggedInUserDetailAct(response.data));
    }
}

function* updateUserDetailGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setUpdateUserDetailAct({ statusCode: response.status }));
    }
}

function* saveUserSettingsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setSaveUserSettingsAct({ statusCode: response.status }));
    }
}

function* getUserSettingsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLoginErrorAct(response.error));
    } else {
        yield put(setGetUserSettingsAct(response.data));
    }
}

export default function* loginSaga() {
    yield takeLatest(LoginConstants.GET_USERS_REQUEST, fetchUserDetails);
    yield takeLatest(LoginConstants.LOGIN_USER_REQUEST, loginUserGen);
    yield takeLatest(LoginConstants.GET_USER_ME_REQUEST, getUserMeGen);
    yield takeLatest(LoginConstants.FORGOT_PASSWORD_REQUEST, forgotPasswordGen);
    yield takeLatest(LoginConstants.RESET_PASSWORD_REQUEST, resetPasswordGen);
    yield takeLatest(LoginConstants.VALIDATE_OTP_REQUEST, validateOtpGen);
    yield takeLatest(LoginConstants.CHANGE_PASSWORD_REQUEST, changePasswordGen);
    yield takeLatest(LoginConstants.LOGOUT_USER_REQUEST, logoutUserGen);
    yield takeLatest(LoginConstants.LOGGEDIN_USER_DETAIL_REQUEST, getLoggedInUserDetailsGen);
    yield takeLatest(LoginConstants.UPDATE_USER_DETAIL_REQUEST, updateUserDetailGen);
    yield takeLatest(LoginConstants.SAVE_USER_SETTINGS, saveUserSettingsGen);
    yield takeLatest(LoginConstants.GET_USER_SETTINGS, getUserSettingsGen);
}