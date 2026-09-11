import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Common Component
import { TextIconInput, ProgressIndicator, ModalContainer } from "../../../Components/Common";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { changePasswordRoleTypeUserAct } from "../../../store/usermanagement/usermanagementactions";

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


    function passwordChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event,
            { name, value } = target;
        if (pwdStrongStrengthRegex.test(value)) {
            setProgressIndicatorState(prevState => ({
                ...prevState, weakProgressValue: 100, mediumProgressValue: 100,
                passwordStrengthText: "Your newPassword is strong.",
                passwordStrengthColor: "tw-text-green-500"
            }))
            setTimeout(() => {
                setProgressIndicatorState(prevState => ({
                    ...prevState, strongProgressValue: 100,
                }))
            }, 150);
        } else if (pwdMediumStrengthRegex.test(value)) {
            setProgressIndicatorState(prevState => ({
                ...prevState, weakProgressValue: 100, mediumProgressValue: 100, strongProgressValue: 0,
                passwordStrengthText: "Your newPassword is medium.",
                passwordStrengthColor: "tw-text-yellow-500"
            }))
        } else {
            setProgressIndicatorState(prevState => ({
                ...prevState, weakProgressValue: 100,
                strongProgressValue: 0,
                passwordStrengthText: "Your newPassword is weak.",
                passwordStrengthColor: "tw-text-red-500"
            }))
            setTimeout(() => {
                setProgressIndicatorState(prevState => ({
                    ...prevState, mediumProgressValue: 0, strongProgressValue: 0,
                }))
            }, 150);
        }
        changePwdForm.setFieldValue(name, value);
    }

    const [showCnfrmPwdIconState, setShowCnfrmPwdIconState] = useState<boolean>(false);
    return (
        <>
            <ModalContainer
                id="change-newPassword-modal"
                modalTitle="Change Password"
                isOpen={props.isOpen}
                toggle={props.toggle}
                submitTitle="Submit"
                submitHndlr={changePwdForm.handleSubmit}
                cancelHndlr={props.toggle}
                modalSize="md"
            >
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-6">
                    <div className="tw-col-span-12">
                            <TextIconInput
                                iconPositionClassName="right"
                                labelText="Password"
                                inputType={showPwdIconState ? "text" : "password"}
                                name="newPassword"
                                placeHolder="Enter new password"
                                onChange={changePwdForm.handleChange}
                                value={changePwdForm.values.newPassword || ""}
                                invalid={(changePwdForm.touched.newPassword && changePwdForm.errors.newPassword) ? true : false}
                                error={(changePwdForm.touched.newPassword && changePwdForm.errors.newPassword) ? changePwdForm.errors.newPassword : ""}
                            />
                            <i 
                                onClick={showPasswordHndlr} 
                                className={classnames("tw-align-middle tw-text-gray-500", {
                                    "ri-eye-fill": showPwdIconState,
                                    "ri-eye-off-fill": !showPwdIconState
                                })}
                            ></i>

                    </div>
                    <div className="tw-col-span-12">
                        <div className="tw-relative">
                            <TextIconInput
                                iconPositionClassName="right"
                                labelText="Confirm Password"
                                inputType={showCnfrmPwdIconState ? "text" : "password"}
                                name="confirmPassword"
                                placeHolder="Confirm password"
                                onChange={changePwdForm.handleChange}
                                onBlur={changePwdForm.handleBlur}
                                value={changePwdForm.values.confirmPassword || ""}
                                invalid={(changePwdForm.touched.confirmPassword && changePwdForm.errors.confirmPassword) ? true : false}
                                error={(changePwdForm.touched.confirmPassword && changePwdForm.errors.confirmPassword) ? changePwdForm.errors.confirmPassword : ""}
                            />
                            <i 
                                onClick={showCnfrmPasswordHnldr} 
                                className={classnames("tw-align-middle tw-text-gray-500", {
                                    "ri-eye-fill": showCnfrmPwdIconState,
                                    "ri-eye-off-fill": !showCnfrmPwdIconState
                                })}
                            ></i>
                        </div>
                    </div>
                </div>
            </ModalContainer>

        </>
    )
}