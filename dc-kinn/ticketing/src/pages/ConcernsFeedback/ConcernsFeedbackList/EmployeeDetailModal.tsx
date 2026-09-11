import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import { getEmployeeDetailColumn } from "./helper";

const EmployeeDetailModal = (props: any) => {
    const [employeeDetailModalState, setEmployeeDetailModalState] = useState([])

    const {  employeeList } = props;
    
    useEffect(() => {
        const updatedEmployeeList = employeeList.map((employee: any) => {
            if (employee.departmentHeadCode || employee.departmentHeadName) {
                return {
                    employeeCode: employee.departmentHeadCode,
                    employeeName: employee.departmentHeadName
                };
            }
            return employee;
        });

        setEmployeeDetailModalState(updatedEmployeeList);
    }, [employeeList]);
    
    const roleColumns = useMemo(() => getEmployeeDetailColumn(), []);
    return (
        <>
               <TableContainer
                columns={roleColumns || []}
                data={employeeDetailModalState || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-50 tw-text-gray-500 tw-text-left tw-align-middle"
                // showCheckbox={true}
            />
        </>
    );
};

export default EmployeeDetailModal;
