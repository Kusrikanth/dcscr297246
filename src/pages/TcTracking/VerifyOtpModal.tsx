import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import classnames from "classnames";
import { IntervalTimer, Button } from '../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../hooks/storehook';
import { generateActionPayload } from '../../utility/reduxutility';
import { validateStuTcRequestAct, verifyTcRequestOtpAct } from '../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { shallowEqual } from 'react-redux';
import { maskEmail, maskPhone } from './helper';

const initialValues: any = {
    otpValue1: "",
    otpValue2: "",
    otpValue3: "",
    otpValue4: "",
};

const validationSchema = Yup.object().shape({
    otpValue1: Yup.string().required("*"),
    otpValue2: Yup.string().required("*"),
    otpValue3: Yup.string().required("*"),
    otpValue4: Yup.string().required("*"),
});

const VerifyOtpModal = (props: any) => {

    const { modalData, filterValues, setOtpValue } = props || {}
    const { emailId, mobileNo } = modalData || {}
    const dispatch = useAppDispatch()
    const [expiryTimerState, setExpiryTimerState] = useState<boolean>(true);
    const [resendTimerState, setResendTimerState] = useState<boolean>(true);

    const inputElementRef = useRef<any>({
        otpValue1: null,
        otpValue2: null,
        otpValue3: null,
        otpValue4: null,
    });

    const {
        validateStuTcRequestResp, showApiLoader, verifyTcRequestOtpError,
    } = useAppSelector(
        ({ applicationSale, globalData }) => ({
            validateStuTcRequestResp: applicationSale.validateStuTcRequestResp,
            verifyTcRequestOtpError: applicationSale.verifyTcRequestOtpError,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const tcTrackerRef = useRef({
        prevValidateStuTcRequestResp: validateStuTcRequestResp,
        prevVerifyTcRequestOtpError: verifyTcRequestOtpError
    });

    useEffect(() => {
        const { prevValidateStuTcRequestResp, prevVerifyTcRequestOtpError } = tcTrackerRef.current || {}

        if (validateStuTcRequestResp && prevValidateStuTcRequestResp !== validateStuTcRequestResp) {
            setExpiryTimerState(true);
            setResendTimerState(true);
        } else if (verifyTcRequestOtpError && prevVerifyTcRequestOtpError !== verifyTcRequestOtpError) {
            const { code, details } = verifyTcRequestOtpError || {}
            clearOtpInputs()
        }

        tcTrackerRef.current.prevValidateStuTcRequestResp = validateStuTcRequestResp;
        tcTrackerRef.current.prevVerifyTcRequestOtpError = verifyTcRequestOtpError

    }, [validateStuTcRequestResp, verifyTcRequestOtpError])

    const validateOtpForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { otpId, requestId } = validateStuTcRequestResp || {}
            const otpValue = Object.values(values).join("");
            setOtpValue(otpValue)
            const payload = {
                otpId, requestId, otp: otpValue
            }
            dispatch(verifyTcRequestOtpAct(generateActionPayload("verify_tc_request_otp", undefined, payload)));
        },
    });

    const clearOtpInputs = () => {
        const keys = ["otpValue1", "otpValue2", "otpValue3", "otpValue4"];
        keys.forEach((key, index) => {
            const el = inputElementRef.current[key];
            if (el && typeof el.value !== "undefined") {
                el.value = "";
            }
        });

        inputElementRef.current.otpValue1?.focus();
    };

    function onKeyDownHndlr(event: React.KeyboardEvent<HTMLInputElement>) {
        const { target, currentTarget, ctrlKey, key } = event,
            { name, value } = (target as HTMLInputElement) || {},
            nextElemId = currentTarget.getAttribute("data-nextelem"),
            prevElemId = currentTarget.getAttribute("data-prevelem");
        if (!isNaN(Number(key))) {
            validateOtpForm.setValues((prevValues: any) => ({
                ...prevValues,
                [name]: key,
            }));
            if (value !== key) {
                inputElementRef.current[name].value = key;
            }
            if (nextElemId) {
                setTimeout(() => {
                    inputElementRef.current[nextElemId].focus();
                }, 0);
            }
        } else if (key === "Backspace") {
            if (prevElemId && !value) {
                setTimeout(() => {
                    inputElementRef.current[prevElemId].focus();
                }, 0);
            } else if (value && prevElemId) {
                validateOtpForm.setValues((prevValues: any) => ({
                    ...prevValues,
                    [name]: "",
                }));
                setTimeout(() => {
                    inputElementRef.current[prevElemId].focus();
                }, 0);
            } else if (value) {
                validateOtpForm.setValues((prevValues: any) => ({
                    ...prevValues,
                    [name]: "",
                }));
            }
        } else if (!((ctrlKey && key === "v") || key === "Tab")) {
            event.preventDefault();
        }
    }

    function onPasteHndlr(event: React.ClipboardEvent<HTMLInputElement>) {
        const pastedValue = event.clipboardData.getData("Text"),
            getDigitInPasterValue = pastedValue.replace(/[^0-9]/g, ""),
            digitArray = getDigitInPasterValue && getDigitInPasterValue.split(""),
            updateFormInfo: any = {};
        if (digitArray.length > 0) {
            Object.keys(inputElementRef.current).forEach((item, index) => {
                inputElementRef.current[item].value = digitArray[index] || "";
                updateFormInfo[item] = digitArray[index] || "";
            });
            validateOtpForm.setValues((prevValues: any) => ({
                ...prevValues,
                ...updateFormInfo,
            }));
        }
        event.preventDefault();
    }

    const stopExpiryTimerHndlr = useCallback(() => {
        setExpiryTimerState(false);
    }, []);

    const stopResendTimerHndlr = useCallback(() => {
        setResendTimerState(false);
    }, []);

    const resendBtnHndlr = () => {
        setExpiryTimerState(false);
        clearOtpInputs()
        dispatch(validateStuTcRequestAct(generateActionPayload("validate_student_tc_request", undefined, filterValues)));
    }

    return (
        <form onSubmit={validateOtpForm.handleSubmit} className='tw-grid tw-grid-cols-12 tw-p-4'>
            <div className='tw-col-span-12 tw-text-lg tw-font-bold'>
                Check Your Phone
            </div>
            <div className='tw-col-span-12 tw-text-sm tw-mt-2'>
                Please Enter OTP recieved on your {maskPhone(mobileNo)} & {maskEmail(emailId)}.
            </div>
            <div className='tw-col-span-12 tw-mt-4 tw-text-sm'>
                Enter The Otp <span className='tw-text-red-500'>*</span>
            </div>
            <div className='tw-col-span-12'>
                <div className="tw-my-4 tw-flex tw-justify-center tw-gap-3">
                    <input
                        type="text"
                        ref={(el) => (inputElementRef.current.otpValue1 = el)}
                        onKeyDown={onKeyDownHndlr}
                        // onChange={onChangeOtpHndlr}
                        // value={validateOtpForm.values.otpValue1}
                        autoFocus
                        data-nextelem="otpValue2"
                        onPaste={onPasteHndlr}
                        data-prevelem=""
                        // className="form-control form-control bg-light border-light text-center"
                        className={classnames(
                            "form-control form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input ",
                            validateOtpForm.touched.otpValue1 &&
                                validateOtpForm.errors.otpValue1
                                ? "is-invalid"
                                : "tw-border-[#9E9E9E]"
                        )}
                        maxLength={1}
                        name="otpValue1"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        ref={(el) => (inputElementRef.current.otpValue2 = el)}
                        // value={validateOtpForm.values.otpValue2}
                        onKeyDown={onKeyDownHndlr}
                        // onChange={onChangeOtpHndlr}
                        data-nextelem="otpValue3"
                        data-prevelem="otpValue1"
                        className={classnames(
                            "form-control form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input ",
                            validateOtpForm.touched.otpValue2 &&
                                validateOtpForm.errors.otpValue2
                                ? "is-invalid"
                                : "tw-border-[#9E9E9E]"
                        )}
                        maxLength={1}
                        name="otpValue2"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        ref={(el) => (inputElementRef.current.otpValue3 = el)}
                        // value={validateOtpForm.values.otpValue3}
                        onKeyDown={onKeyDownHndlr}
                        // onChange={onChangeOtpHndlr}
                        data-nextelem="otpValue4"
                        data-prevelem="otpValue2"
                        className={classnames(
                            "form-control form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input ",
                            validateOtpForm.touched.otpValue3 &&
                                validateOtpForm.errors.otpValue3
                                ? "is-invalid"
                                : "tw-border-[#9E9E9E]"
                        )}
                        maxLength={1}
                        name="otpValue3"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        ref={(el) => (inputElementRef.current.otpValue4 = el)}
                        // value={validateOtpForm.values.otpValue4}
                        onKeyDown={onKeyDownHndlr}
                        // onChange={onChangeOtpHndlr}
                        data-nextelem=""
                        data-prevelem="otpValue3"
                        className={classnames(
                            "form-control form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input ",
                            validateOtpForm.touched.otpValue4 &&
                                validateOtpForm.errors.otpValue4
                                ? "is-invalid"
                                : "tw-border-[#9E9E9E]"
                        )}
                        maxLength={1}
                        name="otpValue4"
                        autoComplete="off"
                    />
                </div>
            </div>
            <div className='tw-col-span-12 tw-flex tw-items-center'>
                <span className='tw-text-sm'>OTP Expires in</span> &nbsp;
                <span>
                    <IntervalTimer
                        startTimer={expiryTimerState}
                        stopTimerHndlr={stopExpiryTimerHndlr}
                        initialMinute="10"
                        initialSeconds="00"
                        timerContainerClass="tw-text-sm"
                    /></span>
            </div>
            <div className='tw-col-span-12 tw-mt-4 tw-flex tw-items-center'>
                <span className='tw-text-sm'><span
                    onClick={resendBtnHndlr}
                    className={classnames(
                        "tw-font-semibold tw-underline",
                        resendTimerState ? "tw-text-gray-400 tw-pointer-events-none" : "tw-text-cyan-500 tw-cursor-pointer"
                    )}
                >
                    Resend OTP
                </span> ( Available in </span> &nbsp;
                <span>
                    <IntervalTimer
                        startTimer={resendTimerState}
                        stopTimerHndlr={stopResendTimerHndlr}
                        initialMinute="01"
                        initialSeconds="00"
                        timerContainerClass="tw-text-sm"
                    /></span> &nbsp;<span className='tw-text-sm'>)</span>
            </div>
            <div className='tw-col-span-12 tw-mt-4 tw-text-sm'>
                <span className="tw-font-bold">Note :</span><span className='tw-text-gray-500'> You can go back and update your details if required.</span>
            </div>
            <div className="tw-col-span-12 tw-flex tw-justify-end tw-mt-6">
                <div className="tw-flex tw-gap-2 tw-w-full tw-ml-auto">
                    <Button
                        variant="wrong"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default VerifyOtpModal
