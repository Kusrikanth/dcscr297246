import React, { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import classNames from "classnames";
import { FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import * as Yup from "yup";


import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";
//Custom Hooks


//Helper

import { StepperFormContext } from "../helper";
//Action Generator



import { nanoid } from "nanoid";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { MultiSelect, TextInput } from "../../../../../../Components/Common";
// Ol state
// function getInitialState(initialState: any) {
//     return {
//         currentAddress: "Dummy address",
//         houseNo: initialState?.houseNo || "Current house",
//         landmark: initialState?.landmark || "Landmark",
//         country: initialState?.country || "1",
//         state: initialState?.state || "1",
//         city: initialState?.city || "1",
//         pinCode: initialState?.pinCode || "1"
//     }
// }

function getInitialState(initialState: any) {
    return {
        houseNo: initialState?.houseNo || "",
        landmark: initialState?.landmark || "",
        country: initialState?.country || "",
        state: initialState?.state || "",
        city: initialState?.city || "",
        pinCode: initialState?.pinCode || "",
        areaId: initialState?.areaId || "",
        distanceFromSchool: initialState?.distanceFromSchool || "",
    }
}

function getNewRowInfo(academicYearId?: any, academicYear?: any) {
    return {
        id: nanoid(),
        academicYearId,
        academicYear,
        subjectList: [{
            id: nanoid(),
            subject: "",
            maxMarks: "",
            marks: "",
            percentage: "",
            remarks: ""
        }]
    };
}
interface IAddAcademicResult {
    resultsList: Array<{
        id: string,
        academicYearId: string,
        academicYear: string,
        subjectList: [{
            id: string,
            subject: string,
            maxMarks: string,
            marks: string,
            percentage: string,
            remarks: string
        }]
    }>;
}
const initialValues: IAddAcademicResult = { resultsList: [] };
export default function AcademicDetails({ formId, instituteId, storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, editStudentData, storeMultiFormData, updateFormKeyDataHndlr,
        requestedMultiFormKeys } = useContext<any>(StepperFormContext);
    const [academicYearListState, setAcademicYearListState] = useState([]);
    const [selectedAcademicState, setSelectedAcademicState] = useState([]);
    const requestedResidentialAddress = useRef<any>(false);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const dispatch = useAppDispatch();
    const { academicYearListResp, instAcademicErrorResp } = useAppSelector(({ instAcademics }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp,
    }), shallowEqual);

    const academiDetailsRespRef = useRef({
        prevAcademicYearListResp: academicYearListResp,
        prevInstAcademicErrorResp: instAcademicErrorResp
    });

    useEffect(() => {
        const academicYearPayload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, academicYearPayload)));
    }, []);

    useEffect(() => {
        const { prevAcademicYearListResp, prevInstAcademicErrorResp } = academiDetailsRespRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            const { data } = academicYearListResp;
            if (Array.isArray(data)) {
                const oldYearList: any = data.filter((item: any) => item.yearStatus === "OLD");
                setAcademicYearListState(oldYearList);
            }
        }
        academiDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
        academiDetailsRespRef.current.prevInstAcademicErrorResp = instAcademicErrorResp;
    }, [academicYearListResp, instAcademicErrorResp]);


    const academicsForm = useFormik({
        initialValues,
        // validationSchema,
        onSubmit: (values) => {
            const { resultsList } = values;
            if (resultsList) {
                const payload: any = [];
                resultsList.forEach((item, index) => {
                    const { academicYear, subjectList } = item,
                        updatedAcademicYear = academicYear.split("-")[1],
                        updatedMarksList = subjectList.map((subject, index) => {
                            return ({
                                subject: subject?.subject,
                                maxMarks: subject?.maxMarks,
                                marks: subject?.marks,
                                percentage: subject?.percentage,
                                remarks: subject?.remarks,
                            })
                        });
                    payload.push({
                        academicYear: updatedAcademicYear,
                        marksRequestVOList: updatedMarksList
                    })
                });
                storeMultiFormDataCallback(formId, true, payload);
            }

        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            academicsForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    function onSelectAcademicHandler(selectItem: any) {
        setSelectedAcademicState(selectItem);
        if (!formikArrayHelpers?.current) {
            return;
        }
        if (selectItem.length > selectedAcademicState.length) {
            const prevSelectedId = selectedAcademicState.map((item: any) => item.academicYearId),
                addedItem = selectItem.find((item: any) => (!prevSelectedId.includes(item.academicYearId)));
            if (addedItem.academicYearId) {
                const addedRow = getNewRowInfo(addedItem?.academicYearId, addedItem?.academicYearName);
                formikArrayHelpers?.current.push(addedRow);
            }
        } else if (selectItem.length < selectedAcademicState.length) {
            const selectedId = selectItem.map((item: any) => item.academicYearId),
                removedItemId: any = selectedAcademicState.find((item: any) => (!selectedId.includes(item.academicYearId)));
            if (removedItemId?.academicYearId) {
                const { resultsList } = academicsForm.values,
                    updateResultList = resultsList.filter((item: any) => item.academicYearId !== removedItemId.academicYearId);
                academicsForm.setValues((prevState: any) => ({
                    ...prevState,
                    resultsList: updateResultList
                }));
            }
        } else {
            academicsForm.setValues((prevState: any) => ({
                ...prevState,
                resultsList: []
            }));
        }
    }

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

    return (
        <form onSubmit={academicsForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                ACADEMIC DETAILS
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <div className="row ">
                    <div className="col-5">
                        {/* <SelectInput
                            name="academicYearId"
                            labelText="Latest Academic Percentage"
                            // formgroupClassName="mb-4"
                            inputClassName="ng-input"
                            // defaultSelect="Academic Year"
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            menuItems={[]}
                        /> */}
                        <MultiSelect
                            name="feeCategoriesId"
                            labelText="Fee Category"
                            onChange={onSelectAcademicHandler}
                            value={selectedAcademicState}
                            menuItems={academicYearListState}
                            textKey={"academicYearName"}
                            valueKey={"academicYearId"}
                        // isDisabled={props.feeConcessionId}
                        // error={(addFeeConcessionForm.touched.feeCategoriesId && addFeeConcessionForm.errors.feeCategoriesId) ? addFeeConcessionForm.errors.feeCategoriesId : ""}
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
                                            const inputFieldErrors: any = Array.isArray(academicsForm.errors.resultsList) && academicsForm.errors.resultsList[index] || {};
                                            const inputFieldTouched = Array.isArray(academicsForm.touched.resultsList) && academicsForm.touched.resultsList[index] || {};
                                            const { subjectList } = result;
                                            return (
                                                <div key={result.id} className="mb-4">
                                                    <div className="mb-2">
                                                        <label className="form-label fw-bold">Results of Last Class ({result.academicYear})</label>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col"><label className="form-label fw-bold">Subject</label></div>
                                                        <div className="col"><label className="form-label fw-bold">Maximum Marks</label></div>
                                                        <div className="col"><label className="form-label fw-bold">Maximum Marks</label></div>
                                                        <div className="col"><label className="form-label fw-bold">% of Marks</label></div>
                                                        <div className="col"><label className="form-label fw-bold">Remarks</label></div>
                                                    </div>
                                                    {
                                                        Array.isArray(subjectList) && subjectList.map((subjectInfo, childIndex) => {
                                                            return (
                                                                <div key={`subjectinfo-${subjectInfo.id}`} className="row gx-3">
                                                                    <div className="col">
                                                                        <TextInput
                                                                            name={`resultsList[${index}].subjectList[${childIndex}].subject`}
                                                                            placeHolder="Please enter details"
                                                                            value={subjectInfo.subject}
                                                                            onChange={academicsForm.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="col">
                                                                        <TextInput
                                                                            name={`resultsList[${index}].subjectList[${childIndex}].maxMarks`}
                                                                            placeHolder="Please enter details"
                                                                            value={subjectInfo.maxMarks}
                                                                            onChange={academicsForm.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="col">
                                                                        <TextInput
                                                                            name={`resultsList[${index}].subjectList[${childIndex}].marks`}
                                                                            placeHolder="Please enter details"
                                                                            value={subjectInfo.marks}
                                                                            onChange={academicsForm.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="col">
                                                                        <TextInput
                                                                            name={`resultsList[${index}].subjectList[${childIndex}].percentage`}
                                                                            placeHolder="Please enter details"
                                                                            value={subjectInfo.percentage}
                                                                            onChange={academicsForm.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="col">
                                                                        <div className="hstack align-items-start">
                                                                            <TextInput
                                                                                name={`resultsList[${index}].subjectList[${childIndex}].remarks`}
                                                                                placeHolder="Please enter details"
                                                                                formgroupClassName="me-2"
                                                                                inputClassName="w-90"
                                                                                value={subjectInfo.remarks}
                                                                                onChange={academicsForm.handleChange}
                                                                            />
                                                                            {!(childIndex === 0) && <button
                                                                                type="button"
                                                                                data-id={`${index}-${childIndex}`} onClick={removeSubjectHndlr}
                                                                                className="btn btn-white btn-sm btn-icon btn-rounded btn-hover-danger mt-1 flex-shrink-0">
                                                                                <i className="ri-delete-bin-2-fill" />
                                                                            </button>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    <div className="">
                                                        <button data-id={index} type="button" className="btn  btn-soft-success" onClick={onAddRecordHandler}>Add Records</button>
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