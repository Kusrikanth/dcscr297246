import { useMemo } from "react";
import { generateColumns } from "./helper";
import { TableExpandable } from "../../../../../Components/Common";

const MarksAnalysis100Per = ({ data }) => {
  const tableColumns = useMemo(() => generateColumns(data?.centums.subjects, data?.centums?.branchWiseSubjectAndAvgMarks), [ data?.centums.subjects, data?.centums?.branchWiseSubjectAndAvgMarks]);
  
  return (
    <div className="">
      <TableExpandable
        columns={tableColumns || []}
        data={data?.centums?.branchWiseSubjectAndAvgMarks || []}
        divClass="table-responsive mb-3 table-expandable"
        theadClass="text-muted align-middle theadPrimary"
        tableClass="table-bordered table-nowrap"
        showFooter={true}
        trFooterClass="fw-semibold bg-light"
      ></TableExpandable>
    </div>
  );
};

export default MarksAnalysis100Per;
