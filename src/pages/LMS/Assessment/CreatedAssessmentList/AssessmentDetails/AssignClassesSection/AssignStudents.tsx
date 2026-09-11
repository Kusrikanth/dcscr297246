import { useFormik } from "formik";
import React, { useEffect } from "react";
import { MultiSelectCheckbox, TextInput } from "../../../../../../Components/Common";

const initialValues = {
    createdBy: ""
}

const AssignStudents = (props: any) => {
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
    return (
        <div style={{ padding: "1rem" }}>
            <div className="row">
                <div className="col-12">
                    <MultiSelectCheckbox
                        name="createdBy"
                        labelText='Assign'
                        labelClass='fs-12'
                        value={addModrateForm.values.createdBy}
                        onChange={selectStudentHndlr}
                        idKey="userId"
                        options={createdBy}
                        renderValue={renderValueStaff}
                        renderOptions={renderOptionsEmployee}
                        onSearchHandler={onSearchMultiSelectHandlerEmployee}
                    />
                </div>
            </div>
            <div className="hstack gap-2 justify-content-end mt-4 mb-1">
                <button type="button" className="btn btn-light" onClick={props.toggle}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-success"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AssignStudents;