import React, { useMemo, useState } from "react";
import { Collapse } from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import ExamOverallChart from "./ExamOverallChart";
import {
  buildExamPerformanceRows,
  generateExamPerformanceColumns,
  IExamColumn,
  ISubjectYearRow,
} from "./helper";



const ExaminationPerformance = ({
  academicYear,
  subjects,
  exams,
}:any) => {
  const [isOpen, setIsOpen] = useState(true);

  const rows = useMemo(
    () => buildExamPerformanceRows(academicYear, subjects, exams),
    [academicYear, subjects, exams]
  );

  const columns = useMemo(
    () => generateExamPerformanceColumns(subjects),
    [subjects]
  );

  function toggleHndlr() {
    setIsOpen((prevState) => !prevState);
  }

  return (
    <div className="tw-card">
      <div className="tw-card-header tw-flex tw-flex-wrap tw-items-start tw-gap-3">
        <button
          type="button"
          onClick={toggleHndlr}
          aria-expanded={isOpen}
          className="tw-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-flex-shrink-0 tw-text-gray-400 hover:tw-text-gray-600"
        >
          <i
            className={`${
              isOpen ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"
            } tw-text-xl`}
          />
        </button>

        <div className="tw-flex-grow tw-min-w-0">
          <h4 className="tw-card-title">Examination Performance</h4>
          <p className="tw-card-subTitle">
            Subject scores per examination for {academicYear}
          </p>
        </div>
      </div>

      <Collapse isOpen={isOpen}>
        {subjects.length && rows.length ? (
          <React.Fragment>
            <TableContainer
              columns={columns}
              data={rows}
              divClass="tw-overflow-x-auto"
              tableClass="tw-w-full tw-whitespace-nowrap tw-align-middle"
              theadClass="tw-bg-gray-50 tw-text-gray-500 tw-align-middle"
            />

            <div className="tw-card-body tw-pt-0 !tw-px-0">
              <ExamOverallChart rows={rows} />
            </div>
          </React.Fragment>
        ) : (
          <div className="tw-card-body">
            <NoDataComp
              title="No examination data"
              helperText="Clear the subject or exam filter to see the full examination summary."
            />
          </div>
        )}
      </Collapse>
    </div>
  );
};

export default React.memo(ExaminationPerformance);
