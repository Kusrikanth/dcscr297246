import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { TextIconInput } from "../../../Components/Common";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Actions
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  forgotPasswordAct,
  setForgettedEmailAct,
} from "../../../store/login/loginaction";
import FacingLoginIssue from "../FacingLoginIssue";
import Email from "../../../assets/imagesdps/authiconV1/login-2.png";
import { WHATSAPP_LINK } from "../../../Components/constants/common";

//Types
const initialValues: any = {
  username: "",
};
const validationSchema = Yup.object().shape({
  username: Yup.string().required("User name is required."),
});

const ForgotPassword: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { forgotPasswordResp, loginErrorResp, showApiLoader } = useAppSelector(
    ({ login, globalData }) => ({
      forgotPasswordResp: login.forgotPasswordResp,
      loginErrorResp: login.loginErrorResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const forgotPasswordRespRef = useRef<any>({
    prevForgotPasswordResp: forgotPasswordResp,
    prevLoginErrorResp: loginErrorResp,
  });

  useEffect(() => {
    const { prevForgotPasswordResp, prevLoginErrorResp } =
      forgotPasswordRespRef.current || {};
    if (forgotPasswordResp && forgotPasswordResp !== prevForgotPasswordResp) {
      toast.success("OTP successfully send to your register email id.");
      history.push("/validateotp");
      dispatch(setForgettedEmailAct(forgotPwdForm.values.username));
    } else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
      toast.error("Invalid username id.");
    }
  }, [forgotPasswordResp, loginErrorResp]);

  const forgotPwdForm = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        forgotPasswordAct(
          generateActionPayload("forgot_password", undefined, values, {
            tokenNotRequired: true,
          })
        )
      );
    },
  });

  return (
      <div className="login-container-new login-screen">
        <div className="d-flex flex-column align-items-center justify-content-center mb-4">
          <p className="sign-in-text text-center mb-1">Forgot Password?</p>
          <span className="header-subtitle d-block fs-7 mb-xl-4 text-wrap">
            Reset password with Delhi Public School
          </span>
        </div>

        <div className="">
          <div className="text-center">
            <div className="alert alert-warning alert-borderless alert-warning text-center fs-7 mb-4">
              Enter your registered username and an OTP will be sent to your
              email Id
            </div>
          </div>
          <form onSubmit={forgotPwdForm.handleSubmit}>
            <TextIconInput
              // iconPositionClassName="right"
              formgroupClassName="mb-4"
              inputClassName="inputField"
              // labelText="Email"
              name="username"
              placeHolder="Enter Username"
              onChange={forgotPwdForm.handleChange}
              value={forgotPwdForm.values.username || ""}
              invalid={
                forgotPwdForm.touched.username && forgotPwdForm.errors.username
                  ? true
                  : false
              }
              error={
                forgotPwdForm.touched.username && forgotPwdForm.errors.username
                  ? forgotPwdForm.errors.username
                  : ""
              }
              maxLength = {200}
            >
              <i
                className={"align-middle icon-green ri-user-fill text-muted"}
              ></i>
            </TextIconInput>
            <div className="mb-4 text-center">
              <button
                type="submit"
                className="btn btn-success w-lg btn-bg-green align-center px-3 w-100 authv1-btn"
                disabled={showApiLoader}
              >
                Send OTP
              </button>
            </div>
          </form>
          <div className="text-center fs-7 link-text">
            <p className="mb-0">
              Wait, I remember my password...{" "}
              <Link
                to="/login"
                className="text-info text-decoration-underline"
                onClick={
                  showApiLoader ? (event) => event.preventDefault() : undefined
                }
              >
                Click here
              </Link>{" "}
            </p>
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
  );
};

export default ForgotPassword;
