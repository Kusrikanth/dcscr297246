import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMasterDataReducer, IBranchTypes } from "./masterdatatypes";

const initialState: IMasterDataReducer = {
    branchTypesResp: undefined,
    masterInstGroupsResp: undefined,
    masterAcademicYearResp: undefined,
    masterAcademicTermsResp: undefined,
    masterDepartmentResp: undefined,
    masterUserRoleResp: undefined,
    masterCurriculumResp: undefined,
    masterClassesResp: undefined,
    masterClassStreamGroupResp: undefined,
    masterModuleResp: undefined,
    masterTermTypesResp: undefined,
    masterInstFormsResp: undefined,
    masterSubjectTypesResp: undefined,
    academicCurrciulumResp: undefined,
    countriesResp: undefined,
    countryStateResp: undefined,
    districtResp: undefined,
    stateCityResp: undefined,
    masterTrustResp: undefined,
    masterFeeTypesResp: undefined,
    masterBanksResp: undefined,

    nationalityResp: undefined,
    religionResp: undefined,
    occupationResp: undefined,
    genderListResp: undefined,
    casteListResp: undefined,
    subCasteListResp: undefined,
    motherToungeResp: undefined,
    bloodGroupResp: undefined,
    employeeCategoriesResp: undefined,

    qualificationsListResp: undefined,
    universityListResp: undefined,
    relationTypeListResp: undefined,
    designationListResp: undefined,

    taxCategoryListResp: undefined,
    salaryCategoryListResp: undefined,
    masterIncomeResp: undefined,

    employeeStatusResp: undefined,
    maritalStatusResp: undefined,
    employeeSpecializationResp: undefined,
    hodListResp: undefined,
    reportingHeadResp: undefined,
    hrmDepartmentResp: undefined,
    houseDetailsResp: undefined,

    validateExportDataResp: undefined,
    remarksExportDataResp: undefined,
    headerCurriculumResp: undefined,
    masterDataErrorResp: undefined,
};

export const masterDataSlice = createSlice({
    name: 'masterData',
    initialState,
    reducers: {
        setBranchTypesAct: (state, action: PayloadAction<IBranchTypes[]>) => {
            state.branchTypesResp = action.payload
        },
        setMasterInstituteGroupAct: (state, action: PayloadAction<any>) => {
            state.masterInstGroupsResp = action.payload;
        },
        setMasterAcademicYearAct: (state, action: PayloadAction<any>) => {
            state.masterAcademicYearResp = action.payload;
        },
        setMasterAcademicTermAct: (state, action: PayloadAction<any>) => {
            state.masterAcademicTermsResp = action.payload;
        },
        setMasterDepartmentAct: (state, action: PayloadAction<any>) => {
            state.masterDepartmentResp = action.payload;
        },
        setMasterUserRoleAct: (state, action: PayloadAction<any>) => {
            state.masterUserRoleResp = action.payload;
        },
        setMasterCurriculumAct: (state, action: PayloadAction<any>) => {
            state.masterCurriculumResp = action.payload;
        },
        setMasterClassesAct: (state, action: PayloadAction<any>) => {
            state.masterClassesResp = action.payload;
        },
        setMasterClassStreamGroupAct: (state, action: PayloadAction<any>) => {
            state.masterClassStreamGroupResp = action.payload;
        },
        setMasterModuleAct: (state, action: PayloadAction<any>) => {
            state.masterModuleResp = action.payload;
        },
        setMasterTermTypesAct: (state, action: PayloadAction<any>) => {
            state.masterTermTypesResp = action.payload;
        },
        setMasterInstFormsAct: (state, action: PayloadAction<any>) => {
            state.masterInstFormsResp = action.payload;
        },
        setMasterSubjectTypesAct: (state, action: PayloadAction<any>) => {
            state.masterSubjectTypesResp = action.payload;
        },
        setAcademicCurriculumResp: (state, action: PayloadAction<any>) => {
            state.academicCurrciulumResp = action.payload;
        },
        setCountriesAct: (state, action: PayloadAction<any>) => {
            state.countriesResp = action.payload;
        },
        setCountryStateAct: (state, action: PayloadAction<any>) => {
            state.countryStateResp = action.payload;
        },
        setDistrictAct: (state, action: PayloadAction<any>) => {
            state.districtResp = action.payload;
        },
        setStateCityAct: (state, action: PayloadAction<any>) => {
            state.stateCityResp = action.payload;
        },
        resetCountryStateAct: (state, action: PayloadAction<any>) => {
            state.countryStateResp = action.payload;
        },
        setMasterTrustAct: (state, action: PayloadAction<any>) => {
            state.masterTrustResp = action.payload;
        },
        setMasterFeeTypesAct: (state, action: PayloadAction<any>) => {
            state.masterFeeTypesResp = action.payload;
        },
        setMasterBanksAct: (state, action: PayloadAction<any>) => {
            state.masterBanksResp = action.payload;
        },

        setNationalityAct: (state, action: PayloadAction<any>) => {
            state.nationalityResp = action.payload;
        },
        setReligionAct: (state, action: PayloadAction<any>) => {
            state.religionResp = action.payload;
        },
        setOccupationAct: (state, action: PayloadAction<any>) => {
            state.occupationResp = action.payload;
        },
        setGenderListAct: (state, action: PayloadAction<any>) => {
            state.genderListResp = action.payload;
        },
        setCasteListAct: (state, action: PayloadAction<any>) => {
            state.casteListResp = action.payload;
        },
        setSubCasteListAct: (state, action: PayloadAction<any>) => {
            state.subCasteListResp = action.payload;
        },
        setMotherToungeAct: (state, action: PayloadAction<any>) => {
            state.motherToungeResp = action.payload;
        },
        setBloodGroupAct: (state, action: PayloadAction<any>) => {
            state.bloodGroupResp = action.payload;
        },
        setEmployeeCategoriesAct: (state, action: PayloadAction<any>) => {
            state.employeeCategoriesResp = action.payload;
        },
        setQualificationListAct: (state, action: PayloadAction<any>) => {
            state.qualificationsListResp = action.payload;
        },
        setUniversityListAct: (state, action: PayloadAction<any>) => {
            state.universityListResp = action.payload;
        },
        setRelationTypeListAct: (state, action: PayloadAction<any>) => {
            state.relationTypeListResp = action.payload;
        },
        setDesignationsAct: (state, action: PayloadAction<any>) => {
            state.designationListResp = action.payload;
        },
        setTaxCategoryAct: (state, action: PayloadAction<any>) => {
            state.taxCategoryListResp = action.payload;
        },
        setSalaryCategoryAct: (state, action: PayloadAction<any>) => {
            state.salaryCategoryListResp = action.payload;
        },
        setMasterIncomeAct: (state, action: PayloadAction<any>) => {
            state.masterIncomeResp = action.payload;
        },
        setEmployeeStatusAct: (state, action: PayloadAction<any>) => {
            state.employeeStatusResp = action.payload;
        },
        setMaritalStatusAct: (state, action: PayloadAction<any>) => {
            state.maritalStatusResp = action.payload;
        },
        setEmployeeSpecializationAct: (state, action: PayloadAction<any>) => {
            state.employeeSpecializationResp = action.payload;
        },
        setHodListAct: (state, action: PayloadAction<any>) => {
            state.hodListResp = action.payload
        },
        setReporterListAct: (state, action: PayloadAction<any>) => {
            state.reportingHeadResp = action.payload
        },
        setHrmDepartmentAct: (state, action: PayloadAction<any>) => {
            state.hrmDepartmentResp = action.payload
        },
        setHouseDetailsAct: (state, action: PayloadAction<any>) => {
            state.houseDetailsResp = action.payload
        },

        setValidateExportDataAct: (state, action: PayloadAction<any>) => {
            state.validateExportDataResp = action.payload
        },
        setRemarksExportDataAct: (state, action: PayloadAction<any>) => {
            state.remarksExportDataResp = action.payload
        },
        setHeaderCurriculumAct: (state, action: PayloadAction<any>) => {
            state.headerCurriculumResp = action.payload
        },

        setMasterErrorAct: (state, action: PayloadAction<any>) => {
            state.masterDataErrorResp = action.payload;
        }
    },
});

export const { setBranchTypesAct,
    setMasterInstituteGroupAct, setMasterAcademicYearAct, setMasterAcademicTermAct,
    setMasterClassesAct, setMasterDepartmentAct, setMasterUserRoleAct, setMasterCurriculumAct, setMasterClassStreamGroupAct, setMasterModuleAct,
    setMasterTermTypesAct, setMasterInstFormsAct, setMasterSubjectTypesAct,
    setAcademicCurriculumResp, setCountriesAct, setCountryStateAct, setDistrictAct, setStateCityAct, resetCountryStateAct,

    setMasterTrustAct, setMasterFeeTypesAct, setMasterBanksAct,
    setNationalityAct, setReligionAct, setOccupationAct, setGenderListAct, setCasteListAct, setSubCasteListAct, setMotherToungeAct, setBloodGroupAct,
    setEmployeeCategoriesAct,
    setQualificationListAct, setUniversityListAct, setRelationTypeListAct,
    setDesignationsAct, setTaxCategoryAct, setSalaryCategoryAct, setMasterIncomeAct, setEmployeeStatusAct, setMaritalStatusAct,
    setEmployeeSpecializationAct, setHodListAct, setReporterListAct, setHrmDepartmentAct,
    setHouseDetailsAct,
    setValidateExportDataAct, setRemarksExportDataAct, setHeaderCurriculumAct,
    setMasterErrorAct } = masterDataSlice.actions;

export default masterDataSlice.reducer;
