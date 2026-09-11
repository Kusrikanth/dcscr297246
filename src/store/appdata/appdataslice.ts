import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppDataReducer } from "./appdatatypes";

const initialState: IAppDataReducer = {
    currentInstIdResp: undefined,
    currentInstCodeResp: undefined,
    currentBranchIdResp: undefined,
    loggedInUserRole: undefined,
    virtualRoleResp: undefined,
    isUserAuthenticated: undefined,
    loginUserDetailsResp: undefined,
    addStudentPayload: undefined,
    addEmployeePayload: undefined,
    addedEmployeeId: undefined,
    currentStudentId: undefined,
    tcTrackingStuResp: undefined,
    currentQuestionsList : undefined,

    getLoginActivityForUserDetails: undefined,
    addedStudentId: undefined,
    sideBarMenuOpenState: undefined,
};

export const appDataSlice = createSlice({
    name: 'appData',
    initialState,
    reducers: {
        setCurrentInstIdAct: (state, action: PayloadAction<any>) => {
            state.currentInstIdResp = action.payload
        },
        setCurrentInstCodeAct: (state, action: PayloadAction<any>) => {
            state.currentInstCodeResp = action.payload
        },
        setCurrentBranchIdAct: (state, action: PayloadAction<any>) => {
            state.currentBranchIdResp = action.payload;
        },
        setLoggedinUserRoleAct: (state, action: PayloadAction<any>) => {
            state.loggedInUserRole = action.payload;
        },
        setVirtualRoleAct: (state, action: PayloadAction<any>) => {
            state.virtualRoleResp = action.payload;
        },
        setAuthenticatedUserAct: (state, action: PayloadAction<any>) => {
            state.isUserAuthenticated = action.payload;
        },
        setUserDetailsAct: (state, action: PayloadAction<any>) => {
            state.loginUserDetailsResp = action.payload;
        },
        setAddStudentPayloadAct: (state, action: PayloadAction<any>) => {
            state.addStudentPayload = action.payload;
        },
        setAddEmployeePayloadAct: (state, action: PayloadAction<any>) => {
            state.addEmployeePayload = action.payload;
        },
        setAddedStudentIdAct: (state, action: PayloadAction<any>) => {
            state.addedStudentId = action.payload;
        },
        setLoginActivityForUserDetailsAct: (state, action: PayloadAction<any>) => {
            state.getLoginActivityForUserDetails = action.payload;
        },
        setAddedEmployeeIdAct: (state, action: PayloadAction<any>) => {
            state.addedEmployeeId = action.payload;
        },
        setSideBarMenuOpenStateAct: (state, action: PayloadAction<any>) => {
            state.sideBarMenuOpenState = action.payload;
        },
        setCurrentStudentIdAct: (state, action: PayloadAction<any>) => {
            state.currentStudentId = action.payload;
        },
        setTcTrackingStuAct: (state, action: PayloadAction<any>) => {
            state.tcTrackingStuResp = action.payload;
        },
        setCurrentQuestionsAct: (state, action: PayloadAction<any>) => {
            state.currentQuestionsList = action.payload;
        },
        cleanAppDataStateAct: (state, action: PayloadAction<any>) => {
            state.currentInstIdResp = undefined;
            state.currentBranchIdResp = undefined;
            state.loggedInUserRole = undefined;
            state.virtualRoleResp = undefined;
            state.isUserAuthenticated = undefined;
            state.loginUserDetailsResp = undefined;
            state.addStudentPayload = undefined;
            state.addEmployeePayload = undefined;
            state.addedEmployeeId = undefined;
            state.tcTrackingStuResp = undefined;

            state.getLoginActivityForUserDetails = undefined;
            state.addedStudentId = undefined;
            state.currentStudentId = undefined;
            state.sideBarMenuOpenState = undefined;
        },
    },
});

export const { setCurrentInstIdAct, setAuthenticatedUserAct,setCurrentInstCodeAct,
    setLoggedinUserRoleAct, setVirtualRoleAct, setCurrentBranchIdAct,
    setAddStudentPayloadAct, setAddEmployeePayloadAct,setCurrentQuestionsAct,
    setAddedStudentIdAct, setLoginActivityForUserDetailsAct, setAddedEmployeeIdAct,setTcTrackingStuAct,
    cleanAppDataStateAct, setCurrentStudentIdAct } = appDataSlice.actions;

export default appDataSlice.reducer;
