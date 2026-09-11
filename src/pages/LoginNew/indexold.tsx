import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Link, useHistory } from 'react-router-dom';
import classnames from "classnames";
import { TextIconInput } from "../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { userDetailsAct } from "../../store/actions";
import { loginUserAct } from "../../store/login/loginaction";
import { setAuthenticatedUserAct } from "../../store/appdata/appdataslice";

//Types
import { ILoginFormOld } from "./logintypes";
//Utility
import { setLocalStorage } from "../../utility/storageUtility";
import { accessTokenKey } from "../../Components/constants/storageconstants";


const initialValues: ILoginFormOld = {
    mobileNumber: undefined,
    password: undefined
};

const validationSchema = Yup.object().shape({
    mobileNumber: Yup.string().required("User name required."),
    password: Yup.string().required("Password is required.")
});

const Login: React.FC<any> = (props: any) => {
    const [loginState, setLoginState] = useState<ILoginFormOld>({ mobileNumber: "", password: "" });
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
            const { role, accessToken } = loginUserResp,
                { token } = accessToken || {};
            if (token) {
                setLocalStorage(accessTokenKey, token);
            }
            if (Array.isArray(role) && role[0]) {
                const rolesDetails = [...role],
                    indexOfStaffRole = role.indexOf("default-roles-staff");
                rolesDetails.splice(indexOfStaffRole, 1);
                redirectSetupHndlr(rolesDetails[0]);
            } else {
                redirectSetupHndlr();
            }
            dispatch(setAuthenticatedUserAct(true));
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            const { details } = loginErrorResp;
            toast.error(details || "Something went wrong.");
        }
    }, [loginUserResp, loginErrorResp]);
    function redirectSetupHndlr(userRole?: string) {
        const { mobileNumber } = loginForm.values;
        let role = "", redirectUrl = "";
        if (mobileNumber === "admin" || userRole === "dc-admin") {
            role = "SUPER_ADMIN";
            redirectUrl = "/institute-list";
        } else if (mobileNumber === "branch" || userRole === "branch-admin") {
            role = "BRANCH_ADMIN";
            redirectUrl = "/branch-dashboard";
        } else {
            role = "INSTITUTE_ADMIN";
            redirectUrl = "/dashboard";
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
            dispatch(loginUserAct(generateActionPayload("login_user", undefined, values, { tokenNotRequired: true })));
            // redirectSetupHndlr();
        },
    });

    function showPasswordHndlr() {
        setShowPasswordState(!showPasswordState);
    }
    return (
        <div className="col-12 d-flex justify-content-center align-items-center pb-3">
            <div className="login-container">
                {/* <div ref={headerContainer} className="pt-3 pb-2 header-container overflow-hidden">
                <div className="text-center" style={{ zIndex: 1 }}>
                    <h3 className="mb-0 text-white">SMART ERP</h3>
                    <span className="text-white fs-5">dn</span>
                </div>

                <div className="circle-div" style={dynamicCircleStyle}>

                </div>
            </div> */}
                <div className="header-new-container">
                    {/* <img src={HeaderBgSvg} className="position-absolute top-0 left-0" /> */}

                    <div className="text-center" style={{ zIndex: 1 }}>
                        <h3 className="mb-0 text-white">SMART ERP</h3>
                        <span className="text-white fs-5">Excellence In Education</span>
                    </div>
                </div>
                <div className="px-3 pt-5 pb-4">
                    <form onSubmit={loginForm.handleSubmit}>
                        <TextIconInput
                            formgroupClassName="mb-4"
                            name="mobileNumber"
                            // value={filterState.curriculumName}
                            placeHolder="User Name"
                            value={loginForm.values.mobileNumber}
                            onChange={loginForm.handleChange}
                            invalid={(loginForm.touched.mobileNumber && loginForm.errors.mobileNumber) ? true : false}
                            error={(loginForm.touched.mobileNumber && loginForm.errors.mobileNumber) ? loginForm.errors.mobileNumber : ""}

                        // onChange={onChangeFilterHndlr}
                        ><i className="icon-green ri-user-fill"></i></TextIconInput>
                        <div className="position-relative mb-4">
                            <TextIconInput
                                // formgroupClassName="search-box"
                                name="password"
                                inputType={showPasswordState ? "text" : "password"}
                                // value={filterState.curriculumName}
                                placeHolder="Password"
                                value={loginForm.values.password}
                                onChange={loginForm.handleChange}
                                invalid={(loginForm.touched.password && loginForm.errors.password) ? true : false}
                                error={(loginForm.touched.password && loginForm.errors.password) ? loginForm.errors.password : ""}
                            ><i className="icon-green  ri-lock-fill"></i></TextIconInput>
                            <button onClick={showPasswordHndlr} className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon">
                                <i className={classnames("align-middle", {
                                    "ri-eye-fill": showPasswordState,
                                    "ri-eye-off-fill": !showPasswordState
                                })}></i>
                            </button>
                            <Link to="/forgotpassword"
                                className={classnames("position-absolute end-0 text-muted", (loginForm.touched.password && loginForm.errors.password) ? "forgotpassword-pos-2" : "forgotpassword-pos-1")}
                            >Forgot password?</Link>
                        </div>
                        {!(loginForm.touched.password && loginForm.errors.password) && <div className="d-inline-block mt-2"></div>}
                        <div className="text-center mb-3">
                            <button type="submit" className="btn w-lg btn-success btn-bg-green align-center px-3">Sign In</button>
                        </div>
                    </form>
                    <div className="text-center text-muted fs-7">
                        By Logging in, you agree to Digital Caampus <span className="text-info">Conditions of Use</span> and <span className="text-info">Privacy Policy</span>.
                    </div>

                </div>
            </div >
        </div >
    )
}

export default Login;