import { useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { getColumns, getTableData } from "./helper";
import { Button } from "../../../../../Components/Common";

const StatsCount = ({ toggle, data, type }: any) => {
  const tableColumns = useMemo(() => getColumns(type), [type]);
  const tableRows = useMemo(() => getTableData(type, data), [type, data]);
  

  return (
    <div className="container-fluid tw-px-0">
      <div className="tw-flex tw-flex-wrap">
        <div className="tw-w-full">
          <TableContainer
            columns={tableColumns}
            data={tableRows}
            divClass="table-responsive tw-mt-3"
            tableClass="tw-whitespace-nowrap"
            theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
          />
        </div>
        <div className="tw-w-full tw-py-3 tw-px-3 tw-flex tw-justify-end">
          <Button type="button" onClick={toggle} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatsCount;