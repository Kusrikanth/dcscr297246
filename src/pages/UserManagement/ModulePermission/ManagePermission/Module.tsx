import React, { useMemo } from "react";
import { InputCheckbox } from "../../../../Components/Common/InputCheckbox";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  CreateStudentData,
  // generateColumns,
} from "../../ManageUser/Students/CreateStudentAccModal/helper";
import { generateColumns } from "./helper";

const Module = ({ data, updateMydata, checkAll }: any) => {
  const roleColumns = useMemo(
    () => generateColumns(updateMydata, checkAll, data),
    [data]
  );

  return (
    <div className="card tw-h-full">
      <TableContainer
        columns={roleColumns || []}
        data={data}
        divClass="table-responsive tw-mb-1"
        theadClass="text- text-muted tw-align-middle"
        tdClass="text-start modified-td-class"
        thClass="text-start text-white"
        trClass="modified-tr-class"
        // divClass="table-responsive mb-1"
        // theadClass="table-light text-muted align-middle"
        // showCheckbox={true}
      />
    </div>
  );
};

export default React.memo(Module);
