import React, { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import classNames from "classnames";
import { FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, MultiSelect, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    TextInputWithRegex,
    Button
} from "../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Helper

import { StepperFormContext } from "../helper";
import { percentageList } from "./helper";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getBranchCurriculumAct, getBrchSectionsAct, getBranchClassAct, setBrchClassAct
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import { nanoid } from "nanoid";
import { getAcademicResultsByRegNoAct } from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";

const validationSchema = Yup.object().shape({
    resultsList: Yup.array().of(
        Yup.object().shape({
            subjectList: Yup.array().of(Yup.object().shape({
                marks: Yup.number().typeError("Enter valid number."),
                maxMarks: Yup.number().typeError("Enter valid number."),
                percentage: Yup.number().typeError("Enter valid number."),
            }))
        })
    ),
});

function getResultRowInfo(academicYear?: any, lastAcademicPercentage?: any, resultsList?: any) {
    if (Array.isArray(resultsList)) {
        const academicYearName = !isNaN(academicYear) ? `${Number(academicYear) - 1}-${academicYear}` : academicYear;
        const updatedSubject = resultsList.map(item => {
            const { marksRequestVOList } = item;
            return ({
                id: nanoid(),
                lastYearResultId: marksRequestVOList?.[0]?.lastYearResultId || "",
                subject: marksRequestVOList?.[0]?.subject || "",
                maxMarks: marksRequestVOList?.[0]?.maxMarks || "",
                marks: marksRequestVOList?.[0]?.marks || "",
                percentage: marksRequestVOList?.[0]?.percentage || "",
                remarks: marksRequestVOList?.[0]?.remarks || "",
            })
        });
        return {
            id: nanoid(),
            academicYear: academicYearName,
            lastAcademicPercentage: lastAcademicPercentage || "",
            subjectList: updatedSubject
        }
    }
    return {
        id: nanoid(),
        academicYear,
        lastAcademicPercentage: "",
        subjectList: [{
            id: nanoid(),
            lastYearResultId: "",
            subject: "",
            maxMarks: "",
            marks: "",
            percentage: "",
            remarks: "",
        }]
    };
}
interface IAddAcademicResult {
    resultsList: Array<{
        id: string,
        lastAcademicPercentage: string,
        academicYear: string,
        subjectList: [{
            id: string,
            lastYearResultId?: string,
            subject: string,
            maxMarks: string,
            marks: string,
            percentage: string,
            remarks: string
        }]
    }>;
}


const initialValues: IAddAcademicResult = { resultsList: [] };
export default function AcademicDetails({ branchId, formId, instituteId, storeMultiFormDataCallback }: any) {
    const { tabsData, studentId, isResubmission = false, currentMultiFormKeys } = useContext<any>(StepperFormContext);
    const [lastYearPercentState, setLastYearPercentState] = useState({
        value: "",
        prevValue: "",
        error: ""
    });
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [higherClassState, setHigherClassState] = useState(false);
    const dispatch = useAppDispatch();
    const { academicYearListResp, branchClassResp, academicResultByRegnoResp, instAcademicErrorResp }
        = useAppSelector(({ instAcademics, branchAcademics, admissionRegistration }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            branchClassResp: branchAcademics.branchClassResp,
            academicResultByRegnoResp: admissionRegistration.academicResultByRegnoResp,
            instAcademicErrorResp: instAcademics.instAcademicErrorResp,
        }), shallowEqual);

    const academiDetailsRespRef = useRef({
        prevAcademicYearListResp: academicYearListResp,
        prevBranchClassResp: branchClassResp,
        prevAcademicResultByRegnoResp: academicResultByRegnoResp,
        prevInstAcademicErrorResp: instAcademicErrorResp
    });


    useEffect(() => {
        const { curriculumSoughtId: curriculumId } = tabsData?.studentProfile || {};
        if (curriculumId) {

            const classParams = {
                branchId, pageNo: 0, pageSize: 100, sortBy: "className",
                orderBy: "asc", curriculumId: curriculumId
            };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, classParams)));
        }
    }, [tabsData]);

    useEffect(() => {
        const { prevBranchClassResp, prevAcademicYearListResp, prevAcademicResultByRegnoResp } = academiDetailsRespRef.current;
        if (branchClassResp && prevBranchClassResp !== branchClassResp) {
            const { content } = branchClassResp;
            if (Array.isArray(content)) {
                const { studentProfile } = tabsData || {},
                    { admissionSoughtId } = studentProfile || {};
                const { classSequence } = content.find(item => item.className === "TENTH CLASS") || {};
                if (Number(admissionSoughtId) > Number(classSequence)) {
                    setHigherClassState(true);
                }
                const academicYearPayload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
                dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, academicYearPayload)));
            }
        } else if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            const { data } = academicYearListResp;
            if (Array.isArray(data)) {
                const { studentProfile } = tabsData || {},
                    { academicYearId } = studentProfile || {},
                    academicYearIndex = data.findIndex(item => item.academicYearId?.toString() === academicYearId?.toString());
                const lastTwoAcademicYear = data.slice(academicYearIndex + 1, academicYearIndex + 3 + Number(higherClassState));
                const formData: any = lastTwoAcademicYear.map((item: any) => {
                    const rowInfo = getResultRowInfo(item?.academicYearName);
                    return rowInfo;
                })
                academicsForm.resetForm({
                    values: { resultsList: formData }
                });
                const params = { studentId };
                dispatch(getAcademicResultsByRegNoAct(generateActionPayload("academic_results_byregno", params)));
            }
        } else if (academicResultByRegnoResp && prevAcademicResultByRegnoResp !== academicResultByRegnoResp) {
            //Academic Resutls
            if (academicResultByRegnoResp && Object.keys(academicResultByRegnoResp).length > 0) {
                const yearsList = Object.keys(academicResultByRegnoResp);
                const { lastAcademicPercentage } = academicResultByRegnoResp?.[yearsList[0]]?.[0] || {};
                const formData: any = yearsList.map((item: any) => {
                    return getResultRowInfo(item, lastAcademicPercentage, academicResultByRegnoResp[item])
                });
                academicsForm.resetForm({
                    values: { resultsList: formData }
                });
                setLastYearPercentState(prevState => ({
                    ...prevState, value: lastAcademicPercentage,
                    prevValue: lastAcademicPercentage
                }))
            }
        }
        academiDetailsRespRef.current.prevBranchClassResp = branchClassResp;
        academiDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
        academiDetailsRespRef.current.prevAcademicResultByRegnoResp = academicResultByRegnoResp;
        academiDetailsRespRef.current.prevInstAcademicErrorResp = instAcademicErrorResp;
    }, [branchClassResp, academicYearListResp, academicResultByRegnoResp, instAcademicErrorResp]);


    const academicsForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { resultsList } = values,
                { value: lastAcademicPercentage, prevValue: initialAcademicPercentage } = lastYearPercentState;
            // if (!lastAcademicPercentage) {
            //     setLastYearPercentState(prevState => ({ ...prevState, error: "Last year percentage is required." }));
            //     return;
            // }
            if (!academicsForm.dirty) {
                storeMultiFormDataCallback(formId, true, false, null);
            }
            else if (resultsList) {
                const payload: any = [];
                resultsList.forEach((item, index) => {
                    const { academicYear, subjectList } = item,
                        updatedAcademicYear = academicYear?.toString().split("-")?.[1],
                        updatedMarksList = subjectList.map((subject, index) => {
                            return ({
                                lastYearResultId: subject?.lastYearResultId || "",
                                subject: subject?.subject,
                                maxMarks: subject?.maxMarks,
                                marks: subject?.marks,
                                percentage: subject?.percentage,
                                remarks: subject?.remarks,
                            })
                        });
                    payload.push({
                        academicYear: updatedAcademicYear,
                        lastAcademicPercentage,
                        marksRequestVOList: updatedMarksList
                    })
                });
                const isDirty = academicsForm.dirty || (initialAcademicPercentage !== lastAcademicPercentage) || false;
                storeMultiFormDataCallback(formId, true, isDirty, payload);
            }

        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            if (isResubmission) {
                storeMultiFormDataCallback(formId, true, false, {});
            } else {
                academicsForm.handleSubmit();
            }
        }
    }, [currentMultiFormKeys, isResubmission]);

    function onAddRecordHandler(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-id"),
            numberRowIndex = Number(rowIndex);
        if (!isNaN(numberRowIndex) && numberRowIndex >= 0) {
            const rowInfo = academicsForm.values.resultsList[numberRowIndex],
                { subjectList } = rowInfo;
            subjectList.push({
                id: nanoid(),
                subject: "",
                maxMarks: "",
                marks: "",
                percentage: "",
                remarks: ""
            });
            const updatedRowInfo = Object.assign(rowInfo, subjectList);
            formikArrayHelpers.current?.replace(numberRowIndex, updatedRowInfo);
        }
    }

    function removeSubjectHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-id"),
            [parentIndex, childIndex] = rowIndex?.split("-") || [],
            numberParentIndex = Number(parentIndex), numberChildIndex = Number(childIndex);
        if (numberParentIndex >= 0 && numberChildIndex >= 0) {
            const rowInfo = academicsForm.values.resultsList[numberParentIndex],
                { subjectList } = rowInfo;
            subjectList.splice(numberChildIndex, 1);
            const updatedRowInfo = Object.assign(rowInfo, subjectList);
            formikArrayHelpers.current?.replace(numberParentIndex, updatedRowInfo);
        }
    }

    function changePercentHandler(event: any) {
        const { value } = event.target;
        setLastYearPercentState(prevState => ({ ...prevState, value, error: "" }));
    }

    function onBlurPerncentageHndlr(event: any) {
        const { value } = event.target;
        if (!value) {
            setLastYearPercentState(prevState => ({ ...prevState, value, error: "Last year percentage is required." }));
        }
    }

    return (
        <form onSubmit={academicsForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                ACADEMIC DETAILS
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12 lg:tw-col-span-3">
                        <SelectInput
                            name="academicYearId"
                            labelText="Latest Academic Percentage"
                            // formgroupClassName="mb-4"
                            inputClassName="dps-input"
                            menuItems={percentageList}
                            value={lastYearPercentState?.value}
                            onChange={changePercentHandler}
                            onBlur={onBlurPerncentageHndlr}
                            invalid={!!lastYearPercentState.error}
                            error={lastYearPercentState.error}
                            // defaultSelect="Academic Year"
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                </div>
                <FormikProvider value={academicsForm}>
                    <FieldArray name="resultsList">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }

                            return (
                                <>
                                    {academicsForm.values.resultsList.length > 0 &&
                                        academicsForm.values.resultsList.map((result, index) => {
                                            const resultListError: any = Array.isArray(academicsForm.errors.resultsList) && academicsForm.errors.resultsList[index] || {};
                                            const resultListTouched = Array.isArray(academicsForm.touched.resultsList) && academicsForm.touched.resultsList[index] || {};
                                            const { subjectList } = result;
                                            return (
                                                <div key={result.id} className="tw-mb-4">
                                                    <div className="tw-mb-2">
                                                        <label className="form-label tw-font-bold">Results of Last Class ({result.academicYear})</label>
                                                    </div>
                                                    <div className="tw-hidden lg:tw-grid tw-grid-cols-5">
                                                        <div className="tw-col-span-1"><label className="tw-form-label tw-font-bold">Subject</label></div>
                                                        <div className="tw-col-span-1"><label className="tw-form-label tw-font-bold">Maximum Marks</label></div>
                                                        <div className="tw-col-span-1"><label className="tw-form-label tw-font-bold">Marks Obtained</label></div>
                                                        <div className="tw-col-span-1"><label className="tw-form-label tw-font-bold">% of Marks</label></div>
                                                        <div className="tw-col-span-1"><label className="tw-form-label tw-font-bold">Remarks</label></div>
                                                    </div>
                                                    {
                                                        Array.isArray(subjectList) && subjectList.map((subjectInfo, childIndex) => {
                                                            const subjectListError = Array.isArray(resultListError?.subjectList) && resultListError.subjectList[childIndex] || {};
                                                            const subjectListTouched = Array.isArray(resultListTouched?.subjectList) && resultListTouched.subjectList[childIndex] || {};
                                                            return (
                                                                <div key={`subjectinfo-${subjectInfo.id}`} className="tw-grid tw-grid-cols-12 lg:tw-grid-cols-5 tw-gap-x-3 tw-gap-y-2 tw-mb-3">
                                                                    <div className="tw-col-span-12 tw-flex tw-justify-between tw-items-center lg:tw-hidden tw-border-b tw-pb-1 tw-mb-1">
                                                                        <span className="tw-font-normal">{childIndex + 1}{`. Subject Details`}</span>
                                                                        {!(childIndex === 0) && <button
                                                                            type="button"
                                                                            data-id={`${index}-${childIndex}`} onClick={removeSubjectHndlr}
                                                                            className="tw-bg-white tw-p-1 tw-rounded-full hover:tw-bg-red-50 tw-text-red-500 tw-mt-1 tw-flex-shrink-0">
                                                                            <i className="ri-delete-bin-2-fill" />
                                                                        </button>}
                                                                    </div>
                                                                    <div className="tw-col-span-6 lg:tw-col-span-1">
                                                                        <TextInput
                                                                            labelText="Subject"
                                                                            labelClass="tw-block lg:tw-hidden"
                                                                            formgroupClassName="tw-mb-0"
                                                                            name={`resultsList[${index}].subjectList[${childIndex}].subject`}
                                                                            placeHolder="Please enter details"
                                                                            value={subjectInfo.subject}
                                                                            onChange={academicsForm.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="tw-col-span-6 lg:tw-col-span-1">
                                                                        <TextInput
                                                                            labelText="Max Marks"
                                                                            labelClass="tw-block lg:tw-hidden"
                                                                            formgroupClassName="tw-mb-0"
                                                                            name={`resultsList[${index}].subjectList[${childIndex}].maxMarks`}
                                                                            placeHolder="Please enter details"
                                                                            value={subjectInfo.maxMarks}
                                                                            onChange={academicsForm.handleChange}
                                                                            onBlur={academicsForm.handleBlur}
                                                                            invalid={(subjectListTouched.maxMarks && subjectListError.maxMarks) ? true : false}
                                                                            error={(subjectListTouched.maxMarks && subjectListError.maxMarks) ? subjectListError.maxMarks : ""}
                                                                        />
                                                                    </div>
                                                                    <div className="tw-col-span-6 lg:tw-col-span-1">
                                                                        <TextInput
                                                                            labelText="Marks"
                                                                            labelClass="tw-block lg:tw-hidden"
                                                                            formgroupClassName="tw-mb-0"
                                                                            name={`resultsList[${index}].subjectList[${childIndex}].marks`}
                                                                            placeHolder="Please enter details"
                                                                            value={subjectInfo.marks}
                                                                            onChange={academicsForm.handleChange}
                                                                            onBlur={academicsForm.handleBlur}
                                                                            invalid={(subjectListTouched.marks && subjectListError.marks) ? true : false}
                                                                            error={(subjectListTouched.marks && subjectListError.marks) ? subjectListError.marks : ""}
                                                                        />
                                                                    </div>
                                                                    <div className="tw-col-span-6 lg:tw-col-span-1">
                                                                        <TextInput
                                                                            labelText="Percentage Marks"
                                                                            labelClass="tw-block lg:tw-hidden"
                                                                            formgroupClassName="tw-mb-0"
                                                                            name={`resultsList[${index}].subjectList[${childIndex}].percentage`}
                                                                            placeHolder="Please enter details"
                                                                            value={subjectInfo.percentage}
                                                                            onBlur={academicsForm.handleBlur}
                                                                            onChange={academicsForm.handleChange}
                                                                            invalid={(subjectListTouched.percentage && subjectListError.percentage) ? true : false}
                                                                            error={(subjectListTouched.percentage && subjectListError.percentage) ? subjectListError.percentage : ""}
                                                                        />
                                                                    </div>
                                                                    <div className="tw-col-span-12 lg:tw-col-span-1">
                                                                        <div className="tw-flex tw-items-start">
                                                                            <TextInput
                                                                                labelText="Remarks"
                                                                                labelClass="tw-block lg:tw-hidden"
                                                                                formgroupClassName="tw-mb-0 tw-me-2 tw-flex-grow tw-w-[90%]"
                                                                                name={`resultsList[${index}].subjectList[${childIndex}].remarks`}
                                                                                placeHolder="Please enter details"
                                                                                value={subjectInfo.remarks}
                                                                                onChange={academicsForm.handleChange}
                                                                            />
                                                                            {!(childIndex === 0) && <Button
                                                                                type="button"
                                                                                data-id={`${index}-${childIndex}`} onClick={removeSubjectHndlr}
                                                                                variant="wrong">
                                                                                <i className="ri-delete-bin-2-fill" />
                                                                            </Button>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    <div className="">
                                                        <Button data-id={index} type="button" variant="primary" onClick={onAddRecordHandler}>Add Records</Button>
                                                    </div>
                                                </div>

                                            )
                                        })}
                                </>
                            )
                        }}
                    </FieldArray>
                </FormikProvider>
            </AccordionBody>
        </form >
    )
}