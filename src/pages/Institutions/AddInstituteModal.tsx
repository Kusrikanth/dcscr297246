import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Label, Input } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
    ModalContainer, TextIconInput, TextInput, SelectInput, PhoneInput
    , UploadImage,
    TextInputWithRegex,
    UploadImageUpdated,
    TextArea,
    DateInput
} from "../../Components/Common";

//Images
import DPSLogoSM from "../../assets/imagesdps/mastersetup/dps_logo.png";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../../utility/reduxutility";
import { addInstBranchAct, getBranchByIdAct, updateBranchAct } from "../../store/mastersettings/branch/branchactions";
import { getBranchTypesAct, getMasterTrustAct, resetCountryStateAct, setCountryStateAct } from "../../store/masterdata/masterdataactions";
import { getCountriesAct, getCountryStateAct } from "../../store/masterdata/masterdataactions";

//Utility
import { uploadImageFileErrorHndlr } from "../../utility/commonutility";

//Interface & Types
import { IAddBranch, IBranchInfo, IUpdateBranchResp } from "../../store/mastersettings/branch/branchtypes";
import { IAddBranchProps, IAddBranchModalRespRef } from "./institutetypes";
import { IBranchTypes } from "../../store/masterdata/masterdatatypes"
import { updateInstByIdAct } from "../../store/mastersettings/instituteinfo/instituteinfoactions";
import { Current_Date_YYYYMMDD, getYyyyMmDdFormat } from "../../utility/dateutility";

const validationSchema = Yup.object().shape({
    instituteName: Yup.string().required("Institute name required."),
    shortName: Yup.string().required("Short code required."),
    affiliationNo: Yup.number().typeError("Enter a valid number.").required("Affiliation number required."),
    institutionPhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required.").nullable(),
    trustId: Yup.string().required("Trusty name required."),
    contactPersonFirstName: Yup.string().required("First name required."),
    contactPersonLastName: Yup.string().required("Last name required."),
    contactPerEmailId: Yup.string().email('Invalid Email.').required('Email is required.').nullable(),
    emailId: Yup.string().email('Invalid Email.').required('Institution Email is required.').nullable(),
    contactPersonPhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required.").nullable(),
    address: Yup.string().required("Location required."),
    licenceType: Yup.string().required("Licence type required."),
    websiteUrl: Yup.string().required("Website url required."),
    pincode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required."),
    licenseExpiryDate: Yup.string().required("License expiry date required."),
    countryId: Yup.string().required("Country required."),
    stateId: Yup.string().required("State required.")
});

function getAddEditInstData(instituteDetails?: any): any {    
    return ({
        instituteName: instituteDetails?.instituteName || undefined,
        shortName: instituteDetails?.shortName || undefined,
        affiliationNo: instituteDetails?.affiliationNo || undefined,
        trustId: instituteDetails?.trustId || undefined,
        emailId: instituteDetails?.emailId || undefined,
        institutionPhoneNo: instituteDetails?.institutionPhoneNo || undefined,
        licenceType: instituteDetails?.licenceType || undefined,
        licenseExpiryDate: (instituteDetails?.licenseExpiryDate) ? getYyyyMmDdFormat(instituteDetails.licenseExpiryDate) : undefined,
        websiteUrl: instituteDetails?.websiteUrl || undefined,
        contactPersonFirstName: instituteDetails?.contactPersonFirstName || undefined,
        contactPersonLastName: instituteDetails?.contactPersonLastName || undefined,
        contactPerEmailId: instituteDetails?.contactPerEmailId || undefined,
        contactPersonPhoneNo: instituteDetails?.contactPersonPhoneNo || undefined,
        countryId: instituteDetails?.countryId || undefined,
        stateId: instituteDetails?.stateId || undefined,
        address: instituteDetails?.address || undefined,
        pincode: instituteDetails?.pincode || undefined
    })
}

const initialState = getAddEditInstData();
const AddInstituteModal: React.FC<any> = (props) => {      
    console.log(props);
    
    const [addInstituteState, setAddBranchState] = useState<any>(() => getAddEditInstData());
    const [branchLogoFileState, setBranchLogoFileState] = useState<any>("");
    const branchLogoFileRef = useRef<any>(null);
    const [fileUploadErrorMessageState, setFileUploadErrorMessageState] = useState<string>("");

    const dispatch = useAppDispatch();
    const { createInstituteResp, updateInstResp, masterTrustResp, countriesResp, countryStateResp, userMeResp, instituteListResp } = useAppSelector(({ branch, instituteInfo, masterData, login }) => ({
        createInstituteResp: instituteInfo.createInstituteResp,
        updateInstResp: instituteInfo.updateInstResp,
        masterTrustResp: masterData.masterTrustResp,
        countriesResp: masterData.countriesResp,
        countryStateResp: masterData.countryStateResp,
        userMeResp: login.userMeResp,
        instituteListResp: instituteInfo.instituteListResp,


    }), shallowEqual);

    const addBranchModalRespRef = useRef<any>({
        prevCreateInstituteResp: createInstituteResp,
        prevUpdateInstResp: updateInstResp,
    });

    //Component Did Mount

    useEffect(() => {
        if (props.editInstituteDetails) {
            const value = props.editInstituteDetails.countryId;
            dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: value })));
        }
    }, [props.editInstituteDetails]);

    useEffect(() => {
        if (props.isOpen && props.editInstituteDetails) {
            const editInstData = getAddEditInstData(props.editInstituteDetails);
            addInstituteForm.resetForm({ values: editInstData });
        } else {
            addInstituteForm.resetForm({ values: initialState });
        }
    }, [props.isOpen, props.editInstituteDetails]);


    useEffect(() => {
        dispatch(getMasterTrustAct(generateActionPayload("get_master_trust")));
        dispatch(getCountriesAct(generateActionPayload("get_countries")));
    },[])

    useEffect(() => {
        const { prevCreateInstituteResp, prevUpdateInstResp, prevMasterDataErrorResp } = addBranchModalRespRef.current;
        if (createInstituteResp && prevCreateInstituteResp !== createInstituteResp) {
            toast.success("Institute added successfully.");
            props.toggle(true);
        } else if (updateInstResp && prevUpdateInstResp !== updateInstResp) {
            toast.success("Institute updated successfully.");
            props.toggle(true);
        }
        addBranchModalRespRef.current.prevCreateInstituteResp = createInstituteResp;
        addBranchModalRespRef.current.prevUpdateInstResp = updateInstResp;
    }, [createInstituteResp, updateInstResp]);
    
    const addInstituteForm = useFormik({
        enableReinitialize: true,
        initialValues: initialState,
        validationSchema,
        onSubmit: (values) => {
            if (props.instituteId) {
                const payload = {
                    ...values,
                    id: props.instituteId,
                    instituteGroupId: props?.editInstituteDetails?.instituteGroupId
                }
                const formData: any = new FormData();
                // if (branchLogoFileRef.current)
                formData.append("file", branchLogoFileRef.current);
                formData.append("institutesRequest", JSON.stringify(payload));
                // dispatch(updateBranchAct(generateActionPayload("add_inst_branch", undefined, formData)));
                
                dispatch(updateInstByIdAct(generateActionPayload("update_inst_details", undefined, formData)));
                
            } else {
                const payload: any = {
                    ...values, instituteId: props.instituteId, instituteGroupId: "1"
                }
                const formData = new FormData();
                // if (branchLogoFileRef.current)
                formData.append("file", branchLogoFileRef.current);
                formData.append("institutesRequest", JSON.stringify(payload));
                // dispatch(updateInstByIdAct(generateActionPayload("update_inst_details", undefined, formData)));
                dispatch(addInstBranchAct(generateActionPayload("update_inst_details", undefined, formData)));
            }
        },
    });

    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        addInstituteForm.setFieldValue(name, updateDate);
    }

    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (value) {
          dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: value })));
          dispatch(setCountryStateAct(undefined));
        }
        addInstituteForm.setValues((prevState: any) => ({ ...prevState, stateId: "", [name]: value }));
      }

    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        const uploadFileMessage = uploadImageFileErrorHndlr(file.size, file.type);
        if (uploadFileMessage && typeof (uploadFileMessage) === "string") {
            setFileUploadErrorMessageState(uploadFileMessage);
            branchLogoFileRef.current = undefined;
            setBranchLogoFileState(null);
            return;
        }
        setFileUploadErrorMessageState("");
        branchLogoFileRef.current = event.target.files[0];
        setBranchLogoFileState(URL.createObjectURL(file));
    }
    return (
        <ModalContainer
            id="add-branch-modal"
            modalTitle={props.modalTitle}
            isOpen={props.isOpen}
            toggle={props.toggle}
            submitTitle={props.instituteId ? "Update" : "Submit"}
            submitHndlr={addInstituteForm.handleSubmit}
            cancelHndlr={props.toggle}
            modalSize="lg"
        >
            {props.instituteId && (<div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 tw-flex tw-justify-center tw-mb-4">
                    <UploadImageUpdated
                        name="institute-logo"
                        acceptFileFormat="image/png, image/gif, image/jpeg"
                        value={branchLogoFileState}
                        onChange={handleFileUploadHnlr}
                        defaultUserType="branch"
                        error={fileUploadErrorMessageState}
                        isDisabled={!props.instituteId ? true : !props.editInstituteDetails?.awsconfigured}
                    />
                </div>
            </div>)}
            <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "33px" }}>
                <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Institute Details</p>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-gap-y-1">
                    <div className="tw-col-span-1">
                        <TextInput
                            name="instituteName"
                            labelText="Institute Name"
                            value={addInstituteForm.values.instituteName}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            labelClass="required"
                            invalid={(addInstituteForm.touched.instituteName && addInstituteForm.errors.instituteName) ? true : false}
                            error={(addInstituteForm.touched.instituteName && addInstituteForm.errors.instituteName) ? addInstituteForm.errors.instituteName : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="shortName"
                            labelText="Institute Code"
                            labelClass="required"
                            value={addInstituteForm.values.shortName}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.shortName && addInstituteForm.errors.shortName) ? true : false}
                            error={(addInstituteForm.touched.shortName && addInstituteForm.errors.shortName) ? addInstituteForm.errors.shortName : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <SelectInput
                            name="trustId"
                            labelText="Trust Name"
                            labelClass="required"
                            value={addInstituteForm.values.trustId}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.trustId && addInstituteForm.errors.trustId) ? true : false}
                            error={(addInstituteForm.touched.trustId && addInstituteForm.errors.trustId) ? addInstituteForm.errors.trustId : ""}
                            menuItems={masterTrustResp}
                            valueKey="id"
                            textKey="trustName"
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextIconInput
                            name="emailId"
                            labelText="Institution Email"
                            labelClass="required"
                            value={addInstituteForm.values.emailId}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.emailId && addInstituteForm.errors.emailId) ? true : false}
                            error={(addInstituteForm.touched.emailId && addInstituteForm.errors.emailId) ? addInstituteForm.errors.emailId : ""}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="tw-col-span-1">
                        <TextInputWithRegex
                            name="affiliationNo"
                            labelText="Affliation No"
                            labelClass="required"
                            value={addInstituteForm.values.affiliationNo}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.affiliationNo && addInstituteForm.errors.affiliationNo) ? true : false}
                            error={(addInstituteForm.touched.affiliationNo && addInstituteForm.errors.affiliationNo) ? addInstituteForm.errors.affiliationNo : ""}
                            maxLength={10}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <PhoneInput
                            name="institutionPhoneNo"
                            labelText="Institution Phone No."
                            labelClass="required"
                            value={addInstituteForm.values.institutionPhoneNo}
                            onChange={onChangePhoneInput}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.institutionPhoneNo && addInstituteForm.errors.institutionPhoneNo) ? true : false}
                            error={(addInstituteForm.touched.institutionPhoneNo && addInstituteForm.errors.institutionPhoneNo) ? addInstituteForm.errors.institutionPhoneNo : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="websiteUrl"
                            labelText="Web Url"
                            labelClass="required"
                            value={addInstituteForm.values.websiteUrl}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.websiteUrl && addInstituteForm.errors.websiteUrl) ? true : false}
                            error={(addInstituteForm.touched.websiteUrl && addInstituteForm.errors.websiteUrl) ? addInstituteForm.errors.websiteUrl : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="licenceType"
                            labelText="Licence Type"
                            labelClass="required"
                            value={addInstituteForm.values.licenceType}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.licenceType && addInstituteForm.errors.licenceType) ? true : false}
                            error={(addInstituteForm.touched.licenceType && addInstituteForm.errors.licenceType) ? addInstituteForm.errors.licenceType : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <DateInput
                            name="licenseExpiryDate"
                            labelText="Expiry Date"
                            // formgroupClassName="mb-4"
                            value={addInstituteForm.values.licenseExpiryDate}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            minDate={Current_Date_YYYYMMDD}
                            labelClass="required"
                            invalid={(addInstituteForm.touched.licenseExpiryDate && addInstituteForm.errors.licenseExpiryDate) ? true : false}
                            error={(addInstituteForm.touched.licenseExpiryDate && addInstituteForm.errors.licenseExpiryDate) ? addInstituteForm.errors.licenseExpiryDate : ""}
                        />
                    </div>
                </div>
            </div>
            <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "33px" }}>
                <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Contact Person Details</p>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-gap-y-1">
                    <div className="tw-col-span-1">
                        <TextInput
                            name="contactPersonFirstName"
                            labelText="First Name"
                            labelClass="required"
                            value={addInstituteForm.values.contactPersonFirstName}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.contactPersonFirstName && addInstituteForm.errors.contactPersonFirstName) ? true : false}
                            error={(addInstituteForm.touched.contactPersonFirstName && addInstituteForm.errors.contactPersonFirstName) ? addInstituteForm.errors.contactPersonFirstName : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="contactPersonLastName"
                            labelText="Last Name"
                            labelClass="required"
                            value={addInstituteForm.values.contactPersonLastName}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.contactPersonLastName && addInstituteForm.errors.contactPersonLastName) ? true : false}
                            error={(addInstituteForm.touched.contactPersonLastName && addInstituteForm.errors.contactPersonLastName) ? addInstituteForm.errors.contactPersonLastName : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextIconInput
                            name="contactPerEmailId"
                            labelText="Email Id"
                            labelClass="required"
                            value={addInstituteForm.values.contactPerEmailId}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.contactPerEmailId && addInstituteForm.errors.contactPerEmailId) ? true : false}
                            error={(addInstituteForm.touched.contactPerEmailId && addInstituteForm.errors.contactPerEmailId) ? addInstituteForm.errors.contactPerEmailId : ""}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="tw-col-span-1">
                        <PhoneInput
                            name="contactPersonPhoneNo"
                            labelText="Phone No."
                            labelClass="required"
                            value={addInstituteForm.values.contactPersonPhoneNo}
                            onChange={onChangePhoneInput}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.contactPersonPhoneNo && addInstituteForm.errors.contactPersonPhoneNo) ? true : false}
                            error={(addInstituteForm.touched.contactPersonPhoneNo && addInstituteForm.errors.contactPersonPhoneNo) ? addInstituteForm.errors.contactPersonPhoneNo : ""}
                        />
                    </div>
                </div>
            </div>
            <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "33px" }}>
                <p style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Location Details</p>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-gap-y-1">
                    <div className="tw-col-span-1">
                        <SelectInput
                            name="countryId"
                            labelText="Country"
                            // formgroupClassName="mb-4"
                            value={addInstituteForm.values.countryId}
                            onChange={onChangeCountryHndlr}
                            onBlur={addInstituteForm.handleBlur}
                            menuItems={countriesResp}
                            valueKey="id"
                            textKey="countryName"
                            labelClass="required"
                            invalid={(addInstituteForm.touched.countryId && addInstituteForm.errors.countryId) ? true : false}
                            error={(addInstituteForm.touched.countryId && addInstituteForm.errors.countryId) ? addInstituteForm.errors.countryId : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <SelectInput
                            name="stateId"
                            labelText="State"
                            // formgroupClassName="mb-4"
                            value={addInstituteForm.values.stateId}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            menuItems={countryStateResp}
                            valueKey="id"
                            textKey="stateName"
                            labelClass="required"
                            invalid={(addInstituteForm.touched.stateId && addInstituteForm.errors.stateId) ? true : false}
                            error={(addInstituteForm.touched.stateId && addInstituteForm.errors.stateId) ? addInstituteForm.errors.stateId : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInputWithRegex
                            name="pincode"
                            labelText="Pin Code"
                            labelClass="required"
                            value={addInstituteForm.values.pincode}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.pincode && addInstituteForm.errors.pincode) ? true : false}
                            error={(addInstituteForm.touched.pincode && addInstituteForm.errors.pincode) ? addInstituteForm.errors.pincode : ""}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={6}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextIconInput
                            name="address"
                            labelText="Location"
                            labelClass="required"
                            value={addInstituteForm.values.address}
                            onChange={addInstituteForm.handleChange}
                            onBlur={addInstituteForm.handleBlur}
                            invalid={(addInstituteForm.touched.address && addInstituteForm.errors.address) ? true : false}
                            error={(addInstituteForm.touched.address && addInstituteForm.errors.address) ? addInstituteForm.errors.address : ""}
                        ><i className="ri-map-pin-line"></i></TextIconInput>
                    </div>
                </div>
            </div>
        </ModalContainer >

    )
}

export default React.memo(AddInstituteModal);