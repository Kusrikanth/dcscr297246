import React, { useEffect, useRef, useState } from "react";
import FeeSummaryStatsList from "../FeeSummaryStatsList";
import FeeCollectionStatsList from "../FeeCollectionStatsList";
import FeeCollectionChart from "../FeeCollectionChart";
import NetPaidByBranch from "../NetPaidByBranch";
import FeeSummaryTables from "../FeeSummaryTables";
import { SelectInput } from "../../../Components/Common";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

const stuStatusOptions = [
  {
    id: "ACTIVE",
    name: "Active"
  }, {
    id: "INACTIVE",
    name: "Inactive"
  }
]

const FeeSummary = () => {

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    branchListResp,
    academicYearListResp,
    loggedInUserRole,
    feeReportErrorResp,
  } = useAppSelector(
    ({ appData, branch, feeReport, instAcademics }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      feeReportErrorResp: feeReport.feeReportErrorResp,
    }),
    shallowEqual
  );

  const [filterState, setFilterState] = useState({
    branchIdState: loggedInUserRole === 'ACCOUNT_HEAD' ? branchId : '',
    academicYearId: "",
    studentStatus: "",
  });


  const superAdminFeeDashboard = useRef({
    prevFeeReportErrorResp: feeReportErrorResp,
  })

  useEffect(() => {
    const { prevFeeReportErrorResp } = superAdminFeeDashboard.current;

    if (feeReportErrorResp && prevFeeReportErrorResp !== feeReportErrorResp) {
      const { details } = feeReportErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    superAdminFeeDashboard.current.prevFeeReportErrorResp = feeReportErrorResp;

  }, [feeReportErrorResp])

  useEffect(() => {
    if (Array.isArray(academicYearListResp?.data)) {
      const { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      setFilterState((prev) => ({ ...prev, academicYearId }));
    }
  }, [academicYearListResp, instituteId])

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      value && setFilterState((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-6">
        <div className="tw-col-span-12 tw-bg-white tw-shadow tw-rounded-2xl tw-p-4">
          <div className="tw-grid tw-gap-4 lg:tw-grid-cols-12 tw-items-center">
            <div className={twMerge("tw-col-span-12",
              (loggedInUserRole !== 'ACCOUNT_HEAD') ? 'lg:tw-col-span-6' : 'lg:tw-col-span-8'
            )}>
              <h4 className="tw-text-base  tw-font-semibold tw-mb-0">Fee Summary</h4>
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-2">
              <SelectInput
                name="academicYearId"
                value={filterState.academicYearId}
                onChange={onChangeFilterHndlr}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="tw-mb-0"
                labelText="Academic Year"
                floatingLabel
              />
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-2">
              <SelectInput
                name="studentStatus"
                value={filterState.studentStatus}
                onChange={onChangeFilterHndlr}
                menuItems={stuStatusOptions}
                valueKey="id"
                textKey="name"
                formgroupClassName="tw-mb-0"
                labelText="Student Status"
                floatingLabel
              />
            </div>
            {(loggedInUserRole !== 'ACCOUNT_HEAD') && <div className="tw-col-span-12 lg:tw-col-span-2">
              <SelectInput
                name="branchIdState"
                valueKey="branchId"
                textKey="branchName"
                value={filterState.branchIdState}
                menuItems={branchListResp?.data}
                onChange={onChangeFilterHndlr}
                labelText="Branch Name"
                floatingLabel
                formgroupClassName="tw-mb-0"
              />
            </div>}
          </div>
        </div>
        <div className="tw-col-span-12">
          <FeeSummaryStatsList
            branchIdState={filterState.branchIdState}
            academicYearId={filterState.academicYearId}
            studentStatus={filterState.studentStatus}
          />
        </div>
        <div className="tw-col-span-12 xl:tw-col-span-6 tw-h-full">
          <FeeCollectionStatsList branchIdState={filterState.branchIdState} />
        </div>
        <div className="tw-col-span-12 xl:tw-col-span-6 tw-h-full">
          <FeeCollectionChart
            branchIdState={filterState.branchIdState}
            academicYearId={filterState.academicYearId}
          />
        </div>
        <div className="tw-col-span-12">
          <NetPaidByBranch />
        </div>
        <div className="tw-col-span-12">
          <FeeSummaryTables branchIdState={filterState.branchIdState} />
        </div>
      </div>
    </>
  );
};

export default FeeSummary;
