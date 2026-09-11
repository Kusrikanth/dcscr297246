import ReactApexChart from "react-apexcharts";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useMemo } from "react";

const RequestByDepartment = (props: any) => {
   const tableColumns = useMemo(() => generateColumns(), [props.data?.ticketsByModule]);

  return (
    <div className="tw-pb-0">
       <TableContainer
          columns={tableColumns || []}
          data={props.data?.ticketsByModule ? props.data?.ticketsByModule?.slice(0, -1) : []}
          tableClass="tw-mb-0"
          divClass="table-responsive tw-max-h-[400px]"
          theadClass="table-light tw-text-gray-600 tw-align-middle tw-sticky tw-top-0 tw-z-[999]"
          showPagination={false}
          showFooter={true}
          tfootClass="tw-bg-white tw-align-middle tw-sticky tw-bottom-0 tw-z-[999]"
        ></TableContainer>
    </div>
  );
};

export default RequestByDepartment;
