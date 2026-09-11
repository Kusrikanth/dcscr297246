import React, { useState, useRef, useEffect } from "react";
import { Form, Label, Input } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { shallowEqual } from "react-redux";

import ReactPhoneInput from "react-phone-input-2";

import { ModalContainer, TextIconInput, TextInput, SelectInput, PhoneInput, UploadImage } from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

// import "react-phone-input-2/lib/style.css";

//Images
import DPSLogoSM from "../../../assets/imagesdps/mastersetup/dps_logo.png";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstituteGroupsAct } from "../../../store/masterdata/masterdataactions";
import { createInstituteAct, uploadInstLogoAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

interface IAddInstModal {
    instituteName: any,
    instituteGroupId: any,
    instituteCode: any,
    afflicationNo: any,
    trustName: any,
    institutionEmail: any,
    institutionPhoneNo: any,
    address: any,
    city: any,
    area: any,
    pinCode: any,
    contactPersonName: any,
    contactPersonPhoneNo: any,
    contactPersonEmail: any,
    licenceType: any,
    expiryDate: any,
    websiteUrl: any
}

function getAddEditBranchData(instDetails?: any): any {
    return ({
        instituteName: "",
        instituteGroupId: "",
        instituteCode: "",
        afflicationNo: "",
        trustName: "",
        institutionEmail: "",
        institutionPhoneNo: "",
        address: "",
        city: "city",
        area: "test area",
        pinCode: "342324",
        contactPersonName: "",
        contactPersonPhoneNo: "2343243242",
        contactPersonEmail: "",
        licenceType: "FRERWre",
        expiryDate: "2022-20-10",
        websiteUrl: "https://www.sample.com"
    })
}

const AddInstitute: React.FC<any> = (props) => {
    const [addInstState, setAddInstState] = useState<IAddInstModal>(() => getAddEditBranchData());
    const [uploadedFileUrlState, setUploadedFileUrlState] = useState("");
    const dispatch = useAppDispatch();
    const { masterInstGroupsResp, createInstituteResp, uploadInstLogoResp, updateInstResp } = useAppSelector(({ masterData, instituteInfo }) => ({
        masterInstGroupsResp: masterData.masterInstGroupsResp,
        createInstituteResp: instituteInfo.createInstituteResp,
        uploadInstLogoResp: instituteInfo.uploadInstLogoResp,
        updateInstResp: instituteInfo.updateInstResp,
    }), shallowEqual);

    const addInstModalRespRef = useRef<any>({
        prevCreateInstituteResp: createInstituteResp,
        prevUpdateInstResp: updateInstResp,
        prevUploadInstLogoResp: uploadInstLogoResp
    });

    useEffect(() => {
        if (!masterInstGroupsResp && props.isOpen) {
            dispatch(getInstituteGroupsAct(generateActionPayload("get_master_inst_groups")));
        } else if (!props.isOpen) {
            setAddInstState(getAddEditBranchData());
            addInstituteForm.resetForm();
        }
    }, [props.isOpen, masterInstGroupsResp]);


    useEffect(() => {
        const { prevCreateInstituteResp, prevUpdateInstResp, prevUploadInstLogoResp } = addInstModalRespRef.current;
        if (createInstituteResp && prevCreateInstituteResp !== createInstituteResp) {
            props.toast.success("Institute added successfully.");
            props.toggle(true);
        } else if (updateInstResp && prevUpdateInstResp !== updateInstResp) {
            props.toast.success("Institute updated successfully.");
            props.toggle(true);
        } else if (uploadInstLogoResp && prevUploadInstLogoResp !== uploadInstLogoResp) {
            props.toast.success("Logo updated successfully.");
        }
        addInstModalRespRef.current.prevCreateInstituteResp = createInstituteResp;
        addInstModalRespRef.current.prevUpdateInstResp = updateInstResp;
        addInstModalRespRef.current.prevUploadInstLogoResp = uploadInstLogoResp;
    }, [createInstituteResp, uploadInstLogoResp, updateInstResp]);

    const addInstituteForm = useFormik({
        enableReinitialize: true,
        initialValues: addInstState,
        // validationSchema: {},
        onSubmit: (values: any) => {
            if (props.instituteGroupId) {
                //
            } else {
                dispatch(createInstituteAct(generateActionPayload("create_inst", undefined, values)));
            }
        },
    });
    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        addInstituteForm.setFieldValue(name, updateDate);
    }

    const [fileState, setFileState] = useState<any>(""),
        [uploadLogoUrlState, setUploadLogoUrlState] = useState("");

    const uploadedFileInfo = useRef<any>("");
    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        uploadedFileInfo.current = event.target.files[0];
        setFileState(URL.createObjectURL(file));
        const params = { instituteId: "54a42c4d-47aa-40b7-bd6b-284702aaebi7", isTemporaryFile: false };
        const formData = new FormData();
        formData.append("file", file);
        dispatch(uploadInstLogoAct(generateActionPayload("upload_inst_logo", params, formData)));
    }

    return (
        <ModalContainer
            id="add-branch-modal"
            modalTitle={props.modalTitle}
            isOpen={props.isOpen}
            toggle={props.toggle}
            submitTitle={props.branchId ? "Update" : "Submit"}
            submitHndlr={addInstituteForm.handleSubmit}
            cancelHndlr={props.toggle}
        >
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-gap-y-1">
                <div className="md:tw-col-span-2 tw-flex tw-justify-center tw-mb-4">
                    {/* <div className="position-relative d-inline-block">
                        <div className="position-absolute bottom-0 end-0">
                            <Label htmlFor="customer-image-input" className="mb-0">
                                <div className="avatar-xs cursor-pointer">
                                    <div className="avatar-title bg-white border rounded-circle text-muted">
                                        <i className="ri-image-fill"></i>
                                    </div>
                                </div>
                            </Label>
                            <Input className="form-control d-none" id="customer-image-input" type="file"
                                accept="image/png, image/gif, image/jpeg"
                            />
                        </div>
                        <div className="avatar-lg p-1">
                            <div className="avatar-title bg-light rounded-circle">
                                <img src={DPSLogoSM} alt="logo" id="customer-img" className="avatar-md rounded-circle object-cover" />
                            </div>
                        </div>
                    </div> */}
                    <UploadImage
                        name="institute-logo"
                        acceptFileFormat="image/png, image/gif, image/jpeg"
                        value={fileState}
                        onChange={handleFileUploadHnlr}

                    />

                </div>
                <div className="tw-col-span-1">
                    <TextInput
                        name="instituteName"
                        labelText="Institute Name"
                        value={addInstituteForm.values.instituteName}
                        onChange={addInstituteForm.handleChange}
                        invalid={(addInstituteForm.touched.instituteName && addInstituteForm.errors.instituteName) ? true : false}
                        error={(addInstituteForm.touched.instituteName && addInstituteForm.errors.instituteName) ? addInstituteForm.errors.instituteName : ""}
                    />
                </div>
                <div className="tw-col-span-1">
                    <TextInput
                        name="instituteCode"
                        labelText="Short Code"
                        value={addInstituteForm.values.instituteCode}
                        onChange={addInstituteForm.handleChange}
                        invalid={(addInstituteForm.touched.instituteCode && addInstituteForm.errors.instituteCode) ? true : false}
                        error={(addInstituteForm.touched.instituteCode && addInstituteForm.errors.instituteCode) ? addInstituteForm.errors.instituteCode : ""}
                    />
                </div>
                <div className="tw-col-span-1">
                    <SelectInput
                        name="instituteGroupId"
                        labelText="Institute Group"
                        value={addInstituteForm.values.instituteGroupId}
                        onChange={addInstituteForm.handleChange}
                        invalid={(addInstituteForm.touched.instituteGroupId && addInstituteForm.errors.instituteGroupId) ? true : false}
                        error={(addInstituteForm.touched.instituteGroupId && addInstituteForm.errors.instituteGroupId) ? addInstituteForm.errors.instituteGroupId : ""}
                        menuItems={masterInstGroupsResp}
                        valueKey="id"
                        textKey="instituteGroupName"
                    />
                </div>
                <div className="tw-col-span-1">
                    <TextInput
                        name="afflicationNo"
                        labelText="Affliation No"
                        value={addInstituteForm.values.afflicationNo}
                        onChange={addInstituteForm.handleChange}
                        invalid={(addInstituteForm.touched.afflicationNo && addInstituteForm.errors.afflicationNo) ? true : false}
                        error={(addInstituteForm.touched.afflicationNo && addInstituteForm.errors.afflicationNo) ? addInstituteForm.errors.afflicationNo : ""}
                    />
                </div>
                <div className="tw-col-span-1">
                    <TextInput
                        name="trustName"
                        labelText="Trust Name"
                        value={addInstituteForm.values.trustName}
                        onChange={addInstituteForm.handleChange}
                        invalid={(addInstituteForm.touched.trustName && addInstituteForm.errors.trustName) ? true : false}
                        error={(addInstituteForm.touched.trustName && addInstituteForm.errors.trustName) ? addInstituteForm.errors.trustName : ""}
                    />
                </div>
                <div className="tw-col-span-1">
                    <TextInput
                        name="contactPersonName"
                        labelText="Contact Name"
                        value={addInstituteForm.values.contactPersonName}
                        onChange={addInstituteForm.handleChange}
                        invalid={(addInstituteForm.touched.contactPersonName && addInstituteForm.errors.contactPersonName) ? true : false}
                        error={(addInstituteForm.touched.contactPersonName && addInstituteForm.errors.contactPersonName) ? addInstituteForm.errors.contactPersonName : ""}
                    />
                </div>
                <div className="tw-col-span-1">
                    <TextIconInput
                        name="contactPersonEmail"
                        labelText="Contact Person Email"
                        value={addInstituteForm.values.contactPersonEmail}
                        onChange={addInstituteForm.handleChange}
                        invalid={(addInstituteForm.touched.contactPersonEmail && addInstituteForm.errors.contactPersonEmail) ? true : false}
                        error={(addInstituteForm.touched.contactPersonEmail && addInstituteForm.errors.contactPersonEmail) ? addInstituteForm.errors.contactPersonEmail : ""}
                    ><i className="ri-mail-unread-line"></i></TextIconInput>
                </div>
                <div className="tw-col-span-1">
                    <PhoneInput
                        name="institutionPhoneNo"
                        labelText="Phone No."
                        value={addInstituteForm.values.institutionPhoneNo}
                        onChange={onChangePhoneInput}
                        invalid={(addInstituteForm.touched.institutionPhoneNo && addInstituteForm.errors.institutionPhoneNo) ? true : false}
                        error={(addInstituteForm.touched.institutionPhoneNo && addInstituteForm.errors.institutionPhoneNo) ? addInstituteForm.errors.institutionPhoneNo : ""}
                    />
                </div>
                <div className="tw-col-span-1">
                    <TextIconInput
                        name="institutionEmail"
                        labelText="Email ID"
                        value={addInstituteForm.values.institutionEmail}
                        onChange={addInstituteForm.handleChange}
                        invalid={(addInstituteForm.touched.institutionEmail && addInstituteForm.errors.institutionEmail) ? true : false}
                        error={(addInstituteForm.touched.institutionEmail && addInstituteForm.errors.institutionEmail) ? addInstituteForm.errors.institutionEmail : ""}
                    ><i className="ri-mail-unread-line"></i></TextIconInput>
                </div>
                <div className="tw-col-span-1">
                    <TextIconInput
                        name="address"
                        labelText="Location"
                        value={addInstituteForm.values.address}
                        onChange={addInstituteForm.handleChange}
                    // invalid={(addInstituteForm.touched.location && addInstituteForm.errors.location) ? true : false}
                    // error={(addInstituteForm.touched.location && addInstituteForm.errors.location) ? addInstituteForm.errors.location : ""}
                    ><i className="ri-map-pin-line"></i></TextIconInput>
                </div>
                <div className="md:tw-col-span-2">
                    <div className="tw-mb-3">
                        <Label htmlFor="subDomain" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">URL / Subdomain</Label>
                        <Input readOnly value="https://www.dps-hyd.digitalcaampus.com" type="email" id="subDomain" className="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-bg-gray-50 tw-text-gray-500 tw-text-sm tw-px-3 tw-py-2" />
                    </div>
                </div>
            </div>
        </ModalContainer >
    )
}

export default React.memo(AddInstitute);