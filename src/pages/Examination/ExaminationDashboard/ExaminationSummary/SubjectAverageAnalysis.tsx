import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { SubjectAverageAnalysisColumns, SubjectAverageAnalysisData } from "./helper";

const SubjectAverageAnalysis = () => {
  const tableColumns = useMemo(() => SubjectAverageAnalysisColumns(), []);

  return (
    <div className="book-summary px-0">
      <TableContainer
        columns={tableColumns}
        data={SubjectAverageAnalysisData}
        tableClass="mb-0"
        divClass="table-responsive mb-0"
        theadClass="table-light text-muted align-middle"
        showPagination={false}
        showFooter={false}
      ></TableContainer>
    </div>
  );
};

export default SubjectAverageAnalysis;
