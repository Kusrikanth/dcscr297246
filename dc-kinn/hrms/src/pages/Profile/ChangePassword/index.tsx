import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
//Common Component
import { TextIconInput, TextInput, SelectInput, PhoneInput, DateInput, TextArea, Button } from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { changePasswordAct } from "../../../store/login/loginaction";


const initialValues: any = {
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
}
const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password required."),
    newPassword: Yup.string().required("New password required.").min(6, "Password min length should be 6 digit."),
    confirmPassword: Yup.string().required('Confirm Password is required.').oneOf([Yup.ref('newPassword'), null], 'Confirm password should be same as new password.'),
});

const ChangePassword: React.FC<any> = ({ oldPassword, instituteId }) => {
    const [changePasswordState, setChangePasswordState] = useState<any>({
        showOldPwdIcon: false,
        showNewPwdIcon: false,
        showConfirmPwdIcon: false,
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
            changePasswordForm.resetForm();
        } else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            const { message } = loginErrorResp;
            toast.error(message || "Something went wrong.");
        }
        changePasswordRespRef.current.prevChangePasswordResp = changePasswordResp;
        changePasswordRespRef.current.prevLoginErrorResp = loginErrorResp;
    }, [changePasswordResp, loginErrorResp]);

    // Institute Form
    const changePasswordForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { ...values };
            dispatch(changePasswordAct(generateActionPayload("change_password", undefined, payload)));
        },
    });

    function showCnfrmPasswordHnldr(event: React.MouseEvent<HTMLElement>) {
        const iconId = event.currentTarget.getAttribute("data-id");
        if (iconId)
            setChangePasswordState((prevState: any) => ({ ...prevState, [iconId]: !prevState[iconId] }))
    }

    function cancelHndlr() {
        changePasswordForm.resetForm();
    }

    return (
        <div className="card">
            <div className="card-header">
                <h4 className="card-title tw-mb-0 tw-grow">Basic Info</h4>
            </div>
            <div className="card-body">
                <form onSubmit={changePasswordForm.handleSubmit}>
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                        <div>
                            <TextIconInput
                                iconPositionClassName="right"
                                labelText="Old Password"
                                inputType={(changePasswordState.showOldPwdIcon) ? "text" : "password"}
                                name="oldPassword"
                                placeHolder="Old Password"
                                onChange={changePasswordForm.handleChange}
                                onBlur={changePasswordForm.handleBlur}
                                value={changePasswordForm.values.oldPassword || ""}
                                invalid={(changePasswordForm.touched.oldPassword && changePasswordForm.errors.oldPassword) ? true : false}
                                error={(changePasswordForm.touched.oldPassword && changePasswordForm.errors.oldPassword) ? changePasswordForm.errors.oldPassword : ""}
                            >
                                <i data-id="showOldPwdIcon" onClick={showCnfrmPasswordHnldr} className={classnames("tw-align-middle tw-text-gray-500", {
                                    "ri-eye-fill": (changePasswordState.showOldPwdIcon),
                                    "ri-eye-off-fill": !(changePasswordState.showOldPwdIcon)
                                })}></i>
                            </TextIconInput>
                        </div>
                        <div className="tw-hidden md:tw-block"></div>
                        <div>
                            <TextIconInput
                                iconPositionClassName="right"
                                labelText="New Password"
                                inputType={(changePasswordState.showNewPwdIcon) ? "text" : "password"}
                                name="newPassword"
                                placeHolder="New Password"
                                onChange={changePasswordForm.handleChange}
                                onBlur={changePasswordForm.handleBlur}
                                value={changePasswordForm.values.newPassword || ""}
                                invalid={(changePasswordForm.touched.newPassword && changePasswordForm.errors.newPassword) ? true : false}
                                error={(changePasswordForm.touched.newPassword && changePasswordForm.errors.newPassword) ? changePasswordForm.errors.newPassword : ""}
                            >
                                <i data-id="showNewPwdIcon" onClick={showCnfrmPasswordHnldr} className={classnames("tw-align-middle tw-text-gray-500", {
                                    "ri-eye-fill": (changePasswordState.showNewPwdIcon),
                                    "ri-eye-off-fill": !(changePasswordState.showNewPwdIcon)
                                })}></i>
                            </TextIconInput>
                        </div>
                        <div className="tw-hidden md:tw-block"></div>
                        <div>
                            <TextIconInput
                                iconPositionClassName="right"
                                labelText="Confirm Password"
                                inputType={(changePasswordState.showConfirmPwdIcon) ? "text" : "password"}
                                name="confirmPassword"
                                placeHolder="Confirm Password"
                                onChange={changePasswordForm.handleChange}
                                onBlur={changePasswordForm.handleBlur}
                                value={changePasswordForm.values.confirmPassword || ""}
                                invalid={(changePasswordForm.touched.confirmPassword && changePasswordForm.errors.confirmPassword) ? true : false}
                                error={(changePasswordForm.touched.confirmPassword && changePasswordForm.errors.confirmPassword) ? changePasswordForm.errors.confirmPassword : ""}
                            >
                                <i data-id="showConfirmPwdIcon" onClick={showCnfrmPasswordHnldr} className={classnames("tw-align-middle tw-text-gray-500", {
                                    "ri-eye-fill": (changePasswordState.showConfirmPwdIcon),
                                    "ri-eye-off-fill": !(changePasswordState.showConfirmPwdIcon)
                                })}></i>
                            </TextIconInput>
                        </div>
                        <div className="tw-hidden md:tw-block"></div>
                        <div className="tw-col-span-full">
                            <div className="tw-flex tw-gap-2 tw-justify-end">
                                {changePasswordForm.dirty && <Button type="button"
                                    variant="secondary" onClick={cancelHndlr}>Cancel</Button>}
                                <Button type="submit"
                                    disabled={!changePasswordForm.dirty}
                                    variant="primary">Update</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default ChangePassword;