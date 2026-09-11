import React, { useState, useEffect, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { Label, Input } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
import {
    UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem,
    Collapse
} from "reactstrap";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    UploadImage,
    RadioInputContainer, UploadImageUpdated, TextInputWithRegex, MultiSelect, MemoizedSelectInput,
    CustomSelect
} from "../../../../../../Components/Common";
//helper
import { trueFalseOptions, StepperFormContext } from "../helper";
import { qualificationOptions, renderOptionsEmployee, renderValueSection } from "./helper";

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}

export function getGuardianInitialState(initialState?: any) {
    return {
        isGuardianEmployeeOfSchool: "false",
        guardianEmployeeCode: "",
        isGuardianPresent: getTrueFalseOptions(initialState?.isGuardianPresent),
        guardianName: initialState?.guardianName || "",
        guardianAadharNo: initialState?.guardianAadharNo || "",
        guardianEmail: initialState?.guardianEmail || "",
        guardianPhoneNo: initialState?.guardianPhoneNo || "",
        guardianWhatsappNo: initialState?.guardianWhatsappNo || "",
        guardianOccupationId: initialState?.guardianOccupationId || "",
        guardianQualificationName: initialState?.guardianQualificationName || "",
        qualificationQualificationSpec: initialState?.qualificationQualificationSpec || "",
        guardianDesignationName: initialState?.guardianDesignationName || "",
        relationWithStudent: initialState?.relationWithStudent || "",
        guardianQualificationSpec: initialState?.guardianQualificationSpec || "",
        guardianContributeStakeHolder: initialState?.guardianContributeStakeHolder || []
    }
}

const validationSchema = Yup.object().shape({
    isGuardianPresent: Yup.string(),
    guardianName: Yup.string().when('isGuardianPresent', {
        is: (isGuardianPresent: any) => isGuardianPresent === "true",
        then: Yup.string()
            .required('Guardian name required.')
    }),
    // guardianAadharNo: Yup.string().when('isGuardianPresent', {
    //     is: (isGuardianPresent: any) => isGuardianPresent === "true",
    //     then: Yup.string()
    //         .required('Document number required.')
    // }),
    guardianEmail: Yup.string().when('isGuardianPresent', {
        is: (isGuardianPresent: any) => isGuardianPresent === "true",
        then: Yup.string().email('Invalid Email.')
            .required('Email id required.')
    }),
    guardianPhoneNo: Yup.string().when('isGuardianPresent', {
        is: (isGuardianPresent: any) => isGuardianPresent === "true",
        then: Yup.string()
            .trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required.")
    }),
    relationWithStudent: Yup.string().when('isGuardianPresent', {
        is: (isGuardianPresent: any) => isGuardianPresent === "true",
        then: Yup.string()
            .required('Relation type is required.')
    })
});

const initialValues = getGuardianInitialState();
export default function GuardianDetails({
    isViewMode,
    stepId, formId, storeMultiFormDataCallback
}: any) {
    const { tabsData, currentMultiFormKeys } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();
    
    const { occupationResp } =
        useAppSelector(({ masterData }) => ({
            occupationResp: masterData.occupationResp,
        }), shallowEqual);

    const guardianForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { ...values };
            // payload.guardianContributeStakeHolder = selectedStakeHolderListState.map((item: any) => item.stakeHolder);
            storeMultiFormDataCallback(formId, true, guardianForm.dirty, payload);
        }
    });
    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        guardianForm.setFieldValue(name, updateDate);
    }

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId))
            guardianForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const formData = getGuardianInitialState(tabsData[stepId]);
            guardianForm.resetForm({
                values: formData
            });
        }
    }, [tabsData, stepId]);

    function hasGuardianHnldr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value === "false") {
            const formData = getGuardianInitialState(undefined)
            guardianForm.setValues(formData);
        } else {
            guardianForm.setFieldValue(name, value);
        }
    }

    function handleOccupationChange(selected: any, config: any) {
        const { name } = config;
        guardianForm.setFieldValue(name, selected);
    }

    return (
        <React.Fragment>
            <form id="student-info-form" onSubmit={guardianForm.handleSubmit}>
                <AccordionHeader tag="h4" targetId={formId}>
                    Guardian Info
                </AccordionHeader>
                <AccordionBody accordionId={formId}>
                    <div className="tw-flex tw-flex-wrap -tw-mx-1.5">
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <RadioInputContainer
                                name="isGuardianPresent"
                                radioClassName="form-radio-green"
                                labelText="Guardian ?"
                                inputContainerClassName="tw-mt-2"
                                isDisabled={isViewMode}
                                radioOptions={trueFalseOptions}
                                value={guardianForm.values.isGuardianPresent}
                                onChange={hasGuardianHnldr}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <TextInput
                                name="guardianName"
                                labelText="Name"
                                labelClass={(guardianForm.values.isGuardianPresent === "true") ? "required" : ""}
                                maxLength={100}
                                value={guardianForm.values.guardianName}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianName && guardianForm.errors.guardianName) ? true : false}
                                error={(guardianForm.touched.guardianName && guardianForm.errors.guardianName) ? guardianForm.errors.guardianName : ""}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <TextInputWithRegex
                                name="guardianAadharNo"
                                labelText="Aadhar Number"
                                value={guardianForm.values.guardianAadharNo}
                                onChange={guardianForm.handleChange}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                                maxLength={12}
                                allowedInputRegex="^[0-9]+$"
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <TextIconInput
                                name="guardianEmail"
                                labelText="Email ID"
                                labelClass={(guardianForm.values.isGuardianPresent === "true") ? "required" : ""}
                                value={guardianForm.values.guardianEmail}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianEmail && guardianForm.errors.guardianEmail) ? true : false}
                                error={(guardianForm.touched.guardianEmail && guardianForm.errors.guardianEmail) ? guardianForm.errors.guardianEmail : ""}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                            ><i className="ri-mail-unread-line"></i></TextIconInput>
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <PhoneInput
                                name="guardianPhoneNo"
                                labelText="Phone No."
                                labelClass={(guardianForm.values.isGuardianPresent === "true") ? "required" : ""}
                                value={guardianForm.values.guardianPhoneNo}
                                onChange={onChangePhoneInput}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianPhoneNo && guardianForm.errors.guardianPhoneNo) ? true : false}
                                error={(guardianForm.touched.guardianPhoneNo && guardianForm.errors.guardianPhoneNo) ? guardianForm.errors.guardianPhoneNo : ""}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <PhoneInput
                                name="guardianWhatsappNo"
                                labelText="Guardian Whatsapp No."
                                value={guardianForm.values.guardianWhatsappNo}
                                onChange={onChangePhoneInput}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianWhatsappNo && guardianForm.errors.guardianWhatsappNo) ? true : false}
                                error={(guardianForm.touched.guardianWhatsappNo && guardianForm.errors.guardianWhatsappNo) ? guardianForm.errors.guardianWhatsappNo : ""}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <SelectInput
                                name="guardianQualificationName"
                                labelText="Qualification"
                                value={guardianForm.values.guardianQualificationName}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                menuItems={qualificationOptions}
                                valueKey="id"
                                textKey="name"
                                invalid={(guardianForm.touched.guardianQualificationName && guardianForm.errors.guardianQualificationName) ? true : false}
                                error={(guardianForm.touched.guardianQualificationName && guardianForm.errors.guardianQualificationName) ? guardianForm.errors.guardianQualificationName : ""}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <CustomSelect
                                name="guardianOccupationId"
                                labelText="Occupation"
                                value={guardianForm.values.guardianOccupationId}
                                options={occupationResp?.data}
                                idKey="occupationId"
                                searchKey="occupationName"
                                defaultSelect="Select"
                                renderValue={renderValueSection}
                                renderOptions={renderOptionsEmployee}
                                onChange={handleOccupationChange}
                                invalid={(guardianForm.touched.guardianOccupationId && guardianForm.errors.guardianOccupationId) ? true : false}
                                error={(guardianForm.touched.guardianOccupationId && guardianForm.errors.guardianOccupationId) ? guardianForm.errors.guardianOccupationId : ""}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <TextInput
                                name="guardianQualificationSpec"
                                labelText="Specify Qualification"
                                value={guardianForm.values.guardianQualificationSpec}
                                onChange={guardianForm.handleChange}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <TextInput
                                name="relationWithStudent"
                                labelText="Relation Type"
                                labelClass={(guardianForm.values.isGuardianPresent === "true") ? "required" : ""}
                                value={guardianForm.values.relationWithStudent}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.relationWithStudent && guardianForm.errors.relationWithStudent) ? true : false}
                                error={(guardianForm.touched.relationWithStudent && guardianForm.errors.relationWithStudent) ? guardianForm.errors.relationWithStudent : ""}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                            <TextInput
                                name="guardianDesignationName"
                                labelText="Designation"
                                value={guardianForm.values.guardianDesignationName}
                                onChange={guardianForm.handleChange}
                                invalid={(guardianForm.touched.guardianDesignationName && guardianForm.errors.guardianDesignationName) ? true : false}
                                error={(guardianForm.touched.guardianDesignationName && guardianForm.errors.guardianDesignationName) ? guardianForm.errors.guardianDesignationName : ""}
                                isDisabled={isViewMode || guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                    </div>
                </AccordionBody>
            </form>
        </React.Fragment>

    )
}