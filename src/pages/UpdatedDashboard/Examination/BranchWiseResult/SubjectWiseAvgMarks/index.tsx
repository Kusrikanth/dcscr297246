import { useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";

const SubjectWiseAvgMarks = ({ data }) => {
  const { subjects, branchWiseSubjectAndAvgMarks } = data?.subjectAndAvgMarks;

  const tableColumns = useMemo(
    () => generateColumns(subjects, branchWiseSubjectAndAvgMarks),
    [subjects, branchWiseSubjectAndAvgMarks]
  );

  return (
    <div>
      <TableContainer
        columns={tableColumns || []}
        data={branchWiseSubjectAndAvgMarks || []}
        divClass="table-responsive !tw-mb-3 table-expandable table-sticky"
        theadClass="text-muted align-middle theadPrimary"
        tableClass="table-bordered table-nowrap"
        showFooter={true}
        trFooterClass="!tw-font-semibold bg-light"
      ></TableContainer>
    </div>
  );
};

export default SubjectWiseAvgMarks;
