
import * as Yup from "yup";
import classnames from "classnames";
import {  TextArea } from "../../../../Components/Common";
import { useFormik } from "formik";

import { default as CancelIcon } from "../../../../assets/imagesdps/academics/CancelIcon.svg?react";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks are required."),
});

const initialValues = { remarks: "" };
const CancelAdmissionModal = (props: any) => {
    const cancelAdmissionModalForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            props.confirmHndlr(values);
        },
    });

    const { isApprovedAction } = props;
    return (
        <>
            <form onSubmit={cancelAdmissionModalForm.handleSubmit}>

                {/* Body */}
                <div className="tw-p-6">
                    <div className="tw-flex tw-flex-col tw-items-center tw-text-center">

                        <div className="tw-mb-2">
                            <CancelIcon style={{ height: "70px", width: "70px" }} />
                        </div>

                        <h5 className="tw-text-lg tw-font-semibold tw-mb-2">
                            Are you sure?
                        </h5>

                        <span className="tw-font-normal tw-mb-3">
                            You want to Cancel this Admission?
                        </span>

                        <TextArea
                            name="remarks"
                            value={cancelAdmissionModalForm.values.remarks}
                            onChange={cancelAdmissionModalForm.handleChange}
                            inputClassName="tw-bg-gray-100 tw-w-full tw-rounded-md tw-p-2"
                            formgroupClassName="tw-w-[70%]"
                            invalid={(cancelAdmissionModalForm.touched.remarks && cancelAdmissionModalForm.errors.remarks) ? true : false}
                            error={(cancelAdmissionModalForm.touched.remarks && cancelAdmissionModalForm.errors.remarks) ? cancelAdmissionModalForm.errors.remarks : ""}
                         />
                    </div>
                </div>

                {/* Footer */}
                <div className="tw-flex tw-justify-center tw-gap-3 tw-p-4 tw-border-t tw-shadow-inner">

                    <Button
                        type="button"
                        onClick={props.toggle}
                        variant="secondary"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                       
                        variant={isApprovedAction ? "primary" : "reject"}
                    >
                        Confirm
                    </Button>

                </div>
            </form>
        </>
    );
};

export default CancelAdmissionModal;
