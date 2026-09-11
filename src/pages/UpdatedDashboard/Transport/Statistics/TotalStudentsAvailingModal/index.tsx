import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getStuAvailingListAct } from "../../../../../store/fee/feereport/feereportactions";
import { Button } from "../../../../../Components/Common";

const TotalStudentsAvailingModal = (props: any) => {
  const { academicYearId, toggle, branchIdState } = props || {}
  const [tableData, setTableData] = useState<any[]>([]);

  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getStuAvailingListResp,
  } = useAppSelector(
    ({ appData, instAcademics, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getStuAvailingListResp: feeReport.getStuAvailingListResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (instituteId && academicYearId) {
      getActiveVehicleApiCall();
    }
  }, [instituteId, academicYearId]);

  useEffect(() => {
    if (Array.isArray(getStuAvailingListResp)) {
      const modifiedResp = getStuAvailingListResp.reduce((acc: any[], curr: any) => {
        const findIdx = acc.findIndex((item: any) => +item.branchId === +curr.branchId)
        const key = curr?.termName?.replace("-", "") || "";
        if (findIdx > -1) {
          acc[findIdx][`${key?.toLowerCase()}`] = curr?.totalStudents
        } else {
          acc = [...acc, {
            branchId: curr?.branchId,
            branchName: curr?.branchName,
            [`${key?.toLowerCase()}`]: curr?.totalStudents,
          }]
        }
        return acc
      }, [])
      setTableData(modifiedResp)
    }
  }, [getStuAvailingListResp])

  const getActiveVehicleApiCall = (otherProps?: any) => {
    const payload = {
      instituteId,
      academicYearId,
      ...otherProps,
    };
    dispatch(getStuAvailingListAct(generateActionPayload('get_stu_avail_list', undefined, payload)))
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

export default TotalStudentsAvailingModal;
