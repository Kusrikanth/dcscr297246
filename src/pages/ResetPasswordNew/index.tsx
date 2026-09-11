import React, { useState, useEffect, useRef } from 'react';
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Link, useHistory } from 'react-router-dom';
import { Card, Col, Container, Input, Label, Row, FormFeedback } from 'reactstrap';
import { AuthCarousel, AuthFooter, TextIconInput, ProgressIndicator, Button } from "../../Components/Common";
import classnames from "classnames";
//Actions
import { userDetailsAct } from "../../store/actions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
//Types
// import { IChangePwdForm } from "./resetpasswordtypes";
//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { resetPasswordAct } from "../../store/login/loginaction";

const initialValues: any = {
    password: "",
    confirmPassword: "",
};

const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required.").min(6, 'Password length should be more than 6 letters.'),
    confirmPassword: Yup.string().required('Confirm Password is required.').oneOf([Yup.ref('password'), null], 'Confirm password should be same as password.'),
});

// confirmPassword: Yup.string().when("password", {
//     is: (val: string) => (val && val.length > 0 ? true : false),
//     then: Yup.string().oneOf(
//         [Yup.ref("password")],
//         "Confirm password should be same as password."
//     ),
//     otherwise: Yup.string().required("Confirm Password is required.")
// })

const pwdMediumStrengthRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
const pwdStrongStrengthRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


const ResetPasswordNew: React.FC<any> = () => {
    const [showPwdIconState, setShowPwdIconState] = useState<boolean>(false);
    const [progressIndicatorState, setProgressIndicatorState] = useState({
        weakProgressValue: 0,
        mediumProgressValue: 0,
        strongProgressValue: 0,
        passwordStrengthText: "",
        passwordStrengthColor: "",
    });
    const [showCnfrmPwdIconState, setShowCnfrmPwdIconState] = useState<boolean>(false);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { resetPasswordResp, validateOtpResp, forgotPasswordResp, loginErrorResp } = useAppSelector(({ login }) => ({
        resetPasswordResp: login.resetPasswordResp,
        validateOtpResp: login.validateOtpResp,
        forgotPasswordResp: login.forgotPasswordResp,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);

    const changePasswordRef = useRef<any>({
        prevResetPasswordResp: resetPasswordResp,
        prevLoginErrorResp: loginErrorResp
    })

    // useEffect(() => {
    //     if (!validateOtpResp) {
    //         history.push('/forgot-password');
    //     }
    // }, [validateOtpResp]);

    useEffect(() => {
        const { prevResetPasswordResp, prevLoginErrorResp } = changePasswordRef.current || {};
        if (resetPasswordResp && prevResetPasswordResp !== resetPasswordResp) {
            history.push('loginv1');
            toast.success("Password resetted successfully. Please login again.");
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            const { message } = loginErrorResp;
            toast.error(message || "Somethin went wrong");
        }
        changePasswordRef.current.prevResetPasswordResp = resetPasswordResp;
        changePasswordRef.current.prevLoginErrorResp = loginErrorResp;
    }, [resetPasswordResp, loginErrorResp]);

    const changePwdForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { username } = forgotPasswordResp;
            const payload = {
                otpId: validateOtpResp,
                newPassword: values.password,
                confirmPassword: values.confirmPassword,
                username
            };
            dispatch(resetPasswordAct(generateActionPayload("reset_password", undefined, payload, { tokenNotRequired: true })));
        },
    });

    function showPasswordHndlr() {
        setShowPwdIconState(!showPwdIconState);
    }

    function showCnfrmPasswordHnldr() {
        setShowCnfrmPwdIconState(!showCnfrmPwdIconState);
    }

    function passwordChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event,
            { name, value } = target;
        if (pwdStrongStrengthRegex.test(value)) {
            setProgressIndicatorState(prevState => ({
                ...prevState, weakProgressValue: 100, mediumProgressValue: 100,
                passwordStrengthText: "Your password is strong.",
                passwordStrengthColor: "tw-text-green-500"
            }))
            setTimeout(() => {
                setProgressIndicatorState(prevState => ({
                    ...prevState, strongProgressValue: 100,
                }))
            }, 150);
        } else if (pwdMediumStrengthRegex.test(value)) {
            setProgressIndicatorState(prevState => ({
                ...prevState, weakProgressValue: 100, mediumProgressValue: 100, strongProgressValue: 0,
                passwordStrengthText: "Your password is medium.",
                passwordStrengthColor: "tw-text-yellow-500"
            }))
        } else {
            setProgressIndicatorState(prevState => ({
                ...prevState, weakProgressValue: 100,
                strongProgressValue: 0,
                passwordStrengthText: "Your password is weak.",
                passwordStrengthColor: "tw-text-red-500"
            }))
            setTimeout(() => {
                setProgressIndicatorState(prevState => ({
                    ...prevState, mediumProgressValue: 0, strongProgressValue: 0,
                }))
            }, 150);
        }
        changePwdForm.setFieldValue(name, value);
    }
    return (
        <div className="tw-col-span-12 tw-flex tw-justify-center tw-items-center tw-pt-4 2xl:tw-pt-12 tw-pb-3">
            <div className="validateotp-container">

                <div className="header-new-container tw-py-3">
                    <div className="tw-text-center" style={{ zIndex: 1 }}>
                        <h4 className="tw-mb-2 tw-text-white tw-text-[1.125rem] tw-font-semibold">Create new password</h4>
                        <span className="header-subtitle tw-block tw-text-[0.8125rem] tw-px-5 tw-text-wrap">
                            Your new password must be different <br /> from previous used password.
                        </span>
                    </div>
                </div>

                <div className="tw-py-4 tw-px-3">

                    <form onSubmit={changePwdForm.handleSubmit}>
                        <TextIconInput
                            iconPositionClassName="right"
                            formgroupClassName="tw-mb-2"
                            labelText="Password"
                            inputType={showPwdIconState ? "text" : "password"}
                            name="password"
                            placeHolder="Enter password"
                            // helperText="Must be at least 8 characters."
                            // onChange={changePwdForm.handleChange}
                            onChange={passwordChangeHndlr}
                            onBlur={changePwdForm.handleBlur}
                            value={changePwdForm.values.password || ""}
                            invalid={(changePwdForm.touched.password && changePwdForm.errors.password) ? true : false}
                            error={(changePwdForm.touched.password && changePwdForm.errors.password) ? changePwdForm.errors.password : ""}
                        >
                            <i onClick={showPasswordHndlr} className={classnames("tw-align-middle tw-text-gray-500 tw-cursor-pointer", {
                                "ri-eye-fill": showPwdIconState,
                                "ri-eye-off-fill": !showPwdIconState
                            })}></i>
                        </TextIconInput>
                        <div className="container-fluid tw-mb-3 tw-px-0">
                            <div className="tw-flex tw-flex-wrap tw-gap-1 tw-mb-1">
                                <div className="tw-flex-1">
                                    <ProgressIndicator
                                        progressColor="danger"
                                        progressValue={progressIndicatorState.weakProgressValue}
                                        progressClassName="progress-sm"
                                    />
                                </div>
                                <div className="tw-flex-1">
                                    <ProgressIndicator
                                        progressColor="warning"
                                        progressValue={progressIndicatorState.mediumProgressValue}
                                        progressClassName="progress-sm"

                                    />
                                </div>
                                <div className="tw-flex-1">
                                    <ProgressIndicator
                                        progressColor="success"
                                        progressValue={progressIndicatorState.strongProgressValue}
                                        progressClassName="progress-sm"
                                    />
                                </div>
                            </div>
                            <div className="tw-flex tw-flex-wrap">
                                <div className="tw-col-span-12">
                                    <p className={classnames("tw-text-[0.8125rem] tw-mb-0", progressIndicatorState.passwordStrengthColor)}>
                                        {progressIndicatorState.passwordStrengthText}</p>
                                </div>
                            </div>
                        </div>
                        <TextIconInput
                            iconPositionClassName="right"
                            labelText="Confirm Password"
                            inputType={showCnfrmPwdIconState ? "text" : "password"}
                            name="confirmPassword"
                            placeHolder="Confirm Password"
                            onChange={changePwdForm.handleChange}
                            onBlur={changePwdForm.handleBlur}
                            value={changePwdForm.values.confirmPassword || ""}
                            invalid={(changePwdForm.touched.confirmPassword && changePwdForm.errors.confirmPassword) ? true : false}
                            error={(changePwdForm.touched.confirmPassword && changePwdForm.errors.confirmPassword) ? changePwdForm.errors.confirmPassword : ""}
                        >
                            <i onClick={showCnfrmPasswordHnldr} className={classnames("tw-align-middle tw-text-gray-500 tw-cursor-pointer", {
                                "ri-eye-fill": showCnfrmPwdIconState,
                                "ri-eye-off-fill": !showCnfrmPwdIconState
                            })}></i>
                        </TextIconInput>
                        <div className="tw-mt-12">
                            <div className="tw-col-span-12 tw-text-center tw-mb-3">
                                <Button variant="primary" type="submit">Reset Password</Button>
                            </div>
                        </div>

                    </form>

                </div>



            </div>
        </div >
    )
}

export default ResetPasswordNew;