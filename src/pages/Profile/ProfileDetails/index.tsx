import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
//Common Component
import { TextIconInput, TextInput, SelectInput, PhoneInput, DateInput, TextArea, Button } from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { getLoggedInUserDetailsAct, getUserMeAct, updateUserDetailAct } from "../../../store/login/loginaction";

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name required."),
    lastName: Yup.string().required("Last name required."),
    mobile: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required."),
    email: Yup.string().email('Invalid Email.').required("Email id required.")
});



function getProfileData(profileInfo?: any): any {
    return ({
        firstName: profileInfo?.firstName || "",
        lastName: profileInfo?.lastName || "",
        username: profileInfo?.username || "",
        mobile: profileInfo?.mobile || "",
        email: profileInfo?.email || "",
        version: profileInfo?.version,
        roleId: profileInfo?.role?.id || "",
        enabled: profileInfo?.enabled,
        instituteId: profileInfo?.instituteId || undefined,
    })
}

const ProfileDetails: React.FC<any> = () => {
    const [profileDetailsState, setProfileDetailsState] = useState<any>(() => getProfileData());
    const dispatch = useAppDispatch();
    const { userMeResp, loggedInUserDetailResp, updateUserDetailResp, loginErrorResp } = useAppSelector(({ login }) => ({
        userMeResp: login.userMeResp,
        loggedInUserDetailResp: login.loggedInUserDetailResp,
        updateUserDetailResp: login.updateUserDetailResp,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);

    const profileDetailsRespRef = useRef<any>({
        prevLoggedInUserDetailResp: loggedInUserDetailResp,
        prevUpdateUserDetailResp: updateUserDetailResp,
        prevLoginErrorResp: loginErrorResp
    })

    useEffect(() => {
        const { prevLoggedInUserDetailResp, prevUpdateUserDetailResp, prevLoginErrorResp } = profileDetailsRespRef.current || {};
        if (loggedInUserDetailResp && prevLoggedInUserDetailResp !== loggedInUserDetailResp) {
            profileDetailsForm.resetForm({ values: getProfileData(loggedInUserDetailResp) })
        } else if (updateUserDetailResp && prevUpdateUserDetailResp !== updateUserDetailResp) {
            toast.success("User details updated successfully");
            const { id, role } = userMeResp;
            const params = { roleType: role?.roleType, userId: id };
            // dispatch(getLoggedInUserDetailsAct(generateActionPayload("loggedin_user_details", params)));
            dispatch(getUserMeAct(generateActionPayload("get_user_me")));
        }
        else if (loginErrorResp && loginErrorResp !== prevLoginErrorResp) {
            const { message } = loginErrorResp;
            toast.error(message || "Something went wrong.");
        }
        profileDetailsRespRef.current.prevLoggedInUserDetailResp = loggedInUserDetailResp;
        profileDetailsRespRef.current.prevUpdateUserDetailResp = updateUserDetailResp;
        profileDetailsRespRef.current.prevLoginErrorResp = loginErrorResp;
    }, [loggedInUserDetailResp, updateUserDetailResp, loginErrorResp]);


    useEffect(() => {
        if (userMeResp) {
            const { id, role } = userMeResp, { roleType } = role || {};
            if (roleType) {
                const params = { roleType, userId: id };
                dispatch(getLoggedInUserDetailsAct(generateActionPayload("loggedin_user_details", params)));
            }
        }
    }, [userMeResp]);

    // Institute Form
    const profileDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: profileDetailsState,
        validationSchema,
        onSubmit: (values) => {
            const { id, role } = userMeResp,
                { roleType } = role || {};
            const params = { roleType, userId: id };
            const payload = { ...values };
            dispatch(updateUserDetailAct(generateActionPayload("update_user_detail", params, payload)));
        },
    });
    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        profileDetailsForm.setFieldValue(name, updateDate);
    }

    function cancelHndlr() {
        profileDetailsForm.resetForm({ values: getProfileData(loggedInUserDetailResp) })
    }
    return (
        <div className="card">
            <div className="card-header">
                <h4 className="card-title tw-mb-0 tw-grow">Basic Info</h4>
            </div>
            <div className="card-body">
                <form onSubmit={profileDetailsForm.handleSubmit}>
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2">
                        <div>
                            <TextInput
                                name="firstName"
                                labelText="First Name"
                                value={profileDetailsForm.values.firstName}
                                onChange={profileDetailsForm.handleChange}
                                onBlur={profileDetailsForm.handleBlur}
                                invalid={(profileDetailsForm.touched.firstName && profileDetailsForm.errors.firstName) ? true : false}
                                error={(profileDetailsForm.touched.firstName && profileDetailsForm.errors.firstName) ? profileDetailsForm.errors.firstName : ""}
                            />
                        </div>
                        <div>
                            <TextInput
                                name="lastName"
                                labelText="Last Name"
                                value={profileDetailsForm.values.lastName}
                                onChange={profileDetailsForm.handleChange}
                                onBlur={profileDetailsForm.handleBlur}
                                invalid={(profileDetailsForm.touched.lastName && profileDetailsForm.errors.lastName) ? true : false}
                                error={(profileDetailsForm.touched.lastName && profileDetailsForm.errors.lastName) ? profileDetailsForm.errors.lastName : ""}
                            />
                        </div>
                        {/* <div className="col-xs-12 col-md-6">
                            <SelectInput
                                name="gender"
                                labelText="Gender"
                                value={profileDetailsForm.values.gender}
                                onChange={profileDetailsForm.handleChange}
                                invalid={(profileDetailsForm.touched.gender && profileDetailsForm.errors.gender) ? true : false}
                                error={(profileDetailsForm.touched.gender && profileDetailsForm.errors.gender) ? profileDetailsForm.errors.gender : ""}
                                menuItems={[{ id: "male", name: "Male" }, { id: "female", name: "Female" }]}
                                valueKey="id"
                                textKey="name"
                            />
                        </div> */}
                        {/* <div className="col-xs-12 col-md-6">
                            <DateInput
                                name="dateOfBirth"
                                labelText="Start Date"
                                value={profileDetailsForm.values.dateOfBirth}
                                onChange={profileDetailsForm.handleChange}
                                invalid={(profileDetailsForm.touched.dateOfBirth && profileDetailsForm.errors.dateOfBirth) ? true : false}
                                error={(profileDetailsForm.touched.dateOfBirth && profileDetailsForm.errors.dateOfBirth) ? profileDetailsForm.errors.dateOfBirth : ""}
                            />
                        </div> */}
                        <div>
                            <TextInput
                                name="username"
                                labelText="User Name"
                                value={profileDetailsForm.values.username}
                                onChange={undefined}
                                onBlur={profileDetailsForm.handleBlur}
                                // invalid={(profileDetailsForm.touched.username && profileDetailsForm.errors.username) ? true : false}
                                // error={(profileDetailsForm.touched.username && profileDetailsForm.errors.username) ? profileDetailsForm.errors.username : ""}
                                isDisabled={true}
                            />
                        </div>
                        <div>
                            <TextInput
                                name="role"
                                labelText="Role"
                                value={loggedInUserDetailResp?.role?.name}
                                onChange={undefined}
                                onBlur={profileDetailsForm.handleBlur}
                                // invalid={(profileDetailsForm.touched.password && profileDetailsForm.errors.password) ? true : false}
                                // error={(profileDetailsForm.touched.password && profileDetailsForm.errors.password) ? profileDetailsForm.errors.password : ""}
                                isDisabled={true}
                            />
                        </div>
                        <div>
                            <PhoneInput
                                name="mobile"
                                labelText="Phone No."
                                value={profileDetailsForm.values.mobile}
                                onChange={onChangePhoneInput}
                                onBlur={profileDetailsForm.handleBlur}
                                invalid={(profileDetailsForm.touched.mobile && profileDetailsForm.errors.mobile) ? true : false}
                                error={(profileDetailsForm.touched.mobile && profileDetailsForm.errors.mobile) ? profileDetailsForm.errors.mobile : ""}
                            />
                        </div>
                        <div>
                            <TextInput
                                name="email"
                                labelText="Email Id"
                                value={profileDetailsForm.values.email}
                                onChange={profileDetailsForm.handleChange}
                                onBlur={profileDetailsForm.handleBlur}
                                invalid={(profileDetailsForm.touched.email && profileDetailsForm.errors.email) ? true : false}
                                error={(profileDetailsForm.touched.email && profileDetailsForm.errors.email) ? profileDetailsForm.errors.email : ""}
                            />
                        </div>
                        {/* <div className="col-12">
                            <TextArea
                                name="address"
                                labelText="Address"
                                value={profileDetailsForm.values.address}
                                onChange={profileDetailsForm.handleChange}
                                invalid={(profileDetailsForm.touched.address && profileDetailsForm.errors.address) ? true : false}
                                error={(profileDetailsForm.touched.address && profileDetailsForm.errors.address) ? profileDetailsForm.errors.address : ""}
                            />
                        </div> */}

                        <div className="tw-col-span-full">
                            <div className="tw-flex tw-gap-2 tw-justify-end">
                                {profileDetailsForm.dirty && <Button type="button"
                                    variant="secondary" onClick={cancelHndlr}>Cancel</Button>}
                                <Button type="submit" variant="primary"
                                    disabled={!profileDetailsForm.dirty}
                                >Update</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default ProfileDetails;