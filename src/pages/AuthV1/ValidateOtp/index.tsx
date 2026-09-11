import React, { useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert } from "reactstrap";
import { useHistory, useLocation } from "react-router-dom";
import { IntervalTimer } from "../../../Components/Common";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Actions
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  validateOtpAct,
  forgotPasswordAct,
  getUserMeAct,
} from "../../../store/login/loginaction";

//Utility
import { getSuggestionMail } from "../../../utility/commonutility";
import FacingLoginIssue from "../FacingLoginIssue";
import { instituteCodeOptions } from "../../../Components/constants/common";
import { setAuthenticatedUserAct, setCurrentBranchIdAct, setCurrentInstCodeAct, setCurrentInstIdAct, setLoggedinUserRoleAct } from "../../../store/appdata/appdataslice";
import { removeLocalStorage, setLocalStorage } from "../../../utility/storageUtility";
import { accessSessionKey, accessTokenKey, instituteIdKey } from "../../../Components/constants/storageconstants";
import { userDetailsAct } from "../../../store/actions";
import { getLoggedInUserRegistrationInfoAct } from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { getRoleForUser } from "../helper";

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
  const location: any = useLocation()
  const history = useHistory();
  const [startTimerState, setStartTimerState] = useState<boolean>(false);
  const [suggestionEmailState, setSuggestionEmailState] = useState<string>("");
  const { isMfa = false } = location.state || {}
  const {
    validateOtpResp,
    forgotPasswordResp,
    forgettedEmail,
    loginErrorResp,
    showApiLoader,
    userMeResp,
    loginUserResp,
  } = useAppSelector(
    ({ login, globalData }) => ({
      validateOtpResp: login.validateOtpResp,
      forgotPasswordResp: login.forgotPasswordResp,
      forgettedEmail: login.forgettedEmail,
      loginErrorResp: login.loginErrorResp,
      showApiLoader: globalData.showApiLoader,
      loginUserResp: login.loginUserResp,
      userMeResp: login.userMeResp,
    }),
    shallowEqual
  );

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
  const validateOtpRespRef = useRef({
    prevValidateOtpResp: validateOtpResp,
    prevForgotPasswordResp: forgotPasswordResp,
    prevLoginErrorResp: loginErrorResp,
  });

  function resetInputRef() {
    Object.keys(inputElementRef.current).forEach((key) => {
      if (inputElementRef.current[key]) {
        inputElementRef.current[key].value = "";
      }
    });
  }

  useEffect(() => {
    if (forgotPasswordResp && !suggestionEmailState) {
      const { email, mobile } = forgotPasswordResp;
      if (email) {
        setSuggestionEmailState(getSuggestionMail(email));
      }
    }
  }, [forgotPasswordResp && suggestionEmailState]);
  useEffect(() => {
    const { prevValidateOtpResp, prevForgotPasswordResp, prevLoginErrorResp } =
      validateOtpRespRef.current || {};
    if (validateOtpResp && validateOtpResp !== prevValidateOtpResp) {
      const { isOtpValid } = validateOtpResp;
      if (isOtpValid === "invalid otp") {
        toast.error("Invalid otp.");
      } else {
        toast.success("Successfully validated your otp.");
        if (!isMfa) {
          history.push("/resetpassword");
        } else {
          const { branchId, instituteId, role, username, shortName } = userMeResp;
          const { name } = role || {};
          const { token, sessionId } = loginUserResp || {};
          setLocalStorage(accessTokenKey, token);
          setLocalStorage(accessSessionKey, sessionId);
          if (instituteId) {
            dispatch(setCurrentInstIdAct(instituteId));
            const instituteCode = instituteCodeOptions.find(item => item.id === +instituteId)?.code;
            dispatch(setCurrentInstCodeAct(instituteCode));
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
      }
    } else if (
      forgotPasswordResp &&
      forgotPasswordResp !== prevForgotPasswordResp
    ) {
      setStartTimerState(true);
      toast.success("OTP successfully resend to your registered email id.");
    } else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
      const { details, message } = loginErrorResp || {};
      toast.error(details || message || "Something went wrong");
    }
    validateOtpRespRef.current.prevValidateOtpResp = validateOtpResp;
    validateOtpRespRef.current.prevForgotPasswordResp = forgotPasswordResp;
    validateOtpRespRef.current.prevLoginErrorResp = loginErrorResp;
  }, [validateOtpResp, forgotPasswordResp, loginErrorResp]);

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
      dispatch(userDetailsAct({ ...location?.state?.values, role }));
      dispatch(setLoggedinUserRoleAct(role));
      history.push(redirectUrl);
    } else {
      toast.error(`Please provide privileges to this role: ${userRole}.`);
    }
  }

  const validateOtpForm = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!startTimerState) {
        toast.error("Password expired resend your otp again.");
        validateOtpForm.resetForm();
        resetInputRef();
      } else {
        // setStartTimerState(false);
        const { username } = forgotPasswordResp;
        const otpValue = Object.values(values).join(""),
          payload = {
            otp: otpValue,
            username,
            source: isMfa ? "MFA" : "LOGIN",
          };
        dispatch(
          validateOtpAct(
            generateActionPayload("validate_otp", undefined, payload, {
              tokenNotRequired: true,
            })
          )
        );
      }
    },
  });

  const stopTimerHndlr = useCallback(() => {
    setStartTimerState(false);
  }, []);

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

  function resendBtnHndlr(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (showApiLoader) return;
    const { username } = forgotPasswordResp;
    if (username && !startTimerState) {
      validateOtpForm.resetForm();
      Object.keys(inputElementRef.current).forEach((item) => {
        inputElementRef.current[item].value = "";
      });
      inputElementRef.current["otpValue1"].focus();
      const payload = isMfa ? { username, loginStatus: "MFA" } : { username };

      dispatch(
        forgotPasswordAct(
          generateActionPayload(
            "forgot_password",
            undefined,
            payload,
            { tokenNotRequired: true }
          )
        )
      );
    }
  }

  return (
    <div className={classnames("login-container-new ")}>
      <div className="d-flex flex-column align-items-center justify-content-center mb-4">
        <p className={classnames("sign-in-text text-center mb-1" + (isMfa && " h4 fw-normal"))}>Verify Your {isMfa ? "Identity" : "Email"}</p>
        <span className={classnames("header-subtitle d-block fs-7 text-wrap text-center" + (isMfa && " fw-normal"))}>
          Please enter the 4 digit OTP sent to{" "}
          <span className="fw-bold">{suggestionEmailState}</span>
        </span>
      </div>
      <div className={`${!isMfa && "pt-4"}`}>
        <form onSubmit={validateOtpForm.handleSubmit}>
          <div className="mb-4 d-flex justify-content-center gap-3">
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
                "form-control form-control bg-light text-center opt-input ",
                validateOtpForm.touched.otpValue1 &&
                  validateOtpForm.errors.otpValue1
                  ? "is-invalid"
                  : "border-light"
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
                "form-control form-control bg-light text-center opt-input ",
                validateOtpForm.touched.otpValue2 &&
                  validateOtpForm.errors.otpValue2
                  ? "is-invalid"
                  : "border-light"
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
                "form-control form-control bg-light text-center opt-input ",
                validateOtpForm.touched.otpValue3 &&
                  validateOtpForm.errors.otpValue3
                  ? "is-invalid"
                  : "border-light"
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
                "form-control form-control bg-light text-center opt-input ",
                validateOtpForm.touched.otpValue4 &&
                  validateOtpForm.errors.otpValue4
                  ? "is-invalid"
                  : "border-light"
              )}
              maxLength={1}
              name="otpValue4"
              autoComplete="off"
            />

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
          <div className="row">
            <div className="col-12 text-center mb-3">
              <button
                type="submit"
                className={"btn btn-success w-lg btn-bg-green align-center px-3 authv1-btn w-100"}
                disabled={showApiLoader}
              >
                Confirm
              </button>
            </div>
          </div>
        </form>
        <div className="row">
          {/* <input type="button" value="Restart" onClick={e => setStartTimerState(true)} /> */}
          <div className="col-12 text-center mb-3">
            <IntervalTimer
              startTimer={startTimerState}
              stopTimerHndlr={stopTimerHndlr}
              initialMinute="04"
              initialSeconds="00"
            />
          </div>
          <div className="col-12 text-center">
            <p className="mb-0">
              Didn't receive a code ?{" "}
              <a
                href="#"
                onClick={resendBtnHndlr}
                className={classnames(
                  "fw-semibold text-decoration-underline",
                  startTimerState ? "text-muted pe-none" : "text-info"
                )}
              >
                Resend
              </a>{" "}
            </p>
          </div>
        </div>
        <FacingLoginIssue></FacingLoginIssue>
      </div>
    </div>
  );
};

export default ValidateOtp;
