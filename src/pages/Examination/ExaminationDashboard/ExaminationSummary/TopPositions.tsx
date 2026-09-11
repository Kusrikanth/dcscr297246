import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { topPositionColumns, topPositionsData } from "./helper";

const TopPositions = () => {
  const tableColumns = useMemo(() => topPositionColumns(), []);

  return (
    <div className="book-summary px-0">
      <TableContainer
        columns={tableColumns}
        data={topPositionsData}
        tableClass="mb-0"
        divClass="table-responsive mb-0"
        theadClass="table-light text-muted align-middle"
        showPagination={false}
        showFooter={false}
      ></TableContainer>
    </div>
  );
};

export default TopPositions;
