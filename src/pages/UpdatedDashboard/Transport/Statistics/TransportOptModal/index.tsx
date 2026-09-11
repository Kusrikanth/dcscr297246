import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { getTransportOptedListAct } from "../../../../../store/fee/feereport/feereportactions";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { Button } from "../../../../../Components/Common";

const TransportOptModal = (props: any) => {

  const { academicYearId, toggle, branchIdState } = props || {}
  const [tableData, setTableData] = useState<any[]>([]);

  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getTransportOptedListResp,
  } = useAppSelector(
    ({ appData, instAcademics, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getTransportOptedListResp: feeReport.getTransportOptedListResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (instituteId && academicYearId) {
      getTransportOptedApiCall();
    }
  }, [instituteId, academicYearId]);

  useEffect(() => {
    if (getTransportOptedListResp) {
      const modifiedResp = Object.entries(getTransportOptedListResp).map(([key, value]: [string, any]) => {
        const { studentCountPrePrimary = 0, studentCountGrade = 0, staffCount = 0 } = value || {}
        const total = +studentCountPrePrimary + +studentCountGrade + +staffCount
        return { branchName: key, total, ...value }
      })
      setTableData(modifiedResp)
    }
  }, [getTransportOptedListResp])

  const getTransportOptedApiCall = (otherProps?: any) => {
    const payload = {
      instituteId,
      academicYearId,
      ...otherProps,
    };
    dispatch(getTransportOptedListAct(generateActionPayload('get_transport_opted_list', undefined, payload)))
  }

  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <div className="container-fluid tw-px-0">
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

export default TransportOptModal;
