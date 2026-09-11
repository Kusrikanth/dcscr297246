import React, { useState, useEffect, useRef, useCallback } from 'react';
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Alert } from "reactstrap";
import { Link, useHistory } from 'react-router-dom';
import { Card, Col, Container, Row } from 'reactstrap';
import { AuthCarousel, AuthFooter, TextIconInput, IntervalTimer, Button } from "../../Components/Common";
import classnames from "classnames";
//Images
import EmailIcon from "../../assets/imagesdps/authicon/email_icon.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { validateOtpAct, forgotPasswordAct } from "../../store/login/loginaction";

//Utility
import { getSuggestionMail } from "../../utility/commonutility";

//Types

const initialValues: any = {
    otpValue1: "",
    otpValue2: "",
    otpValue3: "",
    otpValue4: "",
    // otpValue5: "",
    // otpValue6: ""
};

const validationSchema = Yup.object().shape({
    otpValue1: Yup.string().required("*"),
    otpValue2: Yup.string().required("*"),
    otpValue3: Yup.string().required("*"),
    otpValue4: Yup.string().required("*"),
    // otpValue5: Yup.string().required("*"),
    // otpValue6: Yup.string().required("*"),
});

const ValidateOtp: React.FC<any> = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [startTimerState, setStartTimerState] = useState<boolean>(false);
    const [suggestionEmailState, setSuggestionEmailState] = useState<string>("");
    const { validateOtpResp, forgotPasswordResp, forgettedEmail, loginErrorResp } = useAppSelector(({ login }) => ({
        validateOtpResp: login.validateOtpResp,
        forgotPasswordResp: login.forgotPasswordResp,
        forgettedEmail: login.forgettedEmail,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);

    useEffect(() => {
        // if (!forgotPasswordResp) {
        // history.push('/forgotpassword');
        // } else {
        setStartTimerState(true);
        // }
        // return () => { }
    }, [forgotPasswordResp]);
    const inputElementRef = useRef<any>({
        otpValue1: null,
        otpValue2: null,
        otpValue3: null,
        otpValue4: null,
        // otpValue5: null,
        // otpValue6: null
    });
    const validateOtpRespRef = useRef<any>({
        prevValidateOtpResp: validateOtpResp,
        prevForgotPasswordResp: forgotPasswordResp,
        prevLoginErrorResp: loginErrorResp
    })

    useEffect(() => {
        if (forgotPasswordResp && !suggestionEmailState) {
            const { email, mobile } = forgotPasswordResp;
            if (email) {
                setSuggestionEmailState(getSuggestionMail(email));
            }
        }
    }, [forgotPasswordResp && suggestionEmailState]);
    useEffect(() => {
        const { prevValidateOtpResp, prevForgotPasswordResp, prevLoginErrorResp } = validateOtpRespRef.current || {};
        if (validateOtpResp && validateOtpResp !== prevValidateOtpResp) {
            const { isOtpValid } = validateOtpResp;
            if (isOtpValid === "invalid otp") {
                toast.error("Invalid otp.");
            }
            else {
                toast.success("Successfully validated your otp.");
                history.push("/resetpassword");
            }
        }
        else if (forgotPasswordResp && forgotPasswordResp !== prevForgotPasswordResp) {
            setStartTimerState(true);
            toast.success("OTP successfully resend to your registered email id.");
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            toast.error("Somethin went wrong");
        }
        validateOtpRespRef.current.prevValidateOtpResp = validateOtpResp;
        validateOtpRespRef.current.prevForgotPasswordResp = forgotPasswordResp;
        validateOtpRespRef.current.prevLoginErrorResp = loginErrorResp;
    }, [validateOtpResp, forgotPasswordResp, loginErrorResp]);

    const validateOtpForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (!startTimerState) {
                toast.error("Password expired resend your otp again.")
            } else {
                setStartTimerState(false);
                const { username } = forgotPasswordResp;
                const otpValue = Object.values(values).join(''),
                    payload = {
                        otp: otpValue,
                        username
                    }
                dispatch(validateOtpAct(generateActionPayload("validate_otp", undefined, payload, { tokenNotRequired: true })));
            }
        },
    });

    const stopTimerHndlr = useCallback(() => {
        setStartTimerState(false);
    }, []);

    function onKeyDownHndlr(event: React.KeyboardEvent<HTMLInputElement>) {
        const { target, currentTarget, ctrlKey, key } = event, { name, value } = (target as HTMLInputElement) || {},
            nextElemId = currentTarget.getAttribute("data-nextelem"),
            prevElemId = currentTarget.getAttribute("data-prevelem");
        if (!isNaN(Number(key))) {
            validateOtpForm.setValues((prevValues: any) => ({ ...prevValues, [name]: key }));
            if (value !== key) {
                inputElementRef.current[name].value = key;
            }
            if (nextElemId) {
                setTimeout(() => { inputElementRef.current[nextElemId].focus(); }, 0);
            }
        } else if (key === 'Backspace') {
            if (prevElemId && !value) {
                setTimeout(() => { inputElementRef.current[prevElemId].focus(); }, 0);
            } else if (value && prevElemId) {
                validateOtpForm.setValues((prevValues: any) => ({ ...prevValues, [name]: "" }));
                setTimeout(() => { inputElementRef.current[prevElemId].focus(); }, 0);
            } else if (value) {
                validateOtpForm.setValues((prevValues: any) => ({ ...prevValues, [name]: "" }));
            }
        }
        else if (!((ctrlKey && (key === 'v')) || (key === 'Tab'))) {
            event.preventDefault();
        }
    }

    function onPasteHndlr(event: React.ClipboardEvent<HTMLInputElement>) {
        const pastedValue = event.clipboardData.getData('Text'),
            getDigitInPasterValue = pastedValue.replace(/[^0-9]/g, ""),
            digitArray = getDigitInPasterValue && getDigitInPasterValue.split(""),
            updateFormInfo: any = {};
        if (digitArray.length > 0) {
            Object.keys(inputElementRef.current).forEach((item, index) => {
                inputElementRef.current[item].value = digitArray[index] || "";
                updateFormInfo[item] = digitArray[index] || "";
            });
            validateOtpForm.setValues((prevValues: any) => ({ ...prevValues, ...updateFormInfo }));
        }
        event.preventDefault();
    }

    function resendBtnHndlr(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        const { username } = forgotPasswordResp;
        if (username && !startTimerState) {
            Object.keys(inputElementRef.current).forEach((item) => {
                inputElementRef.current[item].value = "";
            });
            inputElementRef.current["otpValue1"].focus();
            dispatch(forgotPasswordAct(generateActionPayload("forgot_password", undefined, { username }, { tokenNotRequired: true })));
        }
    }

    return (
        <div className="tw-col-span-12 tw-flex tw-justify-center tw-items-center tw-pt-4 2xl:tw-pt-5 tw-pb-3">
            <div className="validateotp-container">
                {/* <div ref={headerContainer} className="pt-3 pb-2 header-container overflow-hidden">
                <div className="text-center" style={{ zIndex: 1 }}>
                    <h3 className="mb-0 text-white">SMART ERP</h3>
                    <span className="text-white fs-5">dn</span>
                </div>

                <div className="circle-div" style={dynamicCircleStyle}>

                </div>
            </div> */}
                <div className="header-new-container tw-py-3">
                    <div className="tw-text-center" style={{ zIndex: 1 }}>
                        <div className="header-circle-img tw-m-auto tw-mb-2">
                            <i className="icon-green ri-mail-line"></i>
                        </div>
                        <h4 className="tw-mb-1 tw-text-white">Verify Your Email</h4>
                        <span className="header-subtitle tw-block tw-text-xs tw-px-5 xl:tw-mb-4 tw-text-wrap">
                            Please enter the 4 digit OTP sent to <span className="tw-font-bold">{suggestionEmailState}</span>
                        </span>
                    </div>
                </div>
                <div className="container-fluid tw-pt-4 tw-pb-4">
                    <form onSubmit={validateOtpForm.handleSubmit}>
                        <div className="tw-grid tw-grid-cols-12 tw-mb-4 tw-gap-2">
                            <div className="tw-col-span-3">
                                <input type="text"
                                    ref={el => inputElementRef.current.otpValue1 = el}
                                    onKeyDown={onKeyDownHndlr}
                                    // onChange={onChangeOtpHndlr}
                                    // value={validateOtpForm.values.otpValue1}
                                    autoFocus
                                    data-nextelem="otpValue2"
                                    onPaste={onPasteHndlr}
                                    data-prevelem=""
                                    // className="form-control form-control bg-light border-light tw-text-center"
                                    className={classnames('form-control form-control bg-light tw-text-center', (
                                        ((validateOtpForm.touched.otpValue1 && validateOtpForm.errors.otpValue1)) ? "is-invalid" : "border-light"))}
                                    maxLength={1}
                                    name="otpValue1"
                                />
                            </div>
                            <div className="tw-col-span-3">
                                <input type="text"
                                    ref={el => inputElementRef.current.otpValue2 = el}
                                    // value={validateOtpForm.values.otpValue2}
                                    onKeyDown={onKeyDownHndlr}
                                    // onChange={onChangeOtpHndlr}
                                    data-nextelem="otpValue3"
                                    data-prevelem="otpValue1"
                                    className={classnames('form-control form-control bg-light tw-text-center', (
                                        ((validateOtpForm.touched.otpValue2 && validateOtpForm.errors.otpValue2)) ? "is-invalid" : "border-light"))}
                                    maxLength={1}
                                    name="otpValue2"
                                />
                            </div>
                            <div className="tw-col-span-3">
                                <input type="text"
                                    ref={el => inputElementRef.current.otpValue3 = el}
                                    // value={validateOtpForm.values.otpValue3}
                                    onKeyDown={onKeyDownHndlr}
                                    // onChange={onChangeOtpHndlr}
                                    data-nextelem="otpValue4"
                                    data-prevelem="otpValue2"
                                    className={classnames('form-control form-control bg-light tw-text-center', (
                                        ((validateOtpForm.touched.otpValue3 && validateOtpForm.errors.otpValue3)) ? "is-invalid" : "border-light"))}
                                    maxLength={1}
                                    name="otpValue3"
                                />
                            </div>
                            <div className="tw-col-span-3">
                                <input type="text"
                                    ref={el => inputElementRef.current.otpValue4 = el}
                                    // value={validateOtpForm.values.otpValue4}
                                    onKeyDown={onKeyDownHndlr}
                                    // onChange={onChangeOtpHndlr}
                                    data-nextelem=""
                                    data-prevelem="otpValue3"
                                    className={classnames('form-control form-control bg-light tw-text-center', (
                                        ((validateOtpForm.touched.otpValue4 && validateOtpForm.errors.otpValue4)) ? "is-invalid" : "border-light"))}
                                    maxLength={1}
                                    name="otpValue4"
                                />
                            </div>
                            {/* <div className="col-2">
                                <input type="text"
                                    ref={el => inputElementRef.current.otpValue5 = el}
                                    // value={validateOtpForm.values.otpValue5}
                                    onKeyDown={onKeyDownHndlr}
                                    // onChange={onChangeOtpHndlr}
                                    data-nextelem="otpValue6"
                                    data-prevelem="otpValue4"
                                    className={classnames('form-control form-control bg-light text-center', (
                                        ((validateOtpForm.touched.otpValue5 && validateOtpForm.errors.otpValue5)) ? "is-invalid" : "border-light"))}
                                    maxLength={1}
                                    name="otpValue5"
                                />
                            </div>
                            <div className="col-2">
                                <input type="text"
                                    ref={el => inputElementRef.current.otpValue6 = el}
                                    // value={validateOtpForm.values.otpValue6}
                                    onKeyDown={onKeyDownHndlr}
                                    // onChange={onChangeOtpHndlr}
                                    data-nextelem=""
                                    data-prevelem="otpValue5"
                                    className={classnames('form-control form-control bg-light text-center', (
                                        ((validateOtpForm.touched.otpValue6 && validateOtpForm.errors.otpValue6)) ? "is-invalid" : "border-light"))}
                                    maxLength={1}
                                    name="otpValue6"
                                />
                            </div> */}


                        </div>
                        <div className="tw-grid tw-grid-cols-12">
                            <div className="tw-col-span-12 tw-text-center tw-mb-3">
                                <Button color="success" variant='primary' type="submit"
                                    className="!tw-w-full  tw-bg-[#155b2e]">Confirm</Button>
                            </div>
                        </div>
                    </form>
                    <div className="tw-grid tw-grid-cols-12">
                        {/* <input type="button" value="Restart" onClick={e => setStartTimerState(true)} /> */}
                        <div className="tw-col-span-12 tw-text-center tw-mb-3">
                            <IntervalTimer
                                startTimer={startTimerState}
                                stopTimerHndlr={stopTimerHndlr}
                                initialMinute="04"
                                initialSeconds="00"
                            />
                        </div>
                        <div className="tw-col-span-12 tw-text-center">
                            <p className="tw-mb-0">Didn't receive a code ? <a
                                href='#' onClick={resendBtnHndlr}
                                className={classnames('tw-font-semibold tw-underline',
                                    startTimerState ? "tw-text-gray-500 tw-pointer-events-none" : "tw-text-[#405189]")}
                            >Resend</a> </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ValidateOtp;