import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { Button } from "../../../../../Components/Common";

const NewAdmissionsModal = ({ toggle }: any) => {

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
    if (Array.isArray(getSchoolStrengthStatsCountResp) && getSchoolStrengthStatsCountResp.length > 0) {
      const formattedData = Object.values(
        getSchoolStrengthStatsCountResp.reduce((acc: any, curr: any) => {
          const branchKey = curr.branchName.toLowerCase().replace(/\s+/g, '');
          if (!acc[branchKey]) {
            acc[branchKey] = {
              branchName: curr.branchName
                .toLowerCase()
                .replace(/\b\w/g, (l: string) => l.toUpperCase()),
              cambridge: 0,
              cbse: 0,
              earlyYears: 0,
              total: 0,
            };
          }

          const students = curr.studentsCount || 0;

          if (curr.curriculumName?.toLowerCase().includes("cambridge")) {
            acc[branchKey].cambridge += students;
          } else if (curr.curriculumName?.toLowerCase().includes("cbse")) {
            acc[branchKey].cbse += students;
          } else if (curr.curriculumName?.toLowerCase() === "early years") {
            acc[branchKey].earlyYears += students;
          }

          acc[branchKey].total += students;

          return acc;
        }, {})
      );
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
            theadClass="table-light text-muted align-middle"
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

export default NewAdmissionsModal;
