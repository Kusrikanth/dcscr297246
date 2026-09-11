import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { nanoid } from 'nanoid';
import { toast } from "react-toastify";
import { FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage, SelectWithTextInput, AutoSearchInput
} from "../../../../../Components/Common";

//Helper
import {
    StepperFormContext, stepInfo, trueFalseOptions, TABS_ACTIONS,
    getSiblingFormState, generateSiblingPayload
} from "./helper";

//Common Utility
import { generateUniqueNumber, getTrueFalseOptions } from "../../../../../utility/commonutility";
import classnames from "classnames";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getStudentByFilterAct, getSiblingDetailsAct, setGetSiblingDetailsAct
} from "../../../../../store/directory/studentmanagement/studentmanagementactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getBranchCurriculumAct, getBranchClassAct, getBrchSectionsAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getSiblingDetailsByIdAct, getSiblingForRegistrationAct, updateSiblingDetailsAct } from "../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import Button from "../../../../../Components/Common/Button";

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
        })
    ),
});

function getInitialState(editData?: any, hasSibling?: any, siblingFromDPS?: any): any {
    const data: any = [];
    if (editData) {
        return getSiblingFormState(editData);
    } else {
        const uniqueId = nanoid();
        data.push({
            uniqueId: uniqueId,
            siblingCode: "",
            selectedSiblingInfo: undefined,
            siblingName: "",
            siblingCurriculumId: "",
            siblingCurriculumName: "",
            siblingClassId: "",
            siblingClassName: "",
            siblingSectionId: "",
            siblingSectionName: "",
            siblingDetails: ""
        });
        return {
            hasSibling: getTrueFalseOptions(hasSibling),
            siblingFromDPS: getTrueFalseOptions(siblingFromDPS),
            siblings: data
        }
    }
}

const initialValues = getInitialState();
const SiblingDetails: React.FC<any> = ({ stepId, branchId, instituteId }) => {
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [selectedStudentState, setSelectStudentState] = useState(undefined);
    const { isViewMode, studentId, tabsFilledInfo, setTabsDataHandler, nextStepHndlr, currentMultiFormKeys, submitCurrentFormCllbck } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { showApiLoader, siblingsForRegistrationResp, updateSiblingDetailsResp, getSiblingDetailsResp, siblingDetailsByIdResp } =
        useAppSelector(({ globalData, directoryStudent, admissionRegistration }) => ({
            showApiLoader: globalData.showApiLoader,
            siblingsForRegistrationResp: admissionRegistration.siblingsForRegistrationResp,
            updateSiblingDetailsResp: admissionRegistration.updateSiblingDetailsResp,
            getSiblingDetailsResp: directoryStudent.getSiblingDetailsResp,
            siblingDetailsByIdResp: admissionRegistration.siblingDetailsByIdResp
        }), shallowEqual);

    const siblingDetailsRespRef = useRef({
        prevUpdateSiblingDetailsResp: updateSiblingDetailsResp,
        prevSiblingDetailsByIdResp: siblingDetailsByIdResp
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
        const { prevUpdateSiblingDetailsResp, prevSiblingDetailsByIdResp } = siblingDetailsRespRef.current;
        if (updateSiblingDetailsResp && prevUpdateSiblingDetailsResp !== updateSiblingDetailsResp) {
            toast.success("Sibling details updated successfully.");
            nextStepHndlr(stepId, null);
        } else if (siblingDetailsByIdResp && prevSiblingDetailsByIdResp !== siblingDetailsByIdResp) {
            const formData = getInitialState(siblingDetailsByIdResp);
            siblingForm.resetForm({
                values: formData
            })
        }
        siblingDetailsRespRef.current.prevUpdateSiblingDetailsResp = updateSiblingDetailsResp;
        siblingDetailsRespRef.current.prevSiblingDetailsByIdResp = siblingDetailsByIdResp;
    }, [updateSiblingDetailsResp, siblingDetailsByIdResp]);

    useEffect(() => {
        if (getSiblingDetailsResp && selectedStudentState) {
            const { studentCode } = selectedStudentState,
                rowIndex = siblingForm.values?.siblings.findIndex((item: any) => item.siblingCode === studentCode);
            if (rowIndex >= 0) {
                const { studentName, studentCode, classId, rollNo, curriculumId, sectionId,
                    curriculumName, className, sectionName
                } = getSiblingDetailsResp;

                formikArrayHelpers.current?.replace(rowIndex, {
                    uniqueId: generateUniqueNumber(),
                    siblingCode: studentCode,
                    selectedSiblingInfo: {
                        studentName,
                        studentCode: studentCode
                    },
                    siblingName: studentName,
                    siblingCurriculumId: curriculumId,
                    siblingCurriculumName: curriculumName,
                    siblingClassId: classId,
                    siblingClassName: className,
                    siblingSectionId: sectionId,
                    siblingSectionName: sectionName,
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


    useEffect(() => {
        if (studentId) {
            const params = { studentId };
            dispatch(getSiblingDetailsByIdAct(generateActionPayload("sibling_details_byreno", params)));
        }
    }, [studentId]);


    const siblingForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (!siblingForm.dirty && tabsFilledInfo[stepId]) {
                nextStepHndlr(stepId, null);
                return;
            }
            const params = { studentId };
            const payload = generateSiblingPayload(branchId, values);
            dispatch(updateSiblingDetailsAct(generateActionPayload("add_sibling_details", params, payload)));
        },
    });

    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.PREVIOUS_TAB);
    }

    function submitHndlr(e: any) {
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.NEXT_TAB);
    }

    function addNewSiblingHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                siblingCode: "",
                selectedSiblingInfo: undefined,
                siblingName: "",
                siblingCurriculumId: "",
                siblingCurriculumName: "",
                siblingClassId: "",
                siblingClassName: "",
                siblingSectionId: "",
                siblingSectionName: "",
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

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString, instituteId };
            dispatch(getSiblingForRegistrationAct(generateActionPayload("get_siblings_registration", undefined,
                params)));
        }
    }

    function selectedStudentHndlr(selectedStudent: any, meta?: any) {
        const { studentId, studentCode, academicYearId } = selectedStudent || {}, { name } = meta || {};
        const siblingIndexKey = name.split(".")[0];
        if (studentCode) {
            //Sibling code is here student id.
            const studentExist = siblingForm.values?.siblings.find((item: any) =>
                item.siblingCode == studentCode);
            if (!studentExist) {
                const params = { studentId },
                    payload = { academicYearId };
                dispatch(setGetSiblingDetailsAct(undefined));
                // dispatch(getSiblingDetailsAct(generateActionPayload("get_students_by_id", params, payload)));
                dispatch(getSiblingDetailsAct(generateActionPayload("get_siblings_registration_update", undefined, params)));

                siblingForm.setFieldValue(`${siblingIndexKey}.selectedSiblingInfo`, selectedStudent);
                siblingForm.setFieldValue(`${siblingIndexKey}.siblingCode`, studentCode);
                setSelectStudentState(selectedStudent);

            } else {
                siblingForm.setFieldValue(`${siblingIndexKey}.selectedSiblingInfo`, {});
            }
        } else {
            const { removedValue } = meta || {},
                { studentCode: removedStudentCode } = removedValue || {},
                rowIndex = siblingForm.values?.siblings.findIndex((item: any) => item.siblingCode === removedStudentCode);
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
                    siblingDetails: ""
                });
            }
            setSelectStudentState(selectedStudent);

        }
    }

    function hasSiblingsSameSchoolHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        const formData = getInitialState(undefined, "true", value);
        siblingForm.setValues(formData);

    }

    function hasSiblingsHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        const formData = getInitialState(undefined, value, "false");
        siblingForm.setValues(formData);
    }

    return (
        <form id="student-info-form" onSubmit={siblingForm.handleSubmit}>
            <UncontrolledAccordion open="sibling-details" defaultOpen={["sibling-details"]} stayOpen>
                <AccordionItem>
                    <AccordionHeader tag="h4" targetId="sibling-details">
                        Sibling Details
                    </AccordionHeader>
                    <AccordionBody accordionId="sibling-details">
                        <div className="tw-grid tw-grid-cols-1 tw-gap-3">
                            {/* Radio Buttons */}
                            <div className="tw-col-span-1 tw-lg:tw-col-span-4">
                                <RadioInputContainer
                                    name="hasSibling"
                                    labelText="Do you have siblings?"
                                    containerClassName="tw-mr-3"
                                    radioClassName="form-radio-green"
                                    radioOptions={trueFalseOptions}
                                    isDisabled={isViewMode}
                                    value={siblingForm.values.hasSibling}
                                    onChange={hasSiblingsHndlr}
                                />
                            </div>

                            <div className="tw-col-span-1 tw-lg:tw-col-span-8">
                                <RadioInputContainer
                                    name="siblingFromDPS"
                                    labelText="Is there any Sibling Studying in the Same School?"
                                    radioClassName="form-radio-green"
                                    radioOptions={trueFalseOptions}
                                    value={siblingForm.values.siblingFromDPS}
                                    onChange={hasSiblingsSameSchoolHndlr}
                                    isDisabled={isViewMode || siblingForm.values.hasSibling === "false"}
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
                                                            <div
                                                                id={`${siblingDetail.uniqueId}-${index}`}
                                                                key={`${siblingDetail.uniqueId}-${index}`}
                                                                className={`tw-col-span-1 tw-mb-2 ${index < siblingForm.values.siblings.length - 1 ? "tw-border-b" : ""}`}
                                                            >
                                                                <div className="tw-grid tw-grid-cols-1 tw-gap-3">
                                                                    {/* Header with Remove Button */}
                                                                    <div className="tw-flex tw-justify-between tw-items-center tw-border-b tw-mb-2">
                                                                        <span className="tw-text-base tw-font-bold">{index + 1}. Sibling Details</span>
                                                                        {index !== 0 && (
                                                                            <Button
                                                                                data-index={index}
                                                                                onClick={removeSiblingHndlr}
                                                                                color="white"
                                                                                variant="reject"
                                                                            >
                                                                                <i className="ri-delete-bin-2-fill" />
                                                                            </Button>
                                                                        )}
                                                                    </div>

                                                                    {/* AutoSearch Input for existing students */}
                                                                    {siblingForm.values.siblingFromDPS === "true" && (
                                                                        <div className="tw-col-span-1 tw-md:tw-col-span-6">
                                                                            <AutoSearchInput
                                                                                labelText="Student Id"
                                                                                formgroupClassName="search-box tw-mb-3"
                                                                                name={`siblings[${index}].siblingCode`}
                                                                                placeHolder="Search..."
                                                                                onBlur={siblingForm.handleBlur}
                                                                                onChange={onInputSearchChange}
                                                                                valueKey="studentCode"
                                                                                labelKey="studentName"
                                                                                subLabelKey="studentCode"
                                                                                labelHeader="Student Code"
                                                                                subLabelHeader="Student Name"
                                                                                options={siblingsForRegistrationResp}
                                                                                selected={siblingDetail.selectedSiblingInfo}
                                                                                selectedOptionCallbck={selectedStudentHndlr}
                                                                                invalid={inputFieldTouched.siblingCode && inputFieldErrors.siblingCode ? true : false}
                                                                                error={inputFieldTouched.siblingCode && inputFieldErrors.siblingCode ? inputFieldErrors.siblingCode : ""}
                                                                                isDisabled={isViewMode || siblingForm.values.siblingFromDPS === "false"}
                                                                            >
                                                                                <i className="ri-search-line search-icon"></i>
                                                                            </AutoSearchInput>
                                                                        </div>
                                                                    )}

                                                                    {/* Sibling Name */}
                                                                    <div className="tw-col-span-1 tw-md:tw-col-span-6 tw-lg:tw-col-span-4 tw-xxl:tw-col-span-3">
                                                                        <TextInput
                                                                            name={`siblings[${index}].siblingName`}
                                                                            labelText="Name"
                                                                            value={siblingDetail.siblingName}
                                                                            onChange={siblingForm.handleChange}
                                                                            invalid={(inputFieldTouched.siblingName && inputFieldErrors.siblingName) ? true : false}
                                                                            error={(inputFieldTouched.siblingName && inputFieldErrors.siblingName) ? inputFieldErrors.siblingName : ""}
                                                                            isDisabled={isViewMode || (siblingForm.values.hasSibling === "false") || (siblingForm.values.siblingFromDPS === "true")}
                                                                        />
                                                                    </div>

                                                                    {/* Curriculum, Class, Section - for existing sibling */}
                                                                    {siblingForm.values.siblingFromDPS === "true" && (
                                                                        <>
                                                                            <div className="tw-col-span-1 tw-md:tw-col-span-6 tw-lg:tw-col-span-4 tw-xxl:tw-col-span-3">
                                                                                <TextInput
                                                                                    name={`siblings[${index}].siblingCurriculumName`}
                                                                                    labelText="Curriculum"
                                                                                    value={siblingDetail.siblingCurriculumName}
                                                                                    onChange={() => { }}
                                                                                    invalid={inputFieldTouched.siblingCurriculumName && inputFieldErrors.siblingCurriculumName ? true : false}
                                                                                    error={inputFieldTouched.siblingCurriculumName && inputFieldErrors.siblingCurriculumName ? inputFieldErrors.siblingCurriculumName : ""}
                                                                                    isDisabled={true}
                                                                                />
                                                                            </div>
                                                                            <div className="tw-col-span-1 tw-md:tw-col-span-6 tw-lg:tw-col-span-4 tw-xxl:tw-col-span-3">
                                                                                <TextInput
                                                                                    name={`siblings[${index}].siblingClassName`}
                                                                                    labelText="Class"
                                                                                    value={siblingDetail.siblingClassName}
                                                                                    onChange={() => { }}
                                                                                    isDisabled={true}
                                                                                />
                                                                            </div>
                                                                            <div className="tw-col-span-1 tw-md:tw-col-span-6 tw-lg:tw-col-span-4 tw-xxl:tw-col-span-3">
                                                                                <TextInput
                                                                                    name={`siblings[${index}].siblingSectionName`}
                                                                                    labelText="Section"
                                                                                    value={siblingDetail.siblingSectionName}
                                                                                    onChange={() => { }}
                                                                                    isDisabled={true}
                                                                                />
                                                                            </div>
                                                                        </>
                                                                    )}

                                                                    {/* Sibling Details for new sibling */}
                                                                    {siblingForm.values.siblingFromDPS === "false" && (
                                                                        <div className="tw-col-span-1 tw-md:tw-col-span-12 tw-lg:tw-col-span-8 tw-xxl:tw-col-span-8">
                                                                            <TextInput
                                                                                name={`siblings[${index}].siblingDetails`}
                                                                                labelText="Sibling Details"
                                                                                value={siblingDetail.siblingDetails}
                                                                                onChange={siblingForm.handleChange}
                                                                                invalid={inputFieldTouched.siblingDetails && inputFieldErrors.siblingDetails ? true : false}
                                                                                error={inputFieldTouched.siblingDetails && inputFieldErrors.siblingDetails ? inputFieldErrors.siblingDetails : ""}
                                                                                isDisabled={isViewMode || (siblingForm.values.hasSibling === "false") || (siblingForm.values.siblingFromDPS === "true")}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </>
                                        );
                                    }}
                                </FieldArray>
                            </FormikProvider>

                            {/* Add Sibling Button */}
                            {siblingForm.values.siblings.length < 2 && (
                                <div className="tw-col-span-1 tw-mt-2">
                                    <Button
                                    variant="soft"
                                        type="button"
                                        disabled={isViewMode || siblingForm.values.hasSibling === "false"}
                                        onClick={addNewSiblingHndlr}
                                    >
                                        Add Siblings
                                    </Button>
                                </div>
                            )}
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion >
            {!isViewMode && <div className="row mt-3">
                <div className="col-12 text-end mt-2">
                    <button disabled={showApiLoader} type="button" onClick={previousBtnHndlr} className="btn  btn-soft-success me-2">
                        Previous
                    </button>
                    <button disabled={showApiLoader} type="button" onClick={submitHndlr} className="btn btn-success">
                        Next
                    </button>
                </div>
            </div>}
        </form >
    )
}

export default SiblingDetails;