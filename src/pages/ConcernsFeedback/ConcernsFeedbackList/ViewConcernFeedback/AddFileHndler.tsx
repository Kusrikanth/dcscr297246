import React, { useState } from 'react'
import { MultipleFileUpload } from '../../../../Components/Common';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { addConcernFileAct, getCommentListAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    document: [],
}

const validationSchema = Yup.object().shape({
    document: Yup.array().test('is-files-required', 'At least one file is required', function (value) {
        if (!value || value.length === 0) {
            return false;
        }
        return true;
    }).nullable(),
})

const AddFileHndler = (props:any) => {

    const dispatch = useDispatch();
    const location:any = useLocation();

    const addConcernFileForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { document } = values || {};
            const formData = new FormData();
            if(document.length > 0 ){
                document.map((file: any) => {
                    formData.append("fileList", file);
                })
                dispatch(addConcernFileAct(generateActionPayload("add_concern_file", { id: location.state.complaintId } , formData)));
            }
        },
    });

    const handleFileChange = (files: any) => {
        addConcernFileForm.setValues((prev: any) => ({ ...prev, document: files }))
    }

    return (
        <>
            <form onSubmit={addConcernFileForm.handleSubmit}>
                <div className="tw-flex tw-flex-wrap tw-p-4">
                    <div className="tw-w-full">
                        <MultipleFileUpload
                            name="document"
                            prevFiles={addConcernFileForm.values.document}
                            onChange={handleFileChange}
                            containerClass="tw-w-full"
                            maxSizeInMb={2}
                            helperText="Note : Max File Size is 2MB"
                            error={
                                addConcernFileForm.touched.document &&
                                    addConcernFileForm.errors.document
                                    ? addConcernFileForm.errors.document
                                    : ""
                            }
                        />
                    </div>

                    <div className="tw-ml-auto tw-mt-3">
                        <Button
                            type="submit"
                            variant='primary'
                            disabled={props.showApiLoader}
                        >
                            Add File
                        </Button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddFileHndler