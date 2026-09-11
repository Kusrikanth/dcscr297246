

import { combineReducers } from "@reduxjs/toolkit";

// Front
import Layout from "./layouts/reducer";
import Profile from "./auth/profile/reducer";
import login from "./login/loginslice";
import appData from "./appdata/appdataslice";
import masterData from "./masterdata/masterdataslice";
//Master setting reducer
import branch from "./mastersettings/branch/branchslice";
import instituteInfo from "./mastersettings/instituteinfo/instituteinfoslice";
import instAcademics from "./mastersettings/instacademics/instacademicslice";
import instFeeSettings from "./mastersettings/feesettings/feesettingsslice";

//Module Settings
import masterFeeSettings from "./modulesettings/masterfeesettings/masterfeesettingsslice";

//Branch Settings
import branchInfo from "./branchsettings/branchinfo/branchinfoslice";
import branchAcademics from "./branchsettings/branchacademics/branchacademicsslice";


//Directory 
import directoryStudent from "./directory/studentmanagement/studentmanagementslice";
import directoryEmployee from "./directory/employeemanagement/employeemanagementslice";

//Academic
import classroomManagmentInfo from "./academic/classroomManagment/classroommanagmentslice";
import academicRequest from "./academic/academicRequest/academicrequestslice";
//Class Subject
import assignGroupInfo from "./academic/assignGroup/assigngroupslice";
import classSubjectsInfo from "./academic/classSubjects/classsubjectsslice";
import languagesInfo from "./academic/languages/languagesslice";
import classteacherInfo from "./academic/classTeacher/classteacherslice";

//User Management
import userManagement from "./usermanagement/usermanagementslice";

//Fee Management
import feeCollections from "./fee/feecollections/feecollectionsslice";
import feeConcession from "./fee/feeconcessions/feeconcessionslice";
import feeApprovals from "./fee/feeapprovals/feeapprovalsslice";
import applicationSale from "./FrontDesk/AdmissionManagment/applicationmanagmentslice";
import feeReport from "./fee/feereport/feereportslice";

//Admissions
import interview from "./FrontDesk/Interview/interviewslice";
import examination from "./FrontDesk/examination/examinationslice";
import admissionRegistration from "./FrontDesk/AdmissionRegistration/admissionregistrationslice";
import reports from "./FrontDesk/Reports/reportsslice"
import registrationInstruction from "./FrontDesk/RegistrationInstruction/registrationinstructionslice";

//Global
import globalData from "./global/globalslice";
import admissionSettingRequest from "./FrontDesk/AdmissionSettings/admissionsettingslice";
import admissionAvailabilityRequest from "./FrontDesk/Settings/admissionAvailability/admissionavailabilityslice";

//tranport
import transportrequest from "./transportation/transportationslice";
import transportrecords from "./transportation/TransportationRecords/transportationrecordsslice";
import vehicleDetailRequest from "./transportation/settings/vehicledetails/vehicledetaileslice";
import transportConcession from "./transportation/TransportationConcession/transportationconcessionslice";
import transportEmployee from "./transportation/TransportationEmployee/transportationemployeeslice";


// Student Attendance
import dailyAttendance from "./StudentAttendance/DailyAttendance/dailyattendanceslice"
import holidayDetails from "./StudentAttendance/HolidayDetails/holidaydetailsslice"
import studentLongLeaves from "./StudentAttendance/StudentLongLeaves/studentlongleavesslice"
import scheduleTask from "./StudentAttendance/ScheduleTask/scheduleTaskslice"
import scheduleLog from "./StudentAttendance/ScheduleLog/scheduleLogslice"

// assign languages
import assignLanguages from "./assignlanguages/assignlanguagesslice"

// hostel
import hostelSettings from "./hostel/hostelsettings/hostelsettingsslice"
import hostelStuLedger from "./hostel/hostelfee/hostelstudentledger/hostelstudentledgerslice"
import hostelRequest from "./hostel/hostelrequest/hostelrequestslice";


//not reporting students
import notReportingStu from "./academic/notreportingstudents/notreportingstudentsslice"

// conerns feedback
import concernsFeedback from "./concernsfeedback/concernsfeedbacklist/concernsfeedbacklistslice"
import complaintDepartment from "./concernsfeedback/complaintdepartment/complaintdepartmentslice"

//Library
import librarysettings from "./library/settings/librarysettingsslice";
import libraryBookCollection from "./library/bookcollection/bookcollectionslice";
import libraryBookIssuance from "./library/bookissuance/bookissuanceslice";
import libraryBookReturn from "./library/bookreturn/bookreturnslice";
import libraryBookRenewal from "./library/bookrenewal/bookrenewalslice";


// health records
import healthRecords from "./healthrecords/healthrecordsslice";

//CBSE Verifications
import cbseVerification from "./cbseverification/cbseverificationslice";
import stockChecking from "./library/stockDetails/stockdetailsslice";


//Access Management
import accessManagement from "./accessmanagement/accessmanagementslice";

//Communication
import communication from "./communication/communicationslice";
import examinationSettings from "./examination/examinationsettings/examinationsettingsslice";
import examinationManagement from "./examination/examinationmanagement/examinationmanagementslice";
import timeTableManagement from "./academic/timetableManagment/timetableManagmentslice";

//LMS
import lmsSettings from "./lms/lmssettings/lmssettingsslice"
import lmsAssessment  from "./lms/lmsAssessment/lmsAssessmentslice";
import studentAssessments from "./lms/studentAssessment/studentAssessmentSlice"

import zoomMeetings from "./lms/zoomMeeting/zoomMeetingSlice";

import examinationSports from "./examination/examinationSports/examinationSportsSlice";
import lmsdigitalcurriculum  from "./lms/lmsdigitalcurriculum/lmsdigitalcurriculumslice";
import pvaReports from "./examination/pvaReports/pvaReportsSlice";
import branchStorageSettings from "./branchstorage/branchstoragesettings/branchstoragesettingsslice";
import branchStorageManagement from "./branchstorage/branchstoragemanagement/branchstoragemanagementslice";

const rootReducer = combineReducers({
    // public
    Layout,
    Profile,
    login,
    appData,
    globalData,
    masterData,
    branch,
    instituteInfo,
    instAcademics,
    instFeeSettings,
    masterFeeSettings,
    branchInfo,
    branchAcademics,
    directoryStudent,
    directoryEmployee,
    classroomManagmentInfo,
    academicRequest,
    assignGroupInfo,
    classSubjectsInfo,
    languagesInfo,
    classteacherInfo,
    userManagement,
    feeCollections,
    feeConcession,
    feeApprovals,
    feeReport,
    applicationSale,
    interview,
    registrationInstruction,
    reports,
    examination,
    admissionRegistration,
    admissionSettingRequest,
    admissionAvailabilityRequest,
    transportrequest,
    transportrecords,
    dailyAttendance,
    holidayDetails,
    transportConcession,
    transportEmployee,
    assignLanguages,
    concernsFeedback,
    complaintDepartment,
    studentLongLeaves,
    scheduleTask,
    scheduleLog,
    hostelSettings,
    hostelStuLedger,
    hostelRequest,
    notReportingStu,
    timeTableManagement,
    vehicleDetailRequest,
    healthRecords,
    cbseVerification,
    librarysettings,
    stockChecking,
    libraryBookCollection,
    libraryBookIssuance,
    libraryBookReturn,
    libraryBookRenewal,
    accessManagement,
    examinationSettings,
    examinationManagement,
    examinationSports,
    communication,
    lmsSettings,
    lmsAssessment,
    studentAssessments,
    lmsdigitalcurriculum,
    pvaReports,
    branchStorageSettings,
    branchStorageManagement,
    zoomMeetings,
});


// export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
