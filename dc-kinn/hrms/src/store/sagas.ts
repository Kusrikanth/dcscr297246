import { all, fork } from "redux-saga/effects";

import LayoutSaga from "./layouts/saga";
import loginSaga from "./login/loginsaga";
import masterDataSaga from "./masterdata/masterdatasaga";
import branchSaga from "./mastersettings/branch/branchsaga";
import instituteInfoSaga from "./mastersettings/instituteinfo/instituteinfosaga";
import instAcademicsSaga from "./mastersettings/instacademics/instacademicssaga";
import branchInfoSaga from "./branchsettings/branchinfo/branchinfosaga";
import brchAcademicsSaga from "./branchsettings/branchacademics/branchacademicssaga";
import studentManagementSaga from "./directory/studentmanagement/studentmangementsaga";
import employeeManagementSaga from "./directory/employeemanagement/employeemangementsaga";
import academicSaga from "./academic/classroomManagment/classroommanagmentsaga";
import feeCollectionsSaga from "./fee/feecollections/feecollectionssaga";
import applicationSaleSaga from "./FrontDesk/AdmissionManagment/applicationmanagmentsaga";
import addmissionRegistrationSaga from "./FrontDesk/AdmissionRegistration/admissionregistrationsaga";
import concernsFeedbackSaga from "./concernsfeedback/concernsfeedbacklist/concernsfeedbacklistsaga";
import complaintDepartmentSaga from "./concernsfeedback/complaintdepartment/complaintdepartmentsaga";
import dailyAttendanceSaga from "./StudentAttendance/DailyAttendance/dailyattendancesaga";
import holidayDetailRequestSaga from "./StudentAttendance/HolidayDetails/holidaydetailssaga";

export default function* rootSaga() {
  yield all([
    fork(LayoutSaga),
    fork(loginSaga),
    fork(masterDataSaga),
    fork(branchSaga),
    fork(instituteInfoSaga),
    fork(instAcademicsSaga),
    fork(branchInfoSaga),
    fork(brchAcademicsSaga),
    fork(studentManagementSaga),
    fork(employeeManagementSaga),
    fork(academicSaga),
    fork(feeCollectionsSaga),
    fork(applicationSaleSaga),
    fork(addmissionRegistrationSaga),
    fork(concernsFeedbackSaga),
    fork(complaintDepartmentSaga),
    fork(dailyAttendanceSaga),
    fork(holidayDetailRequestSaga),
  ]);
}
