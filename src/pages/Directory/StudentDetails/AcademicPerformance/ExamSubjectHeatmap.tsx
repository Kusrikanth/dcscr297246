import React, { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateHeatmapColumns } from "./helper";


const ExamSubjectHeatmap = ({
  subjects,
  exams,
}:any) => {
  const columns = useMemo(() => generateHeatmapColumns(exams), [exams]);

  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header tw-flex tw-items-start tw-gap-3">
        <div className="tw-flex-grow tw-min-w-0">
          <h4 className="tw-card-title">Exam X Subject Performance</h4>
          <p className="tw-card-subTitle">
            Hover a cell for marks, maximum and grade
          </p>
        </div>
        <div className="tw-flex tw-items-center tw-gap-1 tw-text-xs tw-text-gray-500 tw-flex-shrink-0">
          <span>Low</span>
          <i
            className="tw-inline-block tw-w-4 tw-h-3 tw-rounded-sm"
            style={{ background: "#fde3e1" }}
          />
          <i
            className="tw-inline-block tw-w-4 tw-h-3 tw-rounded-sm"
            style={{ background: "#fff0cc" }}
          />
          <i
            className="tw-inline-block tw-w-4 tw-h-3 tw-rounded-sm"
            style={{ background: "#dff3e8" }}
          />
          <span>High</span>
        </div>
      </div>

      <TableContainer
        columns={columns}
        data={subjects}
        divClass="tw-overflow-x-auto"
        tableClass="tw-w-full tw-whitespace-nowrap"
        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
      />
    </div>
  );
};

export default React.memo(ExamSubjectHeatmap);
