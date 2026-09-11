export interface IMasterFeeSettingsReducerState {
    feeCategoriesResp: any;
    addFeeCategoryResp: any;
    updateFeeCategoryResp: any;
    deleteFeeCategoryResp: any;

    feeTypesResp: any;
    feeTypeByIdResp: any;
    addFeeTypesResp: any;
    updateFeeTypeResp: any;
    deleteFeeTypeResp: any;

    feeParticularsResp: any;
    feeParticularByIdResp: any;
    addFeeParticularResp: any;
    updateFeeParticularResp: any;
    deleteFeeParticularResp: any;

    specialFeesResp: any;
    specialFeeByIdResp: any;
    addSpecialFeeResp: any;
    updateSpecialFeeResp: any;
    deleteSpecialFeeResp: any;
    updateSpecialFeeStatusResp : any;

    // special feeNames
    specialfeeNamesResp:any;
    specialfeeNameByIdResp:any;
    addSpecialfeeNameItemsResp:any;
    updateSpecialfeeNameItemResp:any;
    delSpecialfeeNameItemResp:any;

    // special fee bulkupload
    specialfFeeBulkUploadResp:any;

    feeFinesResp: any;
    addFeeFineResp: any;
    updateFeeFineResp: any;
    deleteFeeFineResp: any;

    feeConcessionsResp: any;
    addFeeConcessionResp: any;
    updateFeeConcessionResp: any;
    deleteFeeConcessionResp: any;
    
    transportFeeConcessionsResp: any;
    addTransportFeeConcessionResp: any;
    updateTransportFeeConcessionResp: any;
    deleteTransportFeeConcessionResp: any;

    feeStructuresResp: any;
    feeStructureByIdResp: any;
    feeStructureForClassResp: any;
    addFeeStructureResp: any;
    updateFeeStructureResp: any;
    deleteFeeStructureResp: any;

    feeReceiptsResp: any;
    addFeeReceiptResp: any;
    updateFeeReceiptesp: any;
    deleteFeeReceiptResp: any;

    getSpecialFeePaymentListResp: any;
    getSpecialFeeCategoryListResp: any;
    getConcessionDashboardDataListResp: any;
    getStudentConcessionListResp: any;
    exportStuConcessionDetailsResp: any;

    addFeeConcessionTypeResp: any;
    getFeeConcessionTypeListResp: any;
    updateFeeConcessionTypeResp: any;
    deleteFeeConcessionTypeResp: any;

    getJodoFeeStructureResp: any;

    masterFeeSettingsErrorResp: any;
}