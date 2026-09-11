import React, { useState, useEffect, useRef } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
 TextIconInput, TextInput, SelectInput, PhoneInput
    , 
    TextInputWithRegex,
    UploadImageUpdated
} from "../../../Components/Common";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { addInstBranchAct, getBranchByIdAct, updateBranchAct } from "../../../store/mastersettings/branch/branchactions";
import { getBranchTypesAct, resetCountryStateAct, getMasterTrustAct } from "../../../store/masterdata/masterdataactions";
import { getCountriesAct, getCountryStateAct } from "../../../store/masterdata/masterdataactions";

//Utility
import { uploadImageFileErrorHndlr } from "../../../utility/commonutility";

//Interface & Types
import { IAddBranchProps, IAddBranchModalRespRef } from "./branchtypes";
//Utility
import { NAME_REGEX } from "../../../utility/validationutility";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    village: Yup.string().required("Village is required."),
    address: Yup.string().required("Branch name required."),
    affiliationNumber: Yup.number().typeError("Enter a valid number.").required("Affiliation number required."),
    branchEmail: Yup.string().email('Invalid Email.').required('Email is required.').nullable(),
    branchName: Yup.string().required("Branch name required."),
    branchPhoneNumber: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required.").nullable(),
    branchTypeId: Yup.string().required("Branch type required."),
    contactPersonFirstName: Yup.string().required("Contact person name required.").matches(NAME_REGEX, "Enter a valid name with space."),
    countryId: Yup.string().required("Country required.").nullable(),
    pinCode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required.").nullable(),
    shortName: Yup.string().required("Short name required."),
    stateId: Yup.string().required("State required.").nullable(),
    fax: Yup.string().required("Fax required.").nullable(),
    trustId: Yup.string().required("Trust name required."),
});

function getCampusNumber(campusNumber: any) {
    if (!isNaN(campusNumber)) {
        return campusNumber.toString();
    }
    return undefined;
}

function getAddEditBranchData(branchDetails?: any): any {
    return ({
        village: branchDetails?.village || undefined,
        address: branchDetails?.address || undefined,
        affiliationNumber: branchDetails?.affiliationNumber || undefined,
        branchId: branchDetails?.branchId || undefined,
        branchEmail: branchDetails?.branchEmail || undefined,
        branchName: branchDetails?.branchName || undefined,
        branchPhoneNumber: branchDetails?.branchPhoneNumber || undefined,
        branchTypeId: branchDetails?.branchTypeId || undefined,
        campusNumber: getCampusNumber(branchDetails?.campusNumber),
        contactPersonFirstName: branchDetails?.contactPersonFirstName || undefined,
        countryId: branchDetails?.countryId || undefined,
        instituteId: branchDetails?.instituteId || undefined,
        pinCode: branchDetails?.pinCode || undefined,
        shortName: branchDetails?.shortName || undefined,
        trustId: branchDetails?.trustId || undefined,
        stateId: branchDetails?.stateId || undefined,
        fax: branchDetails?.fax || undefined,
        udiseCode: branchDetails?.udiseCode || undefined,
        noOfSeats: 0
    })
}

const AddBranchModal: React.FC<IAddBranchProps> = (props) => {
    const [addBranchState, setAddBranchState] = useState<any>(() => getAddEditBranchData());
    const [branchLogoFileState, setBranchLogoFileState] = useState<any>("");
    const branchLogoFileRef = useRef<any>(null);
    const [fileUploadErrorMessageState, setFileUploadErrorMessageState] = useState<string>("");

    const dispatch = useAppDispatch();
    const { addBranchResp, branchTypesResp, updateBranchResp, masterTrustResp,
        countriesResp, countryStateResp,showApiLoader,
        masterDataErrorResp } = useAppSelector(({ branch, masterData,globalData }) => ({
            addBranchResp: branch.addBranchResp,
            branchTypesResp: masterData.branchTypesResp,
            updateBranchResp: branch.updateBranchResp,
            countriesResp: masterData.countriesResp,
            masterTrustResp: masterData.masterTrustResp,
            countryStateResp: masterData.countryStateResp,
            masterDataErrorResp: masterData.masterDataErrorResp,
            showApiLoader:globalData.showApiLoader,
        }), shallowEqual);

    const addBranchModalRespRef = useRef<IAddBranchModalRespRef>({
        prevAddBranchResp: addBranchResp,
        prevUpdateBranchResp: updateBranchResp,
        prevMasterDataErrorResp: masterDataErrorResp
    });

    //Component Did Mount
    useEffect(() => {
        if (!countriesResp)
            dispatch(getCountriesAct(generateActionPayload("get_countries")));
        return () => { dispatch(resetCountryStateAct(undefined)) }
    }, [countriesResp]);
    useEffect(() => {
        if (!branchTypesResp && props.isOpen) {
            dispatch(getBranchTypesAct(generateActionPayload("get_branch_types")));
        } else if (!props.isOpen) {
            setAddBranchState(getAddEditBranchData());
            addBranchForm.resetForm();
            setBranchLogoFileState("");
            setFileUploadErrorMessageState("");
            branchLogoFileRef.current = null;
        }
    }, [props.isOpen, branchTypesResp]);
    useEffect(() => {
        if (!masterTrustResp && props.isOpen) {
            dispatch(getMasterTrustAct(generateActionPayload("get_master_trust")));
           
        } else if (!props.isOpen) {
            setAddBranchState(getAddEditBranchData());
            addBranchForm.resetForm();
            setBranchLogoFileState("");
            setFileUploadErrorMessageState("");
            branchLogoFileRef.current = null;
           
        }
    }, [props.isOpen, masterTrustResp]);
    // useEffect(() => {
    //     if (!masterTrustResp)
    //       dispatch(getMasterTrustAct(generateActionPayload("get_master_trust")));
    //   }, [masterTrustResp]);
    useEffect(() => {
        if (props.editBranchDetails) {
            const { countryId, logo } = props.editBranchDetails,
                branchDetails = getAddEditBranchData(props.editBranchDetails);

            setBranchLogoFileState(logo);
            if (countryId) {
                dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId })));
            }
            setAddBranchState((prevState: any) => ({
                ...prevState, ...branchDetails
            }));
            addBranchForm.resetForm();
        }
    }, [props.editBranchDetails]);

    useEffect(() => {
        const { prevAddBranchResp, prevUpdateBranchResp, prevMasterDataErrorResp } = addBranchModalRespRef.current;
        if (addBranchResp && prevAddBranchResp !== addBranchResp) {
            toast.success("Branch added successfully.");
            props.toggle(true);
        } else if (updateBranchResp && prevUpdateBranchResp !== updateBranchResp) {
            toast.success("Branch updated successfully.");
            props.toggle(true);
        } else if (masterDataErrorResp && prevMasterDataErrorResp !== masterDataErrorResp) {
            const { details }: any = masterDataErrorResp;
            toast.error(details || "Something went wrong.");
        }
        addBranchModalRespRef.current.prevAddBranchResp = addBranchResp;
        addBranchModalRespRef.current.prevUpdateBranchResp = updateBranchResp;
        addBranchModalRespRef.current.prevMasterDataErrorResp = masterDataErrorResp;
    }, [addBranchResp, updateBranchResp]);

    const addBranchForm = useFormik({
        enableReinitialize: true,
        initialValues: addBranchState,
        validationSchema,
        onSubmit: (values) => {
            if (props.branchId) {
                const formData: any = new FormData();
                if (branchLogoFileRef.current)
                    formData.append("file", branchLogoFileRef.current);
                formData.append("branchRequest", JSON.stringify(values));         
                dispatch(updateBranchAct(generateActionPayload("add_inst_branch", undefined, formData)));
            } else {
                const payload: any = {
                    ...values, instituteId: props.instituteId
                }
                const formData = new FormData();
                if (branchLogoFileRef.current)
                    formData.append("file", branchLogoFileRef.current);
                formData.append("branchRequest", JSON.stringify(payload));
                dispatch(addInstBranchAct(generateActionPayload("add_inst_branch", undefined, formData)));
            }
        },
    });

    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        addBranchForm.setFieldValue(name, updateDate);
    }
    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (value)
            dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: value })));
        addBranchForm.setValues((prevState: any) => ({ ...prevState, stateId: "", [name]: value }));
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

        <>
            <div className="tw-p-4">

                <div className="tw-flex tw-flex-wrap tw--mx-3">

                    <div className="tw-w-full tw-flex tw-justify-center tw-px-3">
                        <UploadImageUpdated
                            name="institute-logo"
                            acceptFileFormat="image/png, image/gif, image/jpeg"
                            value={branchLogoFileState}
                            onChange={handleFileUploadHnlr}
                            defaultUserType="branch"
                            error={fileUploadErrorMessageState}
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextInput
                            name="branchName"
                            labelText="Branch Name"
                            value={addBranchForm.values.branchName}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.branchName && addBranchForm.errors.branchName) ? true : false}
                        error={(addBranchForm.touched.branchName && addBranchForm.errors.branchName) ? addBranchForm.errors.branchName : ""}
                        isReadOnly={!!props.branchId}
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextInput
                            name="shortName"
                            labelText="Short Code"
                            value={addBranchForm.values.shortName}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.shortName && addBranchForm.errors.shortName) ? true : false}
                        error={(addBranchForm.touched.shortName && addBranchForm.errors.shortName) ? addBranchForm.errors.shortName : ""}
                        isReadOnly={!!props.branchId}
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <SelectInput
                            name="trustId"
                            labelText="Trust Name"
                            value={addBranchForm.values.trustId}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.trustId && addBranchForm.errors.trustId) ? true : false}
                            error={(addBranchForm.touched.trustId && addBranchForm.errors.trustId) ? addBranchForm.errors.trustId : ""}
                            menuItems={masterTrustResp}
                            valueKey="id"
                            textKey="trustName"
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <SelectInput
                            name="branchTypeId"
                            labelText="Branch Type"
                            value={addBranchForm.values.branchTypeId}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.branchTypeId && addBranchForm.errors.branchTypeId) ? true : false}
                        error={(addBranchForm.touched.branchTypeId && addBranchForm.errors.branchTypeId) ? addBranchForm.errors.branchTypeId : ""}
                        menuItems={branchTypesResp}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextInput
                            name="campusNumber"
                            labelText="Campus No"
                            value={addBranchForm.values.campusNumber}
                            onChange={addBranchForm.handleChange}
                            maxLength={15}
                            isDisabled={true}
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextInputWithRegex
                            name="affiliationNumber"
                            labelText="Affiliation No"
                            value={addBranchForm.values.affiliationNumber}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.affiliationNumber && addBranchForm.errors.affiliationNumber) ? true : false}
                        error={(addBranchForm.touched.affiliationNumber && addBranchForm.errors.affiliationNumber) ? addBranchForm.errors.affiliationNumber : ""}
                        maxLength={10}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>

                    <div className="tw-w-1/2 tw-px-3">
                        <SelectInput
                            name="countryId"
                            labelText="Country"
                            value={addBranchForm.values.countryId}
                            onChange={onChangeCountryHndlr}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.countryId && addBranchForm.errors.countryId) ? true : false}
                        error={(addBranchForm.touched.countryId && addBranchForm.errors.countryId) ? addBranchForm.errors.countryId : ""}
                        menuItems={countriesResp}
                            valueKey="id"
                            textKey="countryName"
                        />
                    </div>

                    <div className="tw-w-1/2 tw-px-3">
                        <SelectInput
                            name="stateId"
                            labelText="State"
                            value={addBranchForm.values.stateId}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.stateId && addBranchForm.errors.stateId) ? true : false}
                        error={(addBranchForm.touched.stateId && addBranchForm.errors.stateId) ? addBranchForm.errors.stateId : ""}
                        menuItems={countryStateResp}
                            valueKey="id"
                            textKey="stateName"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                    <TextInput
                        name="village"
                        labelText="Village"
                        value={addBranchForm.values.village}
                        onChange={addBranchForm.handleChange}
                        onBlur={addBranchForm.handleBlur}
                        invalid={(addBranchForm.touched.village && addBranchForm.errors.village) ? true : false}
                        error={(addBranchForm.touched.village && addBranchForm.errors.village) ? addBranchForm.errors.village : ""}
                    />
                </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextInput name="address" labelText="Address"
                            value={addBranchForm.values.address}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.address && addBranchForm.errors.address) ? true : false}
                        error={(addBranchForm.touched.address && addBranchForm.errors.address) ? addBranchForm.errors.address : ""}
                    />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextInputWithRegex
                            name="pinCode"
                            labelText="PIN Code"
                            value={addBranchForm.values.pinCode}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                             invalid={(addBranchForm.touched.pinCode && addBranchForm.errors.pinCode) ? true : false}
                        error={(addBranchForm.touched.pinCode && addBranchForm.errors.pinCode) ? addBranchForm.errors.pinCode : ""}
                        maxLength={6}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextIconInput
                            name="branchEmail"
                            labelText="Email ID"
                            value={addBranchForm.values.branchEmail}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.branchEmail && addBranchForm.errors.branchEmail) ? true : false}
                            error={(addBranchForm.touched.branchEmail && addBranchForm.errors.branchEmail) ? addBranchForm.errors.branchEmail : ""}
                        >
                            <i className="ri-mail-unread-line"></i>
                        </TextIconInput>
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <PhoneInput
                            name="branchPhoneNumber"
                            labelText="Phone No."
                            value={addBranchForm.values.branchPhoneNumber}
                            onChange={onChangePhoneInput}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.branchPhoneNumber && addBranchForm.errors.branchPhoneNumber) ? true : false}
                        error={(addBranchForm.touched.branchPhoneNumber && addBranchForm.errors.branchPhoneNumber) ? addBranchForm.errors.branchPhoneNumber : ""}
                                               />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextInputWithRegex
                            name="fax"
                            labelText="Fax No."
                            value={addBranchForm.values.fax}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.fax && addBranchForm.errors.fax) ? true : false}
                        error={(addBranchForm.touched.fax && addBranchForm.errors.fax) ? addBranchForm.errors.fax : ""}
                        maxLength={10}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextInput
                            name="contactPersonFirstName"
                            labelText="Contact Name"
                            value={addBranchForm.values.contactPersonFirstName}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                            invalid={(addBranchForm.touched.contactPersonFirstName && addBranchForm.errors.contactPersonFirstName) ? true : false}
                            error={(addBranchForm.touched.contactPersonFirstName && addBranchForm.errors.contactPersonFirstName) ? addBranchForm.errors.contactPersonFirstName : ""}
                    />
                    </div>

                    <div className="tw-w-full md:tw-w-1/2 tw-px-3">
                        <TextInput
                            name="udiseCode"
                            labelText="UDISE Code"
                            value={addBranchForm.values.udiseCode}
                            onChange={addBranchForm.handleChange}
                            onBlur={addBranchForm.handleBlur}
                        />
                    </div>

                </div>

                <div className="tw-flex tw-gap-3 tw-justify-end tw-mt-4">
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
                        onClick={(event: any) => addBranchForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        {props.branchId ? "Update" : "Submit"}
                    </Button>
                </div>

            </div>

            </>
    )
}

export default React.memo(AddBranchModal);