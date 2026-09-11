import React, { useState, useImperativeHandle, useContext, useEffect } from "react";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    RadioInput
} from "../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    trueFalseOptions
} from "../helper";
import { StepperFormContext } from "../helper";



function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}

function getHealthStatus(fieldValue: any) {
    if (fieldValue) {
        return "true";
    }
    return "false";
}

function getInitialState(initialState?: any) {
    return {
        allergicTo: initialState?.allergicTo || "",
        anyHealthIssue: getHealthStatus(initialState?.healthStatus),
        healthStatus: initialState?.healthStatus || "",
        specialChildDetails: initialState?.specialChildDetails || "",
        isSpecialChild: getTrueFalseOptions(initialState?.isSpecialChild),
        isSingleGirlChild: getTrueFalseOptions(initialState?.isSingleGirlChild) || "false"
    }
}

const validationSchema = Yup.object().shape({
    anyHealthIssue: Yup.string(),
    allergicTo: Yup.string().required("Allergic to is required."),
    healthStatus: Yup.string().when('anyHealthIssue', {
        is: (anyHealthIssue: any) => anyHealthIssue === "true",
        then: Yup.string()
            .required('Health status is required.')
    }),
    specialChildDetails: Yup.string().when('isSpecialChild', {
        is: (isSpecialChild: any) => isSpecialChild === "true",
        then: Yup.string()
            .required('Special child details required.')
    })
});

const initialValues = getInitialState();
export default function MedicalInfo({ stepId, formId, formDetails, storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);

    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const medicalForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormDataCallback(formId, true, medicalForm.dirty, values);
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

    function onChangeSpecialChildHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        medicalForm.setValues((prevState: any) => ({
            ...prevState, [name]: value,
            specialChildDetails: "",
        }))
    }

    function onChangeHealthIssueHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        medicalForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value,
            healthStatus: ""
        }))
    }

    return (
        <form onSubmit={medicalForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="medicalInfo">
                Medical Info
            </AccordionHeader>
            <AccordionBody accordionId="medicalInfo">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12">
                        <p className="tw-text-sm tw-mb-2 tw-font-bold">Whether Candidate is :</p>
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <RadioInputContainer
                            name="isSpecialChild"
                            labelText="Specially abled ( Divyangjan)"
                            radioClassName="form-radio-green"
                            inputContainerClassName="tw-mt-2 tw-mb-3"
                            radioOptions={trueFalseOptions}
                            value={medicalForm.values.isSpecialChild}
                            onChange={onChangeSpecialChildHandler}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-8 lg:tw-col-span-8 2xl:tw-col-span-9">
                        <TextInput
                            name="specialChildDetails"
                            labelText="Special Child Details"
                            inputClassName="ng-input"
                            labelClass={(medicalForm.values.isSpecialChild === "true") ? "required tw-font-bold" : "tw-font-bold"}
                            value={medicalForm.values.specialChildDetails}
                            onChange={medicalForm.handleChange}
                            isDisabled={medicalForm.values.isSpecialChild === "false"}
                            invalid={(medicalForm.touched.specialChildDetails && medicalForm.errors.specialChildDetails) ? true : false}
                            error={(medicalForm.touched.specialChildDetails && medicalForm.errors.specialChildDetails) ? medicalForm.errors.specialChildDetails : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <RadioInputContainer
                            name="anyHealthIssue"
                            labelText="Health Issue"
                            containerClassName="tw-me-3"
                            inputContainerClassName="tw-mt-2"
                            radioClassName="form-radio-green"
                            radioOptions={trueFalseOptions}
                            value={medicalForm.values.anyHealthIssue}
                            onChange={onChangeHealthIssueHndlr}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-8 lg:tw-col-span-8 2xl:tw-col-span-9">
                        <TextInput
                            name="healthStatus"
                            labelText="Health Status"
                            inputClassName="ng-input"
                            labelClass={(medicalForm.values.anyHealthIssue === "true") ? "required tw-font-bold" : "tw-font-bold"}
                            isDisabled={medicalForm.values.anyHealthIssue === 'false'}
                            value={medicalForm.values.healthStatus}
                            onChange={medicalForm.handleChange}
                            invalid={(medicalForm.touched.healthStatus && medicalForm.errors.healthStatus) ? true : false}
                            error={(medicalForm.touched.healthStatus && medicalForm.errors.healthStatus) ? medicalForm.errors.healthStatus : ""}
                        />
                    </div>


                    <div className="tw-col-span-12 md:tw-col-span-8 lg:tw-col-span-8 2xl:tw-col-span-9">
                        <TextInput
                            name="allergicTo"
                            labelText="Is the child prone to any allergy ?"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={medicalForm.values.allergicTo}
                            onChange={medicalForm.handleChange}
                            invalid={(medicalForm.touched.allergicTo && medicalForm.errors.allergicTo) ? true : false}
                            error={(medicalForm.touched.allergicTo && medicalForm.errors.allergicTo) ? medicalForm.errors.allergicTo : ""}
                        // isDisabled={medicalForm.values.isSpecialChild === "false"}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <RadioInputContainer
                            name="isSingleGirlChild"
                            labelText="Single Girl Child"
                            radioClassName="form-radio-green"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={trueFalseOptions}
                            value={medicalForm.values.isSingleGirlChild}
                            onChange={medicalForm.handleChange}
                        // isDisabled={isMotherSingleParent}
                        />
                    </div>



                </div>
            </AccordionBody>
        </form>
    )
}