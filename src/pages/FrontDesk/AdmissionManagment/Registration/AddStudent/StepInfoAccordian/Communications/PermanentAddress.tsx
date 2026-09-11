import React, { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    TextInputWithRegex
} from "../../../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import {
    getCountryStateAct, getStateCityAct,
} from "../../../../../../../store/masterdata/masterdataactions";
import {
    permanentAddressCityAct, permanentAddressStateAct
} from "../../../../../../../store/directory/studentmanagement/studentmanagementactions";


//  Old State
// function getInitialState(initialState: any) {
//     return {
//         permanentAddress: "Testing Address",
//         isPermanentAddressSame: initialState?.isPermanentAddressSame || false,
//         pHouseNo: initialState?.pHouseNo || "Permanent House No",
//         pLandmark: initialState?.pLandmark || "Permanent Landmark",
//         pCountry: initialState?.pCountry || "1",
//         pState: initialState?.pState || "1",
//         pCity: initialState?.pCity || "12",
//         pPinCode: initialState?.pPinCode || "123456"
//     }
// }

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}
function getInitialState(initialState?: any) {
    return {
        isPermanentAddressSame: getTrueFalseOptions(initialState?.isPermanentAddressSame),
        pHouseNo: initialState?.pHouseNo || "",
        pLandmark: initialState?.pLandmark || "",
        pCountry: initialState?.pCountry || "",
        pState: initialState?.pState || "",
        pCity: initialState?.pCity || "",
        pPinCode: initialState?.pPinCode || "",
        pAreaId: initialState?.pAreaId || "",
        pDistanceFromSchool: initialState?.pDistanceFromSchool || "",

    }
}
const validationSchema = Yup.object().shape({
    permanentAddress: Yup.string().required("Address required."),
    pHouseNo: Yup.string().required("House no required."),
    pLandmark: Yup.string().required('Landmark required.'),
    pCountry: Yup.string().required("Select country."),
    pState: Yup.string().required("Select state."),
    pCity: Yup.string().required("Select city."),
    pPinCode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required."),
});

const initialValues = getInitialState();
export default function PermanentAddress({ formId, formDetails, refId, countriesResp }: any) {
    const { currentMultiFormKeys, editStudentData, storeMultiFormData,
        submitCurrentFormCllbck, requestedMultiFormKeyCllback } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();
    const fieldUpdatedRef = useRef({
        requestCurrentAddress: false,
    });
    const { countryStateResp, permanentAddressStateResp,
        permanentAddressCityResp } = useAppSelector(({ masterData, directoryStudent }) => ({
            countryStateResp: masterData.countryStateResp,
            permanentAddressStateResp: directoryStudent.permanentAddressStateResp,
            permanentAddressCityResp: directoryStudent.permanentAddressCityResp

        }), shallowEqual);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            permanentAddressForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    const permanentAddressForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        onSubmit: (values: any) => {
            // storeMultiFormData("permanentAddress", true, values);
        }
    })

    // useEffect(() => {
    //     const { permanentAddress, residentialAddress } = editStudentData || {},
    //         { formData } = permanentAddress || {},
    //         { formData: residentialFormData } = residentialAddress || {},
    //         { requestCurrentAddress } = fieldUpdatedRef.current;
    //     if (requestCurrentAddress && residentialFormData) {
    //         const { currentAddress, currentCityId, currentCountryId, currentHouseNo,
    //             currentLandmark, currentPincode, currentStateId
    //         } = residentialFormData;
    //         if (currentCountryId) {
    //             dispatch(permanentAddressStateAct(generateActionPayload("get_country_state", { countryId: currentCountryId })));
    //         }
    //         if (currentStateId) {
    //             dispatch(permanentAddressCityAct(generateActionPayload("get_state_city", { stateId: currentStateId })));
    //         }
    //         permanentAddressForm.resetForm({
    //             values: {
    //                 permanentAddress: currentAddress,
    //                 isPermanentAddressSame: "true",
    //                 pHouseNo: currentHouseNo,
    //                 pLandmark: currentLandmark,
    //                 pCountry: currentCountryId,
    //                 pState: currentStateId,
    //                 pCity: currentCityId,
    //                 pPinCode: currentPincode
    //             }
    //         })
    //     } else if (formData) {
    //         const { pCountry, pState } = formData;
    //         if (pCountry) {
    //             dispatch(permanentAddressStateAct(generateActionPayload("get_country_state", { countryId: pCountry })));
    //         }
    //         if (pState) {
    //             dispatch(permanentAddressCityAct(generateActionPayload("get_state_city", { stateId: pState })));
    //         }
    //         setBasicDetailsState(getInitialState(formData));
    //     }
    // }, [editStudentData]);


    useEffect(() => {
        const { requestCurrentAddress } = fieldUpdatedRef.current;
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("permanentAddress")) {
            submitHndlr();
        }
    }, [currentMultiFormKeys]);

    function submitHndlr() {
        const { isPermanentAddressSame } = permanentAddressForm.values;
        if (isPermanentAddressSame && isPermanentAddressSame === "true") {
            // storeMultiFormData("permanentAddress", true, permanentAddressForm.values);
        } else {
            permanentAddressForm.handleSubmit();
        }
    }

    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (name === "pCountry") {
            if (value) {
                dispatch(permanentAddressStateAct(generateActionPayload("get_country_state", { countryId: value })));
            }
            permanentAddressForm.setValues((prevState: any) => ({ ...prevState, pState: "", pCity: "", [name]: value }));
        } else if (name === "pState") {
            if (value) {
                dispatch(permanentAddressCityAct(generateActionPayload("get_state_city", { stateId: value })));
            }
            permanentAddressForm.setValues((prevState: any) => ({ ...prevState, pCity: "", [name]: value }));
        }
    }

    function isPermanentAddressSameHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value === "true") {
            fieldUpdatedRef.current.requestCurrentAddress = true;
            requestedMultiFormKeyCllback(["residentialAddress"]);
        }
        permanentAddressForm.resetForm({ values: getInitialState() });

    }

    return (
        <form onSubmit={permanentAddressForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                Permanent Address
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <div className="row">
                    <div className="col-12">
                        <RadioInputContainer
                            name="isPermanentAddressSame"
                            labelText="Is Permanent Address is same as Correspondence Address ?"
                            containerClassName="d-flex"
                            labelClassName="mb-0 me-3"
                            radioOptions={trueFalseOptions}
                            value={permanentAddressForm.values.isPermanentAddressSame}
                            onChange={isPermanentAddressSameHndlr}
                        />
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="pHouseNo"
                            labelText="House/Flat no"
                            value={permanentAddressForm.values.pHouseNo}
                            onChange={permanentAddressForm.handleChange}
                            invalid={(permanentAddressForm.touched.pHouseNo && permanentAddressForm.errors.pHouseNo) ? true : false}
                            error={(permanentAddressForm.touched.pHouseNo && permanentAddressForm.errors.pHouseNo) ? permanentAddressForm.errors.pHouseNo : ""}
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="pLandmark"
                            labelText="Location / Landmark"
                            value={permanentAddressForm.values.pLandmark}
                            onChange={permanentAddressForm.handleChange}
                            invalid={(permanentAddressForm.touched.pLandmark && permanentAddressForm.errors.pLandmark) ? true : false}
                            error={(permanentAddressForm.touched.pLandmark && permanentAddressForm.errors.pLandmark) ? permanentAddressForm.errors.pLandmark : ""}
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="pCountry"
                            labelText="Country"
                            // formgroupClassName="mb-4"
                            value={permanentAddressForm.values.pCountry}
                            onChange={onChangeCountryHndlr}
                            invalid={(permanentAddressForm.touched.pCountry && permanentAddressForm.errors.pCountry) ? true : false}
                            error={(permanentAddressForm.touched.pCountry && permanentAddressForm.errors.pCountry) ? permanentAddressForm.errors.pCountry : ""}
                            menuItems={countriesResp}
                            valueKey="id"
                            textKey="countryName"
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                        {/* <TextInput
                            name="pCountry"
                            labelText="Country"
                            value={permanentAddressForm.values.pCountry}
                            onChange={permanentAddressForm.handleChange}
                            invalid={(permanentAddressForm.touched.pCountry && permanentAddressForm.errors.pCountry) ? true : false}
                            error={(permanentAddressForm.touched.pCountry && permanentAddressForm.errors.pCountry) ? permanentAddressForm.errors.pCountry : ""}
                        /> */}
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="pState"
                            labelText="State"
                            // formgroupClassName="mb-4"
                            value={permanentAddressForm.values.pState}
                            onChange={onChangeCountryHndlr}
                            invalid={(permanentAddressForm.touched.pState && permanentAddressForm.errors.pState) ? true : false}
                            error={(permanentAddressForm.touched.pState && permanentAddressForm.errors.pState) ? permanentAddressForm.errors.pState : ""}
                            menuItems={permanentAddressStateResp}
                            valueKey="id"
                            textKey="stateName"
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                        {/* <TextInput
                            name="pState"
                            labelText="State"
                            value={permanentAddressForm.values.pState}
                            onChange={permanentAddressForm.handleChange}
                            invalid={(permanentAddressForm.touched.pState && permanentAddressForm.errors.pState) ? true : false}
                            error={(permanentAddressForm.touched.pState && permanentAddressForm.errors.pState) ? permanentAddressForm.errors.pState : ""}
                        /> */}
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="pCity"
                            labelText="City"
                            value={permanentAddressForm.values.pCity}
                            onChange={permanentAddressForm.handleChange}
                            invalid={(permanentAddressForm.touched.pCity && permanentAddressForm.errors.pCity) ? true : false}
                            error={(permanentAddressForm.touched.pCity && permanentAddressForm.errors.pCity) ? permanentAddressForm.errors.pCity : ""}
                            menuItems={permanentAddressCityResp}
                            valueKey="id"
                            textKey="cityName"
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                    </div>

                    <div className="col-4">
                        <TextInputWithRegex
                            name="pPinCode"
                            labelText="PIN Code"
                            value={permanentAddressForm.values.pPinCode}
                            onChange={permanentAddressForm.handleChange}
                            invalid={(permanentAddressForm.touched.pPinCode && permanentAddressForm.errors.pPinCode) ? true : false}
                            error={(permanentAddressForm.touched.pPinCode && permanentAddressForm.errors.pPinCode) ? permanentAddressForm.errors.pPinCode : ""}
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name='pAreaId'
                            valueKey='text'
                            textKey='text'
                            menuItems={[{ text: 'Area' }]}
                            value={permanentAddressForm.values.pAreaId}
                            onChange={permanentAddressForm.handleChange}
                            // formgroupClassName="pe-5"
                            // isDisabled={true}
                            // inputClassName={"border-0"}
                            labelText="Area"
                            invalid={(permanentAddressForm.touched.pAreaId && permanentAddressForm.errors.pAreaId) ? true : false}
                            error={(permanentAddressForm.touched.pAreaId && permanentAddressForm.errors.pAreaId) ? permanentAddressForm.errors.pAreaId : ""}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name='pDistanceFromSchool'
                            valueKey='text'
                            textKey='text'
                            menuItems={[{ text: '10-20km' }]}
                            value={permanentAddressForm.values.pDistanceFromSchool}
                            onChange={permanentAddressForm.handleChange}
                            // formgroupClassName="pe-5"
                            // isDisabled={true}
                            // inputClassName={"border-0"}
                            labelText="Distance from School"
                            invalid={(permanentAddressForm.touched.pDistanceFromSchool && permanentAddressForm.errors.pDistanceFromSchool) ? true : false}
                            error={(permanentAddressForm.touched.pDistanceFromSchool && permanentAddressForm.errors.pDistanceFromSchool) ? permanentAddressForm.errors.pDistanceFromSchool : ""}
                        />
                    </div>
                    {/* <div className="col-12">
                        <input type="submit" value="Submit Permanent" />
                    </div> */}
                </div>
            </AccordionBody>
        </form>
    )
}