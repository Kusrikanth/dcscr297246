import { useMemo } from "react";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Pen01Icon,
  PencilEdit02Icon,
  ViewIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { TextInput } from "../../../../../../Components/Common";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../../../assets/imagesdps/common_icon/export_icon.svg";

const AssginToClasses = () => {
  const menuOptions = useMemo(
    () => [
      //   {
      //     id: "view",
      //     actionIcon: (
      //       <HugeiconsIcon icon={ViewIcon} className="text-muted" size={18} />
      //     ),
      //     actionName: "View",
      //     onClickHndlr: (event: any) => {},
      //   },
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
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <h4 className="card-title mb-0">Assgin To Classes</h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => {}}
                >
                  <i className="ri-add-line me-2"></i>
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
            callbackPaginationHndlr={() => {}}
            currentPageNumber={0}
          ></TableContainer>
        </div>
      </div>
    </>
  );
};

export default AssginToClasses;
