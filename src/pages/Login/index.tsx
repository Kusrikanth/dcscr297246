import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Link, useHistory } from 'react-router-dom';
import { Card, Col, Container, Input, Label, Row, Button, FormFeedback } from 'reactstrap';
import { AuthCarousel, AuthFooter } from "../../Components/Common";
import classnames from "classnames";
import { TextInput } from "../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { userDetailsAct } from "../../store/actions";
import { loginUserAct } from "../../store/login/loginaction";
//Types
import { ILoginForm } from "./logintypes";

const initialValues: ILoginForm = {
    mobileNumber: undefined,
    password: undefined
};

const validationSchema = Yup.object().shape({
    mobileNumber: Yup.string().required("User name required."),
    password: Yup.string().required("Password is required.")
});

const Login: React.FC<any> = () => {
    const [loginState, setLoginState] = useState<ILoginForm>({ mobileNumber: "", password: "" });
    const [showPasswordState, setShowPasswordState] = useState<boolean>(false);
    const history = useHistory();
    // const dispatch = useDispatch();
    const dispatch = useAppDispatch();
    const { loginUserResp, loginErrorResp } = useAppSelector(({ login }) => ({
        loginUserResp: login.loginUserResp,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);

    const loginRespRef = useRef<any>({
        prevLoginUserResp: loginUserResp,
        prevLoginErrorResp: loginErrorResp
    })

    useEffect(() => {
        const { prevLoginUserResp, prevLoginErrorResp } = loginRespRef.current || {};
        if (loginUserResp && loginUserResp !== prevLoginUserResp) {
            // redirectSetupHndlr();
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            toast.error("Somethin went wrong");
        }
        loginRespRef.current.prevLoginUserResp = loginUserResp;
        loginRespRef.current.prevLoginErrorResp = loginErrorResp;
    }, [loginUserResp, loginErrorResp]);
    function redirectSetupHndlr() {
        const { mobileNumber } = loginForm.values;
        let role = "", redirectUrl = "";
        if (mobileNumber === "admin") {
            role = "SUPER_ADMIN";
            redirectUrl = "/institute-list";
        } else if (mobileNumber === "branch") {
            role = "BRANCH_ADMIN";
            redirectUrl = "/classroom-management";
        } else {
            role = "INSTITUTE_ADMIN";
            redirectUrl = "/master-setup";
        }
        dispatch(userDetailsAct({ ...loginForm.values, role }));
        history.push(redirectUrl);
    }
    function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.currentTarget;
        setLoginState(prevState => ({ ...prevState, [name]: value }))
    }

    const loginForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            // dispatch(loginUserAct(generateActionPayload("login_user", undefined, values)));
            redirectSetupHndlr();
        },
    });

    function showPasswordHndlr() {
        setShowPasswordState(!showPasswordState);
    }
    return (
        <React.Fragment>
            <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="bg-overlay"></div>

                <div className="auth-page-content overflow-hidden pt-lg-5">
                    <Container>
                        <div className="row">
                            <Col lg={12}>
                                <Card className="overflow-hidden">
                                    <Row className="g-0">
                                        <Col lg={6}>
                                            <div className="p-lg-5 p-4">
                                                <div>
                                                    <h5 className="text-primary">Welcome Back !</h5>
                                                    {/* <p className="text-muted">Sign in to continue to Velzon.</p> */}
                                                </div>
                                                <div className="mt-5">
                                                    <form onSubmit={loginForm.handleSubmit}>
                                                        <TextInput
                                                            name="mobileNumber"
                                                            labelText="Username"
                                                            value={loginForm.values.mobileNumber}
                                                            placeHolder="Enter username"
                                                            onChange={loginForm.handleChange}
                                                            invalid={(loginForm.touched.mobileNumber && loginForm.errors.mobileNumber) ? true : false}
                                                            error={(loginForm.touched.mobileNumber && loginForm.errors.mobileNumber) ? loginForm.errors.mobileNumber : ""}
                                                        />
                                                        <div className="mb-3">
                                                            <div className="float-end">
                                                                <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                                                            </div>
                                                            <Label className="form-label" htmlFor="password-input">Password</Label>
                                                            <div className="position-relative">
                                                                <Input type={showPasswordState ? "text" : "password"}
                                                                    className="form-control pe-5"
                                                                    placeholder="Enter password"
                                                                    name="password"
                                                                    onChange={loginForm.handleChange}
                                                                    value={loginForm.values.password || ""}
                                                                    invalid={(loginForm.touched.password && loginForm.errors.password) ? true : false}
                                                                />
                                                                {(loginForm.touched.password && loginForm.errors.password) && <FormFeedback type="invalid">
                                                                    {loginForm.errors.password}
                                                                </FormFeedback>}
                                                                <button onClick={showPasswordHndlr} className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon">
                                                                    <i className={classnames("align-middle", {
                                                                        "ri-eye-fill": showPasswordState,
                                                                        "ri-eye-off-fill": !showPasswordState
                                                                    })}></i>
                                                                </button>

                                                            </div>
                                                        </div>

                                                        <div className="form-check">
                                                            <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                            <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                        </div>

                                                        <div className="mt-5">
                                                            <Button color="success" className="w-100" type="submit">Sign In</Button>
                                                        </div>

                                                    </form>
                                                </div>

                                                <div className="mt-5 text-center">
                                                    <p className="mb-0">Don't have an account ? <a href="/#" className="fw-semibold text-primary text-decoration-underline"> Signup</a> </p>
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

export default Login;