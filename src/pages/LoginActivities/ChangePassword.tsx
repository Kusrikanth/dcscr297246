import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Common Component
import { TextIconInput, ProgressIndicator, ModalContainer } from "../../Components/Common";

//Generate Action
import { generateActionPayload } from "../../utility/reduxutility";
import { changePasswordRoleTypeUserAct } from "../../store/usermanagement/usermanagementactions";

const initialValues: any = {
    newPassword: "",
    confirmPassword: "",
};

const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required("Password is required.").min(6, 'Password length should be more than 6 letters.'),
    confirmPassword: Yup.string().required('Confirm Password is required.').oneOf([Yup.ref('newPassword'), null], 'Confirm password should be same as new password.'),

});

const pwdMediumStrengthRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
const pwdStrongStrengthRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

export default function ChangePassword(props: any) {
    const [showPwdIconState, setShowPwdIconState] = useState<boolean>(false);
    const [showCnfrmPwdIconState, setShowCnfrmPwdIconState] = useState<boolean>(false);
    const [progressIndicatorState, setProgressIndicatorState] = useState({
        weakProgressValue: 0,
        mediumProgressValue: 0,
        strongProgressValue: 0,
        passwordStrengthText: "",
        passwordStrengthColor: "",
    });

    const dispatch = useAppDispatch();
    const { changePasswordRoleTypeUserResp } = useAppSelector(({ userManagement }) => ({
        changePasswordRoleTypeUserResp: userManagement.changePasswordRoleTypeUserResp
    }), shallowEqual);
    const changePasswordRespRef = useRef<any>({
        prevChangePasswordRoleTypeUserResp: changePasswordRoleTypeUserResp
    });
    useEffect(() => {
        const { prevChangePasswordRoleTypeUserResp } = changePasswordRespRef.current;
        if (changePasswordRoleTypeUserResp && prevChangePasswordRoleTypeUserResp !== changePasswordRoleTypeUserResp) {
            toast.success("Password upated successfully.");
            props.toggle(true);
        }
        changePasswordRespRef.current.prevChangePasswordRoleTypeUserResp = changePasswordRoleTypeUserResp;
    }, [changePasswordRoleTypeUserResp]);

    const changePwdForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { userIds } = props,
                { newPassword, confirmPassword } = values;
            if (Array.isArray(userIds)) {
                const payload = userIds.map((item: any) => ({
                    userId: item,
                    newPassword, confirmPassword
                }));
                dispatch(changePasswordRoleTypeUserAct(generateActionPayload("change_pwd_role_type", undefined,
                    { changePasswordCOList: payload })));
            }
        },
    });

    function showPasswordHndlr() {
        setShowPwdIconState(!showPwdIconState);
    }

    function showCnfrmPasswordHnldr() {
        setShowCnfrmPwdIconState(!showCnfrmPwdIconState);
    }


    return (
        <>
            <form id={props.formId} onSubmit={changePwdForm.handleSubmit}>
                <div className="modal-body">
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
                        {!props.isMandatory && <button
                            type="button"
                            className="btn btn-light"
                            onClick={props.toggle}
                        >
                            Cancel
                        </button>}
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