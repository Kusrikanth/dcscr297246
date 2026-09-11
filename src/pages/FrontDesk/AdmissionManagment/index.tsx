import React, { Suspense, useEffect, useMemo, useState } from 'react'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import Statistics from './Statistics'
import ModifiedHorizontalTab from '../../../Components/Common/ModifiedHorizontalTab'
import { IMenuOptions } from '../../NewAcademics/academicsTypes';
import NoDataComp from '../../../Components/Common/NoDataComp';
import { shallowEqual } from 'react-redux';
import { downloadApplicationSaleById, getStatasticResp } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { generateActionPayload } from '../../../utility/reduxutility';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { getInstAcademicYearAct } from '../../../store/mastersettings/instacademics/instacademicactions';
import { getOtpSettingKeyAct } from '../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction';
const Registration = React.lazy(() => import("./Registration"));
const ApplicationSale = React.lazy(() => import("./ApplicationSale"));
const PreliminaryScrutiny = React.lazy(() => import("./PreliminaryScrutiny"));
const PanelInterview = React.lazy(() => import("./PanelInterview"));
const Examination = React.lazy(() => import("./Examination"));
const PanelInterviewResult = React.lazy(() => import("./PanelInterviewResult"));
const ExaminationMarks = React.lazy(() => import("./ExaminationMarks"));
const ObservationandInterviewerReport = React.lazy(() => import("./ObservationandInterviewerReport"));
// import ApplicationSale from './ApplicationSale';


const MenuOptions: Array<any> = [
  {
    id: "applicationSale",
    labelName: "Application Sale",
    customPadding: "0px 20px",
  },
  {
    id: "registration",
    labelName: "Registration",
    customPadding: "0px 20px",
  },
  {
    id: "preliminaryScrutiny",
    labelName: "Preliminary Scrutiny",
    customPadding: "0px 20px",
  },
  // {
  //   id: "examination",
  //   labelName: "Examination Schedule",
  //   customPadding: "0px 20px",
  // },
  // {
  //   id: "examinationReschedule",
  //   labelName: "Examination Reschedule",
  //   customPadding: "0px 20px",
  // },
  {
    id: "examination",
    labelName: "Examination",
    customPadding: "0px 20px",
  },
  {
    id: "examinationMarks",
    labelName: "Examination Marks",
    customPadding: "0px 20px",
  },
  {
    id: "panelInterview",
    labelName: "Panel Interview",
    customPadding: "0px 20px",
  },
  // {
  //   id: "panelInterviewReschedule",
  //   labelName: "Panel Interview Reschedule",
  //   customPadding: "0px 20px",
  // },
  {
    id: "observationandInterviewerReport",
    labelName: "Observation and Interviewer Report",
    customPadding: "0px 20px",
  },
  {
    id: "interviewResult",
    labelName: "Interview Result",
    customPadding: "0px 20px",
  },
  {
    id: "admissionResult",
    labelName: "Admission Result",
    customPadding: "0px 20px",
  },
  // {
  //   id: "issuedList",
  //   labelName: "Issued List",
  //   customPadding: "0px 10px",
  // },
  // {
  //   id: "rejectedList",
  //   labelName: "Rejected List",
  //   customPadding: "0px 10px",
  // },
];

function LoadingTabData() {
  return (
    <div className="col-12">
      <div className="card">
        <div className="card-body">
          <div className="h-400px pt-3">
            <NoDataComp title="Loading tab details..." />
          </div>
        </div>
      </div>
    </div>
  )
}
const AdmissionManagment = () => {
  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    registrationTabId,
    statasticResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    currentInstCodeResp: instituteCode,
    loggedInUserRole
  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, applicationSale }) => ({
      registrationTabId: globalData.registrationTabId,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      statasticResp: applicationSale.statasticResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentInstCodeResp: appData.currentInstCodeResp,
      loggedInUserRole: appData.loggedInUserRole,
    }),
    shallowEqual
  );

  const [menuId, setMenuId] = useState<string | null>(registrationTabId || "applicationSale");


  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "applicationSale":
        return ApplicationSale;
      case "registration":
        return Registration;
      case "preliminaryScrutiny":
        return PreliminaryScrutiny;
      case "examination":
        return Examination;
      case "examinationReschedule":
        return Examination;
      case "examinationMarks":
        return ExaminationMarks;
      case "observationandInterviewerReport":
        return ObservationandInterviewerReport;
      case "panelInterview":
        return PanelInterview;
      // case "panelInterviewReschedule":
      //   return PanelInterview;
      case "interviewResult":
        return PanelInterviewResult;
      case "admissionResult":
        return PanelInterviewResult;
      default:
        return null;
    }
  }
  const activeComponent = useMemo(() => {
    const TabComponent: any = menuId && getActiveMenuComponent(menuId);
    if (TabComponent) {
      return (
        <TabComponent
          instituteId={instituteId}
          branchId={branchId}
          tabId={menuId}
        // optionalDetails={optionalDetails}
        />
      );
    }
    return null;
  }, [menuId, branchId, instituteId]);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
      dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId: yearId, branchId })))
    }
  }, [academicYearListResp]);

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    dispatch(getOtpSettingKeyAct(generateActionPayload("get_otp_setting_key", { searchString: "IS_FULL_ADMISSION_PROCESS" }, { instituteId, pageNo : 0 , pageSize : 100})));
  }, [])

  const getOtpSettingKeyResp = useAppSelector(
    (state) => state.admissionAvailabilityRequest.getOtpSettingKeyResp,
    shallowEqual
  );

  const updatedMenuOptions = useMemo(() => {
    const allowedIdsForPMS = ["applicationSale", "registration", "preliminaryScrutiny", "admissionResult"];
    const settingValue = getOtpSettingKeyResp?.settingValue?.toString().toLowerCase();

    // If settingValue is "no", restrict to allowedIdsForPMS
    if (settingValue === "no") {
      return MenuOptions.filter(option => allowedIdsForPMS.includes(option.id));
    }

    // Otherwise, show all options (including admissionResult)
    return MenuOptions.filter(option=>option.id !== "admissionResult")
  }, [instituteCode, loggedInUserRole, getOtpSettingKeyResp]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Students Manage" pageTitle="Admissions" />
        <Statistics statsInfo={statasticResp} />
        <div className="tw-grid tw-grid-cols-12 tw-mb-5">
          <div className="tw-col-span-12">
            <div className="tw-flex tw-items-end">
              <ModifiedHorizontalTab
                MenuOptions={updatedMenuOptions}
                getActiveMenuId={(menuId: any) => {
                  setMenuId(menuId);
                }}
                activeTabId={menuId}
                horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto"
                labelClass="tw-whitespace-nowrap"
              />
            </div>
            <div className="tw-grid tw-grid-cols-12">
              <div className="tw-col-span-12">
                <Suspense fallback={<LoadingTabData />}>{activeComponent}</Suspense>
              </div>
            </div>
            <div className="tw-bg-white tw-rounded-lg tw-shadow" id="tasksList">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdmissionManagment
