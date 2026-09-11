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

const AssessmentSubmissions = () => {
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
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <h4 className="card-title mb-0">Assessment Submissions</h4>
            </div>
            <div className="col-auto ms-auto">
              <button
                id="export-btn"
                className="btn btn-icon btn-rounded btn-soft-info p-2 ms-2"
                onClick={() => {}}
              >
                <img src={ExportIcon} className="img-fluid h-100" />
                <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="row g-3 p-3">
            <div className="col-12 col-lg-3">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                  value={""}
                  onChange={() => {}}
                  formgroupClassName="mb-0"
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
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

export default AssessmentSubmissions;
