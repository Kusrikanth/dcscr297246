import React, { useEffect, useState } from 'react'
import { AutoSearchInputUpdated, MultiSelectCheckbox, SelectInput } from '../../../../Components/Common'

import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getEmployeeByFilterAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { editConcernsFeedbackListAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import { useAppSelector } from '../../../../hooks/storehook';
import { priorityFilter } from './helper';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    priority: null,
}

const validationSchema = Yup.object().shape({
    priority: Yup.string().required('Priority is required').nullable(),
})

const UpdatePriorityModal = (props: any) => {

    const dispatch = useDispatch()

    const {
        getEmployeesByFilterResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        showApiLoader } =
        useAppSelector(({ directoryEmployee, appData, masterData, globalData }) => ({
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,

        }), shallowEqual);

        useEffect(() => {
          if(props.modalData){
            const { priority } = props.modalData || {};
            updatePriorityForm.setValues((prevState: any) => ({ ...prevState, priority }));
          }
        }, [])

    const updatePriorityForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            dispatch(editConcernsFeedbackListAct(generateActionPayload("edit_concern_feedback_list", {id : props.modalData.complaintId}, { ...values })));
        },
    });

    return (
        <>
            <div className="tw-p-4">
                <div className="tw-mb-4">
                    <SelectInput
                        name="priority"
                        value={updatePriorityForm.values.priority}
                        onChange={updatePriorityForm.handleChange}
                        menuItems={priorityFilter}
                        formgroupClassName="tw-mb-0"
                        valueKey="id"
                        textKey="name"
                        labelText="Priority"
                        defaultSelect="Select"
                        invalid={
                            updatePriorityForm.touched.priority &&
                                updatePriorityForm.errors.priority
                                ? true
                                : false
                        }
                        error={
                            updatePriorityForm.touched.priority &&
                                updatePriorityForm.errors.priority
                                ? updatePriorityForm.errors.priority
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

export default UpdatePriorityModal