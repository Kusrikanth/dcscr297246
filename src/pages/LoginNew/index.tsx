import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Link, useHistory, useLocation } from 'react-router-dom';
import classnames from "classnames";
import { TextIconInput } from "../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { userDetailsAct } from "../../store/actions";
import { loginUserAct, getUserMeAct } from "../../store/login/loginaction";
import { setAuthenticatedUserAct, setCurrentBranchIdAct, setCurrentInstIdAct, setLoggedinUserRoleAct } from "../../store/appdata/appdataslice";

//Types
import { ILoginForm } from "./logintypes";
//Utility
import { setLocalStorage } from "../../utility/storageUtility";
import { getBrowserName } from "../../utility/commonutility";
import { getLoggedInUserRegistrationInfoAct } from "../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";

import { accessTokenKey, instituteIdKey } from "../../Components/constants/storageconstants";


//GET DATA
import { getData } from "../../api/apiactions";

const initialValues: ILoginForm = {
    username: "",
    password: ""
};

const validationSchema = Yup.object().shape({
    username: Yup.string().required("User name required."),
    password: Yup.string().required("Password is required.")
});


const Login: React.FC<any> = (props: any) => {
    const [loginState, setLoginState] = useState<ILoginForm>({ username: "", password: "" });
    const [showPasswordState, setShowPasswordState] = useState<boolean>(false);
    const [clientDetailsState, setClientDetailsState] = useState({
        agentName: "",
        ipAddress: ""
    })
    const history = useHistory();
    // const dispatch = useDispatch();
    const location = useLocation<any>();
    const dispatch = useAppDispatch();
    const { showApiLoader, loggedInUserRegistrationInfoResp, loginUserResp, userMeResp,
        admissionRegistrationErrorResp,
        loginErrorResp } =
        useAppSelector(({ globalData, admissionRegistration, login }) => ({
            showApiLoader: globalData.showApiLoader,
            loggedInUserRegistrationInfoResp: admissionRegistration.loggedInUserRegistrationInfoResp,
            loginUserResp: login.loginUserResp,
            userMeResp: login.userMeResp,
            admissionRegistrationErrorResp: admissionRegistration.admissionRegistrationErrorResp,
            loginErrorResp: login.loginErrorResp
        }), shallowEqual);

    const loginRespRef = useRef<any>({
        prevLoginUserResp: loginUserResp,
        prevUserMeResp: userMeResp,
        prevLoggedInUserRegistrationInfoResp: loggedInUserRegistrationInfoResp,
        prevAdmissionRegistrationErrorResp: admissionRegistrationErrorResp,
        prevLoginErrorResp: loginErrorResp
    })

    useEffect(() => {
        const { prevLoginUserResp, prevUserMeResp,
            prevLoggedInUserRegistrationInfoResp,
            prevAdmissionRegistrationErrorResp,
            prevLoginErrorResp } = loginRespRef.current || {};
        if (loginUserResp && loginUserResp !== prevLoginUserResp) {
            const { token } = loginUserResp;
            setLocalStorage(accessTokenKey, token);
            dispatch(getUserMeAct(generateActionPayload("get_user_me")));
        } else if (loggedInUserRegistrationInfoResp && loggedInUserRegistrationInfoResp !== prevLoggedInUserRegistrationInfoResp) {
            const { academicYearId, admissionProcess, branchId, curriculumId, branchEmail, schoolName, instituteId, registrationNo, profileStatus, completionStatus, registrationId } = loggedInUserRegistrationInfoResp;
            if (completionStatus?.toString().toLowerCase() === "complete" && admissionProcess !== "DOCUMENTS RESUBMISSION") {
                history.push(`/thank-you-page`, {
                    registrationId,
                    registrationNo,
                    branchEmail,
                    schoolName
                });
            } else {
                history.push(`/registration-note?curriculum=${curriculumId}&branchId=${branchId}&academicYearId=${academicYearId}&instituteId=${instituteId}`);
            }
        } else if (userMeResp && prevUserMeResp !== userMeResp) {
            const { branchId, instituteId, role, username } = userMeResp;
            const { name } = role || {};
            if (instituteId) {
                dispatch(setCurrentInstIdAct(instituteId));
                setLocalStorage(instituteIdKey, instituteId);
            }
            if (branchId) {
                dispatch(setCurrentBranchIdAct(branchId));
            }
            if (name) {
                redirectSetupHndlr(name, username);
            } else {
                toast.error("No role assigned to this user.");
            }
            dispatch(setAuthenticatedUserAct(true));
        }
        else if (admissionRegistrationErrorResp && admissionRegistrationErrorResp !== prevAdmissionRegistrationErrorResp) {
            const { details, message, code } = admissionRegistrationErrorResp;
            if (code === 410) {
                toast.error('Your registration link has expired please connect with admin.');
            } else {
                toast.error(message || "Something went wrong.");
            }
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            const { message } = loginErrorResp;
            toast.error(message || "Something went wrong.");
        }
        loginRespRef.current.prevLoginUserResp = loginUserResp;
        loginRespRef.current.prevLoggedInUserRegistrationInfoResp = loggedInUserRegistrationInfoResp;
        loginRespRef.current.prevUserMeResp = userMeResp;
        loginRespRef.current.prevAdmissionRegistrationErrorResp = admissionRegistrationErrorResp;
        loginRespRef.current.prevLoginErrorResp = loginErrorResp;
    }, [loginUserResp, loggedInUserRegistrationInfoResp, userMeResp,
        admissionRegistrationErrorResp, loginErrorResp]);

    async function getClientDetails() {
        // Connect ipapi.co with fetch()
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json();
        // Set the IP address to the constant `ip`
        const { ip } = data || {};
        if (ip) {
            setClientDetailsState((prevState) => ({ ...prevState, ipAddress: ip }))
        }
    }

    useEffect(() => {
        const browserName = getBrowserName();
        setClientDetailsState((prevState) => ({ ...prevState, agentName: browserName }))
        getClientDetails();
    }, [])
    function redirectSetupHndlr(userRole?: string, userName?: string) {
        let role = "", redirectUrl = "";
        if (userRole === "GUEST") {
            role = "GUEST";
            const payload = { userName };
            dispatch(setLoggedinUserRoleAct(role));
            dispatch(getLoggedInUserRegistrationInfoAct(generateActionPayload("registrationinfo_byusername", payload)));
            return;
        }
        switch (userRole) {
            case "Platform_Admin": {
                role = "SUPER_ADMIN";
                redirectUrl = "/institute-list";
                break;
            }
            case "Branch_Admin": {
                role = "BRANCH_ADMIN";
                redirectUrl = "/branch-dashboard";
                break;
            }
            case "Institute_Admin": {
                role = "INSTITUTE_ADMIN";
                redirectUrl = "/dashboard";
                break;
            }
            case "Student": {
                role = "STUDENT_ROLE";
                redirectUrl = "/student-dashboard";
                break;
            }
            case "PARENT": {
                role = "PARENT_ROLE";
                redirectUrl = "/student-profile-details";
                break;
            }
            case "ADM_CONS": {
                role = "ADM_CONS";
                redirectUrl = "/admission-dashboard";
                break;
            } case "ADM_HEAD": {
                role = "ADM_HEAD";
                redirectUrl = "/admission-dashboard";
                break;
            } case "TEACHER": {
                role = "TEACHER";
                redirectUrl = "/section-management";
                break;
            }
            case "TRANSPORT_HEAD": {
                role = "TRANSPORT_HEAD";
                redirectUrl = "/transportation-dashboard";
                break;
            }
            case "ACCOUNT_HEAD": {
                role = "ACCOUNT_HEAD";
                redirectUrl = "/student-management";
                break;
            }
            case "ACCOUNT": {
                role = "ACCOUNT";
                redirectUrl = "/fee-dashboard";
                break;
            }
            case "TRANSPORT": {
                role = "TRANSPORT";
                redirectUrl = "/transportation-dashboard";
                break;
            }
            case "PRINCIPAL": {
                role = "PRINCIPAL";
                redirectUrl = "/section-management";
                break;
            }
            case "VICE_PRINCIPAL": {
                role = "VICE_PRINCIPAL";
                redirectUrl = "/section-management";
                break;
            }
            case "PA": {
                role = "PA";
                redirectUrl = "/section-management";
                break;
            }
            case "HR": {
                role = "HR";
                redirectUrl = "/student-management";
                break;
            }
            case "HR_HEAD": {
                role = "HR_HEAD";
                redirectUrl = "/student-management";
                break;
            }
            case "GRIEVANCE": {
                role = "GRIEVANCE";
                redirectUrl = "/student-management";
                break;
            }
            case "EMPLOYEE": {
                role = "EMPLOYEE";
                redirectUrl = "/my-concerns-feedback";
                break;
            }
            case "HOSTEL": {
                role = "HOSTEL";
                redirectUrl = "/hostel-admissions";
                break;
            }
            case "MEDICAL": {
                role = "MEDICAL";
                redirectUrl = "/health-records";
                break;
            }
            case "LIBRARY": {
                role = "LIBRARY";
                redirectUrl = "/library-book-collection";
                break;
            }
            case "Access_Admin": {
                role = "ACCESS_ADMIN";
                redirectUrl = "/roletype-management";
                break;
            }
            default: {
                //
            }
        }
        // if (location?.state?.from) {
        //     redirectUrl = location?.state?.from;
        // }
        if (role && redirectUrl) {
            dispatch(userDetailsAct({ ...loginForm.values, role }));
            dispatch(setLoggedinUserRoleAct(role));
            history.push(redirectUrl);
        } else {
            toast.error(`Please provide privileges to this role: ${userRole}.`);
        }

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
            if (import.meta.env.VITE_AUTH_VERSION === 'v2') {
                const formData = new FormData();
                formData.append("userName", values.username || '');
                formData.append("userPwd", values.password || '');
                dispatch(loginUserAct(generateActionPayload("login_user_v2", undefined, formData, { tokenNotRequired: true })));
                return;
            }
            const params = { instituteId: "" };
            const payload = { ...values, activity: clientDetailsState };
            dispatch(loginUserAct(generateActionPayload("login_user", params, payload, { tokenNotRequired: true })));
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
                            name="username"
                            // value={filterState.curriculumName}
                            placeHolder="User Name"
                            maxLength={200}
                            value={loginForm.values.username}
                            onChange={loginForm.handleChange}
                            invalid={(loginForm.touched.username && loginForm.errors.username) ? true : false}
                            error={(loginForm.touched.username && loginForm.errors.username) ? loginForm.errors.username : ""}

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
                            <Link to="/forgotpasswordv1"
                                className={classnames("position-absolute end-0 text-muted", (loginForm.touched.password && loginForm.errors.password) ? "forgotpassword-pos-2" : "forgotpassword-pos-1")}
                            >Forgot password?</Link>
                        </div>
                        {!(loginForm.touched.password && loginForm.errors.password) && <div className="d-inline-block mt-2"></div>}
                        <div className="text-center mb-3">
                            <button
                                disabled={showApiLoader}
                                type="submit" className="btn w-lg btn-success btn-bg-green align-center px-3">Sign In</button>
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