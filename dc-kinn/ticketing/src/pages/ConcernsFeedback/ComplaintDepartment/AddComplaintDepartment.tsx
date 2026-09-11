import React, { useState, useEffect, } from "react";
import { useFormik, } from "formik";
import { AutoSearchInputUpdated, MultiSelectCheckbox, SelectInput, TextInput, TextInputWithRegex } from "../../../Components/Common";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import * as Yup from 'yup';
import { getEmployeeByFilterAct, getEmployeeNameByFilterAct } from "../../../store/directory/employeemanagement/employeemanagementactions";
import { addComplaintDeptAct, editComplaintDeptAct } from "../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction";
import { renderOptionsEmployee, renderValueEmployee } from "./helper";
import Button from "../../../Components/Common/Button";


const initialValues = {
    category: "",
    departmentId: "",
    shortName: "",
    employeeIds: [],
    // employeeDesignation: "",
    displayOrder: "",
};

const validationSchema = Yup.object().shape({
    category: Yup.string().required('Category is required').nullable(),
    departmentId: Yup.string().required('Department is required').nullable(),
    shortName: Yup.string().required('Short Name is required').nullable(),
    employeeIds: Yup.array().min(1,"At least one Employee is required").required('Employee is required').nullable(),
    // employeeDesignation: Yup.string().required('Employee Designation is required').nullable(),
    displayOrder: Yup.string().required('Display Order is required').nullable()
});

const AddComplaintDepartment: React.FC<any> = (props) => {

    const dispatch = useDispatch();
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(undefined);

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getMasterComplaintDeptListResp,
        getEmployeesNameByFilterResp,
    }: any = useAppSelector(
        ({ masterData, globalData, directoryEmployee, branchAcademics, appData, complaintDepartment }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getEmployeesNameByFilterResp: directoryEmployee.getEmployeesNameByFilterResp,
            getMasterComplaintDeptListResp: complaintDepartment.getMasterComplaintDeptListResp,
        }),
        shallowEqual
    );


    const addComplaintDeptForm = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (props.modalData) {
                const { displayOrder, employeeIds } = values || {}
                const payload = { displayOrder,  employeeIds : employeeIds.map((i:any)=>+i?.id), complaintDepartmentId: props.modalData.id }
                dispatch(editComplaintDeptAct(generateActionPayload("edit_complaints_department", undefined, payload)));
                } else {
                    const payload = { ...values, employeeIds : values.employeeIds.map((i:any)=>+i?.id),  branchId }
                dispatch(addComplaintDeptAct(generateActionPayload("add_complaints_department", undefined, payload)));
            }
        },
    });

    useEffect(() => {

        if (props.modalData) {
            const { category, departmentHeadCode, departmentHeadName, shortName, departmenHeadtId, departmentName, departmentHeadDesignation, displayOrder, departmentId , headsDtos } = props.modalData;

            const employeeIds = headsDtos?.map((i:any)=>({
                id : i?.departmentHeadId,
                employeeName : i?.departmentHeadName,
                employeeCode : i?.departmentHeadCode,
            }))

            addComplaintDeptForm.setValues((prev: any) => ({
                ...prev,
                category,
                departmentId,
                shortName,
                employeeIds,
                // employeeDesignation: departmentHeadDesignation,
                displayOrder,
            }))

        }

        return () => {
            addComplaintDeptForm.resetForm();
        }
    }, [])


    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        addComplaintDeptForm.setValues((prev: any) => ({ ...prev, [name]: value }))

    }

    function onInputSearchChange(name: string, inputString: string) {
        if (inputString) {
            const payload = {
                searchString: inputString,
            };
            dispatch(getEmployeeNameByFilterAct(generateActionPayload("get_employee_by_name_search", undefined, payload)));
        }
    }
    
    function selectEmployeeHndlr(selectedOptions: any, config?: any) {

        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addComplaintDeptForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            addComplaintDeptForm.setValues((prevState: any) => ({ ...prevState, [name]: null }));
        }

    }

    return (
        <>
            <form>
                <div className="tw-p-4">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-2">

                        <div className="tw-col-span-12">
                            <SelectInput
                                name="category"
                                value={addComplaintDeptForm.values.category}
                                onChange={filterHandler}
                                defaultSelect="Select"
                                menuItems={[
                                    { name: "ACADEMIC", key: "ACADEMIC" },
                                    { name: "NON ACADEMIC", key: "NON_ACADEMIC" }
                                ]}
                                valueKey="key"
                                textKey="name"
                                labelClass="required"
                                isDisabled={props.modalData}
                                labelText="Employee Category"
                                invalid={(addComplaintDeptForm.touched.category && addComplaintDeptForm.errors.category) ? true : false}
                                error={(addComplaintDeptForm.touched.category && addComplaintDeptForm.errors.category) ? addComplaintDeptForm.errors.category : ""}
                            />
                        </div>

                        <div className="tw-col-span-12">
                            <SelectInput
                                name="departmentId"
                                value={addComplaintDeptForm.values.departmentId}
                                onChange={filterHandler}
                                defaultSelect="Select"
                                menuItems={getMasterComplaintDeptListResp?.data || []}
                                isDisabled={props.modalData}
                                valueKey="id"
                                textKey="departmentName"
                                labelText="Department"
                                labelClass='required'
                                invalid={(addComplaintDeptForm.touched.departmentId && addComplaintDeptForm.errors.departmentId) ? true : false}
                                error={(addComplaintDeptForm.touched.departmentId && addComplaintDeptForm.errors.departmentId) ? addComplaintDeptForm.errors.departmentId : ""}
                            />
                        </div>

                        <div className="tw-col-span-12">
                            <TextInput
                                name="shortName"
                                value={addComplaintDeptForm.values.shortName}
                                onChange={filterHandler}
                                isDisabled={props.modalData}
                                isReadOnly={props.modalData}
                                labelText="Dept ShortName"
                                labelClass='required'
                                invalid={(addComplaintDeptForm.touched.shortName && addComplaintDeptForm.errors.shortName) ? true : false}
                                error={(addComplaintDeptForm.touched.shortName && addComplaintDeptForm.errors.shortName) ? addComplaintDeptForm.errors.shortName : ""}
                            />
                        </div>

                        <div className="tw-col-span-12">
                            <MultiSelectCheckbox
                                name="employeeIds"
                                labelText="Employee Name"
                                containerClassName="tw-mb-3"
                                idKey="id"
                                labelClass="required"
                                value={addComplaintDeptForm.values.employeeIds}
                                renderValue={renderValueEmployee}
                                renderOptions={renderOptionsEmployee}
                                onChange={selectEmployeeHndlr}
                                onSearchHandler={onInputSearchChange}
                                options={getEmployeesNameByFilterResp || []}
                                invalid={addComplaintDeptForm.touched.employeeIds && addComplaintDeptForm.errors.employeeIds ? true : false}
                                error={addComplaintDeptForm.touched.employeeIds && addComplaintDeptForm.errors.employeeIds ? String(addComplaintDeptForm.errors.employeeIds) : ""}
                            />
                        </div>

                        <div className="tw-col-span-12">
                            <TextInputWithRegex
                                name="displayOrder"
                                value={addComplaintDeptForm.values.displayOrder}
                                allowedInputRegex="^[0-9]*$"
                                onChange={filterHandler}
                                inputClassName="tw-bg-gray-100"
                                labelText="Display Order"
                                labelClass='required'
                                invalid={(addComplaintDeptForm.touched.displayOrder && addComplaintDeptForm.errors.displayOrder) ? true : false}
                                error={(addComplaintDeptForm.touched.displayOrder && addComplaintDeptForm.errors.displayOrder) ? addComplaintDeptForm.errors.displayOrder : ""}
                            />
                        </div>
                    </div>

                    <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            onClick={(event: any) => addComplaintDeptForm.handleSubmit(event)}
                            disabled={showApiLoader}
                        >
                            Submit
                        </Button>
                    </div>
                </div>


            </form>
        </>
    );
};

export default AddComplaintDepartment;
