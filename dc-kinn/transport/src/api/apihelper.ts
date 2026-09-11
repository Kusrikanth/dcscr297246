import { academicUrl } from "./apiurl/academicdata";
import { groupstudentUrl } from "./apiurl/assigngroupdata";
import { authUrl } from "./apiurl/auth";
import { institute, branchInstUrl, branchModuleUrl, academicYearUrl, academicTermUrl, feeSettinsUrl, admissionSetting } from "./apiurl/instmastersettings";
import { masterDataUrl } from "./apiurl/masterdata";
import { moduleSettings } from "./apiurl/modulesettings";

import { subjectlistofteacherUrl } from "./apiurl/subjectslistofteacherdata";
import { classsubjectsUrl } from "./apiurl/classsubjectsdata";
import { languagesUrl } from "./apiurl/languagesdata";

import { branchInfoUrl, branchAcademicsUrl } from "./apiurl/branchsettings";

import { directoryStdntMgnmntUrl, directoryEmployeeMgnmntUrl   } from "./apiurl/directory";

import { userManagement } from "./apiurl/usermanagement";

import { branchFeeSettings } from "./apiurl/branchfee";
import { frontDeskUrl, interviewUrl, examinationUrl } from "./apiurl/frontDesk";
import { admissionUrl, admissionRegistrationUrl, admissionWithdrawalUrl } from "./apiurl/admissiondata";
import { transportdata, vehiclesdetails, transportrecords, transportmanagement, transportconcessionUrl, transportEmployeeUrl, transportRegistrationUrl } from "./apiurl/transportdata";
import { reportsUrl } from "./apiurl/reports";
import { dailyAttendanceUrl, scheduleLogsUrl, scheduleTaskUrl, studentHolidayDetailsUrl, studentLongLeavesUel } from "./apiurl/studentattendance";
import { assignLanguagesUrl, notReportingStuUrl } from "./apiurl/assignlanguages";
import { complaintDepartmentUrl, concernsFeedbackUrl } from "./apiurl/concernsfeedback";
import { hostelFeeUrl, hostelRequestUrl, hostelSettingsUrl } from "./apiurl/hostel";
import { healthRecordsUrl } from "./apiurl/healthrecords";
import { libraryBookCollection, libraryBookIssuance, libraryBookRenewal, libraryBookReturn, librarySettings, libraryStockDetails } from "./apiurl/library";
import { accessManagementUrl } from "./apiurl/accessmanagementdata";
import { communicationUrl } from "./apiurl/communication";
import { examinationSettings } from "./apiurl/examination";
import { dashboardUrl } from "./apiurl/dashboard";
import { examinationHolisticUrls, examinationManagamentUrl } from "./apiurl/examinationmanagement";
import { timetableUrl } from "./apiurl/timetable";
import { lmsAssessment, lmsDigitalCurriculum, lmsSettings, lmsStudentAssessments } from "./apiurl/lms";
import { examinationSportsUrls } from "./apiurl/examinationSports";
import { pvaReports } from "./apiurl/pvaReports";
import { branchStorageSettings, branchStorageManagement } from "./apiurl/branchStorage";

const apiUrlKeys = Object.assign({}, authUrl,
  institute,
  branchInstUrl, branchModuleUrl,
  academicYearUrl, academicTermUrl,
  feeSettinsUrl,
  masterDataUrl, moduleSettings, branchInfoUrl, branchAcademicsUrl,
  directoryStdntMgnmntUrl,
  directoryEmployeeMgnmntUrl,
  academicUrl,
  timetableUrl,
  admissionUrl,
  frontDeskUrl,
  reportsUrl,
  interviewUrl,
  examinationUrl,
  examinationSportsUrls,
  classsubjectsUrl,
  languagesUrl,
  subjectlistofteacherUrl,
  groupstudentUrl, directoryEmployeeMgnmntUrl,  userManagement,
  admissionSetting,
  admissionRegistrationUrl,
  admissionWithdrawalUrl,
  branchFeeSettings,
  transportdata,
  transportmanagement,
  transportrecords,
  transportconcessionUrl,
  transportEmployeeUrl,
  transportRegistrationUrl,
  dailyAttendanceUrl,
  complaintDepartmentUrl,
  concernsFeedbackUrl,
  hostelSettingsUrl,
  hostelFeeUrl,
  assignLanguagesUrl,
  notReportingStuUrl,
  healthRecordsUrl,
  studentLongLeavesUel,
  scheduleTaskUrl,
  scheduleLogsUrl,
  studentHolidayDetailsUrl,
  vehiclesdetails,
  librarySettings,
  libraryBookCollection,
  libraryBookReturn,
  libraryStockDetails,
  libraryBookRenewal,
  hostelRequestUrl,
  libraryBookIssuance,
  accessManagementUrl,
  communicationUrl,
  dashboardUrl,
  examinationManagamentUrl,
  examinationHolisticUrls,
  examinationSettings,
  pvaReports,
  lmsSettings,
  lmsAssessment,lmsStudentAssessments, lmsDigitalCurriculum,
  branchStorageSettings,
  branchStorageManagement);

export function generateApiUrl(apiKey: string, payload: any) {
  const apiUrl: any = apiUrlKeys[apiKey as keyof typeof apiUrlKeys];
  return typeof apiUrl === "function" ? apiUrl(payload || {}) : apiUrl;
}
