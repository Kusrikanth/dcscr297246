
import  { useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import TcFilters, { initialFilterValues } from "../TcFilters";
import { exportTcRequestListAct, getTcRequestList, setTcRequestAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useLocation } from "react-router-dom";
import Button from "../../../../Components/Common/Button";
import { useModal } from "../../../../hooks/modalhook";
import { UncontrolledTooltip } from "reactstrap";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { downloadExcelFile } from "../../../../utility/commonutility";

const TCApprovalList = () => {
  const paginationDetails = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const filterRef = useRef(initialFilterValues);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // This component is used in Library Transfer Request Details and Fee Transfer Request Approvals pages; the condition below adapts the logic for each context.

  const deptName = (location.pathname.includes("library") ? 'LIBRARY' : 'ACCOUNTS')
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    tcRequestList, exportTcRequestListResp,
    classroomManagmentErrorResp } =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classroomManagmentInfo }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        exportTcRequestListResp: classroomManagmentInfo.exportTcRequestListResp,
        tcRequestList: classroomManagmentInfo.tcRequestList,
        classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp
      }), shallowEqual);

  const tcRequestRespRef = useRef({
    prevExportTcRequestListResp: exportTcRequestListResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp
  })

  useEffect(() => {
    const { prevExportTcRequestListResp, prevClassroomManagmentErrorResp } = tcRequestRespRef.current;
    if (exportTcRequestListResp && exportTcRequestListResp !== prevExportTcRequestListResp) {
      toast.success("Approved List Exported successfully");
      closeExportModal()
      downloadExcelFile(exportTcRequestListResp, "Transfer Request Details Approved List");
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


  const getTcRequestListResponse = (otherProps?: any) => {
    const params = {
      branchId,
      ...filterRef.current,
      ...otherProps,
      departmentName: deptName,
      approvedStatus: "APPROVED",
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
      approvedStatus: "APPROVED",

    };
    dispatch(exportTcRequestListAct(generateActionPayload("export_tc_req_list", undefined, payload, {
      responseType: 'blob'
    })));
  }
  function updateFilterHandler(appliedFilter: any) {
    paginationDetails.current.pageNo = 0;
    filterRef.current = appliedFilter;
    getTcRequestListResponse();
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationDetails.current = paginationInfo;
    getTcRequestListResponse(paginationInfo)
  }

  const roleColumns = useMemo(() => generateColumns(), []);
  const { content: TcRequestList = [], totalElements, totalPages, number: pageNumber } = tcRequestList || {};
  return (
    <>
      <div className="tw-inline-block tw-w-full tw-mt-2">

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

          {/* Export Button */}
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
          data={TcRequestList}
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber}
        />

      </div>
      <ModalContainerUpdated
        id="export-tc-request-list"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Transfer Request Details List"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportSubmitHndlr}
          feature="academic"
          subFeature={"tc_request_approvals"}
          remarksText="Enter remarks to Export Transfer Request Details List ?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default TCApprovalList;
