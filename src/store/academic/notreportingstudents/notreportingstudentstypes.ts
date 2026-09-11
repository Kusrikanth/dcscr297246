export interface INotReportingStuReducerState {
    
    getNotReportingStuListResp:any;
    addNotReportingStuResp:any;
    editNotReportingStuResp : any;
    deleteNotReportingStuResp : any;
    getByIdNotReportingStuResp : any;
    exportNotReportingListResp : any;

    //Id-Card
    getIdCardListResp:any;
    approveStuIdCardResp:any;
    payStuIdCardResp:any;
    getIdCardAmountResp:any;
    getIdCardLogsResp:any;
    sendIdCardNotifcationResp:any;
    idCardCollectedByParentResp:any;
    previewIssuedIdcardResp:any;
    getStuDetailsResp:any;
    exportStudentIdCardListResp:any;
    downloadStudentIdCardZipResp:any;
    requestReuploadIdCardResp:any;
    saveVlidateStudentStatusResp:any;
    // error state 

    notReportingStuErrResp:any;

}