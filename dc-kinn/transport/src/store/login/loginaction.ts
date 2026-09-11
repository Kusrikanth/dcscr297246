import { createAction } from "@reduxjs/toolkit";
import { LoginConstants } from "./loginconstants";
import { IActionType, INewActionType, ITestActionType } from "../types";


export { setLogoutUserAct, setForgettedEmailAct, setCleanLoginDataAct } from "./loginslice";
export const getStudentAct = createAction<INewActionType | undefined>(LoginConstants.GET_USERS_REQUEST);


export const loginUserAct = createAction<INewActionType | undefined>(LoginConstants.LOGIN_USER_REQUEST);
export const forgotPasswordAct = createAction<INewActionType | undefined>(LoginConstants.FORGOT_PASSWORD_REQUEST);
export const validateOtpAct = createAction<INewActionType | undefined>(LoginConstants.VALIDATE_OTP_REQUEST);

export const resetPasswordAct = createAction<INewActionType | undefined>(LoginConstants.RESET_PASSWORD_REQUEST);

export const changePasswordAct = createAction<INewActionType | undefined>(LoginConstants.CHANGE_PASSWORD_REQUEST);

export const getStudentActTestT = createAction<ITestActionType<string> | undefined>(LoginConstants.GET_USERS_REQUEST);

export const getUserMeAct = createAction<ITestActionType<string> | undefined>(LoginConstants.GET_USER_ME_REQUEST);


export const logoutUserAct = createAction<ITestActionType<string> | undefined>(LoginConstants.LOGOUT_USER_REQUEST);

export const getLoggedInUserDetailsAct = createAction<ITestActionType<string> | undefined>(LoginConstants.LOGGEDIN_USER_DETAIL_REQUEST);


export const updateUserDetailAct = createAction<INewActionType | undefined>(LoginConstants.UPDATE_USER_DETAIL_REQUEST);

export const getUserSettingsAct = createAction<ITestActionType<string> | undefined>(LoginConstants.GET_USER_SETTINGS);
export const saveUserSettingsAct = createAction<ITestActionType<string> | undefined>(LoginConstants.SAVE_USER_SETTINGS);
