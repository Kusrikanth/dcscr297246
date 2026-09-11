import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, getKeyName } from "./helper";
import { getPendingReqListAct } from "../../../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { Button } from "../../../../../Components/Common";

const PendingRequestsModal = (props: any) => {

  const { academicYearId, toggle, branchIdState } = props || {}
  const [tableData, setTableData] = useState<any[]>([]);

  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getPendingReqListResp,
  } = useAppSelector(
    ({ appData, instAcademics, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getPendingReqListResp: feeReport.getPendingReqListResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (instituteId && academicYearId) {
      getTransportOptedApiCall();
    }
  }, [instituteId, academicYearId]);

  useEffect(() => {
    if (Array.isArray(getPendingReqListResp)) {
      const modifiedResp = getPendingReqListResp.reduce((acc: any[], curr: any, idx: number) => {
        const findIdx = acc.findIndex((item: any) => +item.branchId === +curr.branchId)
        if (findIdx > -1) {
          acc[findIdx][getKeyName(curr?.transportRequestType)] = curr?.numberOfRequests
        } else {
          acc = [...acc, {
            branchId: curr?.branchId,
            branchName: curr?.branchName,
            [getKeyName(curr.transportRequestType)]: curr?.numberOfRequests || 0
          }]
        }

        if (idx === getPendingReqListResp.length - 1) {
          acc = acc.map((item: any) => {
            const { newRequests = 0, terminationRequests = 0, changeRequests = 0 } = item || {}
            return { ...item, totalPendingRequest: newRequests + terminationRequests + changeRequests }
          })
        }
        return acc
      }, [])
      setTableData(modifiedResp)
    }
  }, [getPendingReqListResp])

  const getTransportOptedApiCall = (otherProps?: any) => {
    const payload = {
      instituteId,
      academicYearId,
      ...otherProps,
    };
    dispatch(getPendingReqListAct(generateActionPayload('get_pending_req_list', undefined, payload)))
  }
  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <div className="tw-container-fluid tw-px-0">
      <div className="tw-flex tw-flex-wrap">
        <div className="tw-w-full">
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            divClass="table-responsive tw-mt-3"
            tableClass="table-nowrap"
            theadClass="table-light tw-text-gray-500 tw-align-middle"
            showFooter={true}
            trFooterClass="tw-font-bold tw-bg-gray-100"
          ></TableContainer>
        </div>
        <div className="tw-w-full tw-py-3 tw-px-3 tw-flex tw-justify-end">
          <Button type="button" onClick={toggle} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingRequestsModal;
