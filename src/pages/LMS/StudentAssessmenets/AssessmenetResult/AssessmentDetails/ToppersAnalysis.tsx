import { useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";

const ToppersAnalysis = () => {
  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title mb-0">Toppers Analysis</h4>
      </div>

      <div className="card-body p-0">
        <TableContainer
          columns={tableColumns || []}
          data={tableData || []}
          divClass="table-responsive mb-3"
          tableClass="table-nowrap"
          theadClass="table-light text-muted align-middle"
          showPagination={false}
        ></TableContainer>
      </div>
    </div>
  );
};

export default ToppersAnalysis;
