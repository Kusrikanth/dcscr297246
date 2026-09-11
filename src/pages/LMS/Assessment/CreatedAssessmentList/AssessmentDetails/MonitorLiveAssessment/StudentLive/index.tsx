import { useMemo, useState } from "react";
import TableContainer from "../../../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Pen01Icon,
  ViewIcon,
} from "@hugeicons-pro/core-stroke-standard";

const StudentLive = () => {
    
    const menuOptions = useMemo(
    () => [
      {
        id: "view",
        actionIcon: (
          <HugeiconsIcon icon={ViewIcon} className="text-muted" size={18} />
        ),
        actionName: "View",
        onClickHndlr: (event: any) => {},
      },
      {
        id: "overideMarks",
        actionIcon: (
          <HugeiconsIcon icon={Pen01Icon} className="text-muted" size={18} />
        ),
        actionName: "Overide Marks",
        onClickHndlr: (event: any) => {},
      },
    ],
    []
  );

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  return (
    <>
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={true}
            totalPages={0}
            totalRecords={0}
            callbackPaginationHndlr={() => {}}
            currentPageNumber={0}
          ></TableContainer>
    </>
  );
};

export default StudentLive;
