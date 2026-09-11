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
import feeReport from "./fee/feereport/feereportslice";
import applicationSale from "./FrontDesk/AdmissionManagment/applicationmanagmentslice";
import admissionRegistration from "./FrontDesk/AdmissionRegistration/admissionregistrationslice";
import transportrequest from "./transportation/transportationslice";
import concernsFeedback from "./concernsfeedback/concernsfeedbacklist/concernsfeedbacklistslice"
import complaintDepartment from "./concernsfeedback/complaintdepartment/complaintdepartmentslice"
import vehicleDetailRequest from "./transportation/settings/vehicledetails/vehicledetaileslice";

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
    feeReport,
    applicationSale,
    admissionRegistration,
    transportrequest,
    concernsFeedback,
    complaintDepartment,
    vehicleDetailRequest,
});

export default rootReducer;
