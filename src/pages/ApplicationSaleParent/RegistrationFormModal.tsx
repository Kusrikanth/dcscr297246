import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks


//Common Component

//Generate Action

//Icons
import { default as CancelIcon } from "../../assets/imagesdps/academics/CancelIcon.svg?react";

import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { generateActionPayload } from "../../utility/reduxutility";
import { TextArea } from "../../Components/Common";

const validationSchema = Yup.object().shape({
    reason: Yup.string().required("Remarks are required."),
});

const initialValues = { reason: "" };
export default function RegistrationFormModal(props: any) {
    const dispatch = useAppDispatch();

    const { cancelAdmissionResp } = useAppSelector(({ admissionRegistration }) => ({
        cancelAdmissionResp: admissionRegistration.cancelAdmissionResp
    }), shallowEqual);

    // const cancelAdmissionRef = useRef<any>({
    //     prevCancelAdmissionResp: cancelAdmissionResp
    // });
    // useEffect(() => {
    //     const { prevCancelAdmissionResp } = cancelAdmissionRef.current;
    //     if (cancelAdmissionResp && prevCancelAdmissionResp !== cancelAdmissionResp) {
    //         toast.success("Admission canceled successfully.");
    //         props.toggle(true);
    //     }
    //     cancelAdmissionRef.current.prevCancelAdmissionResp = cancelAdmissionResp;
    // }, [cancelAdmissionResp]);



    const { isUserActive } = props;
    return (
        <>
            <div className="modal-body">
                <div className=" tw-mt-4" style={{textAlign:"center",fontSize:"16px",fontWeight:700}}>
                Please wait till payment is completed 
                   
                </div>
                <div className=" tw-mt-4" style={{textAlign:"center",fontSize:"16px",fontWeight:700}}>
                Do not press back button or refresh the page
                   
                </div>

            </div>
            {/* <div className="modal-footer">
                <div className="text-align-center mt-4">
                    <button type="button"
                        className="btn btn-light me-2" onClick={props.toggle}>Cancel</button>
                    <button type="submit"
                        className={classnames("btn", (isUserActive ? "btn-danger" : "btn-success"))}>Confirm</button>
                </div>
            </div> */}
        </ >
    )
}