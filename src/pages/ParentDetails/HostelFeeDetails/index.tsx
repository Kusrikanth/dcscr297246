import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";


import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";

import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getSiblingVerificationListRecordsCount } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsslice";
import ParentFeeLedger from "./FeeLedger";
import PayFee from "./PayFee";
import { getHostelPayfeeDetailsAct, setHostelPayfeeDetailsAct } from "../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";

const tabOptions = [
  {
    id: "payFee",
    labelName: "Pay Fee",
    customPadding: "0px 10px",
  }, {
    id: "feeLedger",
    labelName: "Fee Ledger",
    customPadding: "0px 10px",
  }];


function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "feeLedger":
      return ParentFeeLedger;
    case "payFee":
      return PayFee;
    default:
      return null;
  }
}


const HostelFeeDetails = () => {

  const [activeId, setActiveId] = useState("");
  const [menuOptions, setMenuOptions] = useState<any>([]);
  const dispatch = useDispatch()

  const {
    currentInstIdResp: instituteId,
    currentStudentId,
    parentChildrensResp,
    hostelPayfeeDetailsResp, hostelStuLedgerErrResp
  }: any = useAppSelector(
    ({ directoryStudent, hostelStuLedger, appData }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      currentStudentId: appData.currentStudentId,
      hostelPayfeeDetailsResp: hostelStuLedger.hostelPayfeeDetailsResp,
      hostelStuLedgerErrResp: hostelStuLedger.hostelStuLedgerErrResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(setHostelPayfeeDetailsAct(undefined));
    }
  }, []);

  useEffect(() => {
    if (hostelPayfeeDetailsResp) {
      const duePayments = hostelPayfeeDetailsResp?.filter((i: any) =>
        ((i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid")));
      if (duePayments && duePayments.length) {
        setActiveId("payFee")
        setMenuOptions(tabOptions)
      } else {
        setActiveId("feeLedger")
        setMenuOptions(tabOptions.filter(item => item.id === 'feeLedger'));
      }
    }
  }, [hostelPayfeeDetailsResp]);

  const feeDetailsRespRef = useRef({
    prevHostelStuLedgerErrResp: hostelStuLedgerErrResp
  });

  useEffect(() => {
    const { prevHostelStuLedgerErrResp } = feeDetailsRespRef.current;
    if (hostelStuLedgerErrResp && prevHostelStuLedgerErrResp !== hostelStuLedgerErrResp) {
      const { details } = hostelStuLedgerErrResp || {};
      toast.error(details || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevHostelStuLedgerErrResp = hostelStuLedgerErrResp;
  }, [hostelStuLedgerErrResp]);

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId || "");
  }

  const selectedChild = useMemo(() => {
    if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
      return parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
    }
    return null;
  }, [parentChildrensResp, currentStudentId]);


  useEffect(() => {
    if (currentStudentId) {
      let params = {
        studentId: currentStudentId,
      }
      dispatch(getHostelPayfeeDetailsAct(generateActionPayload('hostel_payfee_details', params, undefined)));
    }
  }, [currentStudentId])

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    if (selectedChild && TabComponent) {
      return (
        <TabComponent branchId={selectedChild?.childBranchId} />
      );
    }
    return <></>;
  }, [activeId, selectedChild]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Transfer Request Approvals" pageTitle="Parent" />

          <div className="card">
            <div className="card-header">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="card-title tw-mb-0 tw-grow">
                    Student Hostel Fee Details
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body tw-p-0">
              <UpdatedHorizontalTab
                MenuOptions={menuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="px-3 pt-2"

              />
              {activeComponent}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default HostelFeeDetails;
