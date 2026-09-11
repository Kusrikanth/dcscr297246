import React, { useState, useEffect, useRef } from 'react';
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Alert } from "reactstrap";
import { Link, useHistory } from 'react-router-dom';
import { Card, Col, Container, Row, Button } from 'reactstrap';
import { AuthCarousel, AuthFooter, TextIconInput } from "../../Components/Common";
import classnames from "classnames";
//Images
import EmailIcon from "../../assets/imagesdps/authicon/email_icon.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { forgotPasswordAct } from "../../store/login/loginaction";

//Types
import { IForgotPwdForm } from "./forgotpasswordtypes";

const initialValues: IForgotPwdForm = {
    email: ""
};

const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required.")
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
            toast.success("Password successfully send to your register email id.");
            history.push('/validate-otp');
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            toast.error("Somethin went wrong");
        }
    }, [forgotPasswordResp, loginErrorResp]);

    const forgotPwdForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { ...values };
            dispatch(forgotPasswordAct(generateActionPayload("forgot_password", undefined, payload)));
        },
    });



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
                                                <div>
                                                    <h5 className="tw-text-[#405189]">Forgot Password?</h5>
                                                    <p className="tw-text-gray-600">Reset password with Delhi Public School.</p>
                                                </div>
                                                <div className="tw-text-center">
                                                    <img style={{ height: "120px" }} src={EmailIcon} alt="email-icon" className="img-fluid" />
                                                    <div className="alert alert-warning alert-borderless alert-warning tw-text-center tw-mb-3">
                                                        Enter your email and instructions will be sent to you!
                                                    </div>
                                                </div>

                                                <form onSubmit={forgotPwdForm.handleSubmit}>
                                                    <TextIconInput
                                                        iconPositionClassName="right"
                                                        labelText="Email"
                                                        name="email"
                                                        placeHolder="Enter email"
                                                        onChange={forgotPwdForm.handleChange}
                                                        value={forgotPwdForm.values.email || ""}
                                                        invalid={(forgotPwdForm.touched.email && forgotPwdForm.errors.email) ? true : false}
                                                        error={(forgotPwdForm.touched.email && forgotPwdForm.errors.email) ? forgotPwdForm.errors.email : ""}
                                                    >
                                                        <i className={"align-middle tw-text-gray-600 ri-mail-unread-line"}></i>
                                                    </TextIconInput>
                                                    <div className="tw-mt-4">
                                                        <Button color="success" className="tw-w-full" type="submit">Send Reset Link</Button>
                                                    </div>

                                                </form>


                                                <div className="tw-mt-5 tw-text-center">
                                                    <p className="tw-mb-0">Wait, I remember my password... <Link to="/login" className="fw-semibold tw-text-[#405189] tw-underline"> Click here</Link> </p>
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

export default ForgotPassword;