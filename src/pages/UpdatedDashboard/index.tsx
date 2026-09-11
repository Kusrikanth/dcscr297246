import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import boy from "../../assets/imagesdps/updatedDashboard/boy.svg";
import girl from "../../assets/imagesdps/updatedDashboard/girl.svg";
import coins from "../../assets/imagesdps/updatedDashboard/due.svg";
import money from "../../assets/imagesdps/updatedDashboard/fee.svg";
import school from "../../assets/imagesdps/updatedDashboard/school.svg";
import world from "../../assets/imagesdps/updatedDashboard/online.svg";
import teaching from "../../assets/imagesdps/updatedDashboard/teaching.svg";
import nonTeaching from "../../assets/imagesdps/updatedDashboard/nonteaching.svg";

import ClassWiseMarks from "./ClassWiseMarks";
import FailuresAnalysis from "./FailuresAnalysis";
import ClassWiseHighMarks from "./ClassWiseHighMarks";
import ClassWiseTopPerformers from "./ClassWiseTopPerformers";
import FeeCollectionAnalysis from "./FeeSummary/FeeCollectionAnalysis";
import FeeRevenueSummary from "./FeeSummary/FeeRevenueSummary";
import FeeRevenueSummaryyy from "./FeeSummary/FeeRevenueSummaryyy";
import UpdatedHorizontalTab from "../../Components/Common/UpdatedHorizontalTab";
import { default as MoneySvg } from "../../assets/imagesdps/updatedDashboard/moneySvg.svg?react";
import { default as AcademicBooksSvg } from "../../assets/imagesdps/updatedDashboard/academicBooksSvg.svg?react";
import { default as StaffSvg } from "../../assets/imagesdps/updatedDashboard/staffSvg.svg?react";
import { default as BrchDirectorySvg } from "../../assets/imagesdps/menuicon/branch-icon/directory.svg?react";
import FeeSummary from "./FeeSummary";
import Academics from "./Academics";
import StaffSummary from "./StaffSummary";
import BranchWiseNetPaidByDate from "./BranhWiseNetPaidByDate";
import BranchWiseDue from "./BranchWiseNetAmount";
import FeeSummaryTables from "./FeeSummaryTables";
import CommonCard from "../FreeModules/FeeDashBoard/CommonCard";
import PowerBiReport from "./FeeSummary/PowerBiReport";
import NetPaidByBranch from "./NetPaidByBranch";
import FeeCards from "../FreeModules/FeeDashBoard/FeeCards";
import FeeCollection from "../FreeModules/FeeDashBoard/FeeCollection";
import FeeCollectionChart from "./FeeCollectionChart";
import FeeCollectionStatsList from "./FeeCollectionStatsList";
import FeeSummaryStatsList from "./FeeSummaryStatsList";
import { SelectInput } from "../../Components/Common";
import { useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import SuperAdminTransportDashboard from "./Transport";
import SuperAdminExaminationDashboard from "./Examination";
import SuperAdminSchoolStrength from "./SchoolStrengthTab";
import SuperAdminErpUsage from "./ErpUsage";
import SuperAdminHelpdesk from "./SuperAdminHelpdesk";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}
const UpdatedDashboard = () => {
  const [activeId, setActiveId] = useState<any>("feeSummary");
  const [branchIdState, setBranchIdState] = useState<string | null>(null);

  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    loggedInUserRole,
    branchListResp } =
    useAppSelector(({ appData, branch, }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      branchListResp: branch.branchListResp,
    }), shallowEqual)

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "feeSummary",
      labelName: "Fee Summary",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "admissions",
      labelName: "Admissions",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "transport",
      labelName: "Transport",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "examination",
      labelName: "Examination",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "schoolStrength",
      labelName: "School Strength",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "erpUsage",
      labelName: "ERP Usage",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "superAdminHelpdesk",
      labelName: "Helpdesk Summary",
      customPadding: "0px 10px 10px 10px",
    },
  ];
  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "feeSummary":
        return FeeSummary;
      case "admissions":
        return Academics;
      case "transport":
        return SuperAdminTransportDashboard
      case "examination":
        return SuperAdminExaminationDashboard
      case "schoolStrength":
        return SuperAdminSchoolStrength
      case "erpUsage":
        return SuperAdminErpUsage
      case "superAdminHelpdesk":
        return SuperAdminHelpdesk
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent />;
  }, [activeId]);

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBranchIdState(event.target.value)
  }

  useEffect(() => {
    if (instituteId) {
      setBranchIdState(null)
    }
  }, [instituteId])

  return (
    <div className="page-content updated_dashboard_wrapper">
      <div className="container-fluid">
        <div
          className="page-title-box tw-font-bold tw-items-center tw-justify-center tw-sticky tw-hidden"
          style={{ top: "58px", zIndex: "111" }}
        >
          SUPER ADMIN DASHBOARD
        </div>
        {loggedInUserRole !== 'ACCOUNT_HEAD' && <div className="tw-mb-3">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-w-full tw-mx-auto">
            <div className="tw-w-full lg:tw-w-auto tw-px-0">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="horizontal-menu-updated-style super-admin-tabs"
              />
            </div>
          </div>
        </div>}
        <div className="tw-card tw-p-3 tw-hidden">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-y-3">
            <div className="tw-w-full lg:tw-w-1/2">
              <h4 className="tw-card-title tw-mb-0">
                Fee Summary
              </h4>
            </div>
            <div className="tw-w-full lg:tw-w-1/4 2xl:tw-w-1/6 tw-ml-auto">
              <SelectInput
                name="branchId"
                valueKey="branchId"
                textKey="branchName"
                value={branchIdState}
                menuItems={branchListResp?.data}
                onChange={onChangeFilterHndlr}
                labelText="Branch Name"
                floatingLabel
                formgroupClassName="mb-0"
              />
            </div>
          </div>
        </div>
        <>{activeComponent}</>
      </div>
    </div>
  );
};

export default UpdatedDashboard;
