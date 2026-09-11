import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { nanoid } from 'nanoid';
import { toast } from "react-toastify";
import { FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse, Button } from "reactstrap";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage, SelectWithTextInput, AutoSearchInput
} from "../../../../../../Components/Common";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions,
    generateSiblingPayload
} from "./helper";
import { StepperFormContext, stepInfo } from "../helper";

//Common Utility
import { generateUniqueNumber } from "../../../../../../utility/commonutility";
import classnames from "classnames";
//Action Generator
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import {
    getStudentByFilterAct, getSiblingDetailsAct, setGetSiblingDetailsAct
} from "../../../../../../store/directory/studentmanagement/studentmanagementactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { getBranchCurriculumAct, getBranchClassAct, getBrchSectionsAct } from "../../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { TABS_ACTIONS } from "../helper";
import { updateSiblingDetailsAct } from "../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";

const validationSchema = Yup.object().shape({
    siblingFromDPS: Yup.string(),
    siblings: Yup.array().of(
        Yup.object().shape({
            siblingName: Yup.string().test("siblingNameCheck", "Sibling name is required.",
                (value: any, schema: any) => {
                    const siblingFromDps = schema.options.from[1].value.siblingFromDPS;
                    const hasSibling = schema.options.from[1].value.hasSibling;
                    if (hasSibling === "true" && siblingFromDps === "false" && !value) {
                        return false;
                    }
                    return true;
                }),
            siblingCode: Yup.string().test("siblingCode", "Sibling id selection is required and unique.",
                (value: any, schema: any) => {
                    const siblingFromDps = schema.options.from[1].value.siblingFromDPS;
                    const hasSibling = schema.options.from[1].value.hasSibling;
                    if (hasSibling === "true" && siblingFromDps === "true" && !value) {
                        return false;
                    }
                    return true;
                })
            // .test("siblingStudentIdUnique", "Sibling id must be unique.", (value: any, schema: any) => {
            //     const hasSibling = schema.options.from[1].value.siblingFromDPS;
            //     if (hasSibling === "true") {
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

function getInitialState(editData?: any, hasSibling?: any, siblingFromDPS?: any): any {
    const data: any = [];
    if (Array.isArray(editData) && editData.length > 0) {
        for (let i = 0; i < editData.length; i++) {
            const uniqueId = nanoid();
            data.push({
                uniqueId: uniqueId,
                id: editData[i]?.id || undefined,
                siblingCode: editData[i]?.siblingCode || "",
                selectedSiblingInfo: {
                    id: editData[i]?.siblingCode || "",
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
        return { hasSibling: hasSibling || "false", siblingFromDPS: siblingFromDPS, siblings: data }
    } else {
        const uniqueId = nanoid();
        data.push({
            uniqueId: uniqueId,
            id: undefined,
            siblingCode: "",
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
        return {
            hasSibling: getTrueFalseOptions(hasSibling),
            siblingFromDPS: getTrueFalseOptions(siblingFromDPS),
            siblings: data
        }
    }
}

export const SiblingDetails: React.FC<any> = ({ stepId, branchId, instiuteId, academicYearId }) => {
    const [siblingState, setSiblingState] = useState<any>(getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [selectedStudentState, setSelectStudentState] = useState(undefined);

    const { currentMultiFormKeys, submitCurrentFormCllbck } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { getStudentsByFilterResp, updateSiblingDetailsResp, getSiblingDetailsResp } =
        useAppSelector(({ directoryStudent, admissionRegistration }) => ({
            getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
            updateSiblingDetailsResp: admissionRegistration.updateSiblingDetailsResp,
            getSiblingDetailsResp: directoryStudent.getSiblingDetailsResp
        }), shallowEqual);

    const siblingDetailsRespRef = useRef({
        prevUpdateSiblingDetailsResp: updateSiblingDetailsResp
    });
    const currentStepMultiFormKeys = useMemo(() => {
        if (stepId) {
            const { multiFormKeys } = stepInfo.find(item => item.id === stepId) || {};
            if (Array.isArray(multiFormKeys)) {
                return multiFormKeys;
            }
            return [];
        }
        return [];
    }, [stepId]);

    useEffect(() => {
        const { prevUpdateSiblingDetailsResp } = siblingDetailsRespRef.current;
        if (updateSiblingDetailsResp && prevUpdateSiblingDetailsResp !== updateSiblingDetailsResp) {
            toast.success("Sibling details added successfully.");
        }
        siblingDetailsRespRef.current.prevUpdateSiblingDetailsResp = updateSiblingDetailsResp;
    }, [updateSiblingDetailsResp]);

    useEffect(() => {
        if (getSiblingDetailsResp && selectedStudentState) {
            const { id } = selectedStudentState,
                rowIndex = siblingForm.values?.siblings.findIndex((item: any) => item.siblingCode === id);
            if (rowIndex >= 0) {
                const { studentDetails, studentAcademicDetails } = getSiblingDetailsResp,
                    { id, studentName, studentCode } = studentDetails,
                    { classId, rollNo, curriculumId, sectionId,
                        curriculumName, className, sectionName
                    } = studentAcademicDetails;

                formikArrayHelpers.current?.replace(rowIndex, {
                    uniqueId: generateUniqueNumber(),
                    siblingCode: id,
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

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(stepId)) {
            siblingForm.handleSubmit();
        }
    }, [currentMultiFormKeys])


    const siblingForm = useFormik({
        enableReinitialize: true,
        initialValues: siblingState,
        validationSchema,
        onSubmit: (values) => {
            // const { studentParentDetails } = getSiblingDetailsResp || {};

            const params = { studentId: "35691" };
            const payload = generateSiblingPayload(branchId, values);
            dispatch(updateSiblingDetailsAct(generateActionPayload("add_sibling_details", params, payload)));
            // if (siblingFromDPS === "true" && studentParentDetails) {
            //     if (!fatherDetails?.formData) {
            //         const fatherDetails = getFatherDetails(studentParentDetails);
            //         updateFormKeyDataHndlr("fatherDetails", fatherDetails);
            //     }
            //     if (!motherDetails?.formData) {
            //         const motherDetails = getMotherDetails(studentParentDetails);
            //         updateFormKeyDataHndlr("motherDetails", motherDetails);
            //     }
            //     if (!guardianDetails?.formData) {
            //         const guardianDetails = getMotherDetails(studentParentDetails);
            //         updateFormKeyDataHndlr("guardianDetails", guardianDetails);
            //     }
            // }
            // const siblingPayload = values?.siblings.map((item: any) => {
            //     const { uniqueId, selectedSiblingInfo, ...otherInfo } = item;
            //     return otherInfo;
            // });
            // storeMultiFormData("studentSiblingDetails", true, siblingPayload);
        },
    });

    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["studentSiblingDetails"], TABS_ACTIONS.PREVIOUS_TAB);
    }

    function submitHndlr(e: any) {
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.NEXT_TAB);
    }

    function addNewSiblingHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                id: undefined,
                siblingCode: "",
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
            siblingForm.setFieldValue(`${siblingIndexKey}.siblingCode`, id);
        } else {
            const { removedValues } = meta || {},
                { id: removedStudentId } = removedValues[0] || {},
                rowIndex = siblingForm.values?.siblings.findIndex((item: any) => item.siblingCode === removedStudentId);
            if (rowIndex >= 0) {
                const uniqueId = nanoid();
                formikArrayHelpers.current?.replace(rowIndex, {
                    uniqueId: uniqueId,
                    siblingCode: undefined,
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
            const studentExist = siblingForm.values?.siblings.find((item: any) => item.siblingCode == id);
            if (!studentExist) {
                const params = { studentId: id },
                    payload = { academicYearId };
                dispatch(setGetSiblingDetailsAct(undefined));
                dispatch(getSiblingDetailsAct(generateActionPayload("get_students_by_id", params, payload)));
                siblingForm.setFieldValue(`${siblingIndexKey}.selectedSiblingInfo`, selectedStudent);
                siblingForm.setFieldValue(`${siblingIndexKey}.siblingCode`, id);
                setSelectStudentState(selectedStudent);

            } else {
                siblingForm.setFieldValue(`${siblingIndexKey}.selectedSiblingInfo`, undefined);
            }
        } else {
            const { removedValue } = meta || {},
                { id: removedStudentId } = removedValue || {},
                rowIndex = siblingForm.values?.siblings.findIndex((item: any) => item.siblingCode === removedStudentId);
            if (rowIndex >= 0) {
                const uniqueId = nanoid();
                formikArrayHelpers.current?.replace(rowIndex, {
                    uniqueId: uniqueId,
                    siblingCode: undefined,
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

    function hasSiblingsSameSchoolHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        siblingForm.resetForm({
            values: getInitialState(undefined, "true", value)
        });

    }

    function hasSiblingsHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        siblingForm.resetForm({
            values: getInitialState(undefined, value, "false")
        });
    }
    return (
        <form id="student-info-form" onSubmit={siblingForm.handleSubmit}>
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="border-bottom">
                        <h5>2. Sibling Details</h5>
                    </div>

                </div>
            </div>

            <UncontrolledAccordion open="sibling-details" defaultOpen={["sibling-details"]} stayOpen>
                <AccordionItem>
                    <AccordionHeader tag="h4" targetId="sibling-details">
                        Sibling Details
                    </AccordionHeader>
                    <AccordionBody accordionId="sibling-details">
                        <div className="row">
                            <div className="col-4">
                                <RadioInputContainer
                                    name="hasSibling"
                                    labelText="Do you have siblings?"
                                    containerClassName="me-3"
                                    radioOptions={trueFalseOptions}
                                    value={siblingForm.values.hasSibling}
                                    onChange={hasSiblingsHndlr}
                                />
                            </div>
                            <div className="col-4">
                                <RadioInputContainer
                                    name="siblingFromDPS"
                                    labelText="Is there any Sibling Studying in the Same School ?"
                                    radioOptions={trueFalseOptions}
                                    value={siblingForm.values.siblingFromDPS}
                                    onChange={hasSiblingsSameSchoolHndlr}
                                    isDisabled={siblingForm.values.hasSibling === "false"}
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
                                                        const inputFieldErrors: any = Array.isArray(siblingForm.errors.siblings) && siblingForm.errors.siblings[index] || {};
                                                        const inputFieldTouched = Array.isArray(siblingForm.touched.siblings) && siblingForm.touched.siblings[index] || {};
                                                        return (
                                                            <div id={`${siblingDetail.uniqueId}-${index}`} key={`${siblingDetail.uniqueId}-${index}`}
                                                                className={classnames("col-12 mb-2", { " bodrder-bottom": (index < (siblingForm.values.siblings.length - 1)) })}>
                                                                <div className="row">
                                                                    <div className="col-12 border-bottom mb-2 d-flex justify-content-between">
                                                                        <span className="fs-normal fw-bold d-block mb-1">{index + 1}. Sibling Details</span>
                                                                        {(index !== 0) && <Button data-index={index} onClick={removeSiblingHndlr} color="white" className="btn-sm shadow-none btn-icon btn-rounded btn-hover-danger">
                                                                            <i className="ri-delete-bin-2-fill" />
                                                                        </Button>}
                                                                    </div>
                                                                    {/* {(siblingForm.values.siblingFromDPS === "true") && <div className="col-4">
                                                                        <SelectWithTextInput
                                                                            labelText="Student Id"
                                                                            name={`siblings[${index}].selectedSiblingInfo`}
                                                                            value={siblingDetail.selectedSiblingInfo}
                                                                            handleSelect={handleSelectedStudent}
                                                                            menuOpenHndlr={handleMenuOpen}
                                                                            dataIndex={index}
                                                                            options={(Array.isArray(getStudentsByFilterResp) && getStudentsByFilterResp) || []}
                                                                            placeHolder="Search"
                                                                            handleInputChange={handleSearchStudentHndlr}
                                                                            labelId="name"
                                                                            valueId="id"
                                                                            invalid={(inputFieldTouched.selectedSiblingInfo && inputFieldErrors.selectedSiblingInfo) ? true : false}
                                                                            error={(inputFieldTouched.selectedSiblingInfo && inputFieldErrors.selectedSiblingInfo) ? inputFieldErrors.selectedSiblingInfo : ""}
                                                                        // isDisabled={siblingForm.values.siblingFromDPS === "false"}
                                                                        />
                                                                    </div>} */}
                                                                    {(siblingForm.values.siblingFromDPS === "true") && <div className="col-4">
                                                                        <AutoSearchInput
                                                                            labelText="Student Id"
                                                                            formgroupClassName="search-box"
                                                                            name={`siblings[${index}].siblingCode`}
                                                                            placeHolder="Search..."
                                                                            // onChange={(e: any) => setSearchInputState(e.target.value)}
                                                                            onChange={onInputSearchChange}
                                                                            valueKey="id"
                                                                            labelKey="name"
                                                                            subLabelKey="studentCode"
                                                                            labelHeader="Student Code"
                                                                            subLabelHeader="Student Name"
                                                                            options={getStudentsByFilterResp}
                                                                            selected={siblingDetail.selectedSiblingInfo}
                                                                            selectedOptionCallbck={selectedStudentHndlr}
                                                                            invalid={(inputFieldTouched.siblingCode && inputFieldErrors.siblingCode) ? true : false}
                                                                            error={(inputFieldTouched.siblingCode && inputFieldErrors.siblingCode) ? inputFieldErrors.siblingCode : ""}
                                                                            isDisabled={siblingForm.values.siblingFromDPS === "false"}
                                                                        ><i className="ri-search-line search-icon"></i></AutoSearchInput>
                                                                    </div>}

                                                                    {/* <TextInput
                                                                            name={`siblings[${index}].siblingCode`}
                                                                            labelText="Student Id"
                                                                            value={siblingDetail.siblingCode}
                                                                            onChange={siblingForm.handleChange}
                                                                            invalid={(inputFieldTouched.siblingCode && inputFieldErrors.siblingCode) ? true : false}
                                                                            error={(inputFieldTouched.siblingCode && inputFieldErrors.siblingCode) ? inputFieldErrors.siblingCode : ""}
                                                                            isDisabled={siblingForm.values.siblingFromDPS === "no"}
                                                                        /> */}
                                                                    <div className="col-4">
                                                                        <TextInput
                                                                            name={`siblings[${index}].siblingName`}
                                                                            labelText="Name"
                                                                            value={siblingDetail.siblingName}
                                                                            onChange={siblingForm.handleChange}
                                                                            invalid={(inputFieldTouched.siblingName && inputFieldErrors.siblingName) ? true : false}
                                                                            error={(inputFieldTouched.siblingName && inputFieldErrors.siblingName) ? inputFieldErrors.siblingName : ""}
                                                                            isDisabled={(siblingForm.values.hasSibling === "false") || (siblingForm.values.siblingFromDPS === "true")}
                                                                        />
                                                                    </div>
                                                                    {/* <div className="col-4">
                                                                        <TextInput
                                                                            name={`siblings[${index}].campus`}
                                                                            labelText="Campus"
                                                                            value={siblingDetail.campus}
                                                                            onChange={siblingForm.handleChange}
                                                                            invalid={(inputFieldTouched.campus && inputFieldErrors.campus) ? true : false}
                                                                            error={(inputFieldTouched.campus && inputFieldErrors.campus) ? inputFieldErrors.campus : ""}
                                                                            isDisabled={true}
                                                                        />
                                                                    </div> */}
                                                                    {(siblingForm.values.siblingFromDPS === "true") && <div className="col-4">
                                                                        {/* <SelectInput
                                                                            name={`siblings[${index}].siblingCurriculumId`}
                                                                            labelText="Curriculum"
                                                                            value={siblingDetail.siblingCurriculumId}
                                                                            onChange={siblingForm.handleChange}
                                                                            menuItems={brchCurriculumResp?.data}
                                                                            formgroupClassName="mb-0"
                                                                            valueKey="branchCurriculumId"
                                                                            textKey="curriculumName"
                                                                            defaultSelect="Select"
                                                                            isDisabled={true}
                                                                        /> */}
                                                                        <TextInput
                                                                            name={`siblings[${index}].siblingCurriculumName`}
                                                                            labelText="Curriculum"
                                                                            value={siblingDetail.siblingCurriculumName}
                                                                            onChange={() => { }}
                                                                            invalid={(inputFieldTouched.siblingCurriculumName && inputFieldErrors.siblingCurriculumName) ? true : false}
                                                                            error={(inputFieldTouched.siblingCurriculumName && inputFieldErrors.siblingCurriculumName) ? inputFieldErrors.siblingCurriculumName : ""}
                                                                            isDisabled={true}
                                                                        />
                                                                    </div>}
                                                                    {(siblingForm.values.siblingFromDPS === "true") && <div className="col-4">
                                                                        {/* <SelectInput
                                                                            name={`siblings[${index}].siblingClassId`}
                                                                            labelText="Class"
                                                                            value={siblingDetail.siblingClassId}
                                                                            onChange={siblingForm.handleChange}
                                                                            menuItems={branchClassResp?.content}
                                                                            // hideSelectOption={true}
                                                                            valueKey="classId"
                                                                            textKey="shortName"
                                                                            defaultSelect="Select"
                                                                            isDisabled={true}
                                                                        /> */}
                                                                        <TextInput
                                                                            name={`siblings[${index}].siblingClassName`}
                                                                            labelText="Class"
                                                                            value={siblingDetail.siblingClassName}
                                                                            onChange={() => { }}
                                                                            // invalid={(inputFieldTouched.siblingClassName && inputFieldErrors.siblingClassName) ? true : false}
                                                                            // error={(inputFieldTouched.siblingClassName && inputFieldErrors.siblingClassName) ? inputFieldErrors.siblingClassName : ""}
                                                                            isDisabled={true}
                                                                        />
                                                                    </div>}
                                                                    {(siblingForm.values.siblingFromDPS === "true") && <div className="col-4">
                                                                        <TextInput
                                                                            name={`siblings[${index}].siblingSectionName`}
                                                                            labelText="Section"
                                                                            value={siblingDetail.siblingSectionName}
                                                                            onChange={() => { }}
                                                                            // invalid={(inputFieldTouched.siblingSectionName && inputFieldErrors.siblingSectionName) ? true : false}
                                                                            // error={(inputFieldTouched.siblingSectionName && inputFieldErrors.siblingSectionName) ? inputFieldErrors.siblingSectionName : ""}
                                                                            isDisabled={true}
                                                                        />
                                                                        {/* <SelectInput
                                                                            name={`siblings[${index}].siblingSectionIc`}
                                                                            labelText="Section"
                                                                            value={siblingDetail.siblingSectionId}
                                                                            onChange={siblingForm.handleChange}
                                                                            menuItems={brchSectionsResp?.data[0]?.sectionsResponse}
                                                                            // hideSelectOption={true}
                                                                            valueKey="sectionId"
                                                                            textKey="sectionName"
                                                                            isDisabled={true}
                                                                        /> */}
                                                                    </div>}
                                                                    {/* <div className="col-4">
                                                                        <TextInput
                                                                            name={`siblings[${index}].siblingSchoolName`}
                                                                            labelText="Sibling School Name"
                                                                            value={siblingDetail.siblingSchoolName}
                                                                            onChange={siblingForm.handleChange}
                                                                            invalid={(inputFieldTouched.siblingSchoolName && inputFieldErrors.siblingSchoolName) ? true : false}
                                                                            error={(inputFieldTouched.siblingSchoolName && inputFieldErrors.siblingSchoolName) ? inputFieldErrors.siblingSchoolName : ""}
                                                                            isDisabled={true}
                                                                        />
                                                                    </div> */}
                                                                    {(siblingForm.values.siblingFromDPS === "false") && <div className="col-8">
                                                                        <TextInput
                                                                            name={`siblings[${index}].siblingDetails`}
                                                                            labelText="Sibling Details"
                                                                            value={siblingDetail.siblingDetails}
                                                                            onChange={siblingForm.handleChange}
                                                                            invalid={(inputFieldTouched.siblingDetails && inputFieldErrors.siblingDetails) ? true : false}
                                                                            error={(inputFieldTouched.siblingDetails && inputFieldErrors.siblingDetails) ? inputFieldErrors.siblingDetails : ""}
                                                                            isDisabled={(siblingForm.values.hasSibling === "false") || (siblingForm.values.siblingFromDPS === "true")}

                                                                        // isDisabled={siblingForm.values.siblingFromDPS === "false"}
                                                                        />
                                                                    </div>}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                            </>
                                        )
                                    }}
                                </FieldArray>
                            </FormikProvider>


                            {siblingForm.values.siblings.length < 2 && <div className="col-12 mt-2">
                                <button type="button" disabled={siblingForm.values.hasSibling === "false"} onClick={addNewSiblingHndlr} className="btn btn-outline-success me-2">
                                    Add Siblings
                                </button>
                            </div>}
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion >
            <div className="row mt-3">
                <div className="col-12 text-end mt-2">
                    <button type="button" onClick={previousBtnHndlr} className="btn btn-soft-success me-2">
                        Previous
                    </button>
                    <button type="button" onClick={submitHndlr} className="btn btn-success">
                        Next
                    </button>
                </div>
            </div>
        </form >
    )
}