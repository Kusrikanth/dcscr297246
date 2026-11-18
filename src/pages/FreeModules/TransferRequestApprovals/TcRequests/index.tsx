
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import TcRequestsViewModal from "./TcRequestsViewModal";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { exportTcRequestListAct, getTcRequestList, setTcRequestAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import TcFilters, { initialFilterValues } from "../TcFilters";
import TCApproveRejectModal from "./TcApproveRejectModal";
import { toast } from "react-toastify";
import { useModal } from "../../../../hooks/modalhook";
import { useLocation } from "react-router-dom";
import LibraryTcRequestsViewModal from "./LibraryTcRequestsViewModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard, Notebook01Icon } from "@hugeicons-pro/core-stroke-standard";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import Button from "../../../../Components/Common/Button";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { useRevertedTcRecords } from "../../../../utility/tcrevertutility";
import {
  getLoggedInUserName,
  getTcApprovalAccess,
  useApprovalActivities,
} from "../../../../utility/approvalconfigutility";

const TcRequests = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // This component is used in Library Transfer Request Details and Fee Transfer Request Approvals pages; the condition below adapts the logic for each context.

  const deptName = (location.pathname.includes("library") ? 'LIBRARY' : 'ACCOUNTS')
  const paginationDetails = useRef({
    pageNo: 0,
    pageSize: 10
  });
  const { modalState: approveRejTcModalState, closeModal: closeApproveRejTcModalHndlr,
    openModal: openApproveRejModalTcHndlr
  } = useModal();
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const { modalState: tcRequestViewModalState, closeModal: closeTcRequestViewModalHndlr,
    openModal: openTcRequestViewModalHndlr
  } = useModal();

  const { modalState: libraryTcRequestViewModalState, closeModal: closeLibraryTcRequestViewModalHndlr,
    openModal: openLibraryTcRequestViewModalHndlr
  } = useModal();

  const filterRef = useRef(initialFilterValues);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState("");
  const revertedTcRecords = useRevertedTcRecords();
  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    tcRequestList, exportTcRequestListResp, classroomManagmentErrorResp, showApiLoader, userMeResp } =
    useAppSelector(
      ({ appData, classroomManagmentInfo, globalData, login }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        tcRequestList: classroomManagmentInfo.tcRequestList,
        exportTcRequestListResp: classroomManagmentInfo.exportTcRequestListResp,
        showApiLoader: globalData.showApiLoader,
        classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
        userMeResp: login.userMeResp
      }), shallowEqual);

  // Employee-dependent approval: only employees configured as mandatory approvers
  // for the TC Request activity (Branch Settings > Approval Configuration) can
  // approve or cancel; everyone else with screen access is view-only.
  const approvalActivities = useApprovalActivities();
  const tcApprovalAccess = useMemo(
    () => getTcApprovalAccess(approvalActivities, deptName, userMeResp),
    [approvalActivities, deptName, userMeResp]
  );

  const tcRequestRespRef = useRef({
    prevExportTcRequestListResp: exportTcRequestListResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp
  })

  useEffect(() => {
    const { prevExportTcRequestListResp, prevClassroomManagmentErrorResp } = tcRequestRespRef.current;
    if (exportTcRequestListResp && exportTcRequestListResp !== prevExportTcRequestListResp) {
          toast.success("Pending List Exported successfully");
          closeExportModal()
          downloadExcelFile(exportTcRequestListResp, "Transfer Request Details Pending List");
        } else if (classroomManagmentErrorResp && prevClassroomManagmentErrorResp !== classroomManagmentErrorResp) {
      const { message, details }: any = classroomManagmentErrorResp;
      toast.error(message || details || "Something went wrong.");
    }
    tcRequestRespRef.current.prevExportTcRequestListResp = exportTcRequestListResp;
    tcRequestRespRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;

  }, [exportTcRequestListResp, classroomManagmentErrorResp]);

  useEffect(() => {
    return () => {
      dispatch(setTcRequestAct(undefined));
    }
  }, []);

  const getActions = (openApproveRejModalTcHndlr: Function) => [
    {
      id: "allow",
      actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="text-success" size={18} />,
      actionName: "Allow",
      onClickHndlr: (event: any) => {
        const tcReqId = event.currentTarget.getAttribute("data-id");
        if (tcReqId) {
          openApproveRejModalTcHndlr({
            tcReqId,
            requestType: "APPROVED",
          });
        }
      },
    },
    {
      id: "cancel",
      actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="text-danger" size={18} />,
      actionName: "Cancel",
      onClickHndlr: (event: any) => {
        const tcReqId = event.currentTarget.getAttribute("data-id");
        if (tcReqId) {
          openApproveRejModalTcHndlr({
            tcReqId,
            requestType: "REJECTED",
          });
        }
      },
    }
  ];

  const getRowMenuOptions = useMemo(() => {
    const approveRejectActions = getActions(openApproveRejModalTcHndlr);
    const viewAction =
      deptName === "LIBRARY"
        ? {
            id: "view",
            actionIcon: <HugeiconsIcon icon={Notebook01Icon} className="text-muted" size={18} />,
            actionName: "View",
            onClickHndlr: (event: any) => {
              const tcReqId = event.currentTarget.getAttribute("data-id");
              const { studentCode, studentName, className, sectionName } = tcRequestList?.content?.find((item: any) => item?.tcRequestId?.toString() === tcReqId) || {};
              openLibraryTcRequestViewModalHndlr({
                studentCode, studentName, className, sectionName, tcReqId,
              });
            },
          }
        : {
            id: "view",
            actionIcon: <HugeiconsIcon icon={Notebook01Icon} className="text-muted" size={18} />,
            actionName: "View",
            onClickHndlr: (event: any) => {
              const tcReqId = event.currentTarget.getAttribute("data-id");
              const { studentId } = tcRequestList?.content?.find((item: any) => item?.tcRequestId?.toString() === tcReqId) || {};
              openTcRequestViewModalHndlr({ studentId, tcReqId });
            },
          };
    // Approve/Cancel only for requests whose class falls inside the logged-in
    // approver's class scope (approvers can cover all classes or specific ones).
    return (row: any) => [
      viewAction,
      ...(tcApprovalAccess.canApproveClass(row?.className, row?.curriculumName)
        ? approveRejectActions
        : []),
    ];
  }, [tcRequestList, deptName, openApproveRejModalTcHndlr, tcApprovalAccess]);



  const getTcRequestListResponse = (otherProps?: any) => {

    const params = {
      branchId,
      ...filterRef.current,
      ...otherProps,
      departmentName: deptName,
      approvedStatus: "PENDING",
      ...paginationDetails.current,
    }
    dispatch(getTcRequestList(generateActionPayload('tc_request_bydept', undefined, params)))
  }

  const exportSubmitHndlr = (otherProps?: any) => {
    const payload = {
      branchId,
      ...filterRef.current,
      ...otherProps,
      departmentName: deptName,
      approvedStatus: "PENDING",

    };
    dispatch(exportTcRequestListAct(generateActionPayload("export_tc_req_list", undefined, payload, {
      responseType: 'blob'
    })));
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationDetails.current.pageNo = 0;
    paginationDetails.current = paginationInfo;
    getTcRequestListResponse(paginationInfo)
  }

  function updateFilterHandler(appliedFilter: any) {
    filterRef.current = appliedFilter;
    setSelectedAcademicYearId(appliedFilter?.academicYearId || "");
    getTcRequestListResponse();
  }

  function toggleApproveRejModal(apiCall: any) {
    if (typeof apiCall === "boolean" && apiCall) {
      getTcRequestListResponse();
    }
    closeApproveRejTcModalHndlr();
  }

  const props = {
    filterRef,
  };

  const { content: TcRequestList = [], totalElements, totalPages, number: pageNumber } = tcRequestList || {};

  // A TC request reverted from the Transfer Certificate screen comes back as a pending approval
  // under the academic year it was reverted to.
  const displayedTcRequestList = useMemo(() => {
    const revertedRows = revertedTcRecords
      .filter((record) => `${record.revertedAcademicYearId}` === `${selectedAcademicYearId}`)
      .map((record) => ({
        tcRequestId: record.tcId,
        studentId: record.studentId,
        studentCode: record.studentCode,
        studentName: record.studentName,
        curriculumName: record.curriculumName,
        className: record.className,
        sectionName: record.sectionName,
        tcApplicationDate: record.tcApplicationDate,
        lastAttendanceDate: record.lastAttendanceDate,
        deptApprovedStatus: "PENDING",
        tcRequestStatus: "Yet to prepare",
        feePaidStatus: "PENDING",
      }));
    const revertedTcIds = revertedRows.map((row) => `${row.tcRequestId}`);
    return [
      ...revertedRows,
      ...TcRequestList.filter((row: any) => !revertedTcIds.includes(`${row.tcRequestId}`)),
    ];
  }, [TcRequestList, revertedTcRecords, selectedAcademicYearId]);

  const roleColumns = useMemo(() => generateColumns(getRowMenuOptions), [getRowMenuOptions]);
  return (
    <>
      <div className="tw-inline-block tw-w-full tw-mt-2">
        {tcApprovalAccess.restricted && (
          tcApprovalAccess.canApprove ? (
            <div className="tw-flex tw-items-center tw-gap-2 tw-rounded-md tw-border tw-border-teal-200 tw-bg-teal-50 tw-px-3 tw-py-2 tw-mb-3 tw-text-sm tw-text-teal-800">
              <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} size={16} />
              <span>
                You are a designated approver for{" "}
                {deptName === "LIBRARY" ? "Library" : "Accounts"} TC requests
                {getLoggedInUserName(userMeResp)
                  ? ` (${getLoggedInUserName(userMeResp)})`
                  : ""}
                {tcApprovalAccess.currentApproverClassNames.length
                  ? ` — limited to classes ${tcApprovalAccess.currentApproverClassNames.join(", ")}; other classes are view-only`
                  : ""}
                .
              </span>
            </div>
          ) : tcApprovalAccess.isAcknowledger ? (
            <div className="tw-flex tw-items-center tw-gap-2 tw-rounded-md tw-border tw-border-blue-200 tw-bg-blue-50 tw-px-3 tw-py-2 tw-mb-3 tw-text-sm tw-text-blue-800">
              <HugeiconsIcon icon={Notebook01Icon} size={16} />
              <span>
                You are an acknowledgement participant for{" "}
                {deptName === "LIBRARY" ? "Library" : "Accounts"} TC requests —
                you are kept informed, but requests proceed without your
                approval. Approvals are made by{" "}
                <b>{tcApprovalAccess.approverNames.join(", ")}</b>.
              </span>
            </div>
          ) : (
            <div className="tw-flex tw-items-center tw-gap-2 tw-rounded-md tw-border tw-border-orange-200 tw-bg-orange-50 tw-px-3 tw-py-2 tw-mb-3 tw-text-sm tw-text-orange-800">
              <HugeiconsIcon icon={CancelCircleIcon} size={16} />
              <span>
                View-only access: TC requests for{" "}
                {deptName === "LIBRARY" ? "Library" : "Accounts"} can only be
                approved by{" "}
                <b>{tcApprovalAccess.approverNames.join(", ")}</b> (configured
                under Branch Settings &gt; Approval Configuration).
              </span>
            </div>
          )
        )}
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
          <div className="tw-col-span-12 md:tw-col-span-11">
            <TcFilters
              branchId={branchId}
              instituteId={instituteId}
              dispatch={dispatch}
              filterValues={filterRef.current}
              updateFilterHandler={updateFilterHandler}
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-1 tw-flex tw-justify-end md:tw-justify-center tw-items-end tw-pb-3 md:tw-ml-6">
            <Button
              id="export-btn"
              type="button"
              variant="exportBtn"
              onClick={openExportModal}
              className="!tw-p-2"
            >
              <img src={ExportIcon} className="tw-h-5 tw-w-5" />
            </Button>
            <UncontrolledTooltip placement="bottom" target="export-btn">
              Export
            </UncontrolledTooltip>
          </div>
        </div>
        <TableContainer
          columns={roleColumns || []}
          data={displayedTcRequestList}
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
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
          departmentName={deptName}
          approverName={
            tcApprovalAccess.restricted
              ? getLoggedInUserName(userMeResp)
              : ""
          }
          toggle={toggleApproveRejModal}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="tc-requests-approval-modal"
        isOpen={tcRequestViewModalState.showModal}
        toggle={closeTcRequestViewModalHndlr}
        modalSize="xl"
        headerClassName="p-3 bg-white"
        modalTitle="Student Ledger"
      >
        <TcRequestsViewModal
          isOpen={tcRequestViewModalState.showModal}
          toggle={closeTcRequestViewModalHndlr}
          branchId={branchId}
          studentId={tcRequestViewModalState?.modalData?.studentId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="library-tc-requests-approval-modal"
        isOpen={libraryTcRequestViewModalState.showModal}
        toggle={closeLibraryTcRequestViewModalHndlr}
        modalSize="xl"
        headerClassName="p-3 bg-white"
        modalTitle="Student Details"
      >
        <LibraryTcRequestsViewModal
          isOpen={libraryTcRequestViewModalState.showModal}
          toggle={closeLibraryTcRequestViewModalHndlr}
          branchId={branchId}
          studentCode={libraryTcRequestViewModalState?.modalData?.studentCode}
          studentName={libraryTcRequestViewModalState?.modalData?.studentName}
          className={libraryTcRequestViewModalState?.modalData?.className}
          sectionName={libraryTcRequestViewModalState?.modalData?.sectionName}
          {...props}
        />
      </ModalContainerUpdated>

    </>
  );
};

export default TcRequests;
