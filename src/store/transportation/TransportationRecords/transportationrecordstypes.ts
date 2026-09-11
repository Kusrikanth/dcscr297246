export interface IRouteListReducerState {
    // all students

    getAllStudentsTransRecListResp: any,
    exportAllNewRequestResp:any,

    // new requests

    getNewRequestListResp: any,

    requestNoForTransportResp: any,
    approveTransportResp: any,

    termsTransportBySlabIdResp: any,
    transportRequestByIdResp: any,
    approveSubmittedTransportResp: any,
    deleteTransportReqResp: any,
    exportTransportNewReqResp: any,

    // change request

    getChangeRequestListResp: any,
    getAllocationDetailsResp : any,

    // termination

    getTerminationListResp: any,
    addTerminationReqResp: any,
    getTermsForTerminationReqResp: any,
    rejectTerminationReqResp : any,

    // student records

    getStuTransportationRecordsResp : any,
    exportStuTransportationRecordsResp : any,

    // employee records

    getEmpTransportationRecordsResp : any,
    exportEmpTransportationRecordsResp : any;
    
    // error state

    transportationRecordsErrorResp: any,

}