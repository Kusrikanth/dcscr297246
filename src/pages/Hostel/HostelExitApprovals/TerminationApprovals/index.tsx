
import { useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import TcFilters, { initialFilterValues } from "../TcFilters";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useLocation } from "react-router-dom";
import { hostelTransferRequestAct, setHostelTransferRequestAct } from "../../../../store/hostel/hostelrequest/hostelrequestactions";

const TerminationApprovals = ({ parentModule = "" }: { parentModule: string }) => {
  const dispatch = useAppDispatch();
  const paginationDetails = useRef({
    pageNo: 0,
    pageSize: 10
  });

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

  const getTcRequestListResponse = (otherProps?: any) => {
    const params = {
      branchId,
      ...filterRef.current,
      ...otherProps,
      department: parentModule,
      status: "Approved",
      ...paginationDetails.current,
    }
    if(params?.academicYearId){
      dispatch(hostelTransferRequestAct(generateActionPayload('get_hostel_transfer_request', undefined, params)))
    }
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationDetails.current.pageNo = 0;
    paginationDetails.current = paginationInfo;
    getTcRequestListResponse(paginationInfo)
  }

  function updateFilterHandler(appliedFilter: any) {
    filterRef.current = appliedFilter;
    getTcRequestListResponse();
  }

  const { data: tcRequestList, totalElements, totalPages, number: pageNumber } = hostelTransferRequestResp || {};
  const tcApprovedColumns = useMemo(() => generateColumns(), [hostelTransferRequestResp]);
  return (
    <div className="tw-inline-block tw-w-full tw-mt-2">
      <TcFilters
        branchId={branchId}
        instituteId={instituteId}
        dispatch={dispatch}
        filterValues={filterRef.current}
        updateFilterHandler={updateFilterHandler}
      />
      <TableContainer
        columns={tcApprovedColumns}
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
  );
};

export default TerminationApprovals;
