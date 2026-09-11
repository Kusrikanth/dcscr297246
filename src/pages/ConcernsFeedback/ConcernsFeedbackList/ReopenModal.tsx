import React from 'react'
import { BrowseFile, TextArea } from '../../../Components/Common'
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import * as Yup from "yup";
import { generateActionPayload } from '../../../utility/reduxutility';
import { addCommentListAct } from '../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import Button from '../../../Components/Common/Button';

const initialValues = {
    document: null,
    comment: "",
    fileName: "",
}

const ReopenModal = (props:any) => {

    const dispatch = useDispatch()

    const {
        showApiLoader } =
        useAppSelector(({ globalData }) => ({
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    const reopenConcernForm = useFormik({
        initialValues,
        validationSchema : Yup.object().shape({
            comment : Yup.string().required("Comment is required").nullable(),
        }) ,
        onSubmit: (values) => {
            const payload:any = {
                complaintId: props?.complaintId,
                comment: values.comment,
                complaintStatus: "REOPEN",
                commentType: "COMMENT"
            }

            const formData = new FormData();
            formData.append("request", JSON.stringify(payload));
            if(values.document){
                formData.append("multipartFile", values.document || "");
            }
            dispatch(addCommentListAct(generateActionPayload("add_comment_list", undefined, formData)));
        },
    });

    function onChangeFileInputHndlr(event: any) {
        const { name } = event.target;
        const file = event.target.files[0];
        const fileSize = event.target.files[0].size;

        const maxFileSize = 2 * 1024 * 1024;
        if (fileSize > maxFileSize) {
            toast.warning("File size is less than or equal to 2MB.");
        } else {
            reopenConcernForm.setValues((prevState: any) => ({
                ...prevState, fileName: file.name,
                file
            }))
        }
    }

    return (
        <>
            <div className="tw-p-6">
                <div className="tw-grid tw-grid-cols-1 tw-gap-4">
                    <div className="tw-w-full">
                        <TextArea
                            name="comment"
                            value={reopenConcernForm.values.comment}
                            onChange={reopenConcernForm.handleChange}
                            labelText="Comment"
                            height='10rem'
                            invalid={(reopenConcernForm.touched.comment && reopenConcernForm.errors.comment) ? true : false}
                            error={(reopenConcernForm.touched.comment && reopenConcernForm.errors.comment) ? reopenConcernForm.errors.comment : ""}
                        />
                    </div>

                    <div className="tw-w-full">
                        <BrowseFile
                            containerClassName="tw-mb-3"
                            labelText="Upload File"
                            name="file"
                            fileName={reopenConcernForm.values.fileName}
                            onChangeFileHndlr={onChangeFileInputHndlr}
                        />
                    </div>
                </div>

                <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4">
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
                        onClick={(event: any) => reopenConcernForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default ReopenModal