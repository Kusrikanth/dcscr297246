export interface IConcernsFeedbackReducerState {
    
    getConcernsFeedbackListResp:any;
    getConcernsFeedbackListByIdResp : any;
    getConcernsStatsResp:any;
    getCommentListResp : any;
    editCommentListResp : any;
    deleteCommentListResp : any;
    deleteConcernFileResp : any;
    addConcernFileResp : any;
    addCommentListResp : any;
    editConcernsFeedbackListResp : any;
    addConcernsFeedbackListResp : any;
    getConcernsUserListResp:any;
    allModulesListResp:any;

    // concern to parent
    getConcernsToParentListResp : any;
    saveConcernsToParentListResp : any;
    getConcernsToParentSectionListResp : any;

    // error state
    concernDeptByHeadResp: any;
    concernsFeedbackErrResp:any;
    exportConcernsFeedbackListResp:any;

    // help desk
    getHelpDeskStatsResp : any;
    getFetchRequestTypeResp : any;
    getDepartmentListResp : any;
    getMonthWiseTicketsResp : any;
    getTopTenDepartmentsResp : any;
    getTopTenDepartmentsModelResp : any;
    getDepartmentAnalysisResp : any;
    exportOpenTicketsResp : any;

}