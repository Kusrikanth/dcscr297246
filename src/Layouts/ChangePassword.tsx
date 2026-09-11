import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../hooks/storehook";

//Common Component
import { TextIconInput, ProgressIndicator, ModalContainer } from "../Components/Common";

//Generate Action
import { generateActionPayload } from "../utility/reduxutility";
import { changePasswordRoleTypeUserAct } from "../store/usermanagement/usermanagementactions";
import { changePasswordAct } from "../store/login/loginaction";

const initialValues: any = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password required."),
    newPassword: Yup.string().required("Password is required.").min(6, 'Password length should be more than 6 letters.'),
    confirmPassword: Yup.string().required('Confirm Password is required.').oneOf([Yup.ref('newPassword'), null], 'Confirm password should be same as new password.'),

});

export default function ChangePassword(props: any) {
    const [showPwdIconState, setShowPwdIconState] = useState<boolean>(false);
    const [showCnfrmPwdIconState, setShowCnfrmPwdIconState] = useState<boolean>(false);
    const [showOldPwdIconState, setShowOldPwdIconState] = useState(false);
    const [progressIndicatorState, setProgressIndicatorState] = useState({
        weakProgressValue: 0,
        mediumProgressValue: 0,
        strongProgressValue: 0,
        passwordStrengthText: "",
        passwordStrengthColor: "",
    });

    const dispatch = useAppDispatch();
    const { changePasswordResp, loginErrorResp } = useAppSelector(({ login }) => ({
        changePasswordResp: login.changePasswordResp,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);


    const changePasswordRespRef = useRef<any>({
        prevChangePasswordResp: changePasswordResp,
        prevLoginErrorResp: loginErrorResp
    })

    useEffect(() => {
        const { prevChangePasswordResp, prevLoginErrorResp } = changePasswordRespRef.current || {};
        if (changePasswordResp && prevChangePasswordResp !== changePasswordResp) {
            toast.success("Password changed successfully.");
            props.toggle(true);
        } else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            const { message } = loginErrorResp;
            toast.error(message || "Something went wrong.");
        }
        changePasswordRespRef.current.prevChangePasswordResp = changePasswordResp;
        changePasswordRespRef.current.prevLoginErrorResp = loginErrorResp;
    }, [changePasswordResp, loginErrorResp]);

    const changePwdForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { ...values };
            dispatch(changePasswordAct(generateActionPayload("change_password", undefined, payload)));
        },
    });

    function showPasswordHndlr() {
        setShowPwdIconState(!showPwdIconState);
    }

    function showCnfrmPasswordHnldr() {
        setShowCnfrmPwdIconState(!showCnfrmPwdIconState);
    }

    function showOldPasswordHndlr() {
        setShowOldPwdIconState(!showOldPwdIconState);
    }


    return (
        <>
            <form id={props.formId} onSubmit={changePwdForm.handleSubmit}>
                <div className="modal-body">
                    <div className="col-12">
                        <TextIconInput
                            iconPositionClassName="right"
                            labelText="Old Password"
                            inputType={showOldPwdIconState ? "text" : "password"}
                            name="oldPassword"
                            placeHolder="Enter new password"
                            // helperText="Must be at least 8 characters."
                            onChange={changePwdForm.handleChange}
                            value={changePwdForm.values.oldPassword || ""}
                            invalid={(changePwdForm.touched.oldPassword && changePwdForm.errors.oldPassword) ? true : false}
                            error={(changePwdForm.touched.oldPassword && changePwdForm.errors.oldPassword) ? changePwdForm.errors.oldPassword : ""}
                        >
                            <i onClick={showOldPasswordHndlr} className={classnames("align-middle text-muted", {
                                "ri-eye-fill": showOldPwdIconState,
                                "ri-eye-off-fill": !showOldPwdIconState
                            })}></i>
                        </TextIconInput>
                    </div>
                    <div className="col-12">
                        <TextIconInput
                            iconPositionClassName="right"
                            labelText="Password"
                            inputType={showPwdIconState ? "text" : "password"}
                            name="newPassword"
                            placeHolder="Enter new password"
                            // helperText="Must be at least 8 characters."
                            onChange={changePwdForm.handleChange}
                            value={changePwdForm.values.newPassword || ""}
                            invalid={(changePwdForm.touched.newPassword && changePwdForm.errors.newPassword) ? true : false}
                            error={(changePwdForm.touched.newPassword && changePwdForm.errors.newPassword) ? changePwdForm.errors.newPassword : ""}
                        >
                            <i onClick={showPasswordHndlr} className={classnames("align-middle text-muted", {
                                "ri-eye-fill": showPwdIconState,
                                "ri-eye-off-fill": !showPwdIconState
                            })}></i>
                        </TextIconInput>
                    </div>
                    <div className="col-12">
                        <TextIconInput
                            iconPositionClassName="right"
                            labelText="Confirm Password"
                            formgroupClassName="mb-0"
                            inputType={showCnfrmPwdIconState ? "text" : "password"}
                            name="confirmPassword"
                            placeHolder="Confirm password"
                            onChange={changePwdForm.handleChange}
                            onBlur={changePwdForm.handleBlur}
                            value={changePwdForm.values.confirmPassword || ""}
                            invalid={(changePwdForm.touched.confirmPassword && changePwdForm.errors.confirmPassword) ? true : false}
                            error={(changePwdForm.touched.confirmPassword && changePwdForm.errors.confirmPassword) ? changePwdForm.errors.confirmPassword : ""}
                        >
                            <i onClick={showCnfrmPasswordHnldr} className={classnames("align-middle text-muted", {
                                "ri-eye-fill": showCnfrmPwdIconState,
                                "ri-eye-off-fill": !showCnfrmPwdIconState
                            })}></i>
                        </TextIconInput>
                    </div>
                </div>
                <div className="modal-footer modal-footer-shadow">
                    <div className="hstack gap-2 justify-content-end">
                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            Submit
                        </button>
                    </div>
                </div>


            </form>
        </>
    )
}