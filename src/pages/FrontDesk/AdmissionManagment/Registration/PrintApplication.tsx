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
import { cancelAdmissionAct, printRegistrationFormAct } from "../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import { setPrintRegistrationFormAct } from "../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationslice";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
//Utility
import { printDocumentHandler } from "../../../../utility/commonutility";

const validationSchema = Yup.object().shape({
    reason: Yup.string().required("Remarks are required."),
});

const initialValues = { reason: "" };
export default function PrintApplication(props: any) {
    const dispatch = useAppDispatch();
    const printDivRef = useRef<HTMLDivElement>(null);
    const { printRegistrationFormResp } = useAppSelector(({ admissionRegistration }) => ({
        printRegistrationFormResp: admissionRegistration.printRegistrationFormResp
    }), shallowEqual);

    useEffect(() => {
        const { studentRegNo } = props;
        if (studentRegNo) {
            const params = { studentRegNo };
            dispatch(printRegistrationFormAct(generateActionPayload('print_applicationform', params)));
        }
    }, [props.studentRegNo]);


    function printReceiptHndlr() {
        const innerHTMLContent: string = printDivRef.current?.innerHTML || "";
        printDocumentHandler(innerHTMLContent);
    }
    return (
        <form onSubmit={e => e.preventDefault()}>
            <div className="modal-body">
                {
                    printRegistrationFormResp ?
                        <div id="print-div"
                            ref={printDivRef}
                            dangerouslySetInnerHTML={{ __html: printRegistrationFormResp }}>
                        </div> : (
                            <NoDataComp />
                        )
                }

                <div className="d-flex justify-content-end p-3">
                    <button onClick={printReceiptHndlr} className="btn btn-danger px-4 me-2">
                        <PrintSvg className="me-2 d-inline-block" stroke="#FFFFFF" />Print Registration PDF
                    </button>
                </div>
            </div>
        </form >
    )
}