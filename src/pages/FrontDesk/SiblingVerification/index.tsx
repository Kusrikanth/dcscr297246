import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  IMenuOptions,
} from "./SiblingVerificationTypes";
import ApprovedVerification from "./ApprovedVerification";

import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import ApprovalPending from "./ApprovalPending";
import ApprovalRejected from "./ApprovalRejected";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getSiblingVerificationListRecordsCount } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsslice";
import ApprovalOnHold from "./ApprovalOnHold";

const TransferRequestApprovals = () => {

  const [activeId, setActiveId] = useState<string | null>("approvedVerification");

  const dispatch = useDispatch()

  const {
    getSiblingVerificationListRecordsCountResp,
    applicationSaleError,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
} = useAppSelector(
    ({ applicationSale,instAcademics,branchAcademics,appData }) => ({
        getSiblingVerificationListRecordsCountResp : applicationSale.getSiblingVerificationListRecordsCountResp,
        applicationSaleError : applicationSale.applicationSaleError,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        branchClassResp: branchAcademics.branchClassResp,
    }),
    shallowEqual
);

useEffect(() => {

  return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
  }
}, []);

useEffect(() => {
  const { data } = academicYearListResp || {};
  if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
      dispatch(getSiblingVerificationListRecordsCount(generateActionPayload('get_sibling_verification_list_count',undefined,{branchId,academicYearId : yearId})))
  }
}, [academicYearListResp]);


    useEffect(() => {
      
    }, [])

    const SiblingVerificationRef = useRef({
      prevApplicationSaleError: applicationSaleError,
  });
  useEffect(() => {
      const { prevApplicationSaleError} = SiblingVerificationRef.current;
      if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
          const { details } = applicationSaleError;
          toast.error(details)   
      }
      SiblingVerificationRef.current.prevApplicationSaleError = applicationSaleError;

  }, [applicationSaleError])

    const {approvedCount,pendingCount,rejectedCount,onHoldCount} = getSiblingVerificationListRecordsCountResp || {};

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "approvedVerification",
      labelName: "Approved Verification",
      customPadding: "0px 10px",
      count:approvedCount || 0,
    },
    {
      id: "approvalPending",
      labelName: "Approval Pending",
      customPadding: "0px 10px",
      count:pendingCount || 0,
    },
    {
      id: "approvalRejected",
      labelName: "Approval Rejected",
      customPadding: "0px 10px",
      count:rejectedCount || 0,
    },
    {
      id: "approvalOnHold",
      labelName: "Approval On Hold",
      customPadding: "0px 10px",
      count:onHoldCount || 0,
    },
  ];

  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "approvedVerification":
        return ApprovedVerification;
      case "approvalPending":
        return ApprovalPending;
      case "approvalRejected":
        return ApprovalRejected;
      case "approvalOnHold":
        return ApprovalOnHold;
    }
  }
  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId:string | null = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return (
      <TabComponent />
    );
  }, [activeId]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Transfer Request Approvals" pageTitle="Admissions" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">
            {/* Card Header */}
            <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0">
                    Sibling Verification List
                  </h4>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="tw-p-0">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="tw-px-3 tw-pt-2"
              />

              {activeComponent}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default TransferRequestApprovals;
