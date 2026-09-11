import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    TextInputWithRegex
} from "../../../../../../Components/Common";

//Helper
import { StepperFormContext } from "../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import {
    getMasterCurriculumAct
} from "../../../../../../store/masterdata/masterdataactions";
import { pastEducationClassAct, setPastEductionClassAct } from "../../../../../../store/directory/studentmanagement/studentmanagementactions";


function getInitialState(initialState?: any) {
    return {
        isEarlyClass: false,
        lastSchoolStudied: initialState?.lastSchoolStudied || "",
        lastCurriculumStudied: initialState?.lastCurriculumStudied || "",
        lastClassStudied: initialState?.lastClassStudied || "",
        lastAcademicPercentage: initialState?.lastAcademicPercentage || "",
        placeOfSchoolStudied: initialState?.placeOfSchoolStudied || ""
    }
}


const validationSchema = Yup.object().shape({
    isEarlyClass: Yup.boolean(),
    lastSchoolStudied: Yup.string().when('isEarlyClass', {
        is: (isEarlyClass: any) => !isEarlyClass,
        then: Yup.string().required('School name required.')
    }),
    lastCurriculumStudied: Yup.string().when('isEarlyClass', {
        is: (isEarlyClass: any) => !isEarlyClass,
        then: Yup.string().required('Curriculum Required.')
    }),
    lastClassStudied: Yup.string().when('isEarlyClass', {
        is: (isEarlyClass: any) => !isEarlyClass,
        then: Yup.string().required('Class name is required.')
    }),
    placeOfSchoolStudied: Yup.string().when('isEarlyClass', {
        is: (isEarlyClass: any) => !isEarlyClass,
        then: Yup.string().required('Place of school is required.')
    })
});

const initialValues = getInitialState();
export default function PastEducation({ isViewMode, stepId, formId, formDetails, branchId, academicYearId,
    storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();
    const { branchClassResp, masterCurriculumResp } = useAppSelector(({ masterData, branchAcademics }) => ({
        masterCurriculumResp: masterData.masterCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
    }), shallowEqual);

    useEffect(() => {
        dispatch(getMasterCurriculumAct(generateActionPayload("get_master_curriculum", undefined, { pageNo: 0, pageSize: 50 })));
    }, []);

    const pastEducationForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormDataCallback(formId, true, pastEducationForm.dirty, values);
        }
    });

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId))
            pastEducationForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const formData = getInitialState(tabsData[stepId]);
            pastEducationForm.resetForm({
                values: formData
            })
        }
    }, [tabsData, stepId]);

    useEffect(() => {
        const { content } = branchClassResp || {},
            { admissionSoughtId } = tabsData[stepId] || {};
        if (Array.isArray(content) && content.length > 0 && admissionSoughtId) {
            const { classSequence } = content.find(item => item?.id?.toString().toLowerCase() === admissionSoughtId?.toString().toLowerCase()) || {};
            if (!isNaN(classSequence) && Number(classSequence) <= 3) {
                pastEducationForm.setValues(prevState => ({ ...prevState, isEarlyClass: true }));
            }
        }
    }, [branchClassResp, tabsData]);

    return (
        <form onSubmit={pastEducationForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="pastEducation">
                Past Education
            </AccordionHeader>
            <AccordionBody accordionId="pastEducation">
                <div className="tw-grid tw-grid-cols-12 tw-gap-x-3">

                    {/* School Studied */}
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="lastSchoolStudied"
                            labelText="School Studied"
                            labelClass={pastEducationForm.values.isEarlyClass ? "" : "required"}
                            inputClassName="ng-input"
                            isDisabled={isViewMode}
                            value={pastEducationForm.values.lastSchoolStudied}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.lastSchoolStudied && pastEducationForm.errors.lastSchoolStudied) ? true : false}
                            error={(pastEducationForm.touched.lastSchoolStudied && pastEducationForm.errors.lastSchoolStudied) ? pastEducationForm.errors.lastSchoolStudied : ""}
                        />
                    </div>

                    {/* Curriculum */}
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="lastCurriculumStudied"
                            labelText="Curriculum"
                            labelClass={pastEducationForm.values.isEarlyClass ? "" : "required"}
                            inputClassName="ng-input"
                            isDisabled={isViewMode}
                            value={pastEducationForm.values.lastCurriculumStudied}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            menuItems={masterCurriculumResp}
                            valueKey="id"
                            textKey="curriculumName"
                            invalid={(pastEducationForm.touched.lastCurriculumStudied && pastEducationForm.errors.lastCurriculumStudied) ? true : false}
                            error={(pastEducationForm.touched.lastCurriculumStudied && pastEducationForm.errors.lastCurriculumStudied) ? pastEducationForm.errors.lastCurriculumStudied : ""}
                        />
                    </div>

                    {/* Class */}
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="lastClassStudied"
                            labelText="Class"
                            labelClass={pastEducationForm.values.isEarlyClass ? "" : "required"}
                            inputClassName="ng-input"
                            isDisabled={isViewMode}
                            value={pastEducationForm.values.lastClassStudied}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.lastClassStudied && pastEducationForm.errors.lastClassStudied) ? true : false}
                            error={(pastEducationForm.touched.lastClassStudied && pastEducationForm.errors.lastClassStudied) ? pastEducationForm.errors.lastClassStudied : ""}
                        />
                    </div>

                    {/* Place Of School Studied (Full Width) */}
                    <div className="tw-col-span-12">
                        <TextInput
                            name="placeOfSchoolStudied"
                            labelText="Place Of School Studied"
                            labelClass={pastEducationForm.values.isEarlyClass ? "" : "required"}
                            inputClassName="ng-input"
                            isDisabled={isViewMode}
                            value={pastEducationForm.values.placeOfSchoolStudied}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.placeOfSchoolStudied && pastEducationForm.errors.placeOfSchoolStudied) ? true : false}
                            error={(pastEducationForm.touched.placeOfSchoolStudied && pastEducationForm.errors.placeOfSchoolStudied) ? pastEducationForm.errors.placeOfSchoolStudied : ""}
                        />
                    </div>

                </div>
            </AccordionBody>
        </form>
    )
}