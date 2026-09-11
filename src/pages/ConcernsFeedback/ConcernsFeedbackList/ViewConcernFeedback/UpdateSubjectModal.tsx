import React, { useEffect, useState, Suspense } from 'react'
import { QuillEditor, TextInput } from '../../../../Components/Common'
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { editConcernsFeedbackListAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import { useAppSelector } from '../../../../hooks/storehook';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    complaintSubject: null,
    complaintDescription: null,
}

const validationSchema = Yup.object().shape({
    complaintSubject: Yup.string().required('Subject is required').nullable(),
    // complaintDescription: Yup.string().required('Description is required').nullable(),
})

const UpdateSubjectModal = (props: any) => {

    const dispatch = useDispatch()

    const {
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        showApiLoader } =
        useAppSelector(({ directoryEmployee, appData, masterData, globalData }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,

        }), shallowEqual);

    useEffect(() => {
        if (props.modalData) {
            const { complaintSubject, description } = props.modalData || {};
            updateSubjectForm.setFieldValue("complaintSubject", complaintSubject);
            updateSubjectForm.setFieldValue("complaintDescription", description);
        }
    }, [props.modalData])
    const onChangeQuillHndlr = (content: any) => {
        updateSubjectForm.setFieldValue("complaintDescription", content);
    }
    
    const updateSubjectForm = useFormik({
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
                    <TextInput
                        name="complaintSubject"
                        value={updateSubjectForm.values.complaintSubject}
                        onChange={updateSubjectForm.handleChange}
                        onBlur={updateSubjectForm.handleBlur}
                        labelText="Subject"
                        labelClass="required"
                        invalid={
                            updateSubjectForm.touched.complaintSubject &&
                                updateSubjectForm.errors.complaintSubject
                                ? true
                                : false
                        }
                        error={
                            updateSubjectForm.touched.complaintSubject &&
                                updateSubjectForm.errors.complaintSubject
                                ? updateSubjectForm.errors.complaintSubject
                                : ""
                        }
                    />
                </div>

                <div className="tw-mb-4">
                    <Suspense fallback={<div>Loading...</div>}>
                        <QuillEditor
                            name="complaintDescription"
                            value={updateSubjectForm.values.complaintDescription}
                            onChange={onChangeQuillHndlr}
                            invalid={
                                updateSubjectForm.touched.complaintDescription &&
                                    updateSubjectForm.errors.complaintDescription
                                    ? true
                                    : false
                            }
                            error={
                                updateSubjectForm.touched.complaintDescription &&
                                    updateSubjectForm.errors.complaintDescription
                                    ? updateSubjectForm.errors.complaintDescription
                                    : ""
                            }
                            labelText="Description"
                            labelClass="required"
                        />
                    </Suspense>
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
                        onClick={(event: any) => updateSubjectForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default UpdateSubjectModal