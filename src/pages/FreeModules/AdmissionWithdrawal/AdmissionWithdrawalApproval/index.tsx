import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, ModalContainerUpdated, ConfirmationModal } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import { default as ApproveSvg } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { default as CrossSvg } from "../../../../assets/imagesdps/academics/CrossSvg.svg?react";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";

import FilterHeader from "../FilterHeader";
import { initialFilterValues } from "../helper";
import { getAdmissionWithdrawalAct, getAdmissionWithdrawalApprovedAct, setGetAdmissionWithdrawalApprovedAct } from "../../../../store/FrontDesk/AdmissionSettings/admissionsettingaction";
// import {
//   getAdmissionWithdrawalAct
// } from "../../../../store/fee/feeapprovals/feeapprovalactions";
//Common Utility

const AdmissionWithdrawalApproval = () => {

  const paginationRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const filtersRef = useRef(initialFilterValues);
  const filterHeaderRef = useRef<any>();
  const dispatch = useAppDispatch();
  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    getAdmissionWithdrawalApprovedResp,
    admissionSettingErrorResp } =
    useAppSelector(({ appData, masterData,
      admissionSettingRequest }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        getAdmissionWithdrawalApprovedResp: admissionSettingRequest.getAdmissionWithdrawalApprovedResp,
        admissionSettingErrorResp: admissionSettingRequest.admissionSettingErrorResp,
      }), shallowEqual);
  const feeDetailsRespRef = useRef({
    prevGetAdmissionWithdrawalApprovedResp: getAdmissionWithdrawalApprovedResp,
    prevAdmissionSettingErrorResp: admissionSettingErrorResp
  });

  useEffect(() => {
    const { prevGetAdmissionWithdrawalApprovedResp, prevAdmissionSettingErrorResp } = feeDetailsRespRef.current;
    if (getAdmissionWithdrawalApprovedResp && prevGetAdmissionWithdrawalApprovedResp !== getAdmissionWithdrawalApprovedResp) {
      filterHeaderRef.current.closeAdvanceFilterHandler();
    }
    else if (admissionSettingErrorResp && admissionSettingErrorResp !== prevAdmissionSettingErrorResp) {
      const { message }: any = admissionSettingErrorResp;
      toast.error(message || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevGetAdmissionWithdrawalApprovedResp = getAdmissionWithdrawalApprovedResp;
    feeDetailsRespRef.current.prevAdmissionSettingErrorResp = admissionSettingErrorResp;
  }, [getAdmissionWithdrawalApprovedResp, admissionSettingErrorResp]);

  useEffect(() => {
    return () => {
      dispatch(setGetAdmissionWithdrawalApprovedAct(undefined));
    }
  }, []);

  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    getAdmissionWithdrawalApiCall();
  }

  function getAdmissionWithdrawalApiCall(otherProps?: any) {
    const payload = {
      branchId,
      ...filtersRef.current,
      ...otherProps,
      ...paginationRef.current
    }
    dispatch(getAdmissionWithdrawalApprovedAct(generateActionPayload("get_approved_admissionwithdrawal", undefined, payload)));
  }

  function updateFilterHandler(filterValues: any) {
    paginationRef.current.pageNo = 0;
    filtersRef.current = filterValues;
    getAdmissionWithdrawalApiCall(filterValues);
  }


  const withdrawalApprovalColumns = useMemo(() => generateColumns(), []);
  const { data: admissionWithTableData, totalPages, totalElements, pageNumber } = getAdmissionWithdrawalApprovedResp || {};
  return (
    <div className="tw-inline-block tw-w-full tw-mt-2">

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
        columns={withdrawalApprovalColumns}
        data={Array.isArray(admissionWithTableData) ? admissionWithTableData : []}
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
        showPagination={true}
        totalPages={totalPages}
        totalRecords={totalElements}
        callbackPaginationHndlr={paginationHndlr}
        currentPageNumber={pageNumber || 0}
      />
    </div>
  );
};

export default AdmissionWithdrawalApproval;
