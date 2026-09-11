import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setEmployeesStatsAct, setEmployeesListAct, setAddEmployeeAct, setUpdateEmployeeAct,
    setGetEmployeeByIdAct, setDeleteEmployeeAct, setUploadEmployeeDocumentAct,
    setEmployeeMngmntErrorAct, setDownDocumentByIdAct, setEmployeesByFilterAct,
    setEmployeeDocumentListAct, setReporterListAct, setReportingClassDivisionListAct,
    setHodListAct, setExportEmployeeDataAct,
    setAllCompaniesListAct,
    setOtherEmployeesListAct,
    setCompanyDetailsListByIdAct,
    setSaveCompanyDetailsListAct,
    setEditCompanyDetailsListAct,
    setDelCompanyDetailsListAct,
    setOtherExportEmployeeDataAct,
    setEmployeesNameByFilterAct
} from "./employeemanagementslice";
import { EmployeeManagementConstants } from "./employeemanagementconstants";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getEmployeesStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setEmployeesStatsAct(response.data));
    }
}

function* getEmployeesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setEmployeesListAct(response.data));
    }
}

function* getOtherEmployeesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setOtherEmployeesListAct(response.data));
    }
}
function* getReporterListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setReporterListAct(response.data));
    }
}
function* getReportingClassDivisionListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setReportingClassDivisionListAct(response.data));
    }
}
function* getHodListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setHodListAct(response.data));
    }
}

function* addEmployeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
        // yield put(setAddEmployeeAct({
        //     "instituteId": 50,
        //     "branchId": 21,
        //     "employeeBasicDetails": {
        //         "id": 140,
        //         "employeeName": "Employee Name",
        //         "dob": "2023-02-22",
        //         "genderId": 1,
        //         "nationalityId": 1,
        //         "religionId": 1,
        //         "casteId": 6,
        //         "maritalStatusId": 2,
        //         "personalEmailId": "employee@gmail.com",
        //         "aadharNo": "1234567890",
        //         "contactNo": "2343243243",
        //         "bloodGroupId": 4,
        //         "identificationMark1": "Mole",
        //         "identificationMark2": "Mole",
        //         "userTypeId": 26
        //     },
        //     "employeeEducationDetails": {
        //         "employeeId": 140,
        //         "qualificationId": 1,
        //         "univerisityId": 8,
        //         "passoutYear": 2022,
        //         "specializationId": 1,
        //         "otherAchievements": "Other activement"
        //     },
        //     "employeeContactDetails": {
        //         "id": 127,
        //         "addressLine": "Address",
        //         "area": "Area",
        //         "stateId": 26,
        //         "cityId": 51,
        //         "district": "District",
        //         "pincode": "1234"
        //     },
        //     "employeeDependentDetails": [
        //         {
        //             "id": 123,
        //             "dependentName": "Dependency",
        //             "relationTypeId": 1,
        //             "dependentContactNo": "3243243243"
        //         }
        //     ],
        //     "employeeEmergencyDetails": [
        //         {
        //             "id": 122,
        //             "emergencyContactPerson": "emergency",
        //             "emergencyRelationId": 1,
        //             "emergencyContactNo": "3243243243"
        //         }
        //     ],
        //     "employeeMarriageInfo": {
        //         "employeeId": 140,
        //         "marriageCertificateNo": 412654,
        //         "marriageCertificateDor": "2023-02-23"
        //     },
        //     "employeeCurrentJob": {
        //         "employeeId": 140,
        //         "biometricId": 21348654,
        //         "workEmailId": "work@gmail.com",
        //         "workPhoneNo": "3243243243",
        //         "workLocation": "worklocation",
        //         "employeeType": "FULL_TIME",
        //         "departmentId": 1,
        //         "confirmationDate": "2023-02-09",
        //         "sourceOfHire": "naukri-portal",
        //         "employeeStatusId": 1,
        //         "dpsExperiance": 2,
        //         "isTransfered": true
        //     },
        //     "employeeDesignationDetails": {
        //         "id": 107,
        //         "designationId": 1,
        //         "reportingHeadId": 2,
        //         "isReportingHead": true,
        //         "employeeCategoryId": 8,
        //         "isHod": true,
        //         "hodId": 1,
        //         "isClassCoordinator": false,
        //         "classCoordinatorId": null
        //     },
        //     "employeePastExperience": [
        //         {
        //             "id": 101,
        //             "organizationName": "Organization name",
        //             "designationId": 1,
        //             "fromDate": "2023-02-15",
        //             "toDate": "2023-02-20",
        //             "experience": 2.5
        //         }
        //     ],
        //     "employeeBankDetails": {
        //         "id": 127,
        //         "bankAccountNo": "2432432432",
        //         "bankId": 20,
        //         "bankBranchName": "Hdfcnban",
        //         "bankBranchAddress": "Bankd Adress",
        //         "bankIfscCode": "HDFC24324",
        //         "isDefaultAcc": true
        //     },
        //     "employeeSalaryDetails": {
        //         "id": 90,
        //         "taxCategoryTypeId": 1,
        //         "amountType": "abc",
        //         "salaryCategoryId": 1,
        //         "basicSalary": 299,
        //         "grossSalary": 29999,
        //         "panCardNo": "AYWER32432432",
        //         "isPfEligible": true,
        //         "pfAccountNo": "32432432",
        //         "uanNo": "32432432",
        //         "isEsiEligible": true,
        //         "esiAccountNo": "234324",
        //         "netTaxBenefitsPa": 29000,
        //         "remarks": "Remarks"
        //     }
        // }));
    } else {
        yield put(setAddEmployeeAct(response.data));
        // yield put(setAddEmployeeAct({
        //     "instituteId": 50,
        //     "branchId": 21,
        //     "employeeBasicDetails": {
        //         "id": 140,
        //         "employeeName": "Employee Name",
        //         "dob": "2023-02-22",
        //         "genderId": 1,
        //         "nationalityId": 1,
        //         "religionId": 1,
        //         "casteId": 6,
        //         "maritalStatusId": 2,
        //         "personalEmailId": "employee@gmail.com",
        //         "aadharNo": "1234567890",
        //         "contactNo": "2343243243",
        //         "bloodGroupId": 4,
        //         "identificationMark1": "Mole",
        //         "identificationMark2": "Mole",
        //         "userTypeId": 26
        //     },
        //     "employeeEducationDetails": {
        //         "employeeId": 140,
        //         "qualificationId": 1,
        //         "univerisityId": 8,
        //         "passoutYear": 2022,
        //         "specializationId": 1,
        //         "otherAchievements": "Other activement"
        //     },
        //     "employeeContactDetails": {
        //         "id": 127,
        //         "addressLine": "Address",
        //         "area": "Area",
        //         "stateId": 26,
        //         "cityId": 51,
        //         "district": "District",
        //         "pincode": "1234"
        //     },
        //     "employeeDependentDetails": [
        //         {
        //             "id": 123,
        //             "dependentName": "Dependency",
        //             "relationTypeId": 1,
        //             "dependentContactNo": "3243243243"
        //         }
        //     ],
        //     "employeeEmergencyDetails": [
        //         {
        //             "id": 122,
        //             "emergencyContactPerson": "emergency",
        //             "emergencyRelationId": 1,
        //             "emergencyContactNo": "3243243243"
        //         }
        //     ],
        //     "employeeMarriageInfo": {
        //         "employeeId": 140,
        //         "marriageCertificateNo": 412654,
        //         "marriageCertificateDor": "2023-02-23"
        //     },
        //     "employeeCurrentJob": {
        //         "employeeId": 140,
        //         "biometricId": 21348654,
        //         "workEmailId": "work@gmail.com",
        //         "workPhoneNo": "3243243243",
        //         "workLocation": "worklocation",
        //         "employeeType": "FULL_TIME",
        //         "departmentId": 1,
        //         "confirmationDate": "2023-02-09",
        //         "sourceOfHire": "naukri-portal",
        //         "employeeStatusId": 1,
        //         "dpsExperiance": 2,
        //         "isTransfered": true
        //     },
        //     "employeeDesignationDetails": {
        //         "id": 107,
        //         "designationId": 1,
        //         "reportingHeadId": 2,
        //         "isReportingHead": true,
        //         "employeeCategoryId": 8,
        //         "isHod": true,
        //         "hodId": 1,
        //         "isClassCoordinator": false,
        //         "classCoordinatorId": null
        //     },
        //     "employeePastExperience": [
        //         {
        //             "id": 101,
        //             "organizationName": "Organization name",
        //             "designationId": 1,
        //             "fromDate": "2023-02-15",
        //             "toDate": "2023-02-20",
        //             "experience": 2.5
        //         }
        //     ],
        //     "employeeBankDetails": {
        //         "id": 127,
        //         "bankAccountNo": "2432432432",
        //         "bankId": 20,
        //         "bankBranchName": "Hdfcnban",
        //         "bankBranchAddress": "Bankd Adress",
        //         "bankIfscCode": "HDFC24324",
        //         "isDefaultAcc": true
        //     },
        //     "employeeSalaryDetails": {
        //         "id": 90,
        //         "taxCategoryTypeId": 1,
        //         "amountType": "abc",
        //         "salaryCategoryId": 1,
        //         "basicSalary": 299,
        //         "grossSalary": 29999,
        //         "panCardNo": "AYWER32432432",
        //         "isPfEligible": true,
        //         "pfAccountNo": "32432432",
        //         "uanNo": "32432432",
        //         "isEsiEligible": true,
        //         "esiAccountNo": "234324",
        //         "netTaxBenefitsPa": 29000,
        //         "remarks": "Remarks"
        //     }
        // }));
    }
}

function* updateEmployeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setUpdateEmployeeAct(response.data));
    }
}

function* getEmployeeByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setGetEmployeeByIdAct(response.data));
    }
}

function* downloadDocumentByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setDownDocumentByIdAct(response.data));
    }
}

function* deleteEmployeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setDeleteEmployeeAct({ statusCode: response.status }));
    }
}

function* uploadEmployeeDocumentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setUploadEmployeeDocumentAct(response.data));
    }
}

function* getEmployeesByFilterGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setEmployeesByFilterAct(response.data));
    }
}
function* getEmployeesNameByFilterGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setEmployeesNameByFilterAct(response.data));
    }
}
function* getEmployeeDocumentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setEmployeeDocumentListAct(response.data));
    }
}
function* exportEmployeeDataGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setExportEmployeeDataAct({statusCode:response.status,data:response.data}));
    }
}
function* exportOtherEmployeeDataGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setOtherExportEmployeeDataAct({statusCode:response.status,data:response.data}));
    }
}

function* getAllCompaniesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setAllCompaniesListAct(response.data));
    }
}

function* getCompanyDetailsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setCompanyDetailsListByIdAct(response.data));
    }
}

function* saveCompanyDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setSaveCompanyDetailsListAct(response.data));
    }
}

function* editCompanyDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setEditCompanyDetailsListAct({statusCode : response.status}));
    }
}

function* deleteCompanyDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setEmployeeMngmntErrorAct(response.error));
    } else {
        yield put(setDelCompanyDetailsListAct({status : response.statusCode}));
    }
}


export default function* studentManagementSaga() {
    yield takeLatest(EmployeeManagementConstants.GET_EMPLOYEES_STATS_REQUEST, getEmployeesStatsGen);
    yield takeLatest(EmployeeManagementConstants.GET_EMPLOYEES_LIST_REQUEST, getEmployeesListGen);
    yield takeLatest(EmployeeManagementConstants.GET_OTHER_EMPLOYEES_LIST_REQUEST, getOtherEmployeesListGen);
    yield takeLatest(EmployeeManagementConstants.ADD_EMPLOYEE_REQUEST, addEmployeeGen);
    yield takeLatest(EmployeeManagementConstants.UPDATE_EMPLOYEE_REQUEST, updateEmployeeGen);
    yield takeLatest(EmployeeManagementConstants.GET_EMPLOYEE_BYID_REQUEST, getEmployeeByIdGen);
    yield takeLatest(EmployeeManagementConstants.DOWNLOAD_DOCUMENT_BYID_REQUEST, downloadDocumentByIdGen);
    yield takeLatest(EmployeeManagementConstants.UPLOAD_EMPLOYEE_DOCUMENT_REQUEST, uploadEmployeeDocumentGen);
    yield takeLatest(EmployeeManagementConstants.DELETE_EMPLOYEE_REQUEST, deleteEmployeeGen);
    yield takeLatest(EmployeeManagementConstants.GET_EMPLOYEE_DOCUMENT_TYPE_REQUEST, getEmployeeDocumentListGen);
    yield takeLatest(EmployeeManagementConstants.GET_REPORTER_LIST_REQUEST, getReporterListGen);
    yield takeLatest(EmployeeManagementConstants.GET_REPORTING_CLASS_DIVISION_LIST_REQUEST, getReportingClassDivisionListGen);
    yield takeLatest(EmployeeManagementConstants.GET_HOD_LIST_REQUEST, getHodListGen);
    yield takeLatest(EmployeeManagementConstants.GET_EMPLOYEES_BYFILTER_REQUEST, getEmployeesByFilterGen);
    yield takeLatest(EmployeeManagementConstants.GET_EMPLOYEES_NAME_BYFILTER_REQUEST, getEmployeesNameByFilterGen);
    yield takeLatest(EmployeeManagementConstants.EXPORT_EMPLOYEE_DATA_REQUEST, exportEmployeeDataGen);
    yield takeLatest(EmployeeManagementConstants.EXPORT_OTHER_EMPLOYEE_DATA_REQUEST, exportOtherEmployeeDataGen);
    yield takeLatest(EmployeeManagementConstants.GET_ALL_COMPANIES_LIST_REQUEST, getAllCompaniesListGen);
    yield takeLatest(EmployeeManagementConstants.GET_COMPANY_DETAILS_LIST_BY_ID, getCompanyDetailsListByIdGen);
    yield takeLatest(EmployeeManagementConstants.SAVE_COMPANY_DETAILS_LIST, saveCompanyDetailsListGen);
    yield takeLatest(EmployeeManagementConstants.EDIT_COMPANY_DETAILS_LIST, editCompanyDetailsListGen);
    yield takeLatest(EmployeeManagementConstants.DELETE_COMPANY_DETAILS_LIST, deleteCompanyDetailsListGen);
}