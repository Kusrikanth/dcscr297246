import React, { useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
//Common Component
import { TextIconInput, TextInput, SelectInput, PhoneInput, TextInputWithRegex } from "../../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchByIdAct, updateBranchAct } from "../../../../store/mastersettings/branch/branchactions";
import { getBranchTypesAct,  getMasterTrustAct } from "../../../../store/masterdata/masterdataactions";
import { getCountriesAct, getCountryStateAct } from "../../../../store/masterdata/masterdataactions";

//Interface & Types
import { IBranchInfoProps } from "./branchinfotypes";
import Button from "../../../../Components/Common/Button";

// function getAddEditBranchData(branchDetails?: any): IAddBranch {
//     return ({
//         instituteId: branchDetails?.instituteId || "",
//         branchName: branchDetails?.branchName || "",
//         branchId: branchDetails?.branchId || "",
//         shortCode: branchDetails?.shortCode || "",
//         branchTypeId: branchDetails?.branchTypeId || "",
//         affliatonNumber: branchDetails?.affliatonNumber || "",
//         contactName: branchDetails?.contactName || "",
//         mailId: branchDetails?.mailId || "",
//         phoneNumber: branchDetails?.phoneNumber || "",
//         noOfStudents: branchDetails?.noOfStudents || "",
//         // eslint-disable-next-line no-restricted-globals
//         location: branchDetails?.location || "",
//         branchLogo: branchDetails?.branchLogo || "",
//         instituteName: branchDetails?.instituteName || "",
//     })
// }


function getAddEditBranchData(branchDetails?: any): any {
    return ({
        address: branchDetails?.address || undefined,
        affiliationNumber: branchDetails?.affiliationNumber || undefined,
        branchId: branchDetails?.branchId || undefined,
        branchEmail: branchDetails?.branchEmail || undefined,
        branchName: branchDetails?.branchName || undefined,
        branchPhoneNumber: branchDetails?.branchPhoneNumber || undefined,
        branchTypeId: branchDetails?.branchTypeId || undefined,
        campusNumber: branchDetails?.campusNumber || "0",
        contactPersonFirstName: branchDetails?.contactPersonFirstName || undefined,
        countryId: branchDetails?.countryId || undefined,
        instituteId: branchDetails?.instituteId || undefined,
        noOfSeats: 0,
        pinCode: branchDetails?.pinCode || undefined,
        shortName: branchDetails?.shortName || undefined,
        stateId: branchDetails?.stateId || undefined,
         fax: branchDetails?.fax || undefined,
         trustId: branchDetails?.trustId || undefined,
         jodoAuth: branchDetails?.jodoAuth || undefined,
         authorization: branchDetails?.authorization || undefined,
         campusJodoCode: branchDetails?.campusJodoCode || undefined,
         url: branchDetails?.url || undefined,
    })
}


const validationSchema = Yup.object().shape({
    address: Yup.string().required("Branch name required."),
    affiliationNumber: Yup.number().typeError("Enter a valid number.").required("Affiliation number required."),
    branchEmail: Yup.string().email('Invalid Email.').required('Email is required.').nullable(),
    branchName: Yup.string().required("Branch name required."),
    branchPhoneNumber: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required.").nullable(),
    branchTypeId: Yup.string().required("Branch type required."),
    // campusNumber: Yup.number().typeError("Enter valid number.").required("Campus number is required."),
    contactPersonFirstName: Yup.string().required("Contact person name required."),
    countryId: Yup.string().required("Country required.").nullable(),
    // noOfSeats: Yup.number().typeError("Enter valid number").required("No. of Seats required.").nullable(),
    pinCode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required.").nullable(),
    shortName: Yup.string().required("Short name required."),
    stateId: Yup.string().required("State required.").nullable(),
    fax: Yup.string().required("Fax required.").nullable(),
    trustId: Yup.string().required("Trust name required."),
    jodoAuth: Yup.string().required("Auth required."),
    authorization: Yup.string().required("authorization required."),
    campusJodoCode: Yup.string().required("Campus Code required."),
    url: Yup.string().required("URL required."),
});
const BranchInfo: React.FC<IBranchInfoProps> = ({ branchId }) => {
    const [branchInfoState, setBranchInfoState] = useState<any>(() => getAddEditBranchData());
    const dispatch = useAppDispatch();
    const { branchbyIdResp, updateBranchResp, branchTypesResp, countriesResp, countryStateResp, 
        instInfoError, masterTrustResp, } = useAppSelector(({ branch, masterData }) => ({
            branchbyIdResp: branch.branchbyIdResp,
            updateBranchResp: branch.updateBranchResp,
            branchTypesResp: masterData.branchTypesResp,
            countriesResp: masterData.countriesResp,
            countryStateResp: masterData.countryStateResp,
            instInfoError: branch.branchErrorResp,
            masterTrustResp: masterData.masterTrustResp,
        }), shallowEqual);

    const instituteRespRef = useRef<any>({
        prevBranchbyIdResp: branchbyIdResp,
        prevUpdateBranchResp: updateBranchResp,
        prevInstInfoError: instInfoError
    });
    // Component did mount
    useEffect(() => {
        if (!countriesResp)
            dispatch(getCountriesAct(generateActionPayload("get_countries")));
    }, [countriesResp]);
    useEffect(() => {
        if (branchId) {
            const params = { branchId };
            dispatch(getBranchByIdAct(generateActionPayload("get_branch_byid", params)));
        }
    }, [branchId]);
    useEffect(() => {
        if (!branchTypesResp)
            dispatch(getBranchTypesAct(generateActionPayload("get_branch_types")));
    }, [branchTypesResp]);
    //Component Did update
    useEffect(() => {
        const { prevBranchbyIdResp, prevUpdateBranchResp, prevInstInfoError } = instituteRespRef.current;
        if (branchbyIdResp && prevBranchbyIdResp !== branchbyIdResp) {
            branchInfoForm.resetForm();
            const { countryId } = branchbyIdResp;
            if (countryId) {
                dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId })));
            }
            setBranchInfoState(getAddEditBranchData(branchbyIdResp));
        } else if (updateBranchResp && prevUpdateBranchResp !== updateBranchResp) {
            const params = { branchId };
            dispatch(getBranchByIdAct(generateActionPayload("get_branch_byid", params)));
            toast.success("Branch updated successfully.")
        } else if (instInfoError && prevInstInfoError !== instInfoError) {
            const { details } = instInfoError;
            toast.error(details);
        }
        instituteRespRef.current.prevBranchbyIdResp = branchbyIdResp;
        instituteRespRef.current.prevUpdateBranchResp = updateBranchResp;
        instituteRespRef.current.prevInstInfoError = instInfoError;
    }, [branchbyIdResp, updateBranchResp, instInfoError]);
    //trustId
    useEffect(() => {
        if (!masterTrustResp)
          dispatch(getMasterTrustAct(generateActionPayload("get_master_trust")));
      }, [masterTrustResp]);
    const branchInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: branchInfoState,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("branchRequest", JSON.stringify(values));
            dispatch(updateBranchAct(generateActionPayload("add_inst_branch", undefined, formData)));
        },
    });
    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        branchInfoForm.setFieldValue(name, updateDate);
    }
    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (value)
            dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: value })));
        branchInfoForm.setValues((prevState: any) => ({ ...prevState, stateId: "", [name]: value }));
    }

    function onCancelHndlr() {
        const instituteDetails = getAddEditBranchData(branchbyIdResp);
        setBranchInfoState((prevState: any) => ({
            ...prevState, ...instituteDetails
        }));
        branchInfoForm.resetForm();
    }

    return (
        <div className="card-body">
            <form onSubmit={branchInfoForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-2">
                    <div className="tw-col-span-1">
                        <TextInput
                            name="branchName"
                            labelText="Branch Name"
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.branchName}
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.branchName && branchInfoForm.errors.branchName) ? true : false}
                            error={(branchInfoForm.touched.branchName && branchInfoForm.errors.branchName) ? branchInfoForm.errors.branchName : ""}
                            isReadOnly={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="shortName"
                            labelText="Short Code"
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.shortName}
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.shortName && branchInfoForm.errors.shortName) ? true : false}
                            error={(branchInfoForm.touched.shortName && branchInfoForm.errors.shortName) ? branchInfoForm.errors.shortName : ""}
                            isReadOnly={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <SelectInput
                            name="branchTypeId"
                            labelText="Branch Type"
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.branchTypeId}
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.branchTypeId && branchInfoForm.errors.branchTypeId) ? true : false}
                            error={(branchInfoForm.touched.branchTypeId && branchInfoForm.errors.branchTypeId) ? branchInfoForm.errors.branchTypeId : ""}
                            menuItems={branchTypesResp}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="campusNumber"
                            labelText="Campus No"
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.campusNumber}
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.campusNumber && branchInfoForm.errors.campusNumber) ? true : false}
                            error={(branchInfoForm.touched.campusNumber && branchInfoForm.errors.campusNumber) ? branchInfoForm.errors.campusNumber : ""}
                            isDisabled={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInputWithRegex
                            name="affiliationNumber"
                            labelText="Affliation No"
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.affiliationNumber}
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.affiliationNumber && branchInfoForm.errors.affiliationNumber) ? true : false}
                            error={(branchInfoForm.touched.affiliationNumber && branchInfoForm.errors.affiliationNumber) ? branchInfoForm.errors.affiliationNumber : ""}
                            maxLength={10}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <SelectInput
                            name="trustId"
                            labelText="Trust Name"
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.trustId}
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.trustId && branchInfoForm.errors.trustId) ? true : false}
                            error={(branchInfoForm.touched.trustId && branchInfoForm.errors.trustId) ? branchInfoForm.errors.trustId : ""}
                            menuItems={masterTrustResp}
                            valueKey="id"
                            textKey="trustName"
                        // isDisabled={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <SelectInput
                            name="countryId"
                            labelText="Country"
                            // formgroupClassName="mb-4"
                            value={branchInfoForm.values.countryId}
                            formgroupClassName="tw-mb-0"
                            onChange={onChangeCountryHndlr}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.countryId && branchInfoForm.errors.countryId) ? true : false}
                            error={(branchInfoForm.touched.countryId && branchInfoForm.errors.countryId) ? branchInfoForm.errors.countryId : ""}
                            menuItems={countriesResp}
                            valueKey="id"
                            textKey="countryName"
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <SelectInput
                            name="stateId"
                            labelText="State"
                            // formgroupClassName="mb-4"
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.stateId}
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.stateId && branchInfoForm.errors.stateId) ? true : false}
                            error={(branchInfoForm.touched.stateId && branchInfoForm.errors.stateId) ? branchInfoForm.errors.stateId : ""}
                            menuItems={countryStateResp}
                            valueKey="id"
                            textKey="stateName"
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="address"
                            labelText="Address"
                            value={branchInfoForm.values.address}
                            formgroupClassName="tw-mb-0"
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.address && branchInfoForm.errors.address) ? true : false}
                            error={(branchInfoForm.touched.address && branchInfoForm.errors.address) ? branchInfoForm.errors.address : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInputWithRegex
                            name="pinCode"
                            labelText="PIN Code"
                            value={branchInfoForm.values.pinCode}
                            onChange={branchInfoForm.handleChange}
                            formgroupClassName="tw-mb-0"
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.pinCode && branchInfoForm.errors.pinCode) ? true : false}
                            error={(branchInfoForm.touched.pinCode && branchInfoForm.errors.pinCode) ? branchInfoForm.errors.pinCode : ""}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={6}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextIconInput
                            name="branchEmail"
                            formgroupClassName="tw-mb-0"
                            labelText="Email ID"
                            value={branchInfoForm.values.branchEmail}
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.branchEmail && branchInfoForm.errors.branchEmail) ? true : false}
                            error={(branchInfoForm.touched.branchEmail && branchInfoForm.errors.branchEmail) ? branchInfoForm.errors.branchEmail : ""}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="tw-col-span-1">
                        <PhoneInput
                            name="branchPhoneNumber"
                            labelText="Phone No."
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.branchPhoneNumber}
                            onChange={onChangePhoneInput}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.branchPhoneNumber && branchInfoForm.errors.branchPhoneNumber) ? true : false}
                            error={(branchInfoForm.touched.branchPhoneNumber && branchInfoForm.errors.branchPhoneNumber) ? branchInfoForm.errors.branchPhoneNumber : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInputWithRegex
                            name="fax"
                            labelText="Fax No."
                            value={branchInfoForm.values.fax}
                            formgroupClassName="tw-mb-0"
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.fax && branchInfoForm.errors.fax) ? true : false}
                            error={(branchInfoForm.touched.fax && branchInfoForm.errors.fax) ? branchInfoForm.errors.fax : ""}
                            maxLength={10}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="contactPersonFirstName"
                            labelText="Contact Name"
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.contactPersonFirstName}
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.contactPersonFirstName && branchInfoForm.errors.contactPersonFirstName) ? true : false}
                            error={(branchInfoForm.touched.contactPersonFirstName && branchInfoForm.errors.contactPersonFirstName) ? branchInfoForm.errors.contactPersonFirstName : ""}
                        />
                    </div>

                    <div className="tw-col-span-full">
                        <TextInput
                            name="websiteUrl"
                            labelText="Website URL"
                            formgroupClassName="tw-mb-0"
                            value={branchInfoForm.values.websiteUrl || "n/a"}
                            onChange={branchInfoForm.handleChange}
                            isReadOnly={true}
                        />
                    </div>
                    <div className="tw-col-span-full">
                        <h6 className="setting-title">JODO DETAILS</h6>
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="jodoAuth"
                            labelText="Auth"
                            value={branchInfoForm.values.jodoAuth}
                            formgroupClassName="tw-mb-0"
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.jodoAuth && branchInfoForm.errors.jodoAuth) ? true : false}
                            error={(branchInfoForm.touched.jodoAuth && branchInfoForm.errors.jodoAuth) ? branchInfoForm.errors.jodoAuth : ""}
                        />
                    </div>

                    <div className="tw-col-span-1">
                        <TextInput
                            name="authorization"
                            labelText="Authorization"
                            value={branchInfoForm.values.authorization}
                            formgroupClassName="tw-mb-0"
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.authorization && branchInfoForm.errors.authorization) ? true : false}
                            error={(branchInfoForm.touched.authorization && branchInfoForm.errors.authorization) ? branchInfoForm.errors.authorization : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="campusJodoCode"
                            labelText="Campus Code"
                            value={branchInfoForm.values.campusJodoCode}
                            formgroupClassName="tw-mb-0"
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.campusJodoCode && branchInfoForm.errors.campusJodoCode) ? true : false}
                            error={(branchInfoForm.touched.campusJodoCode && branchInfoForm.errors.campusJodoCode) ? branchInfoForm.errors.campusJodoCode : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="url"
                            labelText="URL"
                            value={branchInfoForm.values.url}
                            formgroupClassName="tw-mb-0"
                            onChange={branchInfoForm.handleChange}
                            onBlur={branchInfoForm.handleBlur}
                            invalid={(branchInfoForm.touched.url && branchInfoForm.errors.url) ? true : false}
                            error={(branchInfoForm.touched.url && branchInfoForm.errors.url) ? branchInfoForm.errors.url : ""}
                        />
                    </div>
                    <div className="tw-col-span-full tw-flex tw-justify-end tw-mt-3">
                        {branchInfoForm.dirty && <div className="tw-mr-2">
                            <Button onClick={onCancelHndlr} variant="secondary">Cancel</Button>
                        </div>}
                        <div className="tw-text-right">
                            <Button type="submit"
                                disabled={!branchInfoForm.dirty}
                                variant="primary">Update</Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default BranchInfo;