export interface IHealthRecordsReducerState {

    // Health Records 

    getHealthRecordsListResp: any;
    getStuHealthDetailsResp : any;
    getEmpHealthDetailsResp : any;
    getStuAlimentListResp : any;
    saveHealthRecordsListResp : any;
    editHealthRecordsListResp : any;
    getHealthRecordsListByIdResp : any;
    exportHealthRecordsResp: any;
    exportEmpHealthRecordsResp: any;

    // mi rooms

    getMiRoomListResp : any;
    getMiRoomListByIdResp : any;
    editMiRoomListResp : any;
    saveMiRoomListResp : any;
    deleteMiRoomListResp : any;

    getStuHealthIssueListResp : any;
    exportStudentHealthIssuesResp : any;
    getRegistrationHealthIssueListResp : any;

    //settings
    //sub-alingments

    getSubAlingmentsListResp : any;
    saveSubAlingmentsResp : any;
    editSubAlingmentsResp : any;
    deleteSubAlingmentsListResp : any;

    // Medicen

    getMedicenListResp : any;
    getMedicenListByIdResp : any;
    editMedicenListResp : any;
    saveMedicenListResp : any;
    deleteMedicenListResp : any;
    //error state

    healthRecordsErrResp: any;
}