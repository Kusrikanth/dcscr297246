import { createAction } from "@reduxjs/toolkit";
import { MasterDataConstants } from "./masterdataconstants";
import { INewActionType } from "../types";

export {
    resetCountryStateAct, setCountryStateAct, setQualificationListAct,
    setDesignationsAct,
    setStateCityAct
} from "./masterdataslice";
export const getBranchTypesAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_BRANCH_TYPE_REQUEST);

export const getInstituteGroupsAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_INSTITUTE_GROUPS_REQUEST);

export const getMasterDepartmentAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_DEPARTMENT_REQUEST);

export const getMasterUserRoleAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_USER_ROLE_REQUEST);

export const getMasterAcademicYearAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_ACADEMIC_YEAR_REQUEST);

export const getMasterAcademicTermAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_ACADEMIC_TERM_REQUEST);

export const getMasterCurriculumAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_CURRICULUM_REQUEST);

export const getMasterClassesAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_CLASSES_REQUEST);

export const getMasterClassStreamGroupAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_CLASS_STREAM_GROUP_REQUEST);

export const getMasterModuelAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_MODULE_REQUEST);


export const getMasterTermTypesAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_TERM_TYPES_REQUEST);



export const getMasterInstFormsAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_INST_FORMS_REQUEST);

export const getMasterSubjectTypeAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_SUBJECT_TYPE_REQUEST);


export const getAcademicCurriculumAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_ACADEMIC_CURRICULUM_REQUEST);


export const getCountriesAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_COUNTRIES_REQUEST);
export const getCountryStateAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_COUNTRY_STATE_REQUEST);
export const getDistrictAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_DISTRICT_REQUEST);
export const getStateCityAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_STATE_CITY_REQUEST);

export const getMasterTrustAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_TRUST_REQUEST);

export const getMasterFeeTypesAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_FEE_TYPES);


export const getMasterBanksAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_BANKS_REQUEST);


export const getNationalityAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_NATIONALITY_LIST_REQUEST);

export const getReligionAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_RELIGION_REQUEST);

export const getOccupationAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_OCCUPATION_REQUEST);

export const getGenderListAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_GENDER_LIST_REQUEST);

export const getCasteListAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_CASTE_LIST_REQUEST);

export const getSubCasteListAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_SUB_CASTE_LIST_REQUEST);

export const getMotherToungeAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MOTHER_TOUNGE_REQUEST);

export const getBloodGroupAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_BLOOD_GROUP_LIST_REQUEST);

export const getEmployeeCategoriesAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_EMPLOYEE_CATEGORIES_REQUEST);


export const getQualificationAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_QUALIFICATION_REQUEST);
export const getUniversityAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_UNIVERSITY_REQUEST);
export const getRelationTypeAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_RELATION_TYPE_REQUEST);
export const getDesignationsAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_DESIGNATIONS_REQUEST);

export const getTaxCategoryAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_TAX_CATEGORY_REQUEST);
export const getSalaryCategoryAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_SALARY_CATEGORY_REQUEST);
export const getMasterIncomeAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MASTER_INCOME_REQUEST);


export const getEmployeeStatusAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_EMPLOYEE_STATUS);
export const getMaritalStatusAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_MARITAL_STATUS);

export const getEmployeeSpecializationAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_EMPLOYEE_SPECIALIZATION_REQUEST);
export const getHODListAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_HOD_LIST_REQUEST);
export const getReporterListAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_REPORTER_LIST_REQUEST);
export const getHrmDepartmentsListAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_HRM_DEPARTMENT_LIST_REQUEST);

export const getHouseDetailsAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_HOUSE_DETAILS_REQUEST);


export const validateExportDataAct = createAction<INewActionType | undefined>(MasterDataConstants.VALIDATE_EXPORT_DATA_REQUEST);
export const remarksExportDataAct = createAction<INewActionType | undefined>(MasterDataConstants.REMARKS_EXPORT_DATA_REQUEST);

export const getHeaderCurriculumAct = createAction<INewActionType | undefined>(MasterDataConstants.GET_HEADER_CURRICULUM_REQUEST);

