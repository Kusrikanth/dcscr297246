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
import masterFeeSettings from "./modulesettings/masterfeesettings/masterfeesettingsslice";
import branchInfo from "./branchsettings/branchinfo/branchinfoslice";
import branchAcademics from "./branchsettings/branchacademics/branchacademicsslice";
import directoryStudent from "./directory/studentmanagement/studentmanagementslice";
import directoryEmployee from "./directory/employeemanagement/employeemanagementslice";
import classroomManagmentInfo from "./academic/classroomManagment/classroommanagmentslice";
import feeCollections from "./fee/feecollections/feecollectionsslice";
import feeConcession from "./fee/feeconcessions/feeconcessionslice";
import feeApprovals from "./fee/feeapprovals/feeapprovalsslice";
import feeReport from "./fee/feereport/feereportslice";
import admissionRegistration from "./FrontDesk/AdmissionRegistration/admissionregistrationslice";
import admissionAvailabilityRequest from "./FrontDesk/Settings/admissionAvailability/admissionavailabilityslice";
import transportrequest from "./transportation/transportationslice";
import transportrecords from "./transportation/TransportationRecords/transportationrecordsslice";
import transportConcession from "./transportation/TransportationConcession/transportationconcessionslice";
import transportEmployee from "./transportation/TransportationEmployee/transportationemployeeslice";
import concernsFeedback from "./concernsfeedback/concernsfeedbacklist/concernsfeedbacklistslice"
import complaintDepartment from "./concernsfeedback/complaintdepartment/complaintdepartmentslice"
import vehicleDetailRequest from "./transportation/settings/vehicledetails/vehicledetaileslice";
import healthRecords from "./healthrecords/healthrecordsslice";

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
    masterFeeSettings,
    branchInfo,
    branchAcademics,
    directoryStudent,
    directoryEmployee,
    classroomManagmentInfo,
    feeCollections,
    feeConcession,
    feeApprovals,
    feeReport,
    admissionRegistration,
    admissionAvailabilityRequest,
    transportrequest,
    transportrecords,
    transportConcession,
    transportEmployee,
    concernsFeedback,
    complaintDepartment,
    vehicleDetailRequest,
    healthRecords,
});

export default rootReducer;
