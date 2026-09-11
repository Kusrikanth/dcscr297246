import { all, fork } from "redux-saga/effects";
//layout
import LayoutSaga from "./layouts/saga";
// import ProfileSaga from "./auth/profile/saga";
import loginSaga from "./login/loginsaga";
import masterDataSaga from "./masterdata/masterdatasaga";

//Master settings Saga
import branchSaga from "./mastersettings/branch/branchsaga";
import instituteInfoSaga from "./mastersettings/instituteinfo/instituteinfosaga";
import instAcademicsSaga from "./mastersettings/instacademics/instacademicssaga";
import feeSettingsSaga from "./mastersettings/feesettings/feesettingssaga";

//Module Settings Saga
import masterFeeSettingsSaga from "./modulesettings/masterfeesettings/masterfeesettingssaga";

//Branch Settings
import branchInfoSaga from "./branchsettings/branchinfo/branchinfosaga";
import brchAcademicsSaga from "./branchsettings/branchacademics/branchacademicssaga";


//Directory
import studentManagementSaga from "./directory/studentmanagement/studentmangementsaga";
import employeeManagementSaga from "./directory/employeemanagement/employeemangementsaga";

//Academic 
import academicSaga from "./academic/classroomManagment/classroommanagmentsaga";
import academicRequestSaga from "./academic/academicRequest/academicrequestsaga";
import assigngroupSaga from "./academic/assignGroup/assigngroupsaga";
import classSubjectsSaga from "./academic/classSubjects/classsubjectssaga";
import classTeacherSaga from "./academic/classTeacher/classteachersaga";

import languagesSaga from "./academic/languages/languagessaga";

//User Management
import userManagementSaga from "./usermanagement/usermanagementsaga";

//Branch Fee
import feeCollectionsSaga from "./fee/feecollections/feecollectionssaga";
import feeConcessionSaga from "./fee/feeconcessions/feeconcessionsaga";
import feeReportSaga from "./fee/feereport/feereportsaga";

import feeApprovalsSaga from "./fee/feeapprovals/feeapprovalssaga";
import applicationSaleSaga from "./FrontDesk/AdmissionManagment/applicationmanagmentsaga";
import applicationAvailabilitySaga from "./FrontDesk/Settings/admissionAvailability/admissionavailabilitysaga";

//Admission
import interviewSaga from "./FrontDesk/Interview/interviewsaga";
import examinationSaga from "./FrontDesk/examination/examinationsaga";
import reportsSaga from "./FrontDesk/Reports/reportssaga"
import registrationInstructionSaga from "./FrontDesk/RegistrationInstruction/registrationinstructionsaga";

// Admission Setting 
import AdmissionRequestSaga from "./FrontDesk/AdmissionSettings/admissionsettingsaga";
import addmissionRegistrationSaga from "./FrontDesk/AdmissionRegistration/admissionregistrationsaga";

// Hostel
import HostelSettingsSaga from "./hostel/hostelsettings/hostelsettingssaga";
import HostelStuLedgerSaga from "./hostel/hostelfee/hostelstudentledger/hostelstudentledgersaga"
import hostelRequestSaga from "./hostel/hostelrequest/hostelrequestsaga"



//transport
import transportRequestSaga from "./transportation/transportationsaga";
import transportRecordsSaga from "./transportation/TransportationRecords/transportationrecordssaga";
import vehicleDetailRequestSaga from "./transportation/settings/vehicledetails/vehicledetailesaga";
import transportConcessionSaga from "./transportation/TransportationConcession/transportationconcessionsaga";
import transportEmployeeSaga from "./transportation/TransportationEmployee/transportationemployeesaga";


// Student Attendance
import dailyAttendanceSaga from "./StudentAttendance/DailyAttendance/dailyattendancesaga";
import holidayDetailRequestSaga from "./StudentAttendance/HolidayDetails/holidaydetailssaga";
import studentLongLeavesRequestSaga from "./StudentAttendance/StudentLongLeaves/studentlongleavessaga";
import scheduleTaskSaga from "./StudentAttendance/ScheduleTask/scheduleTasksaga";
import scheduleLogSaga from "./StudentAttendance/ScheduleLog/scheduleLogsaga";

// assign languages
import assignLanguagesSaga from "./assignlanguages/assignlanguagessaga";

// not reporting students
import notReportingStuSaga from "./academic/notreportingstudents/notreportingstudentssaga";

//concern feedback
import concernsFeedbackSaga from "./concernsfeedback/concernsfeedbacklist/concernsfeedbacklistsaga";
import complaintDepartmentSaga from "./concernsfeedback/complaintdepartment/complaintdepartmentsaga";

//library
import librarysettingsSaga from "./library/settings/librarysettingssaga"
import bookcollectionsaga from "./library/bookcollection/bookcollectionsaga";
import bookrenewalsaga from "./library/bookrenewal/bookrenewalsaga";

//health records
import healthRecordsSaga from "./healthrecords/healthrecordssaga";
import bookissuancesaga from "./library/bookissuance/bookissuancesaga";
import bookreturnsaga from "./library/bookreturn/bookreturnsaga";

//CBSE verifications
import cbseVerificationSaga from "./cbseverification/cbseverificationsaga";
import stockcheckingsaga from "./library/stockDetails/stockdetailssaga";

//Access Management
import accessManagementSaga from "./accessmanagement/accessmanagementsaga";

//Communication
import communicationSaga from "./communication/communicationsaga";
import examinationSettingsSaga from "./examination/examinationsettings/examinationsettingssaga";
import examinationManagementSaga from "./examination/examinationmanagement/examinationmanagementsaga";
import examinationSportsSaga from "./examination/examinationSports/examinationSportsSaga"
import timetableManagmentSaga from "./academic/timetableManagment/timetableManagmentsaga";

//lms
import lmsSettingsSaga from "./lms/lmssettings/lmssettingssaga"
import lmsAssessmentSaga from "./lms/lmsAssessment/lmsAssessmentsaga"
import studentAssessmentsSaga from "./lms/studentAssessment/studentAssessmentSaga";
import lmsdigitalcurriculumsaga from "./lms/lmsdigitalcurriculum/lmsdigitalcurriculumsaga";
import branchStorageSettingsSaga from "./branchstorage/branchstoragesettings/branchstoragesettingssaga";
import branchstoragemanagementsaga from "./branchstorage/branchstoragemanagement/branchstoragemanagementsaga";
import zoomMeetingsSaga from "./lms/zoomMeeting/zoomMeetingSaga";

//Pva
import pvaReportsSaga from "./examination/pvaReports/pvaReportsSaga";

export default function* rootSaga() {
  yield all([
    //public
    fork(LayoutSaga),
    // fork(ProfileSaga),
    fork(loginSaga),
    fork(masterDataSaga),
    fork(branchSaga),
    fork(instituteInfoSaga),
    fork(instAcademicsSaga),
    fork(feeSettingsSaga),
    fork(masterFeeSettingsSaga),

    fork(branchInfoSaga),
    fork(brchAcademicsSaga),
    fork(AdmissionRequestSaga),
    fork(studentManagementSaga),
    fork(employeeManagementSaga),

    fork(academicSaga),
    fork(academicRequestSaga),
    fork(assigngroupSaga),
    fork(classSubjectsSaga),
    fork(classTeacherSaga),

    fork(languagesSaga),
    fork(userManagementSaga),
    fork(feeCollectionsSaga),
    fork(feeConcessionSaga),
    fork(feeApprovalsSaga),
    fork(feeReportSaga),

    fork(applicationSaleSaga),
    fork(applicationAvailabilitySaga),
    fork(interviewSaga),
    fork(reportsSaga),
    fork(examinationSaga),
    fork(addmissionRegistrationSaga),
    fork(registrationInstructionSaga),
    fork(transportRequestSaga),
    fork(transportRecordsSaga),
    fork(vehicleDetailRequestSaga),
    fork(transportConcessionSaga),
    fork(transportEmployeeSaga),

    fork(assignLanguagesSaga),

    fork(notReportingStuSaga),
    fork(timetableManagmentSaga),
    fork(lmsSettingsSaga),
    fork(lmsAssessmentSaga),
    fork(studentAssessmentsSaga),
    fork(lmsdigitalcurriculumsaga),

    fork(HostelSettingsSaga),
    fork(HostelStuLedgerSaga),
    fork(hostelRequestSaga),

    fork(concernsFeedbackSaga),
    fork(complaintDepartmentSaga),

    fork(healthRecordsSaga),

    fork(dailyAttendanceSaga),
    fork(holidayDetailRequestSaga),
    fork(studentLongLeavesRequestSaga),
    fork(scheduleTaskSaga),
    fork(scheduleLogSaga),

    fork(cbseVerificationSaga),
    fork(librarysettingsSaga),
    fork(bookcollectionsaga),
    fork(bookissuancesaga),
    fork(bookreturnsaga),
    fork(bookrenewalsaga),
    fork(stockcheckingsaga),

    fork(accessManagementSaga),
    fork(communicationSaga),
    fork(examinationSettingsSaga),
    fork(examinationManagementSaga),
    fork(examinationSportsSaga),
    fork(pvaReportsSaga),

    fork(branchStorageSettingsSaga),
    fork(branchstoragemanagementsaga),
    fork(zoomMeetingsSaga)
  ]);
}
