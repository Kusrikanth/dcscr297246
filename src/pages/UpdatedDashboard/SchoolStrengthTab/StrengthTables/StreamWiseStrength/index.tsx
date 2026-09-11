import { useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";

const StreamWiseStrength = () => {
  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="">
        <TableContainer
          columns={tableColumns || []}
          data={tableData || []}
          tableClass="mb-0"
          divClass="table-responsive"
          theadClass="table-light text-muted align-middle position-sticky top-0"
          showFooter={true}
          trFooterClass="fw-semibold bg-light"
        ></TableContainer>
      </div>
    </>
  );
};

export default StreamWiseStrength;
