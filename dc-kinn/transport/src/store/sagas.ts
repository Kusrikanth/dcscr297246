import { all, fork } from "redux-saga/effects";

import LayoutSaga from "./layouts/saga";
import loginSaga from "./login/loginsaga";
import masterDataSaga from "./masterdata/masterdatasaga";
import branchSaga from "./mastersettings/branch/branchsaga";
import instituteInfoSaga from "./mastersettings/instituteinfo/instituteinfosaga";
import instAcademicsSaga from "./mastersettings/instacademics/instacademicssaga";
import masterFeeSettingsSaga from "./modulesettings/masterfeesettings/masterfeesettingssaga";
import branchInfoSaga from "./branchsettings/branchinfo/branchinfosaga";
import brchAcademicsSaga from "./branchsettings/branchacademics/branchacademicssaga";
import studentManagementSaga from "./directory/studentmanagement/studentmangementsaga";
import employeeManagementSaga from "./directory/employeemanagement/employeemangementsaga";
import academicSaga from "./academic/classroomManagment/classroommanagmentsaga";
import feeCollectionsSaga from "./fee/feecollections/feecollectionssaga";
import feeConcessionSaga from "./fee/feeconcessions/feeconcessionsaga";
import feeApprovalsSaga from "./fee/feeapprovals/feeapprovalssaga";
import feeReportSaga from "./fee/feereport/feereportsaga";
import applicationAvailabilitySaga from "./FrontDesk/Settings/admissionAvailability/admissionavailabilitysaga";
import addmissionRegistrationSaga from "./FrontDesk/AdmissionRegistration/admissionregistrationsaga";
import transportRequestSaga from "./transportation/transportationsaga";
import transportRecordsSaga from "./transportation/TransportationRecords/transportationrecordssaga";
import vehicleDetailRequestSaga from "./transportation/settings/vehicledetails/vehicledetailesaga";
import transportConcessionSaga from "./transportation/TransportationConcession/transportationconcessionsaga";
import transportEmployeeSaga from "./transportation/TransportationEmployee/transportationemployeesaga";
import concernsFeedbackSaga from "./concernsfeedback/concernsfeedbacklist/concernsfeedbacklistsaga";
import complaintDepartmentSaga from "./concernsfeedback/complaintdepartment/complaintdepartmentsaga";
import healthRecordsSaga from "./healthrecords/healthrecordssaga";

export default function* rootSaga() {
  yield all([
    fork(LayoutSaga),
    fork(loginSaga),
    fork(masterDataSaga),
    fork(branchSaga),
    fork(instituteInfoSaga),
    fork(instAcademicsSaga),
    fork(masterFeeSettingsSaga),
    fork(branchInfoSaga),
    fork(brchAcademicsSaga),
    fork(studentManagementSaga),
    fork(employeeManagementSaga),
    fork(academicSaga),
    fork(feeCollectionsSaga),
    fork(feeConcessionSaga),
    fork(feeApprovalsSaga),
    fork(feeReportSaga),
    fork(applicationAvailabilitySaga),
    fork(addmissionRegistrationSaga),
    fork(transportRequestSaga),
    fork(transportRecordsSaga),
    fork(vehicleDetailRequestSaga),
    fork(transportConcessionSaga),
    fork(transportEmployeeSaga),
    fork(concernsFeedbackSaga),
    fork(complaintDepartmentSaga),
    fork(healthRecordsSaga),
  ]);
}
