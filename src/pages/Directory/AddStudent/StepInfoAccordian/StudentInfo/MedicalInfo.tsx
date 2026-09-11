import React, { useState, useImperativeHandle, useContext, useEffect } from "react";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
} from "../../../../../Components/Common";

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
        isSpecialChild: getTrueFalseOptions(initialState?.isSpecialChild),
        otherHealthIssue: initialState?.otherHealthIssue || "",
        allergiticDetails: initialState?.allergiticDetails || "",
        isAllergitic: getTrueFalseOptions(initialState?.isAllergitic),
        emergencyContactNo: initialState?.emergencyContactNo || ""
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

export default function MedicalInfo({ formDetails, refId }: any) {
    const [basicDetailsState, setBasicDetailsState] = useState<any>(getInitialState(formDetails));
    const { currentMultiFormKeys, editStudentData, storeMultiFormData } = useContext<any>(StepperFormContext);

    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const medicalInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: basicDetailsState,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormData("medicalInfo", true, values);
        }
    })

    useEffect(() => {
        if (editStudentData) {
            const { medicalInfo } = editStudentData,
                { formData } = medicalInfo || {};
            if (formData)
                setBasicDetailsState(getInitialState(formData));
        }
    }, [editStudentData]);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("medicalInfo"))
            medicalInfoForm.handleSubmit();
    }, [currentMultiFormKeys]);



    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        medicalInfoForm.setFieldValue(name, updateDate);
    }

    // function onChangeSpecialHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    // const { name, value, checked } = event.target;
    //     if (checked) {
    //         medicalInfoForm.setValues((prevState: any) => ({
    //             ...prevState, [name]: checked,
    //             allergiticDetails: "",
    //             emergencyContactNo: ""
    //         }))
    //         // medicalInfoForm.resetForm();
    //         medicalInfoForm.resetForm({
    //             values: {
    //                 [name]: checked,
    //                 allergiticDetails: "",
    //                 isAllergitic: "",
    //                 otherHealthIssue: "",
    //                 emergencyContactNo: ""
    //             }
    //         });
    //     } else {
    //         medicalInfoForm.resetForm({
    //             values: {
    //                 [name]: checked,
    //                 allergiticDetails: "",
    //                 isAllergitic: "",
    //                 otherHealthIssue: "",
    //                 emergencyContactNo: ""
    //             }
    //         });
    //         // medicalInfoForm.resetForm();
    //     }
    // }

    function onChangeSpecialHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        medicalInfoForm.setValues((prevState: any) => ({
            ...prevState, [name]: value,
            otherHealthIssue: "",
        }))
    }
    function onChangeAllergeticHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        medicalInfoForm.setValues((prevState: any) => ({
            ...prevState, [name]: value,
            allergiticDetails: "",
        }))
    }
    return (
        <form onSubmit={medicalInfoForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="medical-info">
                Medical Info
            </AccordionHeader>
            <AccordionBody accordionId="medical-info">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-4">
                       <RadioInputContainer
                            name="isSpecialChild"
                            labelText="Is Special Child ?"
                            inputContainerClassName="mt-2"
                            radioOptions={trueFalseOptions}
                            value={medicalInfoForm.values.isSpecialChild}
                            onChange={onChangeSpecialHndlr}
                        // isDisabled={isMotherSingleParent}
                        />
                        {/* <Switch
                            attributeId="isSpecialChild"
                            labelName="Is Special Child"
                            className="form-switch-sm mb-3 form-check-right"
                            checked={medicalInfoForm.values.isSpecialChild}
                            onChangeHndlr={onChangeSpecialHndlr}
                        /> */}
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="otherHealthIssue"
                            labelText="Special Child Details"
                            value={medicalInfoForm.values.otherHealthIssue}
                            onChange={medicalInfoForm.handleChange}
                            invalid={(medicalInfoForm.touched.otherHealthIssue && medicalInfoForm.errors.otherHealthIssue) ? true : false}
                            error={(medicalInfoForm.touched.otherHealthIssue && medicalInfoForm.errors.otherHealthIssue) ? medicalInfoForm.errors.otherHealthIssue : ""}
                            isDisabled={medicalInfoForm.values.isSpecialChild === "false"}
                        />
                    </div>

                    <div className="tw-col-span-4">
                         <PhoneInput
                            name="emergencyContactNo"
                            labelText="Emergency Contact no."
                            value={medicalInfoForm.values.emergencyContactNo}
                            onChange={onChangePhoneInput}
                            onBlur={medicalInfoForm.handleBlur}
                            labelClass="required"
                            invalid={(medicalInfoForm.touched.emergencyContactNo && medicalInfoForm.errors.emergencyContactNo) ? true : false}
                            error={(medicalInfoForm.touched.emergencyContactNo && medicalInfoForm.errors.emergencyContactNo) ? medicalInfoForm.errors.emergencyContactNo : ""}
                        // isDisabled={!medicalInfoForm.values.isSpecialChild}
                        />
                    </div>

                    <div className="tw-col-span-4">
                         <RadioInputContainer
                            name="isAllergitic"
                            labelText="Allergic To"
                            inputContainerClassName="mt-2"
                            radioOptions={trueFalseOptions}
                            value={medicalInfoForm.values.isAllergitic}
                            onChange={onChangeAllergeticHndlr}
                        // isDisabled={isMotherSingleParent}
                        />
                        {/* <Switch
                            attributeId="isAllergitic"
                            labelName="Allergic To"
                            className="form-switch-sm mb-3 form-check-right"
                            checked={medicalInfoForm.values.isAllergitic}
                            onChangeHndlr={onChangeAllergeticHndlr}
                        /> */}
                    </div>

                    <div className="tw-col-span-8">
                        <TextInput
                            name="allergiticDetails"
                            labelText="Allergetic Details"
                            value={medicalInfoForm.values.allergiticDetails}
                            onChange={medicalInfoForm.handleChange}
                            invalid={(medicalInfoForm.touched.allergiticDetails && medicalInfoForm.errors.allergiticDetails) ? true : false}
                            error={(medicalInfoForm.touched.allergiticDetails && medicalInfoForm.errors.allergiticDetails) ? medicalInfoForm.errors.allergiticDetails : ""}
                            isDisabled={medicalInfoForm.values.isAllergitic === "false"}
                        />
                    </div>


                    {/* <div className="col-12">
                        <input type="submit" value="Medical Details" />
                    </div> */}

                </div>
            </AccordionBody>
        </form>
    )
}