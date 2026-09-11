import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import { toast } from "react-toastify";
import { InputCheckbox, Button } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getUserSettingsAct, saveUserSettingsAct, } from "../../../store/login/loginaction";

function getProfileData(profileInfo?: any): any {
    return ({
        isMfa: profileInfo?.isMfa ?? false,
    })
}

const UserSettings: React.FC<any> = () => {
    const [userDetailsState, setuserDetailsState] = useState<any>(() => getProfileData());
    const dispatch = useAppDispatch();

    const { saveUserSettingsResp, getUserSettingsResp, loginErrorResp } = useAppSelector(({ login }) => ({
        saveUserSettingsResp: login.saveUserSettingsResp,
        getUserSettingsResp: login.getUserSettingsResp,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);

    const userDetailsRespRef = useRef<any>({
        prevSaveUserSettingsResp: saveUserSettingsResp,
        prevGetUserSettingsResp: getUserSettingsResp,
        prevLoginErrorResp: loginErrorResp
    })

    useEffect(() => {
        const { prevSaveUserSettingsResp, prevGetUserSettingsResp, prevLoginErrorResp } = userDetailsRespRef.current || {};

        if (getUserSettingsResp && prevGetUserSettingsResp !== getUserSettingsResp) {
            userDetailsForm.resetForm({ values: getProfileData(getUserSettingsResp) });
        }
        else if (saveUserSettingsResp && prevSaveUserSettingsResp !== saveUserSettingsResp) {
            toast.success("Updated successfully.");
            dispatch(getUserSettingsAct(generateActionPayload('get_user_settings')));
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            const { message } = loginErrorResp;
            toast.error(message || "Something went wrong.");
        }

        userDetailsRespRef.current.prevSaveUserSettingsResp = saveUserSettingsResp;
        userDetailsRespRef.current.prevGetUserSettingsResp = getUserSettingsResp;
        userDetailsRespRef.current.prevLoginErrorResp = loginErrorResp;
    }, [saveUserSettingsResp, getUserSettingsResp, loginErrorResp]);

    useEffect(() => {
        if (saveUserSettingsResp) {
            dispatch(getUserSettingsAct(generateActionPayload('get_user_settings')));
        }
    }, [saveUserSettingsResp, dispatch]);

    const userDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: userDetailsState,
        onSubmit: (values) => {
            const payload = {
                ...values
            };
            dispatch(saveUserSettingsAct(generateActionPayload("save_user_settings", undefined, payload,)));
        },
    });

    function cancelHndlr() {
        userDetailsForm.resetForm();
    }

    useEffect(() => {
        const { prevGetUserSettingsResp } = userDetailsRespRef.current || {};
        if (getUserSettingsResp && prevGetUserSettingsResp !== getUserSettingsResp) {
            userDetailsForm.setValues((prev: any) => ({ ...prev, isMfa: getUserSettingsResp.isMfa }));
        }
        userDetailsRespRef.current.prevGetUserSettingsResp = getUserSettingsResp;
    }, [getUserSettingsResp]);

    return (
        <div className="card">
            <div className="card-header">
                <h4 className="card-title tw-mb-0 tw-grow">User Settings</h4>
            </div>
            <div className="card-body">
                <form onSubmit={userDetailsForm.handleSubmit}>
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                        <div>
                            <InputCheckbox
                                name="isMfa"
                                labelName="Multi Factor Authentication"
                                value={userDetailsForm.values.isMfa}
                                onChange={userDetailsForm.handleChange}
                            />
                        </div>
                        <div className="tw-col-span-full">
                            <div className="tw-flex tw-gap-2 tw-justify-end">
                                {userDetailsForm.dirty && <Button type="button"
                                    variant="secondary" onClick={cancelHndlr}>Cancel</Button>}
                                <Button type="submit"
                                    disabled={!userDetailsForm.dirty}
                                    variant="primary">Save</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default UserSettings;