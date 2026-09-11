export interface IFeeConcessionReducerState {
    studentConcessionList: any;
    studentConcessionById: any;
    addStudentConcession: any;
    previousStudentConcessionResp: any;
    editStudentConcession: any;
    concessionLedgerDetails: any;
    tutionFeeConcessionList: any;
    tutionFeeConcessionById: any;
    addTutionFeeConcession: any;
    editTutionFeeConcession: any;
    employeeConcessionList: any;
    deleteFeeConcessionListResp: any;
    deleteStuConcessionListResp: any;
    bulkUploadConcessionResp: any;
    exportStuConcessionResp: any;
    exportTutionFeeConcessionResp:any;
    feeConcessionErrorState: any;

    // Student Concession Updated

    getStuConcessionListV2Resp : any;
    deleteStuConcessionListV2Resp : any;
    saveStuConcessionListV2Resp : any;
    editStuConcessionListV2Resp : any;
    getStuConcessionV2ByIdResp : any;
    exportStuConcessionV2Resp : any;
    bulkUploadConcessionV2Resp : any;
    getPrevStuConcessionListV2Resp : any;
    blukUploadConcessionErrorV2Resp : any;
}