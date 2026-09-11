import React, { useEffect, useMemo, useRef, useState } from "react";
import { generateColumns, PrePrimaryResultTableData } from "./helper";
import TableContainer from "../../../../../Components/Common/TableContainer";

const CurricularSkills = () => {

  const columns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="d-inline-block w-100">
        <TableContainer
          columns={columns || []}
          data={PrePrimaryResultTableData}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          showCheckbox={true}
          totalPages={10}
          totalRecords={200}
          callbackPaginationHndlr={() => { }}
          currentPageNumber={1}
        />
      </div>
    </>
  );
};

export default CurricularSkills;
