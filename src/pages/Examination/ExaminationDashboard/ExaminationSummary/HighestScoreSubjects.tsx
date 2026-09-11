import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumnsIssuedBooks, HighestScoreSubjectsTableData } from "./helper";

const HighestScoreSubjects = () => {

  const columns = useMemo(() => generateColumnsIssuedBooks(), []);
  return (
    <div className="book-summary px-0">
      <TableContainer
        columns={columns}
        data={HighestScoreSubjectsTableData}
        tableClass="mb-0"
        divClass="table-responsive mb-0"
        theadClass="table-light text-muted align-middle"
        showPagination={false}
      />
    </div>
  );
};

export default HighestScoreSubjects;
