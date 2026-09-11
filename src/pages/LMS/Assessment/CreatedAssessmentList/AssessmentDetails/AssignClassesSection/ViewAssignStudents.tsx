
import { useFormik } from "formik";
import React, { useEffect, useMemo } from "react";
import { MultiSelectCheckbox, TextInput } from "../../../../../../Components/Common";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import {  generateColumnsStudentsAssingment, questionTableDataStudentsAssingment } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";

const initialValues = {
    createdBy: ""
}

const ViewAssignStudents = (props: any) => {
    const addModrateForm = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: (values) => {

        },
    });
    function selectStudentHndlr(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addModrateForm.setFieldValue(name, selectedOptions);
        } else {
            addModrateForm.setFieldValue(name, []);
        }
    }
    function onSearchMultiSelectHandlerEmployee(name: string, value: string) {
    }
    function renderValueStaff(selectedItems: any[], removeItemHandler: any) {
        return (
            <div className="selected-container">
                {selectedItems.map((item) => (
                    <div key={`item-${item?.id}`} className="selectedoption-item">
                        <span>{item?.employeeName}</span>
                        <span
                            data-id={item?.userId}
                            onClick={removeItemHandler}
                            className="remove-icon"
                        >
                            <i className="ri-close-line"></i>
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    function renderOptionsEmployee(item: any) {
        return `${item?.employeeName} - ${item?.employeeCode}`;
    }
    const createdBy = [
        {
            id: 101,
            userId: "u001",
            employeeName: "John Doe",
            employeeCode: "EMP101"
        },
        {
            id: 102,
            userId: "u002",
            employeeName: "Jane Smith",
            employeeCode: "EMP102"
        },
        {
            id: 103,
            userId: "u003",
            employeeName: "Rahul Sharma",
            employeeCode: "EMP103"
        },
        {
            id: 104,
            userId: "u004",
            employeeName: "Anita Mehta",
            employeeCode: "EMP104"
        }
    ];
    const menuOptions = useMemo(() => [
        {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
            actionName: "Delete",
            onClickHndlr: () => { },
        },
    ], []);
        const columns = useMemo(() => generateColumnsStudentsAssingment(menuOptions), [menuOptions]);
    
    return (
        <div style={{ padding: "1rem" }}>
            <div className="row">
                <TableContainer
                                    columns={columns}
                                    data={questionTableDataStudentsAssingment()}
                                    showPagination={false}
                                    showCheckbox={false}
                                    tableClass="mb-0"
                                    divClass="table-responsive mb-0 fs-12"
                                    theadClass="table-light text-muted align-middle fs-12"
                                />
            </div>
        </div>
    );
};

export default ViewAssignStudents;

