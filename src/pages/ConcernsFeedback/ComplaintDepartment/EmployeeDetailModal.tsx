import React, { useMemo } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import { getEmployeeDetailColumn } from "./helper";

const EmployeeDetailModal = (props: any) => {

    const {  employeeList } = props;

    const roleColumns = useMemo(() => getEmployeeDetailColumn(), []);
    return (
        <>
               <TableContainer
                columns={roleColumns || []}
                data={employeeList || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                // showCheckbox={true}
            />
        </>
    );
};

export default EmployeeDetailModal;
