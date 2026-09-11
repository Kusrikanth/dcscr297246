import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {  useHistory } from "react-router-dom";
import {
  TextIconInput,
  ProgressIndicator,
} from "../../../Components/Common";
import classnames from "classnames";
//Actions
import { userDetailsAct } from "../../../store/actions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Types
// import { IChangePwdForm } from "./resetpasswordtypes";
//Actions
import { generateActionPayload } from "../../../utility/reduxutility";
import { resetPasswordAct } from "../../../store/login/loginaction";

const initialValues: any = {
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password length should be more than 6 letters."),
  confirmPassword: Yup.string()
    .required("Confirm Password is required.")
    .oneOf(
      [Yup.ref("password"), null],
      "Confirm password should be same as password."
    ),
});

// confirmPassword: Yup.string().when("password", {
//     is: (val: string) => (val && val.length > 0 ? true : false),
//     then: Yup.string().oneOf(
//         [Yup.ref("password")],
//         "Confirm password should be same as password."
//     ),
//     otherwise: Yup.string().required("Confirm Password is required.")
// })

const pwdMediumStrengthRegex = new RegExp(
  "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
);
const pwdStrongStrengthRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

const ResetPasswordNew: React.FC<any> = () => {
  const [showPwdIconState, setShowPwdIconState] = useState<boolean>(false);
  const [progressIndicatorState, setProgressIndicatorState] = useState({
    weakProgressValue: 0,
    mediumProgressValue: 0,
    strongProgressValue: 0,
    passwordStrengthText: "",
    passwordStrengthColor: "",
  });
  const [showCnfrmPwdIconState, setShowCnfrmPwdIconState] =
    useState<boolean>(false);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const {
    resetPasswordResp,
    validateOtpResp,
    forgotPasswordResp,
    loginErrorResp,
  } = useAppSelector(
    ({ login }) => ({
      resetPasswordResp: login.resetPasswordResp,
      validateOtpResp: login.validateOtpResp,
      forgotPasswordResp: login.forgotPasswordResp,
      loginErrorResp: login.loginErrorResp,
    }),
    shallowEqual
  );

  const changePasswordRef = useRef<any>({
    prevResetPasswordResp: resetPasswordResp,
    prevLoginErrorResp: loginErrorResp,
  });

  // useEffect(() => {
  //     if (!validateOtpResp) {
  //         history.push('/forgot-password');
  //     }
  // }, [validateOtpResp]);

  useEffect(() => {
    const { prevResetPasswordResp, prevLoginErrorResp } =
      changePasswordRef.current || {};
    if (resetPasswordResp && prevResetPasswordResp !== resetPasswordResp) {
      history.push("login");
      toast.success("Password resetted successfully. Please login again.");
    } else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
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
        username,
      };
      dispatch(
        resetPasswordAct(
          generateActionPayload("reset_password", undefined, payload, {
            tokenNotRequired: true,
          })
        )
      );
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
      setProgressIndicatorState((prevState) => ({
        ...prevState,
        weakProgressValue: 100,
        mediumProgressValue: 100,
        passwordStrengthText: "Your password is strong.",
        passwordStrengthColor: "text-success",
      }));
      setTimeout(() => {
        setProgressIndicatorState((prevState) => ({
          ...prevState,
          strongProgressValue: 100,
        }));
      }, 150);
    } else if (pwdMediumStrengthRegex.test(value)) {
      setProgressIndicatorState((prevState) => ({
        ...prevState,
        weakProgressValue: 100,
        mediumProgressValue: 100,
        strongProgressValue: 0,
        passwordStrengthText: "Your password is medium.",
        passwordStrengthColor: "text-warning",
      }));
    } else {
      setProgressIndicatorState((prevState) => ({
        ...prevState,
        weakProgressValue: 100,
        strongProgressValue: 0,
        passwordStrengthText: "Your password is weak.",
        passwordStrengthColor: "text-danger",
      }));
      setTimeout(() => {
        setProgressIndicatorState((prevState) => ({
          ...prevState,
          mediumProgressValue: 0,
          strongProgressValue: 0,
        }));
      }, 150);
    }
    changePwdForm.setFieldValue(name, value);
  }
  return (
      <div className="login-container-new">
        <div className="d-flex flex-column align-items-center justify-content-center mb-4 mb-xxl-5">
          <p className="sign-in-text text-center mb-1">Create new password</p>
          <span className="header-subtitle d-block fs-7 text-wrap text-center">
            Your new password must be different from previous used password.
          </span>
        </div>

        <div className="">
          <form onSubmit={changePwdForm.handleSubmit}>
            <TextIconInput
              iconPositionClassName="right"
              formgroupClassName="mb-2"
              labelText="Password"
              labelClass="fs-7 text-muted fw-bold authv2-label"
              inputClassName="resetInputField"
              inputType={showPwdIconState ? "text" : "password"}
              name="password"
              placeHolder="Enter password"
              // helperText="Must be at least 8 characters."
              // onChange={changePwdForm.handleChange}
              onChange={passwordChangeHndlr}
              onBlur={changePwdForm.handleBlur}
              value={changePwdForm.values.password || ""}
              invalid={
                changePwdForm.touched.password && changePwdForm.errors.password
                  ? true
                  : false
              }
              error={
                changePwdForm.touched.password && changePwdForm.errors.password
                  ? changePwdForm.errors.password
                  : ""
              }
            >
              <i
                onClick={showPasswordHndlr}
                className={classnames("align-middle", {
                  "ri-eye-fill": showPwdIconState,
                  "ri-eye-off-fill": !showPwdIconState,
                })}
                style={{ color: "#155b2e" }}
              ></i>
            </TextIconInput>
            <div className="container-fluid mb-3 px-0">
              <div className="row g-1 mb-1">
                <div className="col">
                  <ProgressIndicator
                    progressColor="danger"
                    progressValue={progressIndicatorState.weakProgressValue}
                    progressClassName="progress-sm"
                  />
                </div>
                <div className="col">
                  <ProgressIndicator
                    progressColor="warning"
                    progressValue={progressIndicatorState.mediumProgressValue}
                    progressClassName="progress-sm"
                  />
                </div>
                <div className="col">
                  <ProgressIndicator
                    progressColor="success"
                    progressValue={progressIndicatorState.strongProgressValue}
                    progressClassName="progress-sm"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <p
                    className={classnames(
                      "fs-7 mb-0",
                      progressIndicatorState.passwordStrengthColor
                    )}
                  >
                    {progressIndicatorState.passwordStrengthText}
                  </p>
                </div>
              </div>
            </div>
            <TextIconInput
              iconPositionClassName="right"
              labelText="Confirm Password"
              labelClass="fs-7 text-muted fw-bold authv2-label"
              inputClassName="resetInputField"
              inputType={showCnfrmPwdIconState ? "text" : "password"}
              name="confirmPassword"
              placeHolder="Confirm Password"
              onChange={changePwdForm.handleChange}
              onBlur={changePwdForm.handleBlur}
              value={changePwdForm.values.confirmPassword || ""}
              invalid={
                changePwdForm.touched.confirmPassword &&
                changePwdForm.errors.confirmPassword
                  ? true
                  : false
              }
              error={
                changePwdForm.touched.confirmPassword &&
                changePwdForm.errors.confirmPassword
                  ? changePwdForm.errors.confirmPassword
                  : ""
              }
            >
              <i
                onClick={showCnfrmPasswordHnldr}
                className={classnames("align-middle", {
                  "ri-eye-fill": showCnfrmPwdIconState,
                  "ri-eye-off-fill": !showCnfrmPwdIconState,
                })}
                style={{ color: "#155b2e" }}
              ></i>
            </TextIconInput>
            <div className="mt-4">
              <div className="col-12 text-center mb-3">
                <button className="btn btn-success w-100 btn-bg-green align-center px-3 authv1-btn">
                  Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ResetPasswordNew;
