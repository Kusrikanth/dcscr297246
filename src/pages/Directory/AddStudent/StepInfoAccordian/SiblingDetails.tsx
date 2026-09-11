import React, { useState, useContext, useEffect, useRef } from "react";
import { Formik, FieldArray, useFormik, Form, ArrayHelpers, FormikErrors, FormikProvider } from "formik";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage, SelectWithTextInput, AutoSearchInput
} from "../../../../Components/Common";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "./helper";
import { StepperFormContext, getFatherDetails, getMotherDetails, getGuardianDetails } from "../helper";

//Common Utility
import { generateUniqueNumber } from "../../../../utility/commonutility";
import classnames from "classnames";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getStudentByFilterAct, getSiblingDetailsAct, setGetSiblingDetailsAct
} from "../../../../store/directory/studentmanagement/studentmanagementactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getBranchCurriculumAct, getBranchClassAct, getBrchSectionsAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { TABS_ACTIONS } from "../helper";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    hasSiblingsInSameSchool: Yup.string(),
    siblings: Yup.array().of(
        Yup.object().shape({
            siblingName: Yup.string().test("siblingNameCheck", "Sibling name is required.",
                (value: any, schema: any) => {
                    const hasSiblings = schema.options.from[1].value.hasSiblingsInSameSchool;
                    if (hasSiblings === "false" && !value) {
                        return false;
                    }
                    return true;
                }),
            siblingStudentId: Yup.string().test("siblingStudentId", "Sibling id selection is required and unique.",
                (value: any, schema: any) => {
                    const hasSiblings = schema.options.from[1].value.hasSiblingsInSameSchool;
                    if (hasSiblings === "true" && !value) {
                        return false;
                    }
                    return true;
                })
            // .test("siblingStudentIdUnique", "Sibling id must be unique.", (value: any, schema: any) => {
            //     const hasSiblings = schema.options.from[1].value.hasSiblingsInSameSchool;
            //     if (hasSiblings === "true") {
            //         return false;
            //     }
            //     return true;
            // })
        })
    ),
});


function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}

function getInitialState(editData?: any, hasSiblings?: any, hasSiblingsInSameSchool?: any): any {
    const data: any = [];
    if (Array.isArray(editData) && editData.length > 0) {
        for (let i = 0; i < editData.length; i++) {
            data.push({
                uniqueId: generateUniqueNumber(),
                id: editData[i]?.id || undefined,
                siblingStudentId: editData[i]?.siblingStudentId || "",
                selectedSiblingInfo: {
                    id: editData[i]?.siblingStudentId || "",
                    name: editData[i]?.siblingName || "",
                    studentCode: "",
                    rollNumber: ""
                },
                siblingName: editData[i]?.siblingName || "",
                siblingCurriculumId: editData[i]?.siblingCurriculumId || "",
                siblingCurriculumName: editData[i]?.siblingCurriculumName || "",
                siblingClassId: editData[i]?.siblingClassId || "",
                siblingClassName: editData[i]?.siblingClassName || "",
                siblingSectionId: editData[i]?.siblingSectionId || "",
                siblingSectionName: editData[i]?.siblingSectionName || "",
                siblingSchoolName: editData[i]?.siblingSchoolName || "",
                siblingDetails: editData[i]?.siblingDetails || "",
            });
        }
        return { hasSiblings: hasSiblings, hasSiblingsInSameSchool: hasSiblingsInSameSchool, siblings: data }
    } else {
        data.push({
            uniqueId: generateUniqueNumber(),
            id: undefined,
            siblingStudentId: "",
            selectedSiblingInfo: undefined,
            siblingName: "",
            siblingCurriculumId: "",
            siblingCurriculumName: "",
            siblingClassId: "",
            siblingClassName: "",
            siblingSectionId: "",
            siblingSectionName: "",
            siblingSchoolName: "",
            siblingDetails: ""
        });
        return { hasSiblings: getTrueFalseOptions(hasSiblings), hasSiblingsInSameSchool: getTrueFalseOptions(hasSiblingsInSameSchool), siblings: data }
    }
}

export const SiblingDetails: React.FC<any> = ({ branchId, instiuteId, academicYearId }) => {
    const [siblingState, setSiblingState] = useState<any>(getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [isSiblingSchoolState, setIsSiblingSchoolState] = useState<any>("no");
    const [selectedStudentState, setSelectStudentState] = useState(undefined);

    const { submitCurrentFormCllbck, currentMultiFormKeys,
        editStudentData, updateFormKeyDataHndlr, storeMultiFormData } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { brchCurriculumResp, branchClassResp, brchSectionsResp, getStudentsByFilterResp, getSiblingDetailsResp } =
        useAppSelector(({ branchAcademics, directoryStudent }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
            getSiblingDetailsResp: directoryStudent.getSiblingDetailsResp
        }), shallowEqual);

    useEffect(() => {
        if (getSiblingDetailsResp && selectedStudentState) {
            const { id } = selectedStudentState,
                rowIndex = siblingForm.values?.siblings.findIndex((item: any) => item.siblingStudentId === id);
            if (rowIndex >= 0) {
                const { studentDetails, studentAcademicDetails } = getSiblingDetailsResp,
                    { id, studentName, admissionAcademicYearId, studentCode } = studentDetails,
                    { campusType, classId, rollNo, curriculumId, sectionId,
                        curriculumName, className, sectionName
                    } = studentAcademicDetails;

                formikArrayHelpers.current?.replace(rowIndex, {
                    uniqueId: generateUniqueNumber(),
                    siblingStudentId: id,
                    selectedSiblingInfo: {
                        id: id,
                        name: studentName,
                        rollNumber: rollNo,
                        studentCode: studentCode
                    },
                    siblingName: studentName,
                    siblingCurriculumId: curriculumId,
                    siblingCurriculumName: curriculumName,
                    siblingClassId: classId,
                    siblingClassName: className,
                    siblingSectionId: sectionId,
                    siblingSectionName: sectionName,
                    siblingSchoolName: "",
                    siblingDetails: ""
                });
            }
        }
    }, [getSiblingDetailsResp, selectedStudentState]);

    useEffect(() => {
        return () => { dispatch(setGetSiblingDetailsAct(undefined)); }
    }, []);

    const siblingForm = useFormik({
        enableReinitialize: true,
        initialValues: siblingState,
        validationSchema,
        onSubmit: (values) => {
            const { fatherDetails,
                motherDetails, guardianDetails } = editStudentData,
                { hasSiblingsInSameSchool } = values;
            const { studentParentDetails } = getSiblingDetailsResp || {};

            if (hasSiblingsInSameSchool === "true" && studentParentDetails) {
                if (!fatherDetails?.formData) {
                    const fatherDetails = getFatherDetails(studentParentDetails);
                    updateFormKeyDataHndlr("fatherDetails", fatherDetails);
                }
                if (!motherDetails?.formData) {
                    const motherDetails = getMotherDetails(studentParentDetails);
                    updateFormKeyDataHndlr("motherDetails", motherDetails);
                }
                if (!guardianDetails?.formData) {
                    const guardianDetails = getMotherDetails(studentParentDetails);
                    updateFormKeyDataHndlr("guardianDetails", guardianDetails);
                }
            }
            const siblingPayload = values?.siblings.map((item: any) => {
                const { uniqueId, selectedSiblingInfo, ...otherInfo } = item;
                return otherInfo;
            });
            storeMultiFormData("studentSiblingDetails", true, siblingPayload);
        },
    });

    useEffect(() => {
        if (editStudentData) {
            const { studentSiblingDetails } = editStudentData,
                { formData } = studentSiblingDetails || {};
            if (formData) {
                let siblingStudentId = undefined;
                let hasSiblings = !!(Array.isArray(formData) && formData.length > 0) ? "true" : "false";
                if (Array.isArray(formData) && formData.length > 0) {
                    siblingStudentId = formData[0]?.siblingStudentId;
                }
                setSiblingState(getInitialState(formData, hasSiblings, (siblingStudentId ? "true" : "false")));
            }
        }
    }, [editStudentData]);


    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["studentSiblingDetails"], TABS_ACTIONS.PREVIOUS_TAB);
    }


    function submitHndlr() {
        submitCurrentFormCllbck(["studentSiblingDetails"], TABS_ACTIONS.NEXT_TAB);
    }

    // useEffect(() => {
    //     if (editStudentData) {
    //         const { studentSiblingDetails } = editStudentData,
    //             { formData } = studentSiblingDetails || {};
    //         if (formData) {
    //             // setacAdemicDetailsState(getInitialState(formData));
    //         }
    //     }
    // }, [editStudentData]);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("studentSiblingDetails")) {
            submitSiblingHndlr();
        }
    }, [currentMultiFormKeys]);

    function submitSiblingHndlr() {
        const { hasSiblings } = siblingForm.values;
        if ((hasSiblings === "false")) {
            storeMultiFormData("studentSiblingDetails", true, []);
        } else {
            siblingForm.handleSubmit();
        }
    }

    function addNewSiblingHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                id: undefined,
                siblingStudentId: "",
                selectedSiblingInfo: undefined,
                siblingName: "",
                siblingCurriculumId: "",
                siblingCurriculumName: "",
                siblingClassId: "",
                siblingClassName: "",
                siblingSectionId: "",
                siblingSectionName: "",
                siblingSchoolName: "",
                siblingDetails: ""
            });
        }
    }

    function onChangeSiblingHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        setIsSiblingSchoolState(value);
    }
    function removeSiblingHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    function handleSelectedStudent(selectedSingle?: any, meta?: any) {
        const { id } = selectedSingle || {}, { name } = meta;
        const siblingIndexKey = name.split(".")[0];
        if (id) {
            const params = { studentId: id },
                payload = { academicYearId };
            dispatch(setGetSiblingDetailsAct(undefined));
            dispatch(getSiblingDetailsAct(generateActionPayload("get_students_by_id", params, payload)));
            siblingForm.setFieldValue(`${siblingIndexKey}.selectedSiblingInfo`, selectedSingle);
            siblingForm.setFieldValue(`${siblingIndexKey}.siblingStudentId`, id);
        } else {
            const { removedValues } = meta || {},
                { id: removedStudentId } = removedValues[0] || {},
                rowIndex = siblingForm.values?.siblings.findIndex((item: any) => item.siblingStudentId === removedStudentId);
            if (rowIndex >= 0) {
                formikArrayHelpers.current?.replace(rowIndex, {
                    uniqueId: generateUniqueNumber(),
                    siblingStudentId: undefined,
                    selectedSiblingInfo: undefined,
                    siblingName: "",
                    siblingCurriculumId: "",
                    siblingCurriculumName: "",
                    siblingClassId: "",
                    siblingClassName: "",
                    siblingSectionId: "",
                    siblingSectionName: "",
                    siblingSchoolName: "",
                    siblingDetails: ""
                });
            }
        }
        setSelectStudentState(selectedSingle);
    }
    function handleSearchStudentHndlr(inputString: string, inputAction: any) {
        if (inputString) {
            const params = { studentName: inputString, branchId, academicYearId };
            dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined,
                params)));
        }
        // const { name, value } = event.target;
    }

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { studentName: inputString, branchId, academicYearId };
            dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined,
                params)));
        }
    }

    function selectedStudentHndlr(selectedStudent: any, meta?: any) {
        const { id } = selectedStudent || {}, { name } = meta || {};
        const siblingIndexKey = name.split(".")[0];
        if (id) {
            const studentExist = siblingForm.values?.siblings.find((item: any) => item.siblingStudentId == id);
            if (!studentExist) {
                const params = { studentId: id },
                    payload = { academicYearId };
                dispatch(setGetSiblingDetailsAct(undefined));
                dispatch(getSiblingDetailsAct(generateActionPayload("get_students_by_id", params, payload)));
                siblingForm.setFieldValue(`${siblingIndexKey}.selectedSiblingInfo`, selectedStudent);
                siblingForm.setFieldValue(`${siblingIndexKey}.siblingStudentId`, id);
                setSelectStudentState(selectedStudent);

            } else {
                siblingForm.setFieldValue(`${siblingIndexKey}.selectedSiblingInfo`, undefined);
                // siblingForm.setFieldValue(`${siblingIndexKey}.siblingStudentId`, id);
            }
        } else {
            const { removedValue } = meta || {},
                { id: removedStudentId } = removedValue || {},
                rowIndex = siblingForm.values?.siblings.findIndex((item: any) => item.siblingStudentId === removedStudentId);
            if (rowIndex >= 0) {
                formikArrayHelpers.current?.replace(rowIndex, {
                    uniqueId: generateUniqueNumber(),
                    siblingStudentId: undefined,
                    selectedSiblingInfo: undefined,
                    siblingName: "",
                    siblingCurriculumId: "",
                    siblingCurriculumName: "",
                    siblingClassId: "",
                    siblingClassName: "",
                    siblingSectionId: "",
                    siblingSectionName: "",
                    siblingSchoolName: "",
                    siblingDetails: ""
                });
            }
            setSelectStudentState(selectedStudent);

        }
    }

    function handleMenuOpen(rowIndex?: number) {
        if (!isNaN(Number(rowIndex)) && Number(rowIndex) >= 0) {
            const rowFileInfo = siblingForm.values?.siblings[Number(rowIndex)];
            if (rowFileInfo) {
                const { selectedSiblingInfo } = rowFileInfo, { name } = selectedSiblingInfo || {};
                const params = { studentName: name || "a", branchId, academicYearId };
                dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined,
                    params)));
            }
        }
    }

    function hasSiblingsSameSchoolHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        siblingForm.resetForm({
            values: getInitialState(undefined, "true", value)
        });

    }

    function hasSiblingsHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        siblingForm.resetForm({
            values: getInitialState(undefined, value, "false")
        });
    }
    return (
        <form id="student-info-form" onSubmit={siblingForm.handleSubmit}>
            <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 tw-mb-3">
                    <div className="tw-border-b">
                        <h5>2. Sibling Details</h5>
                    </div>
                </div>
            </div>

            <UncontrolledAccordion
                open="sibling-details"
                defaultOpen={["sibling-details"]}
                stayOpen
            >
                <AccordionItem>
                    <AccordionHeader tag="h4" targetId="sibling-details">
                        Sibling Details
                    </AccordionHeader>
                    <AccordionBody accordionId="sibling-details">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-12">
                                <RadioInputContainer
                                    name="hasSiblings"
                                    labelText="Do you have siblings?"
                                    containerClassName="tw-flex"
                                    labelClassName="tw-mb-0 tw-me-3"
                                    radioOptions={trueFalseOptions}
                                    value={siblingForm.values.hasSiblings}
                                    onChange={hasSiblingsHndlr}
                                />
                            </div>

                            <div className="tw-col-span-12">
                                <RadioInputContainer
                                    name="hasSiblingsInSameSchool"
                                    labelText="Is there any Sibling Studying in the Same School ?"
                                    containerClassName="tw-flex"
                                    labelClassName="tw-mb-0 tw-me-3"
                                    radioOptions={trueFalseOptions}
                                    value={siblingForm.values.hasSiblingsInSameSchool}
                                    onChange={hasSiblingsSameSchoolHndlr}
                                    isDisabled={siblingForm.values.hasSiblings === "false"}
                                />
                            </div>

                            <FormikProvider value={siblingForm}>
                                <FieldArray name="siblings">
                                    {(arrayHelpers: ArrayHelpers) => {
                                        if (!formikArrayHelpers.current) {
                                            formikArrayHelpers.current = arrayHelpers;
                                        }

                                        return (
                                            <>
                                                {siblingForm.values.siblings.length > 0 &&
                                                siblingForm.values.siblings.map((siblingDetail: any, index: any) => {
                                                        const inputFieldErrors: any =
                                                            (Array.isArray(siblingForm.errors.siblings) &&
                                                                siblingForm.errors.siblings[index]) ||
                                                            {};
                                                        const inputFieldTouched =
                                                            (Array.isArray(siblingForm.touched.siblings) &&
                                                                siblingForm.touched.siblings[index]) ||
                                                            {};

                                                        return (
                                                            <div
                                                                key={`${siblingDetail.uniqueId}-${index}`}
                                                                className={`tw-col-span-12 tw-mb-2 ${index <
                                                                        siblingForm.values.siblings.length - 1
                                                                        ? "tw-border-b"
                                                                        : ""
                                                                    }`}
                                                            >
                                                                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                                                    <div className="tw-col-span-12 tw-border-b tw-mb-2 tw-flex tw-justify-between">
                                                                        <span className="tw-font-bold tw-mb-1">
                                                                            {index + 1}. Sibling Details
                                                                        </span>

                                                                        {index !== 0 && (
                                                                            <Button
                                                                                variant="wrong"
                                                                                data-index={index}
                                                                                onClick={removeSiblingHndlr}
                                                                                color="white"
                                                                                className="btn-sm shadow-none btn-icon btn-rounded btn-hover-danger"
                                                                            >
                                                                                <i className="ri-delete-bin-2-fill" />
                                                                            </Button>
                                                                        )}
                                                                    </div>

                                                                    {siblingForm.values.hasSiblingsInSameSchool ===
                                                                        "true" && (
                                                                            <div className="tw-col-span-12 md:tw-col-span-4">
                                                                                <AutoSearchInput
                                                                                    labelText="Student Id"
                                                                                    formgroupClassName="search-box"
                                                                                    name={`siblings[${index}].siblingStudentId`}
                                                                                    placeHolder="Search..."
                                                                                    onChange={onInputSearchChange}
                                                                                    valueKey="id"
                                                                                    labelKey="name"
                                                                                    subLabelKey="studentCode"
                                                                                    labelHeader="Student Code"
                                                                                    subLabelHeader="Student Name"
                                                                                    options={getStudentsByFilterResp}
                                                                                    selected={
                                                                                        siblingDetail.selectedSiblingInfo
                                                                                    }
                                                                                    selectedOptionCallbck={
                                                                                        selectedStudentHndlr
                                                                                    }
                                                                                    invalid={
                                                                                        inputFieldTouched.siblingStudentId &&
                                                                                        inputFieldErrors.siblingStudentId
                                                                                    }
                                                                                    error={
                                                                                        inputFieldTouched.siblingStudentId &&
                                                                                            inputFieldErrors.siblingStudentId
                                                                                            ? inputFieldErrors.siblingStudentId
                                                                                            : ""
                                                                                    }
                                                                                    isDisabled={
                                                                                        siblingForm.values
                                                                                            .hasSiblingsInSameSchool ===
                                                                                        "false"
                                                                                    }
                                                                                >
                                                                                    <i className="ri-search-line search-icon" />
                                                                                </AutoSearchInput>
                                                                            </div>
                                                                        )}

                                                                    <div className="tw-col-span-12 md:tw-col-span-4">
                                                                        <TextInput
                                                                            name={`siblings[${index}].siblingName`}
                                                                            labelText="Name"
                                                                            value={siblingDetail.siblingName}
                                                                            onChange={
                                                                                siblingForm.handleChange
                                                                            }
                                                                            invalid={
                                                                                inputFieldTouched.siblingName &&
                                                                                inputFieldErrors.siblingName
                                                                            }
                                                                            error={
                                                                                inputFieldTouched.siblingName &&
                                                                                    inputFieldErrors.siblingName
                                                                                    ? inputFieldErrors.siblingName
                                                                                    : ""
                                                                            }
                                                                            isDisabled={
                                                                                siblingForm.values.hasSiblings ===
                                                                                "false" ||
                                                                                siblingForm.values
                                                                                    .hasSiblingsInSameSchool ===
                                                                                "true"
                                                                            }
                                                                        />
                                                                    </div>

                                                                    {siblingForm.values.hasSiblingsInSameSchool ===
                                                                        "true" && (
                                                                            <>
                                                                                <div className="tw-col-span-12 md:tw-col-span-4">
                                                                                    <TextInput
                                                                                        name={`siblings[${index}].siblingCurriculumName`}
                                                                                        labelText="Curriculum"
                                                                                        value={siblingDetail.siblingCurriculumName}
                                                                                        onChange={() => { }}
                                                                                        invalid={(inputFieldTouched.siblingCurriculumName && inputFieldErrors.siblingCurriculumName) ? true : false}
                                                                                        error={(inputFieldTouched.siblingCurriculumName && inputFieldErrors.siblingCurriculumName) ? inputFieldErrors.siblingCurriculumName : ""}
                                                                                        isDisabled={true}
                                                                                    />
                                                                                </div>

                                                                                {(siblingForm.values.hasSiblingsInSameSchool === "true") &&<div className="tw-col-span-12 md:tw-col-span-4">
                                                                                    <TextInput
                                                                                        name={`siblings[${index}].siblingClassName`}
                                                                                        labelText="Class"
                                                                                        value={
                                                                                            siblingDetail.siblingClassName
                                                                                        }
                                                                                        onChange={() => { }}
                                                                                        isDisabled={true}
                                                                                    />
                                                                                </div>}

                                                                              {(siblingForm.values.hasSiblingsInSameSchool === "true") &&   <div className="tw-col-span-12 md:tw-col-span-4">
                                                                                    <TextInput
                                                                                        name={`siblings[${index}].siblingSectionName`}
                                                                                        labelText="Section"
                                                                                        value={
                                                                                            siblingDetail.siblingSectionName
                                                                                        }
                                                                                        onChange={() => { }}
                                                                                        isDisabled
                                                                                    />
                                                                                </div>}
                                                                            </>
                                                                        )}

                                                                    {siblingForm.values.hasSiblingsInSameSchool ===
                                                                        "false" && (
                                                                            <div className="tw-col-span-12 md:tw-col-span-8">
                                                                                <TextInput
                                                                                    name={`siblings[${index}].siblingDetails`}
                                                                                    labelText="Sibling Details"
                                                                                    value={
                                                                                        siblingDetail.siblingDetails
                                                                                    }
                                                                                    onChange={
                                                                                        siblingForm.handleChange
                                                                                    }
                                                                                    invalid={
                                                                                        inputFieldTouched.siblingDetails &&
                                                                                        inputFieldErrors.siblingDetails
                                                                                    }
                                                                                    error={
                                                                                        inputFieldTouched.siblingDetails &&
                                                                                            inputFieldErrors.siblingDetails
                                                                                            ? inputFieldErrors.siblingDetails
                                                                                            : ""
                                                                                    }
                                                                                    isDisabled={
                                                                                        siblingForm.values.hasSiblings ===
                                                                                        "false" ||
                                                                                        siblingForm.values
                                                                                            .hasSiblingsInSameSchool ===
                                                                                        "true"
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </>
                                        );
                                    }}
                                </FieldArray>
                            </FormikProvider>

                            <div className="tw-col-span-12 tw-mt-2">
                                <Button
                                    variant="soft"
                                    type="button"
                                    disabled={siblingForm.values.hasSiblings === "false"}
                                    onClick={addNewSiblingHndlr}
                                    className="btn btn-outline-success tw-me-2"
                                >
                                    Add Siblings
                                </Button>
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>

            <div className="tw-grid tw-grid-cols-12 tw-mt-3">
                <div className="tw-col-span-12 tw-text-right tw-mt-2">
                    <Button
                        type="button"
                        onClick={previousBtnHndlr}
                        variant="secondary"
                    >
                        Previous
                    </Button>
                    <Button
                        type="button"
                        onClick={submitHndlr}
                        variant="primary"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </form>
    )
}