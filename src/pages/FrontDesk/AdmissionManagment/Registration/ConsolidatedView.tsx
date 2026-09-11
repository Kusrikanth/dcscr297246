import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Common Component
import {
    TextArea
} from "../../../../Components/Common";

//Generate Action
import { generateActionPayload } from "../../../../utility/reduxutility";
//Icons
import { default as CancelIcon } from "../../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { cancelAdmissionAct, consolidatedViewRegistrationFormAct } from "../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import NoDataComp from "../../../../Components/Common/NoDataComp";

const validationSchema = Yup.object().shape({
    reason: Yup.string().required("Remarks are required."),
});

const initialValues = { reason: "" };
export default function ConsolidatedView(props: any) {
    const dispatch = useAppDispatch();

    const { consolidatedViewRegistrationFormResp } = useAppSelector(({ admissionRegistration }) => ({
        consolidatedViewRegistrationFormResp: admissionRegistration.consolidatedViewRegistrationFormResp
    }), shallowEqual);

    useEffect(() => {
        const { studentRegNo } = props;
        if (studentRegNo) {
            const params = { studentRegNo };
            dispatch(consolidatedViewRegistrationFormAct(generateActionPayload('consolidated_admission', params)));
        }
    }, [props.studentRegNo]);

    return (
        <form onSubmit={e => e.preventDefault()}>
            <div className="modal-body">
                {
                    consolidatedViewRegistrationFormResp ?
                        <div id="print-div" className="tw-flex tw-justify-center"
                            dangerouslySetInnerHTML={{ __html: consolidatedViewRegistrationFormResp }}>
                        </div> : (
                            <NoDataComp />
                        )
                }

            </div>
        </form >
    )
}