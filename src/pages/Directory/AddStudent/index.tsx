import React, { useMemo, forwardRef, useEffect, useRef, useState, useImperativeHandle, useReducer, useCallback } from "react";
import { shallowEqual } from "react-redux";
import {
    HorizontalWizard
} from "../../../Components/Common";
import { toast } from "react-toastify";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
// Common Component
import BreadCrumb, { BreadCrumbUpdated } from "../../../Components/Common/BreadCrumb";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

import classnames from "classnames";

import { Photos } from "./StepInfo";
import { StudentInfo, SiblingDetails, ParentGuardian, CommunicationDetails, Documents } from "./StepInfoAccordian";

import { Link, useHistory } from "react-router-dom";
//Helper
import { stepInfo, StepperFormContext, addStudentPayload, TABS_ACTIONS } from "./helper";
import { addStudentAct, getStudentByIdAct, setAddStudentAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../utility/reduxutility";

function getActiveMenuComponent(menuId: any) {
    switch (menuId) {
        case "student_info":
            return StudentInfo;
        case "sibling_details":
            return SiblingDetails;
        case "parents_details":
            return ParentGuardian;
        case "communication_details":
            return CommunicationDetails;
        case "documents":
            return Documents;
        case "upload_photo":
            return Photos;
        default:
            return null;

    }
}

// interface IContextProps{
//     formsData: any,
//     submitForm:boolean,
// }


function AddStudent() {
    const [activeStepId, setActiveStepId] = useState("student_info");
    const history = useHistory();
    const [activeFormState, setActiveFormState] = useState<any>(undefined);
    const [inAddModeState, setInAddModeState] = useState(true);
    const [requestedMultiFormKeysState, setRequestedMultiFormKeysState] = useState<any>(undefined);
    const [desiredTabDetailState, setDesiredTabDetailState] = useState({
        action: "",
        stepId: "",
    });

    const multiFormKeysToValidate = useRef(new Set());
    const submitFormDataRef = useRef<any>({
        studentDetails: {
            isValid: false,
            formData: undefined,
        },
        studentAcademicDetails: {
            isValid: false,
            formData: undefined,
        },
        identificationDetail: {
            isValid: false,
            formData: undefined,
        },
        pastEducation: {
            isValid: false,
            formData: undefined,
        },
        medicalInfo: {
            isValid: false,
            formData: undefined,
        },
        studentSiblingDetails: {
            isValid: false,
            formData: undefined,
        },
        fatherDetails: {
            isValid: false,
            formData: undefined
        },
        motherDetails: {
            isValid: false,
            formData: undefined
        },
        guardianDetails: {
            isValid: false,
            formData: undefined
        },
        residentialAddress: {
            isValid: false,
            formData: undefined
        },
        permanentAddress: {
            isValid: false,
            formData: undefined
        },
        communicationDetails: {
            isValid: false,
            formData: undefined
        },
        studentDocumentsDetails: {
            isValid: false,
            formData: undefined
        }
    });
    const dispatch = useAppDispatch();
    const { addStudentResp, updateStudentResp, getStudentByIdResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId, academicYearListResp,
        studentManagementErrorResp } = useAppSelector(({ directoryStudent, appData, instAcademics }) => ({
            addStudentResp: directoryStudent.addStudentResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
            academicYearListResp: instAcademics.academicYearListResp,

        }), shallowEqual);

    useEffect(() => {
        // dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", {
        //     studentId: "25185"
        // }, { academicYearId: 8 })));
        return () => { dispatch(setAddStudentAct(undefined)) }
    }, []);

    const addStudentRef = useRef<any>({
        prevAddStudentResp: undefined,
        prevUpdateStudentResp: updateStudentResp,
        prevGetStudentByIdResp: getStudentByIdResp,
        prevStudentManagementErrorResp: studentManagementErrorResp
    });

    useEffect(() => {
        const { prevAddStudentResp, prevUpdateStudentResp, prevGetStudentByIdResp, prevStudentManagementErrorResp } = addStudentRef.current;
        if (addStudentResp && prevAddStudentResp !== addStudentResp) {
            if (inAddModeState) {
                toast.success("Student added successfully.");
            } else {
                toast.success("Student updated successfully.");
                history.push("/student-management");
                return;
            }
            const currentStepIndex = stepInfo.findIndex((item: any) => item.id === activeStepId),
                nextStepDetails = stepInfo[currentStepIndex + 1],
                { id } = nextStepDetails || {};
            if (id) {
                setActiveStepId(id);
                setActiveFormState(undefined);
            }
            const { studentDetails } = addStudentResp;
            if (studentDetails?.id && studentDetails?.admissionAcademicYearId) {
                dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", {
                    studentId: studentDetails?.id
                }, { academicYearId: studentDetails?.admissionAcademicYearId })));
            }
            //Set Edit Mode True
            setInAddModeState(false);
        }
        else if (getStudentByIdResp && prevGetStudentByIdResp !== getStudentByIdResp) {
            const addStudentKeys = Object.keys(submitFormDataRef.current);
            const updateFormRefData = submitFormDataRef.current;
            addStudentKeys.forEach((item: any, index: any) => {
                if (item === "studentAcademicDetails") {
                    const { studentAcademicDetails } = getStudentByIdResp;
                    if (!updateFormRefData[item].formData) {
                        updateFormRefData[item].formData = {
                            id: studentAcademicDetails?.id,
                            branchCurriculumId: studentAcademicDetails?.curriculumId,
                            branchClassId: studentAcademicDetails?.classId,
                            academicSectionId: studentAcademicDetails?.sectionId,
                            rollNo: studentAcademicDetails?.rollNo,
                            houseName: studentAcademicDetails?.houseName,
                            // houseId: studentAcademicDetails?.houseId,
                            firstLanguageId: studentAcademicDetails?.firstLanguageId,
                            secondLanguageId: studentAcademicDetails?.secondLanguageId,
                            thirdLanguageId: studentAcademicDetails?.thirdLanguageId,
                            admissionCategory: studentAcademicDetails?.admissionCategory,
                            admissionType: studentAcademicDetails?.admissionType,
                        };
                    }
                } else if (item === "fatherDetails") {
                    const { studentParentDetails } = getStudentByIdResp;
                    if (Array.isArray(studentParentDetails)) {
                        const fatherIndexOf = studentParentDetails.findIndex(item => item.relationType === "Father");
                        if (fatherIndexOf >= 0) {
                            if (!updateFormRefData[item].formData) {
                                updateFormRefData[item].formData = {
                                    id: studentParentDetails[fatherIndexOf]?.id,
                                    fatherName: studentParentDetails[fatherIndexOf]?.name,
                                    fatherNationalityId: studentParentDetails[fatherIndexOf]?.nationalityId,
                                    fatherEmailId: studentParentDetails[fatherIndexOf]?.emailId,
                                    fatherContactNo: studentParentDetails[fatherIndexOf]?.contactNo,
                                    isFatherEmployee: studentParentDetails[fatherIndexOf]?.isEmployee,
                                    fatherEmployeeId: studentParentDetails[fatherIndexOf]?.employeeId,
                                    fatherQualificationId: studentParentDetails[fatherIndexOf]?.qualificationId,
                                    fatherOccupationId: studentParentDetails[fatherIndexOf]?.occupationId,
                                    fatherOrganizationName: studentParentDetails[fatherIndexOf]?.organizationName,
                                    fatherDesignationId: studentParentDetails[fatherIndexOf]?.designationId,
                                    fatherIncomeId: studentParentDetails[fatherIndexOf]?.incomeId,
                                    fatherOfficeAddress: studentParentDetails[fatherIndexOf]?.officeAddress,
                                    fatherDocumentType: studentParentDetails[fatherIndexOf]?.documentType,
                                    fatherDocumentNumber: studentParentDetails[fatherIndexOf]?.documentNumber,
                                    isSingleParent: studentParentDetails[fatherIndexOf]?.isSingleParent,
                                    fatherImageBase64: studentParentDetails[fatherIndexOf]?.imageBase64,
                                    fatherEmployeeCode: studentParentDetails[fatherIndexOf]?.employeeCode,
                                };
                            }
                        }
                    }
                } else if (item === "motherDetails") {
                    const { studentParentDetails } = getStudentByIdResp;
                    if (Array.isArray(studentParentDetails)) {
                        const motherDetailIndex = studentParentDetails.findIndex(item => item.relationType === "Mother");
                        if (motherDetailIndex >= 0) {
                            if (!updateFormRefData[item].formData) {
                                updateFormRefData[item].formData = {
                                    id: studentParentDetails[motherDetailIndex]?.id,
                                    motherName: studentParentDetails[motherDetailIndex]?.name,
                                    motherNationalityId: studentParentDetails[motherDetailIndex]?.nationalityId,
                                    motherEmailId: studentParentDetails[motherDetailIndex]?.emailId,
                                    motherContactNo: studentParentDetails[motherDetailIndex]?.contactNo,
                                    motherEmployeeId: studentParentDetails[motherDetailIndex]?.employeeId,
                                    isMotherEmployee: studentParentDetails[motherDetailIndex]?.isEmployee ? "true" : "false",
                                    motherQualificationId: studentParentDetails[motherDetailIndex]?.qualificationId,
                                    motherOccupationId: studentParentDetails[motherDetailIndex]?.occupationId,
                                    motherOrganizationName: studentParentDetails[motherDetailIndex]?.organizationName,
                                    motherDesignationId: studentParentDetails[motherDetailIndex]?.designationId,
                                    motherIncomeId: studentParentDetails[motherDetailIndex]?.incomeId,
                                    motherOfficeAddress: studentParentDetails[motherDetailIndex]?.officeAddress,
                                    motherDocumentType: studentParentDetails[motherDetailIndex]?.documentType,
                                    motherDocumentNumber: studentParentDetails[motherDetailIndex]?.documentNumber,
                                    isSingleParent: studentParentDetails[motherDetailIndex]?.isSingleParent,
                                    motherImageBase64: studentParentDetails[motherDetailIndex]?.imageBase64,
                                    motherEmployeeCode: studentParentDetails[motherDetailIndex]?.employeeCode,
                                };
                            }
                        }
                    }
                } else if (item === "guardianDetails") {
                    const { studentParentDetails } = getStudentByIdResp;
                    if (Array.isArray(studentParentDetails)) {
                        const GuardianDetailIndex = studentParentDetails.findIndex(item => item.relationType === "Guardian");
                        if (GuardianDetailIndex >= 0) {
                            if (!updateFormRefData[item].formData) {
                                updateFormRefData[item].formData = {
                                    id: studentParentDetails[GuardianDetailIndex]?.id,
                                    guardianName: studentParentDetails[GuardianDetailIndex]?.name,
                                    guardianDocumentType: studentParentDetails[GuardianDetailIndex]?.documentType,
                                    guardianDocumentNumber: studentParentDetails[GuardianDetailIndex]?.documentNumber,
                                    guardianEmailId: studentParentDetails[GuardianDetailIndex]?.emailId,
                                    guardianContactNo: studentParentDetails[GuardianDetailIndex]?.contactNo,
                                    guardianRelationTypeId: studentParentDetails[GuardianDetailIndex]?.guardianRelationTypeId,
                                    guardianOccupationId: studentParentDetails[GuardianDetailIndex]?.occupationId,
                                    guardianDesignationId: studentParentDetails[GuardianDetailIndex]?.designationId,
                                    guardianImageBase64: studentParentDetails[GuardianDetailIndex]?.imageBase64,
                                    isGuardianRequired: studentParentDetails[GuardianDetailIndex]?.name ? "true" : "false"
                                };
                            }
                        }
                    }
                } else if (item === "residentialAddress") {
                    const { communicationDetails }: any = getStudentByIdResp || {};
                    if (!updateFormRefData[item].formData) {
                        updateFormRefData[item].formData = {
                            id: communicationDetails?.id,
                            currentAddress: communicationDetails?.currentAddress,
                            currentCityId: communicationDetails?.currentCityId,
                            currentCountryId: communicationDetails?.currentCountryId,
                            currentHouseNo: communicationDetails?.currentHouseNo,
                            currentLandmark: communicationDetails?.currentLandmark,
                            currentPincode: communicationDetails?.currentPincode,
                            currentStateId: communicationDetails?.currentStateId
                        };
                    }
                } else if (item === "permanentAddress") {
                    const { communicationDetails } = getStudentByIdResp || {};
                    if (!updateFormRefData[item].formData) {
                        updateFormRefData[item].formData = {
                            id: communicationDetails?.id,
                            isPermanentAddress: communicationDetails?.isPermanentAddress,
                            permanentAddress: communicationDetails?.permanentAddress,
                            permanentCityId: communicationDetails?.permanentCityId,
                            permanentCountryId: communicationDetails?.permanentCountryId,
                            permanentHouseNo: communicationDetails?.permanentHouseNo,
                            permanentLandmark: communicationDetails?.permanentLandmark,
                            permanentPincode: communicationDetails?.permanentPincode,
                            permanentStateId: communicationDetails?.permanentStateId,
                        };
                    }
                } else if (Object.prototype.hasOwnProperty.call(getStudentByIdResp, item)) {
                    if (!updateFormRefData[item].formData) {
                        updateFormRefData[item].formData = getStudentByIdResp[item];
                    }
                }
            })
            submitFormDataRef.current = { ...updateFormRefData };
            // setInAddModeState(false);
        }
        else if (studentManagementErrorResp && prevStudentManagementErrorResp !== studentManagementErrorResp) {
            const { details }: any = studentManagementErrorResp;
            toast.error(details || "Something went wrong.");
            if (Array.isArray(activeFormState)) {
                for (let i = 0; i < activeFormState.length; i++) {
                    submitFormDataRef.current[activeFormState[i]].isValid = false;
                }
            }
        }
        addStudentRef.current.prevAddStudentResp = addStudentResp;
        addStudentRef.current.prevGetStudentByIdResp = getStudentByIdResp;
        addStudentRef.current.prevUpdateStudentResp = updateStudentResp;
        addStudentRef.current.prevStudentManagementErrorResp = studentManagementErrorResp;
    }, [addStudentResp, getStudentByIdResp, updateStudentResp, studentManagementErrorResp]);

    useEffect(() => {
        const handler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "Unsaved data will be lost!!!.";
        };
        window.addEventListener("beforeunload", handler);
        return () => {
            window.removeEventListener("beforeunload", handler);
        };
    }, []);


    function previousStepHndlr() {
        const { stepId } = desiredTabDetailState;
        if (stepId) {
            setActiveStepId(stepId);
        }
    }

    // function nextStepHndlr() {
    //     const currentStepIndex = stepInfo.findIndex((item: any) => item.id === activeStepId),
    //         nextStepDetails = stepInfo[currentStepIndex + 1],
    //         { id } = nextStepDetails || {};
    //     if (activeStepId === "communication_details") {
    //         const payloadFormData = addStudentPayload(submitFormDataRef.current, instituteId, branchId);
    //         dispatch(addStudentAct(generateActionPayload("add_student", undefined, payloadFormData)));
    //     } else if (nextStepDetails) {
    //         const { id } = nextStepDetails;
    //         setActiveFormState(undefined);
    //         setActiveStepId(id);
    //     }
    // }

    function nextStepHndlr() {
        const { stepId, action } = desiredTabDetailState;
        if (activeStepId === "communication_details" && inAddModeState) {
            const payloadFormData = addStudentPayload(submitFormDataRef.current, instituteId, branchId);
            dispatch(addStudentAct(generateActionPayload("add_student", undefined, payloadFormData)));
        } else if (activeStepId === "documents") {
            history.push("/student-management");
        } else {
            setActiveStepId(stepId);
        }
        setDesiredTabDetailState((prevState: any) => ({
            ...prevState, action: "", stepId: ""
        }))
        setActiveFormState(undefined);
    }

    function moveParticularTabHndlr() {
        const { action, stepId } = desiredTabDetailState;
        if (stepId) {
            setActiveStepId(stepId);
            setActiveFormState(undefined);
            setDesiredTabDetailState((prevState: any) => ({
                ...prevState, action: "", stepId: ""
            }))
        }
    }

    function submitCurrentFormCllbck(muliformKeys: any, submitActionKey: any) {
        if (Array.isArray(muliformKeys)) {
            setActiveFormState((prevState: any) => ([...muliformKeys]));
            multiFormKeysToValidate.current.clear();

            const currentStepIndex = stepInfo.findIndex((item: any) => item.id === activeStepId);
            if (submitActionKey === TABS_ACTIONS.NEXT_TAB) {
                const { id } = stepInfo[currentStepIndex + 1] || {};
                if (id) {
                    setDesiredTabDetailState({
                        action: TABS_ACTIONS.NEXT_TAB,
                        stepId: id
                    });
                }
            } else if (submitActionKey === TABS_ACTIONS.PREVIOUS_TAB) {
                const { id } = stepInfo[currentStepIndex - 1] || {};
                if (id) {
                    setDesiredTabDetailState({
                        action: TABS_ACTIONS.PREVIOUS_TAB,
                        stepId: id
                    });
                }
            } else if (submitActionKey === TABS_ACTIONS.SUBMIT_TAB) {
                const { id } = stepInfo[currentStepIndex];
                setDesiredTabDetailState({
                    action: TABS_ACTIONS.SUBMIT_TAB,
                    stepId: id
                });
            }
        }
    }

    const academicYearId = useMemo(() => {
        if(academicYearListResp){
            const currentAcademicYear = academicYearListResp.data.find((item: any) => item.yearStatus === "CURRENT");
            return currentAcademicYear?.academicYearId
        }
    }, [academicYearListResp]);    

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeStepId);
        if (TabComponent)
            return <TabComponent branchId={branchId} instituteId={instituteId} academicYearId={academicYearId} />
    }, [activeStepId]);


    function storeMultiFormData(multiFormKey: string, isValid: boolean, formData: any) {
        if (Array.isArray(activeFormState) && submitFormDataRef.current[multiFormKey]) {
            let allFormsValid: boolean = true;
            submitFormDataRef.current[multiFormKey] = {
                isValid,
                formData
            }
            multiFormKeysToValidate.current.add(multiFormKey);
            if (multiFormKeysToValidate.current.size === activeFormState.length) {
                for (let i = 0; i < activeFormState.length; i++) {
                    if (allFormsValid && !submitFormDataRef.current[activeFormState[i]].isValid) {
                        allFormsValid = false;
                        break;
                    }
                }
                if (allFormsValid) {
                    const { action } = desiredTabDetailState;
                    if (action === TABS_ACTIONS.NEXT_TAB || action === TABS_ACTIONS.SUBMIT_TAB) {
                        nextStepHndlr();
                    } else if (action === TABS_ACTIONS.PARTICULAR_TAB || action === TABS_ACTIONS.PREVIOUS_TAB) {
                        moveParticularTabHndlr();
                    } else {
                        return;
                    }
                } else {
                    for (let i = 0; i < activeFormState.length; i++) {
                        submitFormDataRef.current[activeFormState[i]].isValid = false;
                    }
                }
            }


        }
    }
    // function storeMultiFormData(multiFormKey: string, isValid: boolean, formData: any, stopNextStep?: boolean) {
    //     if (Array.isArray(activeFormState) && submitFormDataRef.current[multiFormKey]) {
    //         let allFormsValid: boolean = true;
    //         submitFormDataRef.current[multiFormKey] = {
    //             isValid,
    //             formData
    //         }
    //         for (let i = 0; i < activeFormState.length; i++) {
    //             if (!submitFormDataRef.current[activeFormState[i]].isValid) {
    //                 allFormsValid = false;
    //                 break;
    //             }
    //         }
    //         if (allFormsValid && !stopNextStep) {
    //             nextStepHndlr();
    //         }
    //     }
    // }

    // function updateFormKeyDataHndlr(multiFormKey: string, formData: any) {
    //     if (submitFormDataRef.current[multiFormKey]) {
    //         submitFormDataRef.current[multiFormKey] = {
    //             isValid: true,
    //             formData
    //         }
    //     }
    // }
    function updateFormKeyDataHndlr(multiFormKey: string, formData: any) {
        if (submitFormDataRef.current[multiFormKey]) {
            const updateFormRefData = { ...submitFormDataRef.current };
            updateFormRefData[multiFormKey] = {
                isValid: false,
                formData
            }
            submitFormDataRef.current = updateFormRefData;
            setRequestedMultiFormKeysState([]);
        }
    }


    function updateStepHndlr(stepId: any) {
        // setActiveStepId(stepId);
        // return;
        const currentStepIndex = stepInfo.findIndex((item: any) => item.id === activeStepId),
            currentStepInfo = stepInfo[currentStepIndex],
            clickedStepIndex = stepInfo.findIndex((item: any) => item.id === stepId),
            { multiFormKeys } = currentStepInfo || {};
        multiFormKeysToValidate.current.clear();
        if ((inAddModeState && (Number(clickedStepIndex) > Number(currentStepIndex)))) {
            const nextStepIndex = Number(currentStepIndex) + 1;
            if (nextStepIndex >= 0 && Array.isArray(multiFormKeys)) {
                const { id: nextStepId } = stepInfo[nextStepIndex];
                setActiveFormState([...multiFormKeys]);
                setDesiredTabDetailState({
                    action: TABS_ACTIONS.NEXT_TAB,
                    stepId: nextStepId
                });
            }
        } else if (Array.isArray(multiFormKeys)) {
            setActiveFormState([...multiFormKeys]);
            setDesiredTabDetailState({
                action: TABS_ACTIONS.PARTICULAR_TAB,
                stepId: stepId
            });
        } else {
            return;
        }
    }


    function requestedMultiFormKeyCllback(multiFormKeys: any) {
        if (Array.isArray(multiFormKeys)) {
            setRequestedMultiFormKeysState([...multiFormKeys]);
        }
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb title="Add Student" pageTitle="Directory" />
                <div className="tw-flex tw-justify-center">
                    <div className="tw-w-full tw-max-w-[85rem]">
                        <div className="tw-flex tw-flex-wrap">
                            <div className="tw-w-full">
                                <div className="tw-bg-white tw-rounded-lg tw-shadow">

                                    <div className="tw-border-b tw-px-6 tw-py-4">
                                        <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                            Add Student
                                        </h4>
                                    </div>

                                    <div className="tw-px-6 tw-py-5">
                                        <HorizontalWizard
                                            updateStepHndlr={updateStepHndlr}
                                            stepsList={stepInfo}
                                            activeStepId={activeStepId}
                                        />

                                        <div className="tw-pt-4 tw-pb-3">
                                            <StepperFormContext.Provider
                                                value={{
                                                    currentMultiFormKeys: activeFormState,
                                                    storeMultiFormData,
                                                    editStudentData: submitFormDataRef.current,
                                                    previousStepHndlr,
                                                    updateFormKeyDataHndlr,
                                                    requestedMultiFormKeys: requestedMultiFormKeysState,
                                                    requestedMultiFormKeyCllback: requestedMultiFormKeyCllback,
                                                    submitCurrentFormCllbck,
                                                }}
                                            >
                                                {activeComponent}
                                            </StepperFormContext.Provider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AddStudent;
