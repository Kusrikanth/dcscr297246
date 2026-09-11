export interface IFeeSettingsState {
    instFeeDepartmentsResp: any;
    addInstFeeDepartmentsResp: any;
    updateInstFeeDepartmentResp: any;
    delInstFeeDepartmentResp: any;

    instFeeNamesResp:any;
    addInstFeeNameResp:any;
    updateInstFeeNameResp:any;
    deleteInstFeeNameResp:any;

    instConcessionDepartmentsResp:any;
    instFeeNameByDeptResp:any;
    addInstEmployeeConcession:any;
    updateInstEmployeeConcession:any;
    instEmployeeConcessionDepartment:any;
    instEmployeeConcession:any;
    deleteInstEmployeeConcessionResp:any;

    getPaymentGatewaysListResp:any
    getPaymentGatewaysBranchListResp:any;
    savePaymentGatewaysBranchResp:any;

    instFeeSettingError: any;
}