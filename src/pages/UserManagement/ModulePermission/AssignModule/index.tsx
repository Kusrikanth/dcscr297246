import React, { useMemo } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import { branchData, generateColumns } from "./helper";

const AssignModule = () => {
  const moduleColumns = useMemo(() => generateColumns(), []);
  return (
    <div className="card mb-0">
      {/* <CardHeader>
        <h4 className="card-title mb-0 flex-grow-1">Module Lists</h4>
      </CardHeader> */}
      <div className="card-header">
        <div className="tw-grid tw-grid-cols-12 tw-items-center">
          <div className="tw-col-span-6">
            <h4 className="card-title tw-mb-0 tw-flex-grow">Assign Modules</h4>
          </div>
          {/* <div className="col-auto ms-auto">
                  <div className="d-flex">
                    <div className="d-flex">
                      <button
                        className="btn btn-success float-end d-flex align-items-center me-3"
                        onClick={() => {}}
                      >
                        <i className="ri-add-line me-2" />
                        Create User
                      </button>

                      <i className="ri-home-4-line fs-3" onClick={() => {}}></i>
                    </div>
                  </div>
                </div> */}
        </div>
      </div>
      <div className="card-body tw-p-0">
        <TableContainer
          columns={moduleColumns || []}
          data={branchData}
          divClass="table-responsive tw-mb-1"
          theadClass="table-light text-muted align-middle"
        />
      </div>
    </div>
  );
};

export default AssignModule;
