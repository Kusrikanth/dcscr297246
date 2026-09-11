import React, { useState, useEffect, useRef } from 'react';
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Alert } from "reactstrap";
import { Link, useHistory } from 'react-router-dom';
import { Card, Col, Container, Row } from 'reactstrap';
import { AuthCarousel, AuthFooter, TextIconInput } from "../../Components/Common";
import classnames from "classnames";
//Images
import EmailIcon from "../../assets/imagesdps/authicon/email_icon.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { forgotPasswordAct, setForgettedEmailAct } from "../../store/login/loginaction";
import Button from '../../Components/Common/Button';

//Types
const initialValues: any = {
    username: ""
};
const validationSchema = Yup.object().shape({
    username: Yup.string().required("User name is required.")
});

const ForgotPassword: React.FC<any> = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { forgotPasswordResp, loginErrorResp } = useAppSelector(({ login }) => ({
        forgotPasswordResp: login.forgotPasswordResp,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);

    const forgotPasswordRespRef = useRef<any>({
        prevForgotPasswordResp: forgotPasswordResp,
        prevLoginErrorResp: loginErrorResp
    })

    useEffect(() => {
        const { prevForgotPasswordResp, prevLoginErrorResp } = forgotPasswordRespRef.current || {};
        if (forgotPasswordResp && forgotPasswordResp !== prevForgotPasswordResp) {
            toast.success("OTP successfully send to your register email id.");
            history.push('/validateotpv1');
            dispatch(setForgettedEmailAct(forgotPwdForm.values.username));
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            toast.error("Invalid username id.");
        }
    }, [forgotPasswordResp, loginErrorResp]);

    const forgotPwdForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            dispatch(forgotPasswordAct(generateActionPayload("forgot_password", undefined, values, { tokenNotRequired: true })));
        },
    });

    return (
        <div className="tw-flex tw-justify-center tw-items-center tw-pt-5 tw-pb-3">
            <div className="validateotp-container">

                <div className="header-new-container tw-py-6">
                    <div className="tw-text-center" style={{ zIndex: 1 }}>
                        <div className="header-circle-img m-auto tw-mb-2">
                            <i className="icon-green ri-mail-line"></i>
                        </div>
                        <h4 className="tw-mb-2 tw-text-white">Forgot Password?</h4>
                        <span className="header-subtitle tw-block fs-7 tw-px-6 tw-mb-4 tw-text-wrap">
                            Reset password with Delhi Public School
                        </span>
                    </div>
                </div>

                <div className="tw-py-4 tw-px-3">
                    <div className="tw-text-center">
                        <div className="alert alert-warning alert-borderless alert-warning tw-text-center tw-text-xs tw-mb-3">
                            Enter your registered username and an OTP will be sent to your email Id
                        </div>
                    </div>
                    <form onSubmit={forgotPwdForm.handleSubmit}>
                        <TextIconInput
                            // iconPositionClassName="right"
                            formgroupClassName="tw-mb-4"
                            // labelText="Email"
                            name="username"
                            placeHolder="Enter Username"
                            onChange={forgotPwdForm.handleChange}
                            value={forgotPwdForm.values.username || ""}
                            invalid={(forgotPwdForm.touched.username && forgotPwdForm.errors.username) ? true : false}
                            error={(forgotPwdForm.touched.username && forgotPwdForm.errors.username) ? forgotPwdForm.errors.username : ""}
                        >
                            <i className={"align-middle icon-green ri-user-line"}></i>
                        </TextIconInput>
                        <div className="tw-mb-4 tw-text-center">
                            <Button variant='primary' type="submit" className='!tw-bg-[#155b2e]'>Send OTP</Button>
                        </div>

                    </form>
                    <div className="tw-text-center tw-text-sm">
                        <p className="tw-mb-0">Wait, I remember my password... <Link to="/loginv1" className="tw-font-semibold tw-text-emerald-600 !tw-underline"> Click here</Link> </p>
                    </div>

                </div>



            </div>
        </div >
    )
}

export default ForgotPassword;