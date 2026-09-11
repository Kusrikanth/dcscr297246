import { combineReducers } from "@reduxjs/toolkit";

import Layout from "./layouts/reducer";
import Profile from "./auth/profile/reducer";
import login from "./login/loginslice";
import appData from "./appdata/appdataslice";
import globalData from "./global/globalslice";
import masterData from "./masterdata/masterdataslice";
import branch from "./mastersettings/branch/branchslice";
import instituteInfo from "./mastersettings/instituteinfo/instituteinfoslice";
import instAcademics from "./mastersettings/instacademics/instacademicslice";
import branchInfo from "./branchsettings/branchinfo/branchinfoslice";
import branchAcademics from "./branchsettings/branchacademics/branchacademicsslice";
import directoryStudent from "./directory/studentmanagement/studentmanagementslice";
import directoryEmployee from "./directory/employeemanagement/employeemanagementslice";
import classroomManagmentInfo from "./academic/classroomManagment/classroommanagmentslice";
import feeCollections from "./fee/feecollections/feecollectionsslice";
import applicationSale from "./FrontDesk/AdmissionManagment/applicationmanagmentslice";
import admissionRegistration from "./FrontDesk/AdmissionRegistration/admissionregistrationslice";
import dailyAttendance from "./StudentAttendance/DailyAttendance/dailyattendanceslice"
import holidayDetails from "./StudentAttendance/HolidayDetails/holidaydetailsslice"
import concernsFeedback from "./concernsfeedback/concernsfeedbacklist/concernsfeedbacklistslice"
import complaintDepartment from "./concernsfeedback/complaintdepartment/complaintdepartmentslice"

const rootReducer = combineReducers({
    Layout,
    Profile,
    login,
    appData,
    globalData,
    masterData,
    branch,
    instituteInfo,
    instAcademics,
    branchInfo,
    branchAcademics,
    directoryStudent,
    directoryEmployee,
    classroomManagmentInfo,
    feeCollections,
    applicationSale,
    admissionRegistration,
    dailyAttendance,
    holidayDetails,
    concernsFeedback,
    complaintDepartment,
});

export default rootReducer;
