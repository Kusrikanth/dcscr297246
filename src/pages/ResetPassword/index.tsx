import React, { useState, useEffect, useRef } from 'react';
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Link, useHistory } from 'react-router-dom';
import { Card, Col, Container, Input, Label, Row, FormFeedback } from 'reactstrap';
import { AuthCarousel, AuthFooter, Button, TextIconInput } from "../../Components/Common";
import classnames from "classnames";
//Actions
import { userDetailsAct } from "../../store/actions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
//Types
import { IChangePwdForm } from "./resetpasswordtypes";
//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { resetPasswordAct } from "../../store/login/loginaction";


const initialValues: IChangePwdForm = {
    password: "",
    confirmPassword: "",
};

const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required."),
    confirmPassword: Yup.string().when("password", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
            [Yup.ref("password")],
            "Confirm password should be same as password."
        ),
        otherwise: Yup.string().required("Confirm Password is required.")
    })
});

const ChangePassword: React.FC = () => {
    const [showPwdIconState, setShowPwdIconState] = useState<boolean>(false);
    const [showCnfrmPwdIconState, setShowCnfrmPwdIconState] = useState<boolean>(false);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { resetPasswordResp, validateOtpResp, loginErrorResp } = useAppSelector(({ login }) => ({
        resetPasswordResp: login.resetPasswordResp,
        validateOtpResp: login.validateOtpResp,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);

    const changePasswordRef = useRef<any>({
        prevResetPasswordResp: resetPasswordResp,
        prevLoginErrorResp: loginErrorResp
    })

    useEffect(() => {
        if (!validateOtpResp) {
            history.push('/forgot-password');
        }
    }, [validateOtpResp]);

    useEffect(() => {
        const { prevResetPasswordResp, prevLoginErrorResp } = changePasswordRef.current || {};
        if (resetPasswordResp && prevResetPasswordResp !== resetPasswordResp) {
            history.push('login');
            toast.success("Password resetted successfully. Please login again.");
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            toast.error("Somethin went wrong");
        }
        changePasswordRef.current.prevResetPasswordResp = resetPasswordResp;
        changePasswordRef.current.prevLoginErrorResp = loginErrorResp;
    }, [resetPasswordResp, loginErrorResp]);

    const changePwdForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                otpId: validateOtpResp?.otpId,
                rText: validateOtpResp?.rText,
                newPassword: values.password,
                confirmPassword: values.confirmPassword
            };
            dispatch(resetPasswordAct(generateActionPayload("reset_password", undefined, payload)));
        },
    });

    function showPasswordHndlr() {
        setShowPwdIconState(!showPwdIconState);
    }

    function showCnfrmPasswordHnldr() {
        setShowCnfrmPwdIconState(!showCnfrmPwdIconState);
    }

    return (
        <React.Fragment>
            <div className="auth-page-wrapper auth-bg-cover tw-py-12 tw-flex tw-justify-center tw-items-center tw-min-h-screen">
                <div className="bg-overlay"></div>

                <div className="auth-page-content tw-overflow-hidden tw-pt-12 lg:tw-pt-20">
                    <div className="container tw-mx-auto tw-px-4">
                        <div className="tw-flex tw-flex-wrap tw-justify-center">
                            <div className="tw-w-full">
                                <div className="card tw-overflow-hidden tw-bg-white tw-shadow-md tw-rounded-lg">
                                    <div className="tw-flex tw-flex-wrap tw-m-0">
                                        <div className="tw-w-full lg:tw-w-1/2">
                                            <div className="tw-p-6 lg:tw-p-12">
                                                <div>
                                                    <h5 className="tw-text-primary tw-text-lg tw-font-medium">Change Password !</h5>
                                                    <p className="tw-text-gray-500">Your new password must be different from previous used password.</p>
                                                </div>
                                                <div className="tw-mt-12">
                                                    <form onSubmit={changePwdForm.handleSubmit}>
                                                        <TextIconInput
                                                            iconPositionClassName="right"
                                                            labelText="Password"
                                                            inputType={showPwdIconState ? "text" : "password"}
                                                            name="password"
                                                            placeHolder="Enter password"
                                                            helperText="Must be at least 8 characters."
                                                            onChange={changePwdForm.handleChange}
                                                            value={changePwdForm.values.password || ""}
                                                            invalid={(changePwdForm.touched.password && changePwdForm.errors.password) ? true : false}
                                                            error={(changePwdForm.touched.password && changePwdForm.errors.password) ? changePwdForm.errors.password : ""}
                                                        >
                                                            <i onClick={showPasswordHndlr} className={classnames("tw-align-middle tw-text-gray-500 tw-cursor-pointer", {
                                                                "ri-eye-fill": showPwdIconState,
                                                                "ri-eye-off-fill": !showPwdIconState
                                                            })}></i>
                                                        </TextIconInput>
                                                        <TextIconInput
                                                            iconPositionClassName="right"
                                                            labelText="Confirm Password"
                                                            inputType={showCnfrmPwdIconState ? "text" : "password"}
                                                            name="confirmPassword"
                                                            placeHolder="Confirm Password"
                                                            onChange={changePwdForm.handleChange}
                                                            value={changePwdForm.values.confirmPassword || ""}
                                                            invalid={(changePwdForm.touched.confirmPassword && changePwdForm.errors.confirmPassword) ? true : false}
                                                            error={(changePwdForm.touched.confirmPassword && changePwdForm.errors.confirmPassword) ? changePwdForm.errors.confirmPassword : ""}
                                                        >
                                                            <i onClick={showCnfrmPasswordHnldr} className={classnames("tw-align-middle tw-text-gray-500 tw-cursor-pointer", {
                                                                "ri-eye-fill": showCnfrmPwdIconState,
                                                                "ri-eye-off-fill": !showCnfrmPwdIconState
                                                            })}></i>
                                                        </TextIconInput>


                                                        <div className="form-check">
                                                            <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                            <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                        </div>

                                                        <div className="tw-mt-12">
                                                            <Button variant="primary" className="tw-w-full" type="submit">Reset Password</Button>
                                                        </div>

                                                    </form>
                                                </div>

                                                <div className="tw-mt-5 tw-text-center">
                                                    <p className="tw-mb-0">Wait, I remember my password... <Link to="/login" className="tw-font-semibold tw-text-primary tw-underline"> Click here</Link> </p>
                                                </div>
                                            </div>
                                        </div>
                                        <AuthCarousel />


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AuthFooter />

            </div>
        </React.Fragment>
    );
};

export default ChangePassword;