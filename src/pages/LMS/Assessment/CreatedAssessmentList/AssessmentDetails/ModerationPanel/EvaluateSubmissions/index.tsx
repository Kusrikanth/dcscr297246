import {
  ArrowReloadHorizontalIcon,
  Cancel01Icon,
  PencilEdit01Icon,
  PencilEdit02Icon,
  RedoIcon,
  Share01Icon,
  Tick01Icon,
  ViewIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";

import { useMemo } from "react";
import TableContainer from "../../../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { useHistory } from "react-router-dom";

const EvaluateSubmissions = () => {
  const history = useHistory();

  const menuOptions = useMemo(
    () => [
      {
        id: "view",
        actionIcon: (
          <HugeiconsIcon
            icon={ViewIcon}
            className="me-2 d-inline-block"
            size={18}
            color="#878a99"
          />
        ),
        actionName: "View",
        onClickHndlr: () => {
          history.push(`/view-student-questions-list`);
        },
      },
      {
        id: "approve",
        actionIcon: (
          <HugeiconsIcon
            icon={Tick01Icon}
            className="me-2 d-inline-block "
            size={18}
            color="#878a99"
          />
        ),
        actionName: "Approve",
        onClickHndlr: (event: any) => {},
      },
      {
        id: "sendBack",
        actionIcon: (
          <HugeiconsIcon
            icon={Share01Icon}
            className="me-2 d-inline-block "
            size={18}
            color="#878a99"
          />
        ),
        actionName: "Send Back",
        onClickHndlr: (event: any) => {},
      },
      {
        id: "gradeNow",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit01Icon}
            className="me-2 d-inline-block "
            size={18}
            color="#878a99"
          />
        ),
        actionName: "Grade Now",
        onClickHndlr: (event: any) => {},
      },
      {
        id: "override",
        actionIcon: (
          <HugeiconsIcon
            icon={RedoIcon}
            className="me-2 d-inline-block "
            size={18}
            color="#878a99"
          />
        ),
        actionName: "Override",
        onClickHndlr: (event: any) => {},
      },
    ],
    []
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h4 className="card-title mb-0">Evaluate Submissions</h4>
        </div>
        <div className="card-body p-0">
          <div className="tw-flex tw-gap-6 tw-p-4">
            <p className="mb-0">
              <span className="tw-text-gray-500 tw-me-2">Students:</span>
              <span>30</span>
            </p>
            <p className="mb-0">
              <span className="tw-text-gray-500 tw-me-2">Submissions:</span>
              <span>28/30</span>
            </p>
            <p className="mb-0">
              <span className="tw-text-gray-500 tw-me-2">In Grading:</span>
              <span>6</span>
            </p>
            <p className="mb-0">
              <span className="tw-text-gray-500 tw-me-2">
                Pending Approval:
              </span>
              <span>3</span>
            </p>
            <p className="mb-0">
              <span className="tw-text-gray-500 tw-me-2">Approved:</span>
              <span>19</span>
            </p>
            <p className="mb-0">
              <span className="tw-text-gray-500 tw-me-2">Avg Score:</span>
              <span>42.5 / 50</span>
            </p>
          </div>
          <TableContainer
            columns={tableColumns}
            data={tableData}
            showPagination={false}
            showCheckbox={false}
            tableClass="mb-0"
            divClass="table-responsive mb-0"
            theadClass="table-light text-muted align-middle"
          />
        </div>
      </div>
    </>
  );
};

export default EvaluateSubmissions;
