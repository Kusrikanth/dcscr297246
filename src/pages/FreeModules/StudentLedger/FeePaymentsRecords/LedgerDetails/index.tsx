import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { LedgerDetailsData, generateColumns } from "./helper";

const LedgerDetails = () => {
  const roleColumns = useMemo(() => generateColumns(), []);
  return (
    <div className="d-inline-block w-100 mt-2">
      <div className="row g-3">
        <TableContainer
          columns={roleColumns || []}
          data={LedgerDetailsData}
          divClass="table-responsive mb-1"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          totalPages={10}
          totalRecords={10}
          callbackPaginationHndlr={() => {}}
          currentPageNumber={0}
        />
      </div>
    </div>
  );
};

export default LedgerDetails;
