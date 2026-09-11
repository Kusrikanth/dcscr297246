import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { CentumsData, CentumsColumns } from "./helper";

const Centums = () => {
  const tableColumns = useMemo(() => CentumsColumns(), []);

  return (
    <div className="book-summary px-0">
      <TableContainer
        columns={tableColumns}
        data={CentumsData}
        tableClass="mb-0"
        divClass="table-responsive mb-0"
        theadClass="table-light text-muted align-middle"
        showPagination={false}
        showFooter={false}
      ></TableContainer>
    </div>
  );
};

export default Centums;
