import React, { useState, useEffect, useRef } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch } from "../../../hooks/storehook";

//Common Component
import {
    TextArea
} from "../../../Components/Common";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
//Icons
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";

import { rejectTerminationReqAct } from "../../../store/transportation/TransportationRecords/transportationrecordsaction";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks are required."),
});

const initialValues = { remarks: "" };
export default function RejectTransportReq(props: any) {
    const dispatch = useAppDispatch();

    const rejectTerminationReqForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const params = {
                requestId: props.requestId,
            }
            dispatch(rejectTerminationReqAct(generateActionPayload("reject_termination_req", params, { remarks: values.remarks })));
        },
    });


    useEffect(() => {
        return () => {
            rejectTerminationReqForm.resetForm();
        }
    }, []);
    return (
        <form onSubmit={rejectTerminationReqForm.handleSubmit}>
            <div className="tw-p-6">

                <div className="tw-flex tw-flex-col tw-items-center tw-text-center">

                    <div className="tw-flex tw-mb-4">
                        <CancelIcon style={{ height: "70px", width: "70px" }} />
                    </div>

                    <h5 className="tw-text-lg tw-font-semibold tw-mb-2">
                        You want to reject the Request ?
                    </h5>

                    <span className="tw-text-sm tw-font-normal tw-text-gray-600 tw-mb-4">
                        Termination Request will be reject for student.
                    </span>

                    <div className="tw-w-full tw-max-w-md">
                        <TextArea
                            name="remarks"
                            value={rejectTerminationReqForm.values.remarks}
                            onChange={rejectTerminationReqForm.handleChange}
                            placeHolder="Enter Remarks here..."
                            inputClassName="tw-bg-gray-100 tw-w-full"
                            formgroupClassName="tw-w-full"
                            invalid={
                                rejectTerminationReqForm.touched.remarks &&
                                    rejectTerminationReqForm.errors.remarks
                                    ? true
                                    : false
                            }
                            error={
                                rejectTerminationReqForm.touched.remarks &&
                                    rejectTerminationReqForm.errors.remarks
                                    ? rejectTerminationReqForm.errors.remarks
                                    : ""
                            }
                        />
                    </div>

                </div>

            </div>
            <div className="tw-border-t tw-p-4 tw-flex tw-justify-center tw-gap-3">

                <Button
                    type="button"
                    onClick={props.toggle}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={props.showApiLoader}
                    variant="primary"
                >
                    Confirm
                </Button>

            </div>
        </form >
    )
}