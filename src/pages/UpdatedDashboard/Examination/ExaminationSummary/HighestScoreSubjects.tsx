import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumnsIssuedBooks,
} from "./helper";

const HighestScoreSubjects = (props: any) => {
  const columns = useMemo(() => generateColumnsIssuedBooks(), [props.data]);
  return (
    <div className="book-summary tw-px-0 tw-h-full">
      <TableContainer
        columns={columns}
        data={props?.data?.highestScoreSubjectWises}
        tableClass="tw-mb-0 tw-h-full"
        divClass="table-responsive tw-mb-0 tw-h-full"
        theadClass="table-light text-muted align-middle position-sticky top-0"
        showPagination={false}
      />
    </div>
  );
};

export default HighestScoreSubjects;
