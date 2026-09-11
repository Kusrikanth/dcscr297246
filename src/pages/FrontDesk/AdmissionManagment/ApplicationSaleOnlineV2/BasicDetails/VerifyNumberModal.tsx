import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
import { default as CancelIcon } from "../../../../../assets/imagesdps/academics/CancelIcon.svg?react";

import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

import { TextInput } from "../../../../../Components/Common";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { verifyOtpForUserAct } from "../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { accessTokenKey } from "../../../../../Components/constants/storageconstants";
import { setLocalStorage } from "../../../../../utility/storageUtility";
import { parseQueryStringToObject } from "../../../../../utility/commonutility";
import { useLocation } from "react-router";

const validationSchema = Yup.object().shape({
    otp: Yup.string()
        .required('OTP is required')
        .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
});

const initialValues = { otp: "" };
export default function VerifyNumberModal(props: any) {
    const dispatch = useAppDispatch();
    const params = useLocation().search;

    const { generateOtpForUserResp, showApiLoader } = useAppSelector(({ applicationSale, globalData }) => ({
        generateOtpForUserResp: applicationSale.generateOtpForUserResp,
        showApiLoader: globalData.showApiLoader,
    }), shallowEqual);

    const mobileVerifyRef = useRef({
        prevGenerateOtpForUserResp: generateOtpForUserResp,
    });
    useEffect(() => {
        const { prevGenerateOtpForUserResp } = mobileVerifyRef.current;
        if (generateOtpForUserResp && prevGenerateOtpForUserResp !== generateOtpForUserResp) {
            toast.success("OTP sent Successfully to your mobile number");
        }
        mobileVerifyRef.current.prevGenerateOtpForUserResp = generateOtpForUserResp;
    }, [generateOtpForUserResp]);


    const VerifyOtpForm = useFormik({
        enableReinitialize: false,
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                id: generateOtpForUserResp?.id,
                otp: values.otp
            }
            dispatch(verifyOtpForUserAct(generateActionPayload("verify_otp_for_guest_user", undefined, payload, { tokenNotRequired: true })));
        },
    });

    return (
        <>
            <form className='row p-3 g-3' onSubmit={VerifyOtpForm.handleSubmit}>
                <div className='col-12'>
                    <TextInput
                        name={`otp`}
                        labelText="Enter Your OTP"
                        value={VerifyOtpForm.values.otp}
                        onChange={(event: any) => {
                            VerifyOtpForm.handleChange(event)
                        }}
                        invalid={
                            VerifyOtpForm.touched.otp &&
                                VerifyOtpForm.errors.otp
                                ? true
                                : false
                        }
                        error={
                            VerifyOtpForm.touched.otp &&
                                VerifyOtpForm.errors.otp
                                ? VerifyOtpForm.errors.otp
                                : ""
                        }
                        maxLength={6}
                        autoFocus={true}
                    />
                </div>
                <div className="hstack gap-2 justify-content-end mt-1">

                    <button
                        type="button"
                        className={"btn btn-light"}
                        onClick={props.toggle}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className={`btn btn-success
                `}
                        disabled={showApiLoader}
                    >
                        Submit
                    </button>

                </div>
            </form>
        </ >
    )
}