import React, { useEffect, useState } from 'react'
import { SelectInput } from '../../../../Components/Common'
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { editConcernsFeedbackListAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import { useAppSelector } from '../../../../hooks/storehook';
import { getComplaintDepartmentListAct } from '../../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    moduleId: null,
}

const validationSchema = Yup.object().shape({
    moduleId: Yup.string().required('Module is required').nullable(),
})

const UpdateModuleModal = (props: any) => {

    const dispatch = useDispatch()

    const { currentBranchIdResp: branchId, allModulesListResp, showApiLoader } =
        useAppSelector(({ appData, concernsFeedback, globalData }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            allModulesListResp: concernsFeedback.allModulesListResp,
        }), shallowEqual);

    useEffect(() => {
        if (props.modalData) {
            const { category , departmentName, moduleId } = props.modalData || {};
            updatePriorityForm.setValues((prevState: any) => ({ ...prevState, categories : category , departmentName, moduleId }));
            getComplaintDeptApiCall({category : category});
        }
    }, [])

    const updatePriorityForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { moduleId: updatePriorityForm.values.moduleId };
            dispatch(editConcernsFeedbackListAct(generateActionPayload("edit_concern_feedback_list", { id: props.modalData.complaintId }, { ...payload })));
        },
    });

    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, category: "ACADEMIC", pageNo: 0, pageSize: 500, ...otherProps };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }

    const onChangeFilterHndlr = (event: any) => {
        const { name, value } = event.target;
        if (name === "moduleId") {
            updatePriorityForm.setValues((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    return (
        <>
            <div className="tw-p-4">
                <div className="tw-mb-4">
                    <SelectInput
                        name="moduleId"
                        value={updatePriorityForm.values.moduleId}
                        onChange={onChangeFilterHndlr}
                        menuItems={allModulesListResp}
                        valueKey="id"
                        textKey="moduleName"
                        labelText="Module"
                        defaultSelect="Select"
                        invalid={
                            updatePriorityForm.touched.moduleId &&
                                updatePriorityForm.errors.moduleId
                                ? true
                                : false
                        }
                        error={
                            updatePriorityForm.touched.moduleId &&
                                updatePriorityForm.errors.moduleId
                                ? updatePriorityForm.errors.moduleId
                                : ""
                        }
                    />
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

export default UpdateModuleModal