import React, { useMemo, useState } from "react";
import { Collapse } from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateSubjectYearColumns } from "./helper";

const defaultSort = [{ id: "subject", desc: false }];

const SubjectWisePerformance = ({
  subjects,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const columns = useMemo(() => generateSubjectYearColumns(), []);

  function toggleHndlr() {
    setIsOpen((prevState) => !prevState);
  }

  return (
    <div className="tw-card">
      <div className="tw-card-header tw-flex tw-items-start tw-gap-2">
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
          <h4 className="tw-card-title">Subject-wise Performance</h4>
          <p className="tw-card-subTitle">
            Percentage per subject across academic years — click any column
            header to sort
          </p>
        </div>
      </div>

      <Collapse isOpen={isOpen}>
        <TableContainer
          columns={columns}
          data={subjects}
          defaultSort={defaultSort}
          divClass="tw-overflow-x-auto"
          tableClass="tw-w-full tw-whitespace-nowrap tw-align-middle"
          theadClass="tw-bg-gray-50 tw-text-gray-500 tw-align-middle"
        />
      </Collapse>
    </div>
  );
};

export default React.memo(SubjectWisePerformance);
