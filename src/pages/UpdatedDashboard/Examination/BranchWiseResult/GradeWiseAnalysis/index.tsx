import { useMemo } from "react";
import { TableExpandable } from "../../../../../Components/Common";
import { generateColumns, transformTableData } from "./helper";

const GradeWiseAnalysis = ({ data }) => {
  const { subjects, branchWiseSubjectAndAvgMarks } = data?.gradeWiseAnalysis;

  const tableColumns = useMemo(() => generateColumns(subjects), [subjects]);

  const tableData = useMemo(() => transformTableData(branchWiseSubjectAndAvgMarks), [branchWiseSubjectAndAvgMarks]);

  return (
    <div>
      <TableExpandable
        columns={tableColumns || []}
        data={tableData || []}
        divClass="table-responsive !tw-mb-3 table-expandable table-sticky grade-wise-analysis-table-container !tw-h-[478px]"
        theadClass="text-muted align-middle theadPrimary"
        tableClass="table-bordered table-nowrap"
      />
    </div>
  );
};

export default GradeWiseAnalysis;
