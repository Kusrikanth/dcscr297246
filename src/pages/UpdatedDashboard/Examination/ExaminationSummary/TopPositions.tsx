import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { topPositionColumns } from "./helper";

const TopPositions = (props: any) => {
  const tableColumns = useMemo(() => topPositionColumns(), [props.data]);

  return (
    <div className="book-summary tw-px-0 tw-h-full">
      <TableContainer
        columns={tableColumns}
        data={props?.data?.top10StudentsData}
        // tableClass="tw-mb-0 tw-h-full"
        divClass="table-responsive tw-mb-0 tw-h-full"
        theadClass="table-light text-muted align-middle position-sticky top-0"
        showPagination={false}
        showFooter={false}
      ></TableContainer>
    </div>
  );
};

export default TopPositions;
