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
} from "../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Helper
import {
    trueFalseOptions
} from "../helper";
import { StepperFormContext } from "../helper";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getCountryStateAct, getStateCityAct,
} from "../../../store/masterdata/masterdataactions";
import {
    permanentAddressCityAct, permanentAddressStateAct
} from "../../../store/directory/studentmanagement/studentmanagementactions";


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
        pDistanceFromSchool: initialState?.pDistanceFromSchool || "",
    }
}
const validationSchema = Yup.object().shape({
    pHouseNo: Yup.string().required("House no required."),
    pLandmark: Yup.string().required('Landmark required.'),
    pCountry: Yup.string().required("Select country."),
    pState: Yup.string().test("countryStateCheck", "Select state.",
        (value: any, schema: any) => {
            const countryName = schema.parent.pCountry;
            if (countryName === 'India' && !value) {
                return false;
            }
            return true;
        }),
    pCity: Yup.string().test("countryCityCheck", "Select city.",
        (value: any, schema: any) => {
            const countryName = schema.parent.pCountry;
            if (countryName === 'India' && !value) {
                return false;
            }
            return true;
        }),
    pDistanceFromSchool: Yup.string().test("countryCityCheck", "Distance from school is required.",
        (value: any, schema: any) => {
            const countryName = schema.parent.pCountry;
            if (countryName === 'India' && !value) {
                return false;
            }
            return true;
        }),
    pPinCode: Yup.string().test("countryPincodeCheck", "Pincode required.",
        (value: any, schema: any) => {
            const countryName = schema.parent.pCountry;
            if (countryName === 'India' && !value) {
                return false;
            }
            return true;
        }).matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.'),
});

const initialValues = getInitialState();
export default function PermanentAddress({ stepId, formId,
    branchAreasResp,
    residentialAddressInfo,
    getResidentialAddress,
    storeMultiFormDataCallback, countriesResp }: any) {
    const { tabsData, studentId, currentMultiFormKeys, editStudentData, storeMultiFormData,
        submitCurrentFormCllbck, requestedMultiFormKeyCllback } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();
    const fieldUpdatedRef = useRef({
        requestCurrentAddress: false,
    });
    const { countryStateResp, permanentAddressStateResp,
        permanentAddressCityResp, branchListResp } = useAppSelector(({ branch, masterData, directoryStudent }) => ({
            countryStateResp: masterData.countryStateResp,
            permanentAddressStateResp: directoryStudent.permanentAddressStateResp,
            permanentAddressCityResp: directoryStudent.permanentAddressCityResp,
            branchListResp: branch.branchListResp,
        }), shallowEqual);

    useEffect(() => {
        if (tabsData?.[stepId]) {
            const formData = getInitialState(tabsData[stepId]);
            const { pCountry, pState } = tabsData[stepId];
            if (pCountry) {
                dispatch(permanentAddressStateAct(generateActionPayload("get_stateby_countryname", { countryName: pCountry })));
            }
            if (pState) {
                dispatch(permanentAddressCityAct(generateActionPayload("get_cityby_statename", { stateName: pState })));
            }
            permanentAddressForm.resetForm({
                values: formData
            })
        }
    }, [tabsData, stepId]);

    const permanentAddressForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            const payload = { ...values };
            storeMultiFormDataCallback(formId, true, permanentAddressForm.dirty, payload);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            permanentAddressForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (name === "pCountry") {
            if (value) {
                dispatch(permanentAddressStateAct(generateActionPayload("get_stateby_countryname", { countryName: value })));
            }
            permanentAddressForm.setValues((prevState: any) => ({
                ...prevState, pState: "", pCity: "",
                pPinCode: "", pDistanceFromSchool: "",
                [name]: value
            }));
        } else if (name === "pState") {
            if (value) {
                dispatch(permanentAddressCityAct(generateActionPayload("get_cityby_statename", { stateName: value })));
            }
            permanentAddressForm.setValues((prevState: any) => ({
                ...prevState, pCity: "",
                pPinCode: "", pDistanceFromSchool: "",
                [name]: value
            }));
        }
    }

    async function isPermanentAddressSameHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        if (value === "true") {
            getResidentialAddress();
        } else {
            const initialState = getInitialState();
            permanentAddressForm.resetForm({
                values: initialState
            })
        }
    }

    useEffect(() => {
        if (residentialAddressInfo) {
            const { country, state } = residentialAddressInfo;
            if (country) {
                dispatch(permanentAddressStateAct(generateActionPayload("get_stateby_countryname", { countryName: country })));
            }
            if (state) {
                dispatch(permanentAddressCityAct(generateActionPayload("get_cityby_statename", { stateName: state })));
            }
            permanentAddressForm.setValues({
                isPermanentAddressSame: "true",
                pHouseNo: residentialAddressInfo.houseNo || "",
                pLandmark: residentialAddressInfo.landmark || "",
                pCountry: residentialAddressInfo.country || "",
                pState: residentialAddressInfo.state || "",
                pCity: residentialAddressInfo.city || "",
                pPinCode: residentialAddressInfo.pinCode || "",
                pDistanceFromSchool: residentialAddressInfo.distanceFromSchool || "",
            })
        }
    }, [residentialAddressInfo]);

    
    const branchShortName = branchListResp?.data?.[0]?.shortName;
    const distanceOptions =
        branchShortName === "PC"
            ? [
                { text: "0-2 Km" },
                { text: "2-5 Km" },
                { text: "5-10 Km" },
                { text: "10-15 Km" },
            ]
            : [
                { text: "0-5 Km" },
                { text: "5-10 Km" },
                { text: "10-15 Km" },
                { text: "15-20 Km" },
                { text: "20-25 Km" },
            ];

    return (
        <form onSubmit={permanentAddressForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                Permanent Address
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12">
                        <RadioInputContainer
                            name="isPermanentAddressSame"
                            radioClassName="form-radio-green"
                            labelText="Is Permanent Address is same as Correspondence Address ?"
                            containerClassName="tw-flex"
                            labelClassName="tw-mb-0 tw-me-3"
                            radioOptions={trueFalseOptions}
                            value={permanentAddressForm.values.isPermanentAddressSame}
                            onChange={isPermanentAddressSameHndlr}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="pHouseNo"
                            labelText="House/Flat no"
                            labelClass="required"
                            value={permanentAddressForm.values.pHouseNo}
                            onChange={permanentAddressForm.handleChange}
                            onBlur={permanentAddressForm.handleBlur}
                            invalid={(permanentAddressForm.touched.pHouseNo && permanentAddressForm.errors.pHouseNo) ? true : false}
                            error={(permanentAddressForm.touched.pHouseNo && permanentAddressForm.errors.pHouseNo) ? permanentAddressForm.errors.pHouseNo : ""}
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="pLandmark"
                            labelText="Location / Landmark"
                            labelClass="required"
                            value={permanentAddressForm.values.pLandmark}
                            onChange={permanentAddressForm.handleChange}
                            onBlur={permanentAddressForm.handleBlur}
                            invalid={(permanentAddressForm.touched.pLandmark && permanentAddressForm.errors.pLandmark) ? true : false}
                            error={(permanentAddressForm.touched.pLandmark && permanentAddressForm.errors.pLandmark) ? permanentAddressForm.errors.pLandmark : ""}
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="pCountry"
                            labelText="Country"
                            labelClass="required"
                            value={permanentAddressForm.values.pCountry}
                            onChange={onChangeCountryHndlr}
                            onBlur={permanentAddressForm.handleBlur}
                            invalid={(permanentAddressForm.touched.pCountry && permanentAddressForm.errors.pCountry) ? true : false}
                            error={(permanentAddressForm.touched.pCountry && permanentAddressForm.errors.pCountry) ? permanentAddressForm.errors.pCountry : ""}
                            menuItems={countriesResp}
                            valueKey="countryName"
                            textKey="countryName"
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="pState"
                            labelText="State"
                            labelClass={permanentAddressForm.values.pCountry === 'India' ? "required" : ""}
                            // formgroupClassName="mb-4"
                            value={permanentAddressForm.values.pState}
                            onChange={onChangeCountryHndlr}
                            onBlur={permanentAddressForm.handleBlur}
                            invalid={(permanentAddressForm.touched.pState && permanentAddressForm.errors.pState) ? true : false}
                            error={(permanentAddressForm.touched.pState && permanentAddressForm.errors.pState) ? permanentAddressForm.errors.pState : ""}
                            menuItems={permanentAddressStateResp}
                            valueKey="stateName"
                            textKey="stateName"
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="pCity"
                            labelText="City"
                            labelClass={permanentAddressForm.values.pCountry === 'India' ? "required" : ""}
                            value={permanentAddressForm.values.pCity}
                            onChange={permanentAddressForm.handleChange}
                            onBlur={permanentAddressForm.handleBlur}
                            invalid={(permanentAddressForm.touched.pCity && permanentAddressForm.errors.pCity) ? true : false}
                            error={(permanentAddressForm.touched.pCity && permanentAddressForm.errors.pCity) ? permanentAddressForm.errors.pCity : ""}
                            menuItems={permanentAddressCityResp}
                            valueKey="cityName"
                            textKey="cityName"
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInputWithRegex
                            name="pPinCode"
                            labelText="PIN Code"
                            labelClass={permanentAddressForm.values.pCountry === 'India' ? "required" : ""}
                            value={permanentAddressForm.values.pPinCode}
                            onChange={permanentAddressForm.handleChange}
                            onBlur={permanentAddressForm.handleBlur}
                            invalid={(permanentAddressForm.touched.pPinCode && permanentAddressForm.errors.pPinCode) ? true : false}
                            error={(permanentAddressForm.touched.pPinCode && permanentAddressForm.errors.pPinCode) ? permanentAddressForm.errors.pPinCode : ""}
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name='pDistanceFromSchool'
                            labelClass={permanentAddressForm.values.pCountry === 'India' ? "required" : ""}
                            valueKey='text'
                            textKey='text'
                            menuItems={distanceOptions}
                            value={permanentAddressForm.values.pDistanceFromSchool}
                            onChange={permanentAddressForm.handleChange}
                            onBlur={permanentAddressForm.handleBlur}
                            labelText="Distance from School"
                            isDisabled={permanentAddressForm.values.isPermanentAddressSame === "true"}
                            invalid={(permanentAddressForm.touched.pDistanceFromSchool && permanentAddressForm.errors.pDistanceFromSchool) ? true : false}
                            error={(permanentAddressForm.touched.pDistanceFromSchool && permanentAddressForm.errors.pDistanceFromSchool) ? permanentAddressForm.errors.pDistanceFromSchool : ""}
                        />
                    </div>
                </div>
            </AccordionBody>
        </form>
    )
}