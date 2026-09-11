import { useMemo } from "react";
import TableContainer from "../../../../../../Components/Common/TableContainer.tsx";
import { generateColumns, tableData } from "./helper.tsx";

const ModuleApplicable = () => {
  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div>
        <TableContainer
          columns={tableColumns || []}
          data={tableData || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={false}
        ></TableContainer>

        <div className="d-flex justify-content-end py-3 px-4">
          <button className="btn btn-success">Save</button>
        </div>
      </div>
    </>
  );
};

export default ModuleApplicable;
