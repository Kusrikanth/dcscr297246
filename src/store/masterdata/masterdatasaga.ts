import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  setBranchTypesAct,
  setMasterInstituteGroupAct,
  setMasterAcademicYearAct,
  setMasterAcademicTermAct,
  setMasterClassesAct,
  setMasterDepartmentAct,
  setMasterUserRoleAct,
  setMasterCurriculumAct,
  setMasterModuleAct,
  setMasterTermTypesAct,
  setMasterInstFormsAct,
  setMasterSubjectTypesAct,
  setAcademicCurriculumResp,
  setCountriesAct, setCountryStateAct, setStateCityAct, setMasterTrustAct,
  setMasterFeeTypesAct, setMasterBanksAct,
  setNationalityAct, setReligionAct, setOccupationAct, setGenderListAct, setCasteListAct, setMotherToungeAct, setBloodGroupAct,
  setEmployeeCategoriesAct,
  setQualificationListAct, setUniversityListAct, setRelationTypeListAct,
  setDesignationsAct,
  setTaxCategoryAct, setSalaryCategoryAct, setMasterIncomeAct,
  setMasterErrorAct,
  setEmployeeStatusAct,
  setMaritalStatusAct,
  setEmployeeSpecializationAct,
  setHodListAct,
  setReporterListAct,
  setHrmDepartmentAct,
  setHouseDetailsAct,
  setDistrictAct,
  setValidateExportDataAct, setRemarksExportDataAct,
  setHeaderCurriculumAct,
  setSubCasteListAct,
  setMasterClassStreamGroupAct
} from "./masterdataslice";
import { MasterDataConstants } from "./masterdataconstants";
import { getData, postData, putData } from "../../api/apiactions";
import { IBranchTypes } from "./masterdatatypes";
import { ICreatedActionType } from "../types";

function* getBranchTypesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setBranchTypesAct(response.data));
  }
}
function* getInstituteGroupsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterInstituteGroupAct(response.data));
  }
}

function* getMasterDepartmentGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterDepartmentAct(response.data));
  }
}
function* getMasterUserRoleGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterUserRoleAct(response.data));
  }
}

function* getMasterAcademicYearGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterAcademicYearAct(response.data));
  }
}

function* getMasterAcademicTermGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterAcademicTermAct(response.data));
  }
}

function* getMasterCurriculumGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterCurriculumAct(response.data));
  }
}
function* getMasterClassesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterClassesAct(response.data));
  }
}
function* getMasterClassStreamGroupGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterClassStreamGroupAct(response.data));
  }
}
function* getMasterModuleGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterModuleAct(response.data));
  }
}

function* getMasterTermTypesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterTermTypesAct(response.data));
  }
}

function* getMasterInstFormsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterInstFormsAct(response.data));
  }
}

function* getMasterSubjectTypesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterSubjectTypesAct(response.data));
  }
}

function* getAcademicCurriculumGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setAcademicCurriculumResp(response.data));
  }
}

function* getCountriesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setCountriesAct(response.data));
  }
}

function* getCountryStateGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setCountryStateAct(response.data));
  }
}
function* getDistrictGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setDistrictAct(response.data));
  }
}
function* getStateCityGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setStateCityAct(response.data));
  }
}

function* getMasterTrustGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterTrustAct(response.data));
  }
}

function* getMasterFeeTypesAct(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterFeeTypesAct(response.data));
  }
}

function* getMasterBanksGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterBanksAct(response.data));
  }
}

function* getNationalityGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setNationalityAct(response.data));
  }
}

function* getReligionGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setReligionAct(response.data));
  }
}
function* getOccupationGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setOccupationAct(response.data));
  }
}
function* getGenderListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setGenderListAct(response.data));
  }
}
function* getCasteListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setCasteListAct(response.data));
  }
}
function* getSubCasteListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setSubCasteListAct(response.data));
  }
}

function* getMotherToungeGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMotherToungeAct(response.data));
  }
}

function* getBloodGroupGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setBloodGroupAct(response.data));
  }
}

function* getEmployeeCategoryGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setEmployeeCategoriesAct(response.data));
  }
}
function* getQualificationListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setQualificationListAct(response.data));
  }
}
function* getUniversityListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setUniversityListAct(response.data));
  }
}
function* getRelationTypeListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setRelationTypeListAct(response.data));
  }
}
function* getDesignationsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setDesignationsAct(response.data));
  }
}
function* getTaxCategoryGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setTaxCategoryAct(response.data));
  }
}
function* getSalaryCatgoryGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setSalaryCategoryAct(response.data));
  }
}

function* getMasterIncomeGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMasterIncomeAct(response.data));
  }
}


function* getEmployeeStatusGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setEmployeeStatusAct(response.data));
  }
}
function* getMaritalStatusGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setMaritalStatusAct(response.data));
  }
}
function* getEmployeeSpecializationGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setEmployeeSpecializationAct(response.data));
  }
}

function* getHodListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setHodListAct(response.data));
  }
}
function* getReporterListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setReporterListAct(response.data));
  }
}
function* getHrmDepartmentListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setHrmDepartmentAct(response.data));
  }
}

function* getHouseDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setHouseDetailsAct(response.data));
  }
}

function* validateExportDataGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setValidateExportDataAct(response.data));
  }
}

function* remarksExportDataGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setRemarksExportDataAct({ statusCode: response.status }));
  }
}


function* getHeaderCurriculumGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setMasterErrorAct(response.error));
  } else {
    yield put(setHeaderCurriculumAct(response.data));
  }
}



export default function* masterDataSaga() {
  yield takeLatest(
    MasterDataConstants.GET_BRANCH_TYPE_REQUEST,
    getBranchTypesGen
  );
  yield takeLatest(
    MasterDataConstants.GET_INSTITUTE_GROUPS_REQUEST,
    getInstituteGroupsGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_DEPARTMENT_REQUEST,
    getMasterDepartmentGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_ACADEMIC_YEAR_REQUEST,
    getMasterAcademicYearGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_ACADEMIC_TERM_REQUEST,
    getMasterAcademicTermGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_MODULE_REQUEST,
    getMasterModuleGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_CURRICULUM_REQUEST,
    getMasterCurriculumGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_CLASSES_REQUEST,
    getMasterClassesGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_CLASS_STREAM_GROUP_REQUEST,
    getMasterClassStreamGroupGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_USER_ROLE_REQUEST,
    getMasterUserRoleGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_TERM_TYPES_REQUEST,
    getMasterTermTypesGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_INST_FORMS_REQUEST,
    getMasterInstFormsGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_SUBJECT_TYPE_REQUEST,
    getMasterSubjectTypesGen
  );
  yield takeLatest(
    MasterDataConstants.GET_ACADEMIC_CURRICULUM_REQUEST,
    getAcademicCurriculumGen
  );
  yield takeLatest(
    MasterDataConstants.GET_COUNTRIES_REQUEST,
    getCountriesGen
  );
  yield takeLatest(
    MasterDataConstants.GET_COUNTRY_STATE_REQUEST,
    getCountryStateGen
  );
  yield takeLatest(
    MasterDataConstants.GET_DISTRICT_REQUEST,
    getDistrictGen
  );
  yield takeLatest(
    MasterDataConstants.GET_STATE_CITY_REQUEST,
    getStateCityGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_TRUST_REQUEST,
    getMasterTrustGen
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_FEE_TYPES,
    getMasterFeeTypesAct
  );
  yield takeLatest(
    MasterDataConstants.GET_MASTER_BANKS_REQUEST,
    getMasterBanksGen
  );

  yield takeLatest(MasterDataConstants.GET_NATIONALITY_LIST_REQUEST, getNationalityGen);
  yield takeLatest(MasterDataConstants.GET_RELIGION_REQUEST, getReligionGen);
  yield takeLatest(MasterDataConstants.GET_CASTE_LIST_REQUEST, getCasteListGen);
  yield takeLatest(MasterDataConstants.GET_SUB_CASTE_LIST_REQUEST, getSubCasteListGen);
  yield takeLatest(MasterDataConstants.GET_OCCUPATION_REQUEST, getOccupationGen);
  yield takeLatest(MasterDataConstants.GET_GENDER_LIST_REQUEST, getGenderListGen);
  yield takeLatest(MasterDataConstants.GET_MOTHER_TOUNGE_REQUEST, getMotherToungeGen);
  yield takeLatest(MasterDataConstants.GET_BLOOD_GROUP_LIST_REQUEST, getBloodGroupGen);
  yield takeLatest(MasterDataConstants.GET_EMPLOYEE_CATEGORIES_REQUEST, getEmployeeCategoryGen);

  yield takeLatest(MasterDataConstants.GET_QUALIFICATION_REQUEST, getQualificationListGen);
  yield takeLatest(MasterDataConstants.GET_UNIVERSITY_REQUEST, getUniversityListGen);
  yield takeLatest(MasterDataConstants.GET_RELATION_TYPE_REQUEST, getRelationTypeListGen);
  yield takeLatest(MasterDataConstants.GET_DESIGNATIONS_REQUEST, getDesignationsGen);

  yield takeLatest(MasterDataConstants.GET_TAX_CATEGORY_REQUEST, getTaxCategoryGen);
  yield takeLatest(MasterDataConstants.GET_SALARY_CATEGORY_REQUEST, getSalaryCatgoryGen);
  yield takeLatest(MasterDataConstants.GET_MASTER_INCOME_REQUEST, getMasterIncomeGen);

  yield takeLatest(MasterDataConstants.GET_EMPLOYEE_STATUS, getEmployeeStatusGen);
  yield takeLatest(MasterDataConstants.GET_MARITAL_STATUS, getMaritalStatusGen);
  yield takeLatest(MasterDataConstants.GET_EMPLOYEE_SPECIALIZATION_REQUEST, getEmployeeSpecializationGen);
  yield takeLatest(MasterDataConstants.GET_HOD_LIST_REQUEST, getHodListGen);
  yield takeLatest(MasterDataConstants.GET_REPORTER_LIST_REQUEST, getReporterListGen);
  yield takeLatest(MasterDataConstants.GET_HRM_DEPARTMENT_LIST_REQUEST, getHrmDepartmentListGen);

  yield takeLatest(MasterDataConstants.GET_HOUSE_DETAILS_REQUEST, getHouseDetailsGen);

  yield takeLatest(MasterDataConstants.VALIDATE_EXPORT_DATA_REQUEST, validateExportDataGen);
  yield takeLatest(MasterDataConstants.REMARKS_EXPORT_DATA_REQUEST, remarksExportDataGen);

  yield takeLatest(MasterDataConstants.GET_HEADER_CURRICULUM_REQUEST, getHeaderCurriculumGen);
  
}
