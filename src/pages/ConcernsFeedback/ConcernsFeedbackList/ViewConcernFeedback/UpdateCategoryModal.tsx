import React, { useEffect, useState } from 'react'
import { SelectInput } from '../../../../Components/Common'
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { editConcernsFeedbackListAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import { useAppSelector } from '../../../../hooks/storehook';
import { getComplaintDepartmentListAct } from '../../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction';
import { categoriesOptions } from '../AddConcernFeedback/helper';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    categories: null,
    departmentName: null,
}

const validationSchema = Yup.object().shape({
    categories: Yup.string().required('Category is required').nullable(),
    departmentName: Yup.string().required('Department is required').nullable(),
})

const UpdateCategoryModal = (props: any) => {

    const dispatch = useDispatch()

    const {
        getEmployeesByFilterResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId, getComplaintDepartmentListResp,
        showApiLoader } =
        useAppSelector(({ directoryEmployee, appData, complaintDepartment, globalData }) => ({
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getComplaintDepartmentListResp: complaintDepartment.getComplaintDepartmentListResp,
        }), shallowEqual);

    useEffect(() => {
        if (props.modalData) {
            const { category , departmentName } = props.modalData || {};
            updatePriorityForm.setValues((prevState: any) => ({ ...prevState, categories : category , departmentName }));
            getComplaintDeptApiCall({category : category});
        }
    }, [])

    const updatePriorityForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const findDeptId = getComplaintDepartmentListResp?.data?.find((item: any) => item?.departmentName === values?.departmentName)?.id
            const payload = { complaintDepartmentId: findDeptId, }
            dispatch(editConcernsFeedbackListAct(generateActionPayload("edit_concern_feedback_list", { id: props.modalData.complaintId }, { ...payload })));
        },
    });

    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, category: "ACADEMIC", isEdit: true, pageNo: 0, pageSize: 500, ...otherProps };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }

    const onChangeFilterHndlr = (event: any) => {
        const { name, value } = event.target;

        if (name === "departmentName") {
            updatePriorityForm.setValues((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
        else if (name === "categories") {
            if (value) {
                updatePriorityForm.setValues((prev: any) => ({ ...prev, [name]: value, departmentName : ""}));
                getComplaintDeptApiCall({ category: value });
            }
        }
    }

    return (
        <>
            <div className="tw-p-4">
                <div className="tw-flex tw-flex-col tw-gap-4 tw-mb-4">
                    <div className="tw-w-full">
                        <SelectInput
                            name="categories"
                            value={updatePriorityForm.values.categories}
                            onChange={onChangeFilterHndlr}
                            labelText="Categories"
                            valueKey="key"
                            textKey="name"
                            labelClass="required"
                            menuItems={categoriesOptions}
                            invalid={
                                updatePriorityForm.touched.categories &&
                                    updatePriorityForm.errors.categories
                                    ? true
                                    : false
                            }
                            error={
                                updatePriorityForm.touched.categories &&
                                    updatePriorityForm.errors.categories
                                    ? updatePriorityForm.errors.categories
                                    : ""
                            }
                        />
                    </div>

                    <div className="tw-w-full">
                        <SelectInput
                            name="departmentName"
                            value={updatePriorityForm.values.departmentName}
                            onChange={onChangeFilterHndlr}
                            menuItems={getComplaintDepartmentListResp?.data || []}
                            valueKey="departmentName"
                            textKey="departmentName"
                            labelText="Department"
                            labelClass="required"
                            defaultSelect="Select"
                            invalid={
                                updatePriorityForm.touched.departmentName &&
                                    updatePriorityForm.errors.departmentName
                                    ? true
                                    : false
                            }
                            error={
                                updatePriorityForm.touched.departmentName &&
                                    updatePriorityForm.errors.departmentName
                                    ? updatePriorityForm.errors.departmentName
                                    : ""
                            }
                        />
                    </div>
                </div>

                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="button"
                        variant='secondary'
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant='primary'
                        onClick={(event: any) => updatePriorityForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default UpdateCategoryModal