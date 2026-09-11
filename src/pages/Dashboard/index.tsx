import { shallowEqual } from "react-redux";
//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";
//Actions
import { IUserList } from "../../store/login/logintypes";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { useEffect, useMemo, useRef, useState } from "react";

import TermwiseFee from "./TermwiseFee";
import CommonCard from "./CommonCard";
import AdmissionSummaryGraph from "./AdmissionSummaryGraph";
import AdmissionAnalysis from "./AdmissionAnalysis";
import StudentAdmissionClassWise from "./StudentAdmissionClassWise/StudentAdmissionClassWise";
import LeadCaptureSource from "./LeadCaptureSource";
import { generateActionPayload } from "../../utility/reduxutility";
import { getAdmissionStatsAct } from "../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { calculateTotal, percentageCount } from "./helper";
import LeadConversionStatus from "./LeadConversionStatus";
import { toast } from "react-toastify";
import EmployeeCountIcon from "../../assets/imagesdps/directory/icons/employee-count.svg";
import RegistrationsCountIcon from "../../assets/imagesdps/admissionDashboard/Registration.svg";
import ApplicationsCountIcon from "../../assets/imagesdps/admissionDashboard/Application.svg";
import AdmissionsCountIcon from "../../assets/imagesdps/admissionDashboard/Admission.svg";
import ClassWiseTarget from "./ClassWiseTarget";
import { SelectInput } from "../../Components/Common";
import { useFormik } from "formik";

interface IDashboardRef {
  prevCounterValueResp: number;
  prevUserListResp: IUserList[] | undefined;
  prevApplicationSaleError: any;
}

const initialValues = {
  academicYearId: "",
};

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const AdmissionStatsApiCall = (otherProps?: any) => {
    let payload = {
      branchId,
      instituteId,
      ...otherProps,
    };
    dispatch(getAdmissionStatsAct(generateActionPayload('admission_stats', undefined, payload)))
  }

  const { value, userList, loginErrorResp, currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    getAdmissionStatsResp, academicYearListResp, applicationSaleError
  } = useAppSelector(
    ({ login: { value, userList, loginErrorResp }, instAcademics, appData, applicationSale }) => ({
      value,
      userList,
      loginErrorResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getAdmissionStatsResp: applicationSale.getAdmissionStatsResp,
      applicationSaleError: applicationSale.applicationSaleError,
    }),
    shallowEqual
  );

  const dashboardRef = useRef<IDashboardRef>({
    prevCounterValueResp: value,
    prevUserListResp: userList,
    prevApplicationSaleError: applicationSaleError,
  });

  useEffect(() => {
    const { prevCounterValueResp, prevUserListResp, prevApplicationSaleError } =
      dashboardRef.current;
    if (value && value !== prevCounterValueResp) {
      console.log()
    } else if (userList && prevUserListResp !== userList) {
      console.log()
    } else if (applicationSaleError && applicationSaleError !== prevApplicationSaleError) {
      const { details } = applicationSaleError || {}
      toast.error(details || "Something went wrong");
    }
    dashboardRef.current.prevCounterValueResp = value;
    dashboardRef.current.prevUserListResp = userList;
    dashboardRef.current.prevApplicationSaleError = applicationSaleError;
  }, [value, userList, applicationSaleError]);

  const AdmissionDashboardForm = useFormik({
    initialValues,
    onSubmit: (values) => { }
  })

  const curriculumData = useMemo(() => {
    if (!getAdmissionStatsResp) return [];
    return Object.entries(getAdmissionStatsResp).map(([curriculum, data]) => ({
      curriculum,
      value: Object.entries(data as any).map(([key, value]) => ({ key, value })).filter((item) => item.key !== "previousWeeksCount" && item.key !== "currentWeeksCount"),
    }));
  }, [getAdmissionStatsResp]);

  const weeklyData = useMemo(() => {
    if (!getAdmissionStatsResp) return [];
    return Object.keys(getAdmissionStatsResp).map(key => {
      return {
        curriculum: key,
        previousWeeksCount: getAdmissionStatsResp[key].previousWeeksCount,
        currentWeeksCount: getAdmissionStatsResp[key].currentWeeksCount
      };
    });
  }, [getAdmissionStatsResp]);


  const commonCardConfig = [
    {
      cardMainText: "Admission Count",
      curriculumIndex: "admissionCount",
      bgColor: "#E1E2F6",
      borderColor: "#BCE3FF",
      cardIcon: EmployeeCountIcon
    },
    {
      cardMainText: "This Week Registrations",
      curriculumIndex: "thisWeekRegistrations",
      bgColor: "#F8EFE2",
      borderColor: "#FFD0D0",
      cardIcon: RegistrationsCountIcon
    },
    {
      cardMainText: "This Week Applications",
      curriculumIndex: "thisWeekApplications",
      bgColor: "#EFF7E2",
      borderColor: "#D8D4FE",
      cardIcon: ApplicationsCountIcon
    },
    {
      cardMainText: "This Week Admissions",
      curriculumIndex: "thisWeekAdmissions",
      bgColor: "#ebeedf",
      borderColor: "#C4F4E4",
      cardIcon: AdmissionsCountIcon
    },
  ];

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      AdmissionDashboardForm.setFieldValue("academicYearId", value);
      AdmissionStatsApiCall({ academicYearId: value });
    }
  }

  useEffect(() => {
    if (academicYearListResp && academicYearListResp?.data?.length > 0) {
      let { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "upcoming") || {};
      AdmissionDashboardForm.setFieldValue("academicYearId", academicYearId);
      AdmissionStatsApiCall({ academicYearId });
    }
  }, [academicYearListResp])


  const { data: academicYearList } = academicYearListResp || {};

  return (
    <div className="page-content branch_dashboard_wrapper">
      <div className="container-fluid">
        <BreadCrumb title="Dashboard" pageTitle="DPS" />
        {/* <div className="page-title-box fw-bold d-flex align-items-center justify-content-center sticky-top" style={{ top: '58px', zIndex: '1' }}>Admission Dashboard Summary : {academicYearId}</div> */}
        <div className="card-header !tw-rounded-2xl !tw-shadow-sm !tw-mb-4">
          <div className="tw-grid tw-grid-cols-12 tw-gap-y-3 tw-items-center">
            <div className="tw-col-span-12 lg:tw-col-span-4">
              <h4 className="tw-text-lg tw-mb-0 tw-flex-grow">
                Admission Summary
              </h4>
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-8">
              <div className="tw-flex tw-flex-wrap tw-gap-3 lg:tw-justify-end">
                <div className="tw-w-full lg:tw-w-1/3">
                  <SelectInput
                    name="academicYearId"
                    value={AdmissionDashboardForm.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearList}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    labelText="Academic Year"
                    floatingLabel
                    hideSelectOption={Array.isArray(academicYearList) && Boolean(academicYearList.length)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {commonCardConfig.map((item, index) => {
            const matchedCurriculum = curriculumData.find(
              (data) => data.curriculum === item.curriculumIndex
            );
            const matchedWeeklyData = weeklyData.find(
              (data) => data.curriculum === item.curriculumIndex
            );
            return (
              <div className="col-12 col-lg-6 col-xxl-3" key={index}>
                <CommonCard
                  cardMainText={item.cardMainText}
                  cardMainAmount={calculateTotal(matchedCurriculum)}
                  percentage={percentageCount(
                    matchedWeeklyData?.previousWeeksCount,
                    matchedWeeklyData?.currentWeeksCount
                  ).toFixed(1)}
                  bottomText={"Previous Week"}
                  curriculumData={matchedCurriculum}
                  bgColor={item.bgColor}
                  borderColor={item.borderColor}
                  cardIcon={item.cardIcon}
                />
              </div>
            );
          })}
        </div>
        <div className="col-12">
          <ClassWiseTarget academicYearId={AdmissionDashboardForm.values.academicYearId}></ClassWiseTarget>
        </div>
        <div className="row">
          <div className="col-12 col-xxl-8" style={{ display: "grid" }}>
            <AdmissionAnalysis academicYearId={AdmissionDashboardForm.values.academicYearId} />
          </div>
          <div className="col-12 col-xxl-4" style={{ display: "grid" }}>
            <TermwiseFee academicYearId={AdmissionDashboardForm.values.academicYearId} />
          </div>
          <div className="col-12 col-xl-6 " style={{ display: "grid" }}>
            <StudentAdmissionClassWise academicYearId={AdmissionDashboardForm.values.academicYearId} />
          </div>
          <div className="col-12 col-xl-6 " style={{ display: "grid" }}>
            <LeadConversionStatus />
          </div>
          <div className="col-12  col-xl-6 " style={{ display: "grid" }}>
            <AdmissionSummaryGraph academicYearId={AdmissionDashboardForm.values.academicYearId} />
          </div>
          <div className="col-12 col-xl-6" style={{ display: "grid" }}>
            <LeadCaptureSource academicYearId={AdmissionDashboardForm.values.academicYearId}></LeadCaptureSource>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
