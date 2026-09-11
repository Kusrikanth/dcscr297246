import React, { useState, useImperativeHandle, useContext, useEffect } from "react";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    RadioInput
} from "../../../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";

// function getTrueFalseOptions(fieldValue: any) {
//     if (typeof fieldValue === "string") {
//         return fieldValue === "true";
//     }
//     return fieldValue || false;
// }

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}

function getInitialState(initialState?: any) {
    return {
        allergicTo: initialState?.allergicTo || "",
        healthStatus: initialState?.healthStatus || "",
        specialChildDetails: initialState?.specialChildDetails || "",
        isSpecialChild: initialState?.isSpecialChild || "false",
        isSingleGirlChild: getTrueFalseOptions(initialState?.isSingleGirlChild) || "false"
    }
}

const validationSchema = Yup.object().shape({
    isSpecialChild: Yup.string(),
    otherHealthIssue: Yup.string().when('isSpecialChild', {
        is: (isSpecialChild: any) => isSpecialChild === "true",
        then: Yup.string()
            .required('Special child details required.')
    }),
    isAllergitic: Yup.string(),
    allergiticDetails: Yup.string().when('isAllergitic', {
        is: (isAllergitic: any) => isAllergitic === "true",
        then: Yup.string()
            .required('Allergic details required.')
    }),
    emergencyContactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required('Emergency contact number required.')
});

const initialValues = getInitialState();
export default function MedicalInfo({ stepId, formId, formDetails, storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);

    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const medicalForm = useFormik({
        initialValues,
        // validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormDataCallback(formId, true, values);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            medicalForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const formData = getInitialState(tabsData[stepId]);
            medicalForm.resetForm({
                values: formData
            })
        }
    }, [tabsData, stepId]);

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        medicalForm.setFieldValue(name, updateDate);
    }

    function onChangeSpecialHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        medicalForm.setValues((prevState: any) => ({
            ...prevState, [name]: value,
            otherHealthIssue: "",
        }))
    }

    function onChangeAllergeticHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        medicalForm.setValues((prevState: any) => ({
            ...prevState, [name]: value,
            allergiticDetails: "",
        }))
    }
    return (
        <form onSubmit={medicalForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="medicalInfo">
                Medical Info
            </AccordionHeader>
            <AccordionBody accordionId="medicalInfo">
                <div className="row">

                    {/* <div className="w-100"></div> */}
                    {/* <div className="col-4 d-flex align-items-center">
                        <RadioInputContainer
                            name="isSpecialChild"
                            labelText="Is Special Child ?"
                            inputContainerClassName="mt-2"
                            radioOptions={trueFalseOptions}
                            value={medicalForm.values.isSpecialChild}
                            onChange={onChangeSpecialHndlr}
                        // isDisabled={isMotherSingleParent}
                        />
                    </div> */}
                    <div className="col-4">
                        <TextInput
                            name="allergicTo"
                            labelText="Is the child prone to any allergy ?"
                            value={medicalForm.values.allergicTo}
                            onChange={medicalForm.handleChange}
                            invalid={(medicalForm.touched.allergicTo && medicalForm.errors.allergicTo) ? true : false}
                            error={(medicalForm.touched.allergicTo && medicalForm.errors.allergicTo) ? medicalForm.errors.allergicTo : ""}
                        // isDisabled={medicalForm.values.isSpecialChild === "false"}
                        />
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="healthStatus"
                            labelText="Health Status"
                            value={medicalForm.values.healthStatus}
                            onChange={medicalForm.handleChange}
                            invalid={(medicalForm.touched.healthStatus && medicalForm.errors.healthStatus) ? true : false}
                            error={(medicalForm.touched.healthStatus && medicalForm.errors.healthStatus) ? medicalForm.errors.healthStatus : ""}
                        // isDisabled={medicalForm.values.isSpecialChild === "false"}
                        />
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="specialChildDetails"
                            labelText="Special Child Details"
                            value={medicalForm.values.specialChildDetails}
                            onChange={medicalForm.handleChange}
                            invalid={(medicalForm.touched.specialChildDetails && medicalForm.errors.specialChildDetails) ? true : false}
                            error={(medicalForm.touched.specialChildDetails && medicalForm.errors.specialChildDetails) ? medicalForm.errors.specialChildDetails : ""}
                        />
                    </div>
                    <div className="col-12">
                        <p className="fs-14  mb-2 fw-bold">Whether Candidate is :</p>
                    </div>
                    <div className="col-12 d-flex">
                        <RadioInputContainer
                            name="isSpecialChild"
                            labelText="1. Specially abled ( Divyangjan)"
                            formgroupClassName="me-5"
                            containerClassName="d-flex"
                            labelClassName="mb-0 me-3"
                            radioOptions={trueFalseOptions}
                            value={medicalForm.values.isSpecialChild}
                            onChange={medicalForm.handleChange}
                        // isDisabled={isMotherSingleParent}
                        />
                        <RadioInputContainer
                            name="isSingleGirlChild"
                            labelText="2. Single Girl Child"
                            containerClassName="d-flex"
                            labelClassName="mb-0 me-3"
                            radioOptions={trueFalseOptions}
                            value={medicalForm.values.isSingleGirlChild}
                            onChange={onChangeAllergeticHndlr}
                        // isDisabled={isMotherSingleParent}
                        />
                    </div>
                </div>
            </AccordionBody>
        </form>
    )
}