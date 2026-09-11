import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { Button } from "../../../../../Components/Common";

const TotalInactiveModal = ({ toggle }: any) => {

  const [tableData, setTableData] = useState<any[]>([]);

  const {
    getSchoolStrengthStatsCountResp,
  } = useAppSelector(
    ({ reports }) => ({
      getSchoolStrengthStatsCountResp: reports.getSchoolStrengthStatsCountResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (getSchoolStrengthStatsCountResp) {
      const formattedData = Object.entries(getSchoolStrengthStatsCountResp).map(([branchName, values]: any) => ({
        branchName:
          branchName
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .replace(/\s+/g, " "),
        campusTransfer: values?.campusTransfer || 0,
        notReporting: values?.notReportingStudents || 0,
        tcIssued: values?.tcIssued || 0,
        totalInactive: values?.totalInactive || 0,
      }));
      setTableData(formattedData)
    }
  }, [getSchoolStrengthStatsCountResp])

  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <div className="container-fluid tw-px-0">
      <div className="tw-grid tw-grid-cols-12">
        <div className="tw-col-span-12">
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            divClass="table-responsive tw-mt-3"
            tableClass="table-nowrap"
            theadClass="table-light text-muted tw-align-middle"
          ></TableContainer>
        </div>
        <div className="tw-col-span-12 tw-py-3 tw-px-4 tw-flex tw-justify-end">
          <Button type="button" onClick={toggle} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TotalInactiveModal;
