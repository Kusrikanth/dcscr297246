import React, { useState, useEffect, useRef } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
 TextIconInput, TextInput, PhoneInput ,  UploadImageUpdated
} from "../../../Components/Common";

//Images

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { addBranchAdminAct, updateBranchAdminAct } from "../../../store/mastersettings/branch/branchactions";
import { getInstRoleTypeAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

import {  getCountryStateAct } from "../../../store/masterdata/masterdataactions";
import { Switch } from "../../../Components/Common";
//Utility
import { uploadImageFileErrorHndlr, generateRandomPassword } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";

//Interface & Types

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name required."),
    lastName: Yup.string().required("Last name required."),
    email: Yup.string().email('Invalid Email.').required('Email is required.').nullable(),
    mobile: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required."),
    username: Yup.string().required("User Name required."),
    // password: Yup.string().required("Password required."),
    password: Yup.string().when('id', {
        is: (adminId: any) => !adminId,
        then: Yup.string()
            .required('Password required required.')
    }),
});


function getAddEditBranchAdminData(branchAdminDetails?: any): any {
    const { branchAdminBasicDetails } = branchAdminDetails || {};
    return ({
        id: branchAdminBasicDetails?.id || undefined,
        firstName: branchAdminBasicDetails?.firstName || undefined,
        lastName: branchAdminBasicDetails?.lastName || undefined,
        email: branchAdminBasicDetails?.email || undefined,
        mobile: branchAdminBasicDetails?.mobile || undefined,
        username: branchAdminBasicDetails?.username || undefined,
        roleId: branchAdminDetails?.roleId || undefined,
        instituteId: branchAdminDetails?.instituteId || undefined,
        branchId: branchAdminDetails?.branchId || undefined,
        password: branchAdminDetails?.password || undefined,
        version: branchAdminBasicDetails?.version,
        enabled: true,
        sendLoginDetail: false,
    })
}

const AddBranchAdminModal: React.FC<any> = (props) => {
    const [addBranchState, setAddBranchAdminState] = useState<any>(() => getAddEditBranchAdminData());
    const [branchAdminImgState, setBranchAdminImgState] = useState<any>("");
    const [fileUploadErrorMessageState, setFileUploadErrorMessageState] = useState<string>("");

    const branchLogoFileRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    const { addBranchAdminResp, updateBranchAdminResp, instRoleTypeListResp,showApiLoader
        , instInfoError } = useAppSelector(({ branch, globalData, instituteInfo }) => ({
            addBranchAdminResp: branch.addBranchAdminResp,
            updateBranchAdminResp: branch.updateBranchAdminResp,
            instRoleTypeListResp: instituteInfo.instRoleTypeListResp,
            instInfoError: instituteInfo.instInfoError,
            showApiLoader:globalData.showApiLoader,
        }), shallowEqual);

    const addBranchModalRespRef = useRef<any>({
        prevAddBranchAdminResp: addBranchAdminResp,
        prevUpdateBranchAdminResp: updateBranchAdminResp,
        prevInstRoleTypeListResp: instRoleTypeListResp,
        prevInstInfoError: instInfoError,
    });

    useEffect(() => {
        if (props.isOpen) {
            const { instituteId } = props;
            const payload = {
                instituteId, is_predefined: true
            };
            const params = { roleType: "BRANCH" };
            dispatch(getInstRoleTypeAct(generateActionPayload("get_inst_role_type", params, payload)));

        } else {
            addBranchAdminForm.resetForm();
        }
    }, [props.isOpen, props.instituteId]);

    useEffect(() => {
        if (props.editBranchAdminDetails) {
            setAddBranchAdminState(getAddEditBranchAdminData(props.editBranchAdminDetails));
        } else {
            setAddBranchAdminState(getAddEditBranchAdminData());
            addBranchAdminForm.resetForm();
        }
    }, [props.editBranchAdminDetails]);

    useEffect(() => {
        const { prevAddBranchAdminResp, prevUpdateBranchAdminResp, prevInstRoleTypeListResp, prevInstInfoError } = addBranchModalRespRef.current;
        if (addBranchAdminResp && prevAddBranchAdminResp !== addBranchAdminResp) {
            toast.success("Branch admin added successfully.");
            props.toggle(true);
        } else if (updateBranchAdminResp && prevUpdateBranchAdminResp !== updateBranchAdminResp) {
            toast.success("Branch admin updated successfully.");
            props.toggle(true);
        } else if (instRoleTypeListResp && prevInstRoleTypeListResp !== instRoleTypeListResp) {
            const { data } = instRoleTypeListResp;
            if (Array.isArray(data)) {
                const { id } = data.find(item => item.name === "Branch_Admin") || {};
                addBranchAdminForm.setFieldValue("roleId", id);
            }
        } else if (instInfoError && prevInstInfoError !== instInfoError) {
            const { details } = instInfoError;
            toast.error(details);
        }
        addBranchModalRespRef.current.prevAddBranchAdminResp = addBranchAdminResp;
        addBranchModalRespRef.current.prevUpdateBranchAdminResp = updateBranchAdminResp;
        addBranchModalRespRef.current.prevInstRoleTypeListResp = instRoleTypeListResp;
        addBranchModalRespRef.current.prevInstInfoError = instInfoError;
    }, [addBranchAdminResp, updateBranchAdminResp, instRoleTypeListResp, instInfoError]);

    const addBranchAdminForm = useFormik({
        enableReinitialize: true,
        initialValues: addBranchState,
        validationSchema,
        onSubmit: (values) => {
            if (props.branchAdminId) {
                const { id, password, ...payload } = values;
                const params = { roleType: "BRANCH", userId: id };
                dispatch(updateBranchAdminAct(generateActionPayload("update_user_detail", params, payload)));

            } else {
                const payload = { ...values };
                dispatch(addBranchAdminAct(generateActionPayload("add_branch_admin", undefined, payload)));
            }
        },
    });

    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        addBranchAdminForm.setFieldValue(name, updateDate);
    }
    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (value)
            dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: value })));
        addBranchAdminForm.setValues((prevState: any) => ({ ...prevState, stateId: "", [name]: value }));
    }


    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        const uploadFileMessage = uploadImageFileErrorHndlr(file.size, file.type);
        if (uploadFileMessage && typeof (uploadFileMessage) === "string") {
            setFileUploadErrorMessageState(uploadFileMessage);
            branchLogoFileRef.current = undefined;
            setBranchAdminImgState(null);
            return;
        }
        setFileUploadErrorMessageState("");
        branchLogoFileRef.current = event.target.files[0];
        setBranchAdminImgState(URL.createObjectURL(file));

    }

    function generateRandomPwdHndlr() {
        const randomPassword = generateRandomPassword();
        addBranchAdminForm.setFieldValue("password", randomPassword);
    }

    return (
    
        <div className="tw-p-4">

            <div className="tw-flex tw-flex-wrap tw--mx-3">
                <div className="tw-w-full md:tw-w-1/2 tw-px-3 tw-flex tw-flex-col tw-items-center tw-mx-auto tw-mb-4">
                    <UploadImageUpdated
                        name="institute-logo"
                        acceptFileFormat="image/png, image/gif, image/jpeg"
                        value={branchAdminImgState}
                        onChange={handleFileUploadHnlr}
                        error={fileUploadErrorMessageState}
                    />
                </div>
            </div>

            <div className="tw-relative tw-w-full tw-p-5 tw-border tw-border-gray-300 tw-rounded-md tw-mb-8">
                <p className="tw-absolute tw--top-3 tw-left-4 tw-px-3 tw-text-gray-600 tw-bg-white">
                    User Info
                </p>

                <div className="tw-flex tw-flex-wrap tw--mx-3">

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3 tw-mb-4">
                        <TextInput
                            name="firstName"
                            labelText="First Name"
                            value={addBranchAdminForm.values.firstName}
                            onChange={addBranchAdminForm.handleChange}
                            onBlur={addBranchAdminForm.handleBlur}
                            invalid={(addBranchAdminForm.touched.firstName && addBranchAdminForm.errors.firstName) ? true : false}
                            error={(addBranchAdminForm.touched.firstName && addBranchAdminForm.errors.firstName) ? addBranchAdminForm.errors.firstName : ""}
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3 tw-mb-4">
                        <TextInput
                            name="lastName"
                            labelText="Last Name"
                            value={addBranchAdminForm.values.lastName}
                            onChange={addBranchAdminForm.handleChange}
                            onBlur={addBranchAdminForm.handleBlur}
                            invalid={(addBranchAdminForm.touched.lastName && addBranchAdminForm.errors.lastName) ? true : false}
                            error={(addBranchAdminForm.touched.lastName && addBranchAdminForm.errors.lastName) ? addBranchAdminForm.errors.lastName : ""}
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3 tw-mb-4">
                        <TextIconInput
                            name="email"
                            labelText="E-mail"
                            value={addBranchAdminForm.values.email}
                            onChange={addBranchAdminForm.handleChange}
                            onBlur={addBranchAdminForm.handleBlur}
                            invalid={(addBranchAdminForm.touched.email && addBranchAdminForm.errors.email) ? true : false}
                            error={(addBranchAdminForm.touched.email && addBranchAdminForm.errors.email) ? addBranchAdminForm.errors.email : ""}
                        >
                            <i className="ri-mail-unread-line"></i>
                        </TextIconInput>
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3 tw-mb-4">
                        <PhoneInput
                            name="mobile"
                            labelText="Phone No."
                            value={addBranchAdminForm.values.mobile}
                            onChange={onChangePhoneInput}
                            onBlur={addBranchAdminForm.handleBlur}
                            invalid={(addBranchAdminForm.touched.mobile && addBranchAdminForm.errors.mobile) ? true : false}
                            error={(addBranchAdminForm.touched.mobile && addBranchAdminForm.errors.mobile) ? addBranchAdminForm.errors.mobile : ""}
                        />
                    </div>
                </div>
            </div>

            <div className="tw-relative tw-w-full tw-p-5 tw-border tw-border-gray-300 tw-rounded-md tw-mb-8">
                <p className="tw-absolute tw--top-3 tw-left-4 tw-px-3 tw-text-gray-600 tw-bg-white">
                    Manage Access
                </p>

                <div className="tw-flex tw-flex-wrap tw--mx-3">

                    <div className="tw-w-full tw-px-3 tw-mb-4">
                        <TextInput
                            name="branch"
                            labelText="Branch"
                            value={props?.editBranchAdminDetails?.branchName}
                            onChange={() => { }}
                            inputClassName="tw-bg-gray-100"
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3 tw-mb-4">
                        <TextInput
                            name="username"
                            labelText="User Name"
                            value={addBranchAdminForm.values.username}
                            onChange={addBranchAdminForm.handleChange}
                            onBlur={addBranchAdminForm.handleBlur}
                            invalid={(addBranchAdminForm.touched.username && addBranchAdminForm.errors.username) ? true : false}
                            error={(addBranchAdminForm.touched.username && addBranchAdminForm.errors.username) ? addBranchAdminForm.errors.username : ""}
                        />
                    </div>

                    {!props.branchAdminId && (
                        <>
                            <div className="tw-w-full md:tw-w-1/2 tw-px-3 tw-mb-4">
                                <TextInput
                                    name="password"
                                    labelText="Password"
                                    value={addBranchAdminForm.values.password}
                                    onChange={addBranchAdminForm.handleChange}
                                    onBlur={addBranchAdminForm.handleBlur}
                                    invalid={(addBranchAdminForm.touched.password && addBranchAdminForm.errors.password) ? true : false}
                                    error={(addBranchAdminForm.touched.password && addBranchAdminForm.errors.password) ? addBranchAdminForm.errors.password : ""}
                        />
                            </div>

                            <div className="tw-w-full sm:tw-w-auto tw-px-3 tw-flex tw-items-end tw-ml-auto tw-mb-4">
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="tw-px-4 tw-py-2 tw-bg-[#F4F7FE] tw-text-gray-600 tw-rounded-md tw-hover:tw-bg-gray-200"
                                    onClick={generateRandomPwdHndlr}
                                >
                                    <i className="ri-add-fill tw-mr-1"></i>
                                    Generate Password
                                </Button>
                            </div>
                        </>
                    )}

                </div>
            </div>

            <div className="tw-mb-6">
                <Switch
                    attributeId={"sendLoginDetail"}
                    checked={addBranchAdminForm.values.sendLoginDetail}
                    onChangeHndlr={addBranchAdminForm.handleChange}
                    labelName={"Email Login Details to this user"}
                />
            </div>

            <div className="tw-flex tw-gap-3 tw-justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => addBranchAdminForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    Update
                </Button>
            </div>

        </div>

    )
}

export default React.memo(AddBranchAdminModal);