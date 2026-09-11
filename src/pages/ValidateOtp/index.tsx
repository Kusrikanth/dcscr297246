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
import { validateOtpAct } from "../../store/login/loginaction";

//Types

const initialValues: any = {
    otpValue1: "",
    otpValue2: "",
    otpValue3: "",
    otpValue4: "",
    otpValue5: "",
    otpValue6: ""
};

const validationSchema = Yup.object().shape({
    otpValue1: Yup.string().required("*"),
    otpValue2: Yup.string().required("*"),
    otpValue3: Yup.string().required("*"),
    otpValue4: Yup.string().required("*"),
    otpValue5: Yup.string().required("*"),
    otpValue6: Yup.string().required("*"),
});

const ValidateOtp: React.FC<any> = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [startTimerState, setStartTimer] = useState(false);
    const { validateOtpResp, forgotPasswordResp, loginErrorResp } = useAppSelector(({ login }) => ({
        validateOtpResp: login.validateOtpResp,
        forgotPasswordResp: login.forgotPasswordResp,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);

    useEffect(() => {
        // if (!forgotPasswordResp) {
        //     history.push('/forgot-password');
        // } else {
            setStartTimer(true);
        // }
    }, []);
    const validateOtpRespRef = useRef<any>({
        prevValidateOtpResp: validateOtpResp,
        prevLoginErrorResp: loginErrorResp
    })

    useEffect(() => {
        const { prevValidateOtpResp, prevForgotPasswordResp, prevLoginErrorResp } = validateOtpRespRef.current || {};
        if (validateOtpResp && validateOtpResp !== prevValidateOtpResp) {
            const { isOtpValid } = validateOtpResp;
            if (isOtpValid === "invalid") {
                toast.error("Invalid otp.");
            }
            else {
                toast.success("Successfully validated your otp.");
                history.push("/reset-password");
            }
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            toast.error("Somethin went wrong");
        }
        validateOtpRespRef.current.prevValidateOtpResp = validateOtpResp;
        validateOtpRespRef.current.prevLoginErrorResp = loginErrorResp;
    }, [validateOtpResp, loginErrorResp]);

    const validateOtpForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const otpValue = Object.values(values).join(''),
                payload = {
                    otpId: 8,
                    otp: "712325",
                    rText: "OlC/nAhdv0jHPVlbGmwVxw=="
                }
            dispatch(validateOtpAct(generateActionPayload("validate_otp", undefined, payload)));
        },
    });

    function onChangeOtpHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        validateOtpForm.setValues((prevValues: any) => ({ ...prevValues, [name]: value }));
    }

    const stopTimerHndlr = useCallback(() => {
        setStartTimer(false);
    }, []);

        return (
            <React.Fragment>
                <div className="auth-page-wrapper auth-bg-cover tw-py-5 tw-flex tw-justify-center tw-items-center tw-min-h-screen">
                    <div className="bg-overlay"></div>

                    <div className="auth-page-content overflow-hidden lg:tw-pt-5">
                        <Container>
                            <div className="row">
                                <Col lg={12}>
                                    <Card className="overflow-hidden">
                                        <Row className="tw-gap-0">
                                            <Col lg={6}>
                                                <div className="lg:tw-p-5 tw-p-4">
                                                    <div className="tw-mb-4">
                                                        <div className="avatar-lg tw-mx-auto">
                                                            <div className="avatar-title bg-light !tw-text-[#405189] display-5 rounded-circle">
                                                                <i className="ri-mail-line"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="tw-text-gray-500 tw-text-center lg:tw-mx-3">
                                                        <h4>Verify Your Email</h4>
                                                        <p>Please enter the 4 digit code sent to <span className="tw-font-semibold">example@abc.com</span></p>
                                                    </div>

                                                    <div className="tw-mt-4">
                                                        <form onSubmit={validateOtpForm.handleSubmit}>
                                                            <Row>
                                                                <Col className="col">
                                                                    <div className="tw-mb-3">
                                                                        <input type="text"
                                                                            className="tw-w-full tw-px-3 tw-py-2 tw-text-lg tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded tw-text-center tw-outline-none focus:tw-border-blue-400"
                                                                            maxLength={1}
                                                                            name="otpValue1"
                                                                            value={validateOtpForm.values.otpValue1}
                                                                            onChange={onChangeOtpHndlr}
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col className="col">
                                                                    <div className="tw-mb-3">
                                                                        <input type="text"
                                                                            className="tw-w-full tw-px-3 tw-py-2 tw-text-lg tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded tw-text-center tw-outline-none focus:tw-border-blue-400"
                                                                            maxLength={1}
                                                                            name="otpValue2"
                                                                            onChange={onChangeOtpHndlr}
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col className="col">
                                                                    <div className="tw-mb-3">
                                                                        <input type="text"
                                                                            className="tw-w-full tw-px-3 tw-py-2 tw-text-lg tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded tw-text-center tw-outline-none focus:tw-border-blue-400"
                                                                            maxLength={1}
                                                                            name="otpValue3"
                                                                            onChange={onChangeOtpHndlr}
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col className="col">
                                                                    <div className="tw-mb-3">
                                                                        <label htmlFor="digit4-input" className="tw-sr-only">Dight 4</label>
                                                                        <input type="text"
                                                                            className="tw-w-full tw-px-3 tw-py-2 tw-text-lg tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded tw-text-center tw-outline-none focus:tw-border-blue-400"
                                                                            maxLength={1}
                                                                            name="otpValue4"
                                                                            onChange={onChangeOtpHndlr}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col className="col">
                                                                    <div className="tw-mb-3">
                                                                        <label htmlFor="digit4-input" className="tw-sr-only">Dight 4</label>
                                                                        <input type="text"
                                                                            className="tw-w-full tw-px-3 tw-py-2 tw-text-lg tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded tw-text-center tw-outline-none focus:tw-border-blue-400"
                                                                            maxLength={1}
                                                                            name="otpValue5"
                                                                            onChange={onChangeOtpHndlr}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col className="col">
                                                                    <div className="tw-mb-3">
                                                                        <label htmlFor="digit4-input" className="tw-sr-only">Dight 4</label>
                                                                        <input type="text"
                                                                            className="tw-w-full tw-px-3 tw-py-2 tw-text-lg tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded tw-text-center tw-outline-none focus:tw-border-blue-400"
                                                                            maxLength={1}
                                                                            name="otpValue6"
                                                                            onChange={onChangeOtpHndlr}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>

                                                            <div className="tw-mt-3">
                                                                <Button color="success" variant='primary' type="submit" className='tw-w-full'
                                                                    disabled={!startTimerState}
                                                                >Confirm</Button>
                                                            </div>

                                                        </form>

                                                    </div>

                                                {/* <div>
                                                    <input type="button" value="Start Timer"
                                                        onClick={() => setStartTimer(prevState => !prevState)}
                                                    />
                                                </div> */}

                                                    <div className="tw-mt-3 tw-text-center">
                                                        <IntervalTimer
                                                            startTimer={startTimerState}
                                                            stopTimerHndlr={stopTimerHndlr}
                                                            initialMinute="02"
                                                            initialSeconds="00"
                                                        />
                                                    </div>

                                                    <div className="tw-mt-3 tw-text-center">
                                                        <p className="tw-mb-0">Didn't receive a code ? <Link to="/auth-pass-reset-cover"
                                                            className={classnames('tw-font-semibold tw-underline',
                                                                startTimerState ? "tw-text-gray-500 tw-pointer-events-none" : "tw-text-[#405189]")}>Resend</Link> </p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <AuthCarousel />


                                        </Row>
                                    </Card>
                                </Col>
                            </div>
                        </Container>
                    </div>

                    <AuthFooter />

                </div>
            </React.Fragment>
        );
    };

    export default ValidateOtp;