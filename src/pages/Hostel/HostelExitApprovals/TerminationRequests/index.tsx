
import React, { useEffect, useMemo, useRef } from "react";
import { ModalContainerUpdated } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import TcFilters, { initialFilterValues } from "../TcFilters";
import TCApproveRejectModal from "./TcApproveRejectModal";
import { toast } from "react-toastify";
import { useModal } from "../../../../hooks/modalhook";
import { useLocation } from "react-router-dom";
import { hostelTransferRequestAct, setHostelTransferRequestAct } from "../../../../store/hostel/hostelrequest/hostelrequestactions";
import TcRequestsViewModal from "./TcRequestViewModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle03StrokeStandard, Notebook01Icon } from "@hugeicons-pro/core-stroke-standard";

const TerminationRequests = ({ parentModule = "" }: { parentModule: string }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // This component is used in Library Transfer Request Details and Fee Transfer Request Approvals pages; the condition below adapts the logic for each context.

  const paginationDetails = useRef({
    pageNo: 0,
    pageSize: 10
  });
  const { modalState: approveRejTcModalState, closeModal: closeApproveRejTcModalHndlr,
    openModal: openApproveRejModalTcHndlr
  } = useModal();
  const { modalState: tcRequestViewModalState, closeModal: closeTcRequestViewModalHndlr,
    openModal: openTcRequestViewModalHndlr
  } = useModal();

  const filterRef = useRef(initialFilterValues);
  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    hostelTransferRequestResp, hostelRequestErrorResp, showApiLoader } =
    useAppSelector(
      ({ appData, hostelRequest, globalData }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        showApiLoader: globalData.showApiLoader,
        hostelTransferRequestResp: hostelRequest.hostelTransferRequestResp,
        hostelRequestErrorResp: hostelRequest.hostelRequestErrorResp
      }), shallowEqual);

  const tcRequestRespRef = useRef({
    prevHostelRequestErrorResp: hostelRequestErrorResp
  })

  useEffect(() => {
    const { prevHostelRequestErrorResp } = tcRequestRespRef.current;
    if (hostelRequestErrorResp && prevHostelRequestErrorResp !== hostelRequestErrorResp) {
      const { message, details }: any = hostelRequestErrorResp;
      toast.error(message || details || "Something went wrong.");
    }
    tcRequestRespRef.current.prevHostelRequestErrorResp = hostelRequestErrorResp;

  }, [hostelRequestErrorResp]);

  useEffect(() => {
    return () => {
      dispatch(setHostelTransferRequestAct(undefined));
    }
  }, []);

  const menuOptions = useMemo(() => [
    {
      id: "view",
      actionIcon: <HugeiconsIcon icon={Notebook01Icon} className="text-muted" size={18} />,
      actionName: "View",
      onClickHndlr: (event: any) => {
        const tcReqId = event.currentTarget.getAttribute("data-id");
        const { studentId } = tcRequestList?.find((item: any) => item?.id?.toString() === tcReqId) || {};
        openTcRequestViewModalHndlr({ studentId, tcReqId });
      },
    },
    {
      id: "allow",
      actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard}
        className="text-success" size={18} />,
      actionName: "Allow",
      onClickHndlr: (event: any) => {
        const tcReqId = event.currentTarget.getAttribute("data-id");
        if (tcReqId) {
          openApproveRejModalTcHndlr({
            tcReqId,
            requestType: "APPROVED"
          });
        }
      },
    }
  ], [hostelTransferRequestResp]);


  const getTcRequestListResponse = (otherProps?: any) => {
    const params = {
      branchId,
      ...filterRef.current,
      ...otherProps,
      department: parentModule,
      status: "Pending",
      ...paginationDetails.current,
    }
    dispatch(hostelTransferRequestAct(generateActionPayload('get_hostel_transfer_request', undefined, params)))
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationDetails.current.pageNo = 0;
    paginationDetails.current = paginationInfo;
    getTcRequestListResponse(paginationInfo)
  }

  function updateFilterHandler(appliedFilter: any, resetPagination?: boolean) {
    if (resetPagination) {
      paginationDetails.current.pageNo = 0;
    }
    filterRef.current = appliedFilter;
    getTcRequestListResponse();
  }

  function toggleApproveRejModal(apiCall: any) {
    if (typeof apiCall === "boolean" && apiCall) {
      getTcRequestListResponse();
    }
    closeApproveRejTcModalHndlr();
  }

  const { data: tcRequestList, totalElements, totalPages, number: pageNumber } = hostelTransferRequestResp || {};
  const hostelRequestColumns = useMemo(() => generateColumns(menuOptions), [hostelTransferRequestResp]);
  return (
    <>
      <div className="tw-inline-block tw-w-full tw-mt-2">
        <TcFilters
          branchId={branchId}
          instituteId={instituteId}
          dispatch={dispatch}
          filterValues={filterRef.current}
          updateFilterHandler={updateFilterHandler}
        />
        <TableContainer
          columns={hostelRequestColumns}
          data={Array.isArray(tcRequestList) ? tcRequestList : []}
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber}
        />
      </div>
      <ModalContainerUpdated
        id="tc-requests-approval-modal"
        isOpen={approveRejTcModalState.showModal}
        toggle={closeApproveRejTcModalHndlr}
        hideHeader={true}
        modalSize="md"
      >
        <TCApproveRejectModal
          requestType={approveRejTcModalState?.modalData?.requestType}
          tcReqId={approveRejTcModalState?.modalData?.tcReqId}
          toggle={toggleApproveRejModal}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="tc-requests-approval-modal"
        isOpen={tcRequestViewModalState.showModal}
        toggle={closeTcRequestViewModalHndlr}
        modalSize="xl"
        headerClassName="tw-p-3 tw-bg-white"
        modalTitle="Student Ledger"
      >
        <TcRequestsViewModal
          isOpen={tcRequestViewModalState.showModal}
          toggle={closeTcRequestViewModalHndlr}
          branchId={branchId}
          studentId={tcRequestViewModalState?.modalData?.studentId}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default TerminationRequests;
