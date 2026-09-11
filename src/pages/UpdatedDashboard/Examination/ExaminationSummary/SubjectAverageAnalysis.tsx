import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  SubjectAverageAnalysisColumns,
} from "./helper";

const SubjectAverageAnalysis = (props: any) => {
  const convertedArray = useMemo(() => Object.entries(props?.data?.subjectAverage)?.map(([subjects, percentage]) => ({
    subjects,
    percentage
  })), [props.data]);
  const tableColumns = useMemo(() => SubjectAverageAnalysisColumns(), [props.data]);

  return (
    <div className="book-summary tw-px-0 tw-h-full">
      <TableContainer
        columns={tableColumns}
        data={convertedArray}
        tableClass="tw-mb-0 tw-h-full"
        divClass="table-responsive tw-mb-0 tw-h-full"
        theadClass="table-light text-muted align-middle position-sticky top-0"
        showPagination={false}
        showFooter={false}
      ></TableContainer>
    </div>
  );
};

export default SubjectAverageAnalysis;
