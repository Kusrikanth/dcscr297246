import { useMemo } from "react";
import { TableExpandable } from "../../../../../Components/Common";
import { generateColumns, transformApiDataToTableData } from "./helper";

interface MarksRangeProps {
  data: any; 
}

const MarksRange: React.FC<MarksRangeProps> = ({ data }) => {
 
  const tableColumns = useMemo(() => generateColumns(data), [data]);
  
  const tableData = useMemo(() => transformApiDataToTableData(data), [data]);

  return (
    <div className="">
      <TableExpandable
        columns={tableColumns || []}
        data={tableData || []}
        divClass="table-responsive !tw-mb-3 table-expandable table-sticky marks-range-table-container"
        theadClass="text-muted align-middle theadPrimary"
        tableClass="table-bordered table-nowrap"
        showFooter={true}
        trFooterClass="!tw-font-semibold bg-light"
      />
    </div>
  );
};

export default MarksRange;
