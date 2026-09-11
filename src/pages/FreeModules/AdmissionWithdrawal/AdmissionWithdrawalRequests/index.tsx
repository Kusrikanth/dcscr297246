import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, ModalContainerUpdated, ConfirmationModal } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import AdmissionWithdrawalApprovalModal from "./AdmissionWithdrawalApprovalModal";

import FilterHeader from "../FilterHeader";
import { initialFilterValues } from "../helper";
import { getAdmissionWithdrawalAct, setGetAdmissionWithdrawalAct } from "../../../../store/FrontDesk/AdmissionSettings/admissionsettingaction";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle03StrokeStandard } from "@hugeicons-pro/core-stroke-standard";

const AdmissionWithdrawalRequests = () => {
  const [approveModalState, setApproveModalState] = useState({
    showModal: false,
    confirmMessage: "",
    confirmationType: "",
    admissionWithdrawalId: ""
  })
  const paginationRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const filtersRef = useRef(initialFilterValues);
  const filterHeaderRef = useRef<any>();

  const dispatch = useAppDispatch();
  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    getAdmissionWithdrawalResp,
    admissionSettingErrorResp } =
    useAppSelector(({ appData, masterData,
      admissionSettingRequest }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        getAdmissionWithdrawalResp: admissionSettingRequest.getAdmissionWithdrawalResp,
        admissionSettingErrorResp: admissionSettingRequest.admissionSettingErrorResp,
      }), shallowEqual);
  const feeDetailsRespRef = useRef({
    prevGetAdmissionWithdrawalResp: getAdmissionWithdrawalResp,
    prevAdmissionSettingErrorResp: admissionSettingErrorResp
  });

  useEffect(() => {
    const { prevGetAdmissionWithdrawalResp, prevAdmissionSettingErrorResp } = feeDetailsRespRef.current;
    if (getAdmissionWithdrawalResp && prevGetAdmissionWithdrawalResp !== getAdmissionWithdrawalResp) {
      filterHeaderRef.current.closeAdvanceFilterHandler();
    }
    else if (admissionSettingErrorResp && admissionSettingErrorResp !== prevAdmissionSettingErrorResp) {
      const { message }: any = admissionSettingErrorResp;
      toast.error(message || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevAdmissionSettingErrorResp = admissionSettingErrorResp;
    feeDetailsRespRef.current.prevGetAdmissionWithdrawalResp = getAdmissionWithdrawalResp;
  }, [getAdmissionWithdrawalResp, admissionSettingErrorResp]);

  useEffect(() => {
    return () => {
      dispatch(setGetAdmissionWithdrawalAct(undefined));
    }
  }, []);



  function allowWithdrawalHndlr(event: any) {
    // const admissionWithdrawalId = event.currentTarget.getAttribute("data-id"),
    //   admissionWithdrawalData = admissionWithdrawalResp?.data?.find((item: any) => item.admissionWithdrawalId === +admissionWithdrawalId);
    // if (admissionWithdrawalData) {
    //   setApprovalModalState((prevState) => ({
    //     ...prevState,
    //     showModal: true,
    //     approvalDetails: admissionWithdrawalData
    //   }));
    // }
  }

  function approveHandler(event: any) {
    const withdrawalId = event.currentTarget.getAttribute("data-id");
    setApproveModalState(prevState => ({
      ...prevState, showModal: true, admissionWithdrawalId: withdrawalId,
      confirmationType: "approve",
      confirmMessage: "Are you sure you want to approve admission withdrawal for student?"
    }));
  }
  function rejectHandler(event: any) {
    const withdrawalId = event.currentTarget.getAttribute("data-id");
    setApproveModalState(prevState => ({
      ...prevState, showModal: true, admissionWithdrawalId: withdrawalId,
      confirmationType: "reject",
      confirmMessage: "Are you sure you want to reject admission withdrawal for student?"
    }));
  }

  const menuOptions = useMemo(() => [
    {
      id: "approve",
      actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="me-2 text-success" size={18} />,
      actionName: "Approve",
      onClickHndlr: approveHandler
    },
    // {
    //   id: "reject",
    //   actionIcon: <CrossSvg className="me-2 d-inline-block" />,
    //   actionName: "Reject",
    //   onClickHndlr: rejectHandler
    // },
  ], [getAdmissionWithdrawalResp]);

  const [
    approvalModalState,
    setApprovalModalState,
  ] = useState({
    showModal: false,
    approvalDetails: undefined,
  });


  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    getAdmissionWithdrawalApiCall();
  }

  function getAdmissionWithdrawalApiCall(otherProps?: any) {
    const payload = {
      branchId,
      approvedStatus: "PENDING",
      ...filtersRef.current,
      ...otherProps,
      ...paginationRef.current
    }
    dispatch(getAdmissionWithdrawalAct(generateActionPayload("get_admission_withdrawal", undefined, payload)));
  }

  function updateFilterHandler(filterValues: any) {
    paginationRef.current.pageNo = 0;
    filtersRef.current = filterValues;
    getAdmissionWithdrawalApiCall(filterValues);
  }


  function toogleApproveWithdrawalModal(apiCall: any) {
    if (typeof apiCall === "boolean" && apiCall) {
      getAdmissionWithdrawalApiCall();
    }
    setApproveModalState(prevState => ({ ...prevState, showModal: false }));
  }

  const withdrawalColumns = useMemo(() => generateColumns(menuOptions), [getAdmissionWithdrawalResp]);
  const { data: admissionWithTableData, totalPages, totalElements, pageNumber } = getAdmissionWithdrawalResp || {};
  return (
    <>
      <div className="tw-pb-3 tw-px-3">
        <FilterHeader
          branchId={branchId}
          instituteId={instituteId}
          dispatch={dispatch}
          ref={filterHeaderRef}
          filterValues={filtersRef.current}
          updateFilterHandler={updateFilterHandler}
        />
      </div>
      <TableContainer
        columns={withdrawalColumns || []}
        data={Array.isArray(admissionWithTableData) ? admissionWithTableData : []}
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
        showPagination={true}
        totalPages={totalPages}
        totalRecords={totalElements}
        callbackPaginationHndlr={paginationHndlr}
        currentPageNumber={pageNumber || 0}
      />

      <ModalContainerUpdated
        id="allow-withdrawal"
        modalTitle="Admission Withdrawal"
        modalSize="md"
        isOpen={approveModalState.showModal}
        toggle={toogleApproveWithdrawalModal}
      >
        <AdmissionWithdrawalApprovalModal
          isOpen={approveModalState.showModal}
          toggleModal={toogleApproveWithdrawalModal}
          branchId={branchId}
          instituteId={instituteId}
          admissionWithdrawalId={approveModalState.admissionWithdrawalId}
        />
      </ModalContainerUpdated>

      {/* <ConfirmationModal
        id="delete-admissionwithdrawal-modal"
        isOpen={approveModalState.showModal}
        confirmMessage={approveModalState.confirmMessage}
        cancelHndlr={approveRejectCancelModalHndlr}
        confirmHndlr={approveRejectConfirmModalHndlr}
        showImgIcon={true}
        btnClassName={approveModalState.confirmationType === "approve" ? "btn w-sm btn-success" : "btn w-sm btn-danger"}
        iconType={approveModalState.confirmationType}
      /> */}

    </>
  );
};

export default AdmissionWithdrawalRequests;
