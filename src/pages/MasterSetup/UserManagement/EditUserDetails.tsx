import React, { useState, useEffect, useRef } from "react";
// import { Row, Col, Label, Input, Button } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Common Component
import {
    TextIconInput, ProgressIndicator, ModalComponent,
    TextInput, SelectInput, PhoneInput, UploadImageUpdated,
    Button
} from "../../../Components/Common";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { updateRoleTypeUserAct } from "../../../store/usermanagement/usermanagementactions";
//Utility
import { uploadImageFileErrorHndlr, generateRandomPassword } from "../../../utility/commonutility";


const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name required."),
    lastName: Yup.string().required("Last name required."),
    mobile: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required."),
    email: Yup.string().email('Invalid Email.').required("Email id required."),
    username: Yup.string().required("User Name required."),
});

function getEditUserData(profileInfo?: any): any {
    return ({
        firstName: profileInfo?.firstName || "",
        lastName: profileInfo?.lastName || "",
        username: profileInfo?.username || "",
        mobile: profileInfo?.mobile || "",
        email: profileInfo?.email || "",
        version: profileInfo?.version,
        roleId: profileInfo?.role?.id || "",
        enabled: profileInfo?.enabled || "",
    })
}

const initialValues = getEditUserData();
export default function EditUserDetails(props: any) {
    const [editUserImgState, setEditUserImgState] = useState<any>("");
    const [fileUploadErrorMessageState, setFileUploadErrorMessageState] = useState<string>("");

    const dispatch = useAppDispatch();
    const userImgRef = useRef<any>(null);
    const { updateRoleTypeUserResp } = useAppSelector(({ userManagement }) => ({
        updateRoleTypeUserResp: userManagement.updateRoleTypeUserResp,
    }), shallowEqual);

    const profileDetailsRespRef = useRef<any>({
        prevUpdateRoleTypeUserResp: updateRoleTypeUserResp,
    })

    useEffect(() => {
        const { prevUpdateRoleTypeUserResp } = profileDetailsRespRef.current || {};
        if (updateRoleTypeUserResp && prevUpdateRoleTypeUserResp !== updateRoleTypeUserResp) {
            toast.success("User details updated successfully");
            props.toggle(true);
        }
        profileDetailsRespRef.current.prevUpdateRoleTypeUserResp = updateRoleTypeUserResp;
    }, [updateRoleTypeUserResp]);

    const editUserDetailsForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { id, role } = props.editUserDetails,
                { roleType } = role || {};
            const params = { roleType, userId: id };
            const payload = { ...values, instituteId: props.instituteId };
            dispatch(updateRoleTypeUserAct(generateActionPayload("update_user_detail", params, payload)));
        },
    });

    useEffect(() => {
        if (props.isOpen && props.editUserDetails) {
            const editUserData = getEditUserData(props.editUserDetails);
            editUserDetailsForm.resetForm({ values: editUserData });
        } else {
            editUserDetailsForm.resetForm({ values: initialValues });
        }
    }, [props.isOpen, props.editUserDetails]);


    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        editUserDetailsForm.setFieldValue(name, updateDate);
    }

    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        const uploadFileMessage = uploadImageFileErrorHndlr(file.size, file.type);
        if (uploadFileMessage && typeof (uploadFileMessage) === "string") {
            setFileUploadErrorMessageState(uploadFileMessage);
            userImgRef.current = undefined;
            setEditUserImgState(null);
            return;
        }
        setFileUploadErrorMessageState("");
        userImgRef.current = event.target.files[0];
        setEditUserImgState(URL.createObjectURL(file));
    }

    return (
        <>
            <ModalComponent
                id="edit-user-details"
                modalTitle="Update User"
                isOpen={props.isOpen}
                toggle={props.toggle}
                hideFooter={true}
                cancelHndlr={props.toggle}
                modalSize="lg"
            >
                <form onSubmit={editUserDetailsForm.handleSubmit} className="tw-p-6">
                    <div className="tw-grid tw-grid-cols-12 tw-mb-6">
                        <div className="tw-col-span-12 tw-flex tw-flex-col tw-items-center">
                            <UploadImageUpdated
                                name="institute-logo"
                                acceptFileFormat="image/png, image/gif, image/jpeg"
                                value={editUserImgState}
                                onChange={handleFileUploadHnlr}
                                error={fileUploadErrorMessageState}
                            />
                        </div>
                    </div>
                    
                    <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "33px" }}>
                        <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>User Info</p>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <TextInput
                                    name="firstName"
                                    labelText="First Name"
                                    value={editUserDetailsForm.values.firstName}
                                    onChange={editUserDetailsForm.handleChange}
                                    onBlur={editUserDetailsForm.handleBlur}
                                    invalid={(editUserDetailsForm.touched.firstName && editUserDetailsForm.errors.firstName) ? true : false}
                                    error={(editUserDetailsForm.touched.firstName && editUserDetailsForm.errors.firstName) ? editUserDetailsForm.errors.firstName : ""}
                                />
                            </div>
                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <TextInput
                                    name="lastName"
                                    labelText="Last Name"
                                    value={editUserDetailsForm.values.lastName}
                                    onChange={editUserDetailsForm.handleChange}
                                    onBlur={editUserDetailsForm.handleBlur}
                                    invalid={(editUserDetailsForm.touched.lastName && editUserDetailsForm.errors.lastName) ? true : false}
                                    error={(editUserDetailsForm.touched.lastName && editUserDetailsForm.errors.lastName) ? editUserDetailsForm.errors.lastName : ""}
                                />
                            </div>
                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <div className="tw-relative">
                                    <TextIconInput
                                        name="email"
                                        labelText="E-mail"
                                        value={editUserDetailsForm.values.email}
                                        onChange={editUserDetailsForm.handleChange}
                                        onBlur={editUserDetailsForm.handleBlur}
                                        invalid={(editUserDetailsForm.touched.email && editUserDetailsForm.errors.email) ? true : false}
                                        error={(editUserDetailsForm.touched.email && editUserDetailsForm.errors.email) ? editUserDetailsForm.errors.email : ""}
                                        formgroupClassName="tw-mb-0"
                                    />
                                    <i className="ri-mail-unread-line tw-absolute tw-left-3 tw-top-[30px] tw-text-gray-400"></i>
                                </div>
                            </div>
                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <PhoneInput
                                    name="mobile"
                                    labelText="Phone No."
                                    value={editUserDetailsForm.values.mobile}
                                    onChange={onChangePhoneInput}
                                    onBlur={editUserDetailsForm.handleBlur}
                                    invalid={(editUserDetailsForm.touched.mobile && editUserDetailsForm.errors.mobile) ? true : false}
                                    error={(editUserDetailsForm.touched.mobile && editUserDetailsForm.errors.mobile) ? editUserDetailsForm.errors.mobile : ""}
                                />
                            </div>
                        </div>
                    </div>

                     <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "33px" }}>
                        <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Manage Access</p>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-12">
                                <TextInput
                                    name="branch"
                                    labelText="Branch"
                                    value={props?.editBranchAdminDetails?.branchName}
                                    onChange={undefined}
                                    inputClassName="tw-bg-gray-100"
                                />
                            </div>
                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <TextInput
                                    name="username"
                                    labelText="User Name"
                                    value={editUserDetailsForm.values.username}
                                    onChange={editUserDetailsForm.handleChange}
                                    onBlur={editUserDetailsForm.handleBlur}
                                    invalid={(editUserDetailsForm.touched.username && editUserDetailsForm.errors.username) ? true : false}
                                    error={(editUserDetailsForm.touched.username && editUserDetailsForm.errors.username) ? editUserDetailsForm.errors.username : ""}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            variant="primary"
                        >
                            Update
                        </Button>
                    </div>
                </form>
            </ModalComponent>

        </>
    )
}

// <form onSubmit={editUserDetailsForm.handleSubmit}>
//     <div className="row">
//         <div className="col-xs-12 col-md-6">
//             <TextInput
//                 name="firstName"
//                 labelText="First Name"
//                 value={editUserDetailsForm.values.firstName}
//                 onChange={editUserDetailsForm.handleChange}
//                 onBlur={editUserDetailsForm.handleBlur}
//                 invalid={(editUserDetailsForm.touched.firstName && editUserDetailsForm.errors.firstName) ? true : false}
//                 error={(editUserDetailsForm.touched.firstName && editUserDetailsForm.errors.firstName) ? editUserDetailsForm.errors.firstName : ""}
//             />
//         </div>
//         <div className="col-xs-12 col-md-6">
//             <TextInput
//                 name="lastName"
//                 labelText="Last Name"
//                 value={editUserDetailsForm.values.lastName}
//                 onChange={editUserDetailsForm.handleChange}
//                 onBlur={editUserDetailsForm.handleBlur}
//                 invalid={(editUserDetailsForm.touched.lastName && editUserDetailsForm.errors.lastName) ? true : false}
//                 error={(editUserDetailsForm.touched.lastName && editUserDetailsForm.errors.lastName) ? editUserDetailsForm.errors.lastName : ""}
//             />
//         </div>
//         {/* <div className="col-xs-12 col-md-6">
//                             <SelectInput
//                                 name="gender"
//                                 labelText="Gender"
//                                 value={editUserDetailsForm.values.gender}
//                                 onChange={editUserDetailsForm.handleChange}
//                                 invalid={(editUserDetailsForm.touched.gender && editUserDetailsForm.errors.gender) ? true : false}
//                                 error={(editUserDetailsForm.touched.gender && editUserDetailsForm.errors.gender) ? editUserDetailsForm.errors.gender : ""}
//                                 menuItems={[{ id: "male", name: "Male" }, { id: "female", name: "Female" }]}
//                                 valueKey="id"
//                                 textKey="name"
//                             />
//                         </div> */}
//         {/* <div className="col-xs-12 col-md-6">
//                             <DateInput
//                                 name="dateOfBirth"
//                                 labelText="Start Date"
//                                 value={editUserDetailsForm.values.dateOfBirth}
//                                 onChange={editUserDetailsForm.handleChange}
//                                 invalid={(editUserDetailsForm.touched.dateOfBirth && editUserDetailsForm.errors.dateOfBirth) ? true : false}
//                                 error={(editUserDetailsForm.touched.dateOfBirth && editUserDetailsForm.errors.dateOfBirth) ? editUserDetailsForm.errors.dateOfBirth : ""}
//                             />
//                         </div> */}
//         <div className="col-xs-12 col-md-6">
//             <TextInput
//                 name="username"
//                 labelText="User Name"
//                 value={editUserDetailsForm.values.username}
//                 onChange={undefined}
//                 onBlur={editUserDetailsForm.handleBlur}
//                 // invalid={(editUserDetailsForm.touched.username && editUserDetailsForm.errors.username) ? true : false}
//                 // error={(editUserDetailsForm.touched.username && editUserDetailsForm.errors.username) ? editUserDetailsForm.errors.username : ""}
//                 isDisabled={true}
//             />
//         </div>
//         <div className="col-xs-12 col-md-6">
//             <TextInput
//                 name="role"
//                 labelText="Role"
//                 value={props.editUserDetails?.role?.name}
//                 onChange={undefined}
//                 onBlur={editUserDetailsForm.handleBlur}
//                 // invalid={(editUserDetailsForm.touched.password && editUserDetailsForm.errors.password) ? true : false}
//                 // error={(editUserDetailsForm.touched.password && editUserDetailsForm.errors.password) ? editUserDetailsForm.errors.password : ""}
//                 isDisabled={true}
//             />
//         </div>
//         <div className="col-xs-12 col-md-6">
//             <PhoneInput
//                 name="mobile"
//                 labelText="Phone No."
//                 value={editUserDetailsForm.values.mobile}
//                 onChange={onChangePhoneInput}
//                 onBlur={editUserDetailsForm.handleBlur}
//                 invalid={(editUserDetailsForm.touched.mobile && editUserDetailsForm.errors.mobile) ? true : false}
//                 error={(editUserDetailsForm.touched.mobile && editUserDetailsForm.errors.mobile) ? editUserDetailsForm.errors.mobile : ""}
//             />
//         </div>
//         <div className="col-xs-12 col-md-6">
//             <TextInput
//                 name="email"
//                 labelText="Email Id"
//                 value={editUserDetailsForm.values.email}
//                 onChange={editUserDetailsForm.handleChange}
//                 onBlur={editUserDetailsForm.handleBlur}
//                 invalid={(editUserDetailsForm.touched.email && editUserDetailsForm.errors.email) ? true : false}
//                 error={(editUserDetailsForm.touched.email && editUserDetailsForm.errors.email) ? editUserDetailsForm.errors.email : ""}
//             />
//         </div>
//         {/* <div className="col-12">
//                             <TextArea
//                                 name="address"
//                                 labelText="Address"
//                                 value={editUserDetailsForm.values.address}
//                                 onChange={editUserDetailsForm.handleChange}
//                                 invalid={(editUserDetailsForm.touched.address && editUserDetailsForm.errors.address) ? true : false}
//                                 error={(editUserDetailsForm.touched.address && editUserDetailsForm.errors.address) ? editUserDetailsForm.errors.address : ""}
//                             />
//                         </div> */}

        // <div className="col-12 mt-2">
        //     <div className="text-end">
        //         <button type="button"
        //             className="btn btn-light me-2" onClick={props.toggle}>Cancel</button>
        //         <button type="submit"
        //             className="btn btn-success">Update</button>
        //     </div>
        // </div>
//     </div>
// </form>