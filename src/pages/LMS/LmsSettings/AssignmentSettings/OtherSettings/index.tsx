import { PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { useMemo } from "react";

const OtherSettings = () => {
  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <div className="card">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col-6">
            <h4 className="card-title mb-0 flex-grow-1">Other Settings</h4>
          </div>
          <div className="col-auto ms-auto">
            <div className="d-flex">
              <button
                className="btn btn-success float-end d-flex align-items-center"
                onClick={() => {}}
              >
                <HugeiconsIcon icon={PlusSignIcon} className="me-2" size={18} />
                Add New
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        <TableContainer
          columns={tableColumns || []}
          data={tableData || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          totalPages={0}
          totalRecords={0}
          currentPageNumber={0}
        ></TableContainer>
      </div>
    </div>
  );
};

export default OtherSettings;
