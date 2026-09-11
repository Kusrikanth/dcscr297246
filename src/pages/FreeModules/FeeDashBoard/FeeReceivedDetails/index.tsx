import React, { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { classData, generateColumns } from "./helper";
import Button from "../../../../Components/Common/Button";

const FeeReceivedDetails = () => {
  const curriculumColumns = useMemo(() => generateColumns(), []);
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <h4 className="card-title tw-mb-0 tw-flex-grow">
                Fee Received Details
              </h4>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6 tw-flex tw-justify-end tw-px-4 md:tw-px-0">
              <select className="sort_selection">
                <option value="1">01 Jun 2022 to 31 Jun 2022</option>
                <option value="2">option 2</option>
                <option value="3">option 3</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body tw-p-0">
          <TableContainer
            columns={curriculumColumns || []}
            data={classData ? classData : []}
            divClass="table-responsive tw-mb-1"
            theadClass="table-light text-muted align-middle"
          />
          <Button type="button" variant="secondary">
            View all
          </Button>
        </div>
      </div>
    </>
  );
};

export default FeeReceivedDetails;
