import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { assignPeriodWiseSubjectData, generateColumns } from "./helper";
import { Button } from "../../../../Components/Common";

const AssignTeacher = () => {
  const columns = useMemo(() => generateColumns(), []);

  return (
    <div className="assign-period-wise-subject">
      <div className="card shadow-none">
        <div className="card-header tw-px-0 tw-d-none">
          <h4 className="card-title tw-mb-0 tw-flex-grow">Create Time Table</h4>
        </div>

        <div className="card-body tw-p-0 tw-mb-0">
          <TableContainer
            columns={columns || []}
            data={assignPeriodWiseSubjectData || []}
            tableClass="tw-mb-0"
            divClass="table-responsive tw-mb-3"
            theadClass="table-light text-muted align-middle"
          ></TableContainer>

          <div className="tw-mt-4 tw-flex tw-items-center tw-justify-end tw-px-3">
            <Button variant="info">
              Preview
            </Button>
            <Button variant="primary">Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTeacher;
