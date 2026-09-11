import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, BookEditIcon, Copy01Icon, Delete02Icon, PencilEdit02Icon, ViewIcon } from "@hugeicons-pro/core-stroke-standard";

const CoursePlannerTableView = () => {
  const menuOptions = useMemo(
    () => [
      {
        id: "viewCourse",
        actionIcon: (
          <HugeiconsIcon
            icon={ViewIcon}
            className="text-muted me-2"
            size={18}
          />
        ),
        actionName: "View Course",
        onClickHndlr: (event: any) => {},
      },
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted me-2"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {},
      },
      {
        id: "copy",
        actionIcon: (
          <HugeiconsIcon
            icon={Copy01Icon}
            className="text-muted me-2"
            size={18}
          />
        ),
        actionName: "Copy",
        onClickHndlr: (event: any) => {},
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02Icon}
            className="text-danger me-2"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {},
      },
    ],
    []
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <div className="card">
      <div className="card-header d-none">
        <div className="row align-items-center">
          <div className="col-6">
            <h4 className="card-title mb-0 flex-grow-1">Category List</h4>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <TableContainer
          columns={tableColumns || []}
          data={tableData || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3 border"
          theadClass="table-light text-muted align-middle"
          showCheckbox={false}
          showPagination={true}
          totalPages={0}
          totalRecords={0}
          callbackPaginationHndlr={() => {}}
          currentPageNumber={0}
        />
      </div>
    </div>
  );
};

export default CoursePlannerTableView;
