import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const AdmissionsYearWiseTable = () => {

  const [tableData, setTableData] = useState<any[]>([]);
  const [tableCol, setTableCol] = useState<any[]>([]);

  const {
    getAdmissionsYearWiseResp } =
    useAppSelector(({ reports }) => ({
      getAdmissionsYearWiseResp: reports.getAdmissionsYearWiseResp,
    }), shallowEqual)

  useEffect(() => {
    if (Array.isArray(getAdmissionsYearWiseResp)) {
      const findCol = Array.from(
        new Map(
          getAdmissionsYearWiseResp.map((item: any) => [item.academicYearId, { academicYearName: item.academicYearName, academicYearId: item.academicYearId }])
        ).values()
      )

      const modifiedData = getAdmissionsYearWiseResp.reduce((acc: any, curr: any) => {
        const commonObj = {
          branchName: curr?.branchName,
          branchId: curr?.branchId,
          [`${curr?.academicYearName}Admissions`]: curr?.admissions
        }
        const findBranchIdx = acc.findIndex((item: any) => item.branchName === curr.branchName);

        if (findBranchIdx !== -1) {
          acc[findBranchIdx] = { ...acc[findBranchIdx], [`${curr?.academicYearName}Admissions`]: curr?.admissions }
        } else {
          acc = [...acc, { ...commonObj }]
        }
        return acc
      }, [])
      
      setTableData(modifiedData);
      setTableCol(findCol);
    } else {
      setTableData([])
    }
  }, [getAdmissionsYearWiseResp])

  const tableColumns = useMemo(() => generateColumns(tableCol), [tableCol,tableData]);

  return (
    <div>
      <TableContainer
        columns={tableColumns || []}
        data={tableData || []}
        tableClass="tw-mb-0"
        divClass="table-responsive tw-mb-3 admission-year-wise-table"
        theadClass="table-light text-muted tw-align-middle"
        showFooter={true}
        trFooterClass="fw-bold bg-light"
      ></TableContainer>
    </div>
  );
};

export default AdmissionsYearWiseTable;
