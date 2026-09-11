import { useMemo } from "react";
import { generateColumns } from "./helper";
import { TableExpandable } from "../../../../../Components/Common";

const Below50PerMarksAnalysis = ({ data }) => {
  const tableColumns = useMemo(
    () =>
      generateColumns(
        data?.below50PercentMarksAnalysis?.subjects,
        data?.below50PercentMarksAnalysis?.branchWiseSubjectAndAvgMarks
      ),
    [
      data?.below50PercentMarksAnalysis?.subjects,
      data?.below50PercentMarksAnalysis?.branchWiseSubjectAndAvgMarks,
    ]
  );

  return (
    <div className="">
      <TableExpandable
        columns={tableColumns || []}
        data={data?.below50PercentMarksAnalysis?.branchWiseSubjectAndAvgMarks || []}
        divClass="table-responsive tw-mb-3 table-expandable"
        theadClass="text-muted align-middle theadPrimary"
        tableClass="table-bordered table-nowrap"
        showFooter={true}
        trFooterClass="tw-font-semibold bg-light"
      ></TableExpandable>
    </div>
  );
};

export default Below50PerMarksAnalysis;
