import { useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { Button } from "../../../../../Components/Common";
import { generateColumns } from "./helper";

const AdmissionsCount = ({ toggle, data }: any) => {
  const tableColumns = useMemo(() => generateColumns(), []);

  const tableData = useMemo(() => {
    if (!data) return [];
    const branches = new Set<string>();
    Object.values(data).forEach((curriculum: any) => {
      Object.keys(curriculum).forEach(branch => branches.add(branch));
    });

    return Array.from(branches).map(branch => ({
      branchName: branch,
      cambridge: data["CAMBRIDGE INTERNATIONAL"]?.[branch] || 0,
      cbse: data["CBSE"]?.[branch] || 0,
      earlyYears: data["EARLY YEARS"]?.[branch] || 0,
    }));
  }, [data]);

  return (
    <div className="container-fluid tw-px-0">
      <div className="tw-flex tw-flex-wrap">
        <div className="tw-w-full">
          <TableContainer
            columns={tableColumns}
            data={tableData}
            divClass="table-responsive tw-mt-3"
            tableClass="table-nowrap"
            theadClass="table-light text-muted align-middle"
          ></TableContainer>
        </div>
        <div className="tw-w-full tw-py-3 tw-px-3 tw-flex tw-justify-end">
          <Button variant="secondary" type="button" onClick={toggle}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsCount;
