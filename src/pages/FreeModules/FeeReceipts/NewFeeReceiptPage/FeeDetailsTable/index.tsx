import React, { useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import {generateFeeDetailsColumns } from "../../helper";

const FeeDetailsTable = () => {
  const roleColumns = useMemo(() => generateFeeDetailsColumns(), []);

  return (
    <div className="card">
      <div className="d-inline-block w-100">
        <div className="row g-3">
          <TableContainer
            columns={roleColumns || []}
            data={[]}
            divClass="table-responsive mb-1"
            theadClass="table-light text-muted align-middle"
            showPagination={false}
            showCheckbox={true}
          />
        </div>
      </div>
    </div>
  );
};

export default FeeDetailsTable;
