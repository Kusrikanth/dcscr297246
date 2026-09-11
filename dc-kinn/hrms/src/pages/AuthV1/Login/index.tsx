import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Link, useHistory, useLocation } from 'react-router-dom';
import classnames from "classnames";
import { ModalContainerUpdated, TextIconInput } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Actions
import { generateActionPayload } from "../../../utility/reduxutility";
import { userDetailsAct } from "../../../store/actions";
import { loginUserAct, getUserMeAct, forgotPasswordAct } from "../../../store/login/loginaction";
import { setAuthenticatedUserAct, setCurrentBranchIdAct, setCurrentInstIdAct, setLoggedinUserRoleAct, setCurrentInstCodeAct } from "../../../store/appdata/appdataslice";

//Types
import { ILoginForm } from "./logintypes";
//Utility
import { setLocalStorage } from "../../../utility/storageUtility";
import { getBrowserName } from "../../../utility/commonutility";
import { getRoleForUser } from "../helper";
import { getLoggedInUserRegistrationInfoAct } from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";

import { accessSessionKey, accessTokenKey, branchIdKey, instituteIdKey } from "../../../Components/constants/storageconstants";
import Email from "../../../assets/imagesdps/authiconV1/login-2.png";

//GET DATA
import { getData } from "../../../api/apiactions";
import { instituteCodeOptions, WHATSAPP_LINK } from '../../../Components/constants/common';
import FacingLoginIssue from '../FacingLoginIssue';

const initialValues: ILoginForm = {
    username: "",
    password: ""
};

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required("User name required.")
        .matches(/^\S*$/, "Username cannot contain spaces"),
    password: Yup.string().required("Password is required.")
});

const Login: React.FC<any> = (props: any) => {
    // const { updateGlobalPermission } = usePermissionContext();
    const [loginState, setLoginState] = useState<ILoginForm>({ username: "", password: "" });
    const [showPasswordState, setShowPasswordState] = useState<boolean>(false);
    const [clientDetailsState, setClientDetailsState] = useState({
        agentName: "",
        ipAddress: "",
        city: "",
        country: "",
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

    const loginRespRef = useRef({
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
            const { access, token, hasSuperAdminAccess } = loginUserResp;
            if (import.meta.env.VITE_AUTH_VERSION === 'v2') {
                let instituteId = undefined, branchId = undefined;
                if (hasSuperAdminAccess || (Array.isArray(access) && access.length)) {
                    if (hasSuperAdminAccess) {
                        dispatch(getUserMeAct(generateActionPayload("get_user_me_v2", undefined, undefined, {
                            tokenNotRequired: true,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })));
                    } else {
                        const { instituteId = '', hasInstituteLevelAccess = false, branchIds = [] } = access[0];
                        if (!hasInstituteLevelAccess) {
                            branchId = Array.isArray(branchIds) && branchIds.length ? branchIds[0] : '';
                        }
                        dispatch(getUserMeAct(generateActionPayload("get_user_me_v2", undefined, undefined, {
                            tokenNotRequired: true,
                            headers: {
                                Authorization: `Bearer ${token}`,
                                ...(instituteId ? { 'X-Institute-ID': instituteId } : {}),
                                ...(branchId ? { 'X-Branch-ID': branchId } : {}),
                            },
                        })));
                    }
                } else {
                    toast.error('No access is assigned for the user.');
                }
            } else {
                dispatch(getUserMeAct(generateActionPayload("get_user_me", undefined, undefined, {
                    tokenNotRequired: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })));
            }
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
            const { instituteId, branchId, userInfo, access } = userMeResp;
            const { hasSuperAdminAccess } = loginUserResp;
            const { roles } = userInfo || {};
            const { token } = loginUserResp;
            setLocalStorage(accessTokenKey, token);
            dispatch(setCurrentInstIdAct(instituteId));
            setLocalStorage(instituteIdKey, instituteId);
            if (branchId) {
                setLocalStorage(branchIdKey, branchId);
                dispatch(setCurrentBranchIdAct(branchId));
            }
            const instituteCode = instituteCodeOptions.find(item => item.id === +instituteId)?.code;
            dispatch(setCurrentInstCodeAct(instituteCode));

            dispatch(setAuthenticatedUserAct(true));

            //GUEST ROLE CODE
            const hasGuestAdmissionRole = Array.isArray(roles)
                && roles.some((roleItem: any) => roleItem?.roleType?.code === "GGTSUTSGET");

            if (hasGuestAdmissionRole) {
                const payload = { userName: userInfo?.loginId };
                dispatch(getLoggedInUserRegistrationInfoAct(generateActionPayload("registrationinfo_byusername", payload)));
            } else if (hasSuperAdminAccess) {
                history.push('/roletype-management');
            } else {
                const { role } = getRoleForUser(roles[0]?.description ? roles[0]?.description?.toUpperCase() : "");
                const roleUser = role ? role?.toUpperCase() : "";
                console.log({ roleUser, tesT: roles[0]?.description });
                dispatch(userDetailsAct({ ...loginForm.values, role: roleUser }));
                dispatch(setLoggedinUserRoleAct(roleUser));
                history.push('/employee-management')
                // history.push('/dashboard');
            }
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
        const { ip, country_name, city } = data || {};
        if (ip) {
            setClientDetailsState((prevState) => ({ ...prevState, ipAddress: ip, city, country: country_name }))
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
        const userRoleInfo = getRoleForUser(userRole || "");
        redirectUrl = userRoleInfo.redirectUrl;
        role = userRoleInfo.role;

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
            const formData = new FormData();
            formData.append("userName", values.username || '');
            formData.append("userPwd", values.password || '');
            formData.append("activity", JSON.stringify({ ...clientDetailsState, source: "WEB", osName: clientDetailsState.agentName }));
            dispatch(loginUserAct(generateActionPayload("login_user_v2", undefined, formData, {
                tokenNotRequired: true,
            })));
        },
    });

    function showPasswordHndlr() {
        setShowPasswordState(!showPasswordState);
    }

    return (
        <>
            <div className="login-container-new login-screen">

                <p className="sign-in-text mb-4 mb-xxl-5 text-center">Sign In Your Account</p>
                <div className="">
                    <form onSubmit={loginForm.handleSubmit}>
                        <TextIconInput
                            inputClassName="inputField"
                            formgroupClassName="mb-3"
                            labelText="Username"
                            labelClass="fs-7 text-muted fw-bold authv2-label"
                            name="username"
                            placeHolder="User Name"
                            value={loginForm.values.username}
                            onChange={(e) => {
                                const noSpaceValue = e.target.value.replace(/\s/g, "");
                                loginForm.setFieldValue("username", noSpaceValue);
                            }}
                            maxLength={200}
                            invalid={loginForm.touched.username && loginForm.errors.username ? true : false}
                            error={loginForm.touched.username && loginForm.errors.username ? loginForm.errors.username : ""}
                        >
                            <i className="icon-green ri-user-fill text-muted"></i>
                        </TextIconInput>

                        <div className="position-relative mb-4">
                            <TextIconInput
                                formgroupClassName="mb-2"
                                inputClassName="inputField"
                                name="password"
                                labelText="Password"
                                labelClass="fs-7 text-muted fw-bold authv2-label"
                                inputType={showPasswordState ? "text" : "password"}
                                // value={filterState.curriculumName}
                                placeHolder="Password"
                                value={loginForm.values.password}
                                onChange={loginForm.handleChange}
                                invalid={
                                    loginForm.touched.password && loginForm.errors.password
                                        ? true
                                        : false
                                }
                                error={
                                    loginForm.touched.password && loginForm.errors.password
                                        ? loginForm.errors.password
                                        : ""
                                }
                            >
                                <i className="icon-green  ri-lock-fill text-muted"></i>
                                <i
                                    onClick={showPasswordHndlr}
                                    className={classnames("align-middle login-password-eye", {
                                        "ri-eye-fill": showPasswordState,
                                        "ri-eye-off-fill": !showPasswordState,
                                    })}
                                ></i>
                            </TextIconInput>
                            <Link
                                to="/forgotpassword"
                                className={classnames(
                                    "position-absolute end-0 fs-7 text-info text-decoration-underline link-text",
                                    loginForm.touched.password && loginForm.errors.password
                                        ? "forgotpassword-pos-2"
                                        : "forgotpassword-pos-1"
                                )}
                            >
                                Forgot password?
                            </Link>
                        </div>
                        {!(loginForm.touched.password && loginForm.errors.password) && (
                            <div className="d-inline-block mt-2"></div>
                        )}
                        <div
                            className={classnames(
                                "text-center mb-3",
                                (loginForm.touched.username && loginForm.errors.username) ||
                                    (loginForm.touched.password && loginForm.errors.password)
                                    ? "mt-5"
                                    : "mt-0"
                            )}
                        >
                            <button
                                disabled={showApiLoader}
                                type="submit"
                                className="btn w-100 btn-success btn-bg-green align-center px-3 authv1-btn"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                    <div className="text-center text-muted agree-text" style={{ fontSize: "10px" }}>
                        By Logging in, you agree to Digital Caampus{" "}
                        <span className="text-info">Conditions of Use</span> and{" "}
                        <a href="https://k-innovative.com/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-info">Privacy Policy</a>.
                    </div>
                </div>
                <div className="contact-container mt-5 d-flex align-items-center justify-content-center">
                    <p className="text-dark fs-7 mb-2">
                        <span className="me-2" style={{ lineHeight: "0px" }}>
                            <img
                                className="img-fluid"
                                style={{ height: "1.8rem", width: "1.8rem" }}
                                src={Email}
                            />
                        </span>
                        <span style={{ display: "inline-block" }}>
                            Facing login issues? Click here
                        </span>
                    </p>
                    <div className="branch-whatsapp-container d-flex align-items-center justify-content-center">
                        <div className="px-2 me-3 mb-2">
                            <a
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                            >
                                <i
                                    className="ri-whatsapp-line fs-18"
                                    style={{ color: "green" }}
                                ></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
