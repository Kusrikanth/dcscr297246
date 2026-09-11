export interface IMasterDataReducer {
    branchTypesResp: IBranchTypes[] | undefined;
    masterInstGroupsResp: any;
    masterAcademicYearResp: any;
    masterAcademicTermsResp: any;
    masterDepartmentResp: any;
    masterUserRoleResp: any;
    masterCurriculumResp: any;
    masterClassesResp: any;
    masterClassStreamGroupResp: any;
    masterModuleResp: any;
    masterTermTypesResp: any;
    masterInstFormsResp: any;
    masterSubjectTypesResp: any;
    academicCurrciulumResp: any;
    countriesResp: any;
    countryStateResp: any;
    districtResp: any;
    stateCityResp: any;
    masterTrustResp: any;
    masterFeeTypesResp: any;
    masterBanksResp: any;
    nationalityResp: any;
    religionResp: any;
    occupationResp: any;
    genderListResp: any;
    casteListResp: any;
    subCasteListResp: any;
    motherToungeResp: any;
    bloodGroupResp: any;
    qualificationsListResp: any;
    universityListResp: any;
    relationTypeListResp: any;
    designationListResp: any;
    taxCategoryListResp: any;
    salaryCategoryListResp: any;
    masterIncomeResp: any;
    employeeStatusResp: any;
    maritalStatusResp: any;
    employeeSpecializationResp: any;
    hodListResp: any;
    reportingHeadResp: any;
    hrmDepartmentResp: any;
    houseDetailsResp: any;
    employeeCategoriesResp: any;

    validateExportDataResp: any;
    remarksExportDataResp: any;
    headerCurriculumResp: any;
    masterDataErrorResp: any;

}

export interface IBranchTypes {
    id: string;
    active: boolean;
    name: string;
    status: string;
}