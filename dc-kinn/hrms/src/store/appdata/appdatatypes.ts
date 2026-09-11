export interface IAppDataReducer {
    currentInstIdResp: any,
    currentInstCodeResp: any,
    currentBranchIdResp: any,
    loggedInUserRole: any,
    virtualRoleResp: any,
    isUserAuthenticated: any,
    loginUserDetailsResp: any,
    addStudentPayload: any;
    addEmployeePayload: any;
    addedEmployeeId: any;
    addedStudentId: any;
    currentStudentId: any;
    tcTrackingStuResp : any;
    currentQuestionsList : any;

    getLoginActivityForUserDetails: any;

    sideBarMenuOpenState: any;
}