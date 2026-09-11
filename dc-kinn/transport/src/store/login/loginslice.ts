import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { IUserList, TLoginError } from "./logintypes";

export interface ILoginState {
  value: number;
  // eslint-disable-next-line no-restricted-globals
  status: 'idle' | 'loading' | 'failed',
  userList: Array<IUserList> | undefined,
  loginUserResp: any;
  userMeResp: any;
  forgotPasswordResp: any;
  validateOtpResp: any;
  resetPasswordResp: any;
  forgettedEmail: any;
  changePasswordResp: any;
  logoutUserResp: any;
  loggedInUserDetailResp: any;
  updateUserDetailResp: any;
  saveUserSettingsResp: any;
  getUserSettingsResp: any;
  loginErrorResp: any;
}

const initialState: ILoginState = {
  value: 0,
  status: 'idle',
  userList: undefined,
  loginUserResp: undefined,
  userMeResp: undefined,
  forgotPasswordResp: undefined,
  validateOtpResp: undefined,
  resetPasswordResp: undefined,
  forgettedEmail: undefined,
  changePasswordResp: undefined,
  logoutUserResp: undefined,
  loggedInUserDetailResp: undefined,
  updateUserDetailResp: undefined,
  saveUserSettingsResp: undefined,
  getUserSettingsResp: undefined,
  loginErrorResp: undefined
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setUserDetailsAct: (state, action: PayloadAction<IUserList[]>) => {
      state.userList = action.payload;
    },
    setLoginUserAct: (state, action: PayloadAction<any>) => {
      state.loginUserResp = action.payload;
    },
    setUserMeAct: (state, action: PayloadAction<any>) => {
      state.userMeResp = action.payload;
    },
    setForgotPasswordAct: (state, action: PayloadAction<any>) => {
      state.forgotPasswordResp = action.payload;
    },
    setValidateOtpAct: (state, action: PayloadAction<any>) => {
      state.validateOtpResp = action.payload;
    },
    setResetPasswordAct: (state, action: PayloadAction<any>) => {
      state.resetPasswordResp = action.payload;
    },
    setForgettedEmailAct: (state, action: PayloadAction<any>) => {
      state.forgettedEmail = action.payload;
    },
    setChangePasswordAct: (state, action: PayloadAction<any>) => {
      state.changePasswordResp = action.payload;
    },
    setLogoutUserAct: (state, action: PayloadAction<any>) => {
      state.logoutUserResp = action.payload;
    },
    setLoggedInUserDetailAct: (state, action: PayloadAction<any>) => {
      state.loggedInUserDetailResp = action.payload;
    },
    setUpdateUserDetailAct: (state, action: PayloadAction<any>) => {
      state.updateUserDetailResp = action.payload;
    },
    setSaveUserSettingsAct: (state, action: PayloadAction<any>) => {
      state.saveUserSettingsResp = action.payload;
    },
    setGetUserSettingsAct: (state, action: PayloadAction<any>) => {
      state.getUserSettingsResp = action.payload;
    },
    setCleanLoginDataAct: (state, action: PayloadAction<any>) => {
      state.loginUserResp = undefined;
      state.userMeResp = undefined;
      state.forgotPasswordResp = undefined;
      state.validateOtpResp = undefined;
      state.resetPasswordResp = undefined;
      state.forgettedEmail = undefined;
      state.changePasswordResp = undefined;
      state.logoutUserResp = undefined;
      state.loggedInUserDetailResp = undefined;
      state.updateUserDetailResp = undefined;
      state.saveUserSettingsResp = undefined;
      state.saveUserSettingsResp = undefined;
    },
    setLoginErrorAct: (state, action: PayloadAction<TLoginError>) => {
      state.loginErrorResp = action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount, setUserDetailsAct,
  setLoginUserAct, setUserMeAct, setForgotPasswordAct, setValidateOtpAct, setResetPasswordAct,
  setForgettedEmailAct, setChangePasswordAct, setLogoutUserAct, setLoggedInUserDetailAct,
  setUpdateUserDetailAct, setSaveUserSettingsAct, setGetUserSettingsAct,
  setCleanLoginDataAct,
  setLoginErrorAct } = loginSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.login.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.


export default loginSlice.reducer;
