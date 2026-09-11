import { useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { SelectInput } from "../../../../../Components/Common";

const AdmissionSummaryTableView = () => {
  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="">
        <TableContainer
          columns={tableColumns || []}
          data={tableData || []}
          divClass="table-responsive tw-mb-3"
          theadClass="table-light text-muted align-middle"
          showFooter={true}
          trFooterClass="fw-bold bg-light tw-text-center"
        ></TableContainer>
      </div>
    </>
  );
};

export default AdmissionSummaryTableView;
