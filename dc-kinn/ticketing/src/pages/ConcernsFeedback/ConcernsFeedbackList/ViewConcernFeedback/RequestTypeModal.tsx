import React, { useEffect } from 'react'
import { SelectInput } from '../../../../Components/Common'
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { editConcernsFeedbackListAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import { useAppSelector } from '../../../../hooks/storehook';
import { requestType } from '../AddConcernFeedback/helper';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    requestType: null,
}

const validationSchema = Yup.object().shape({
    requestType: Yup.string().required('requestType is required').nullable(),
})

const RequestTypeModal = (props: any) => {

    const dispatch = useDispatch()

    const {
        showApiLoader } =
        useAppSelector(({ globalData }) => ({
            showApiLoader: globalData.showApiLoader,

        }), shallowEqual);

    useEffect(() => {
        if (props.modalData) {
            const { requestType } = props.modalData || {};
            updatePriorityForm.setValues((prevState: any) => ({ ...prevState, requestType }));
        }
    }, [])

    const updatePriorityForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            dispatch(editConcernsFeedbackListAct(generateActionPayload("edit_concern_feedback_list", { id: props.modalData.complaintId }, { ...values })));
        },
    });

    return (
        <>
            <div className="tw-p-4">
                <div className="tw-mb-4">
                    <SelectInput
                        name="requestType"
                        value={updatePriorityForm.values.requestType}
                        onChange={updatePriorityForm.handleChange}
                        menuItems={requestType}
                        formgroupClassName="tw-mb-0"
                        valueKey="reqType"
                        textKey="name"
                        labelText="Request Type"
                        defaultSelect="Select"
                        invalid={
                            updatePriorityForm.touched.requestType &&
                                updatePriorityForm.errors.requestType
                                ? true
                                : false
                        }
                        error={
                            updatePriorityForm.touched.requestType &&
                                updatePriorityForm.errors.requestType
                                ? updatePriorityForm.errors.requestType
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

export default RequestTypeModal