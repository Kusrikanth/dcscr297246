import React, { useMemo, forwardRef, useEffect, useRef, useCallback, useState, useImperativeHandle } from "react";
import { shallowEqual } from "react-redux";
import {
    HorizontalWizard
} from "../../../Components/Common";
import { toast } from "react-toastify";
// Common Component
import BreadCrumb from "../../../Components/Common/BreadCrumb";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

import {
    DesignationDetails, BankDetails, TdsDetails, PhotosDocuments,
} from "./StepInfo";
import { BasicDetails, BasicInfo, JobDetails, PayrollDetails, Documents } from "./StepInfoAccordian"
import { Link, useHistory, useLocation } from "react-router-dom";
//Helper
import { stepInfo, StepperFormContext, addEmployeePayload, TABS_ACTIONS, formSectionSaveKey } from "./helper";
//Helper
import { addEmployeeAct, getEmployeeByIdAct } from "../../../store/directory/employeemanagement/employeemanagementactions";
import { setAddedEmployeeIdAct, setAddEmployeePayloadAct } from "../../../store/appdata/appdataactions";
import { generateActionPayload } from "../../../utility/reduxutility";

function getActiveMenuComponent(menuId: any) {
    switch (menuId) {
        case "basic_details":
            return BasicInfo;
        case "job_details":
            return JobDetails;
        case "bank_details":
            return BankDetails;
        // case "tds_details":
        //     return TdsDetails;
        case "photo_document":
            return Documents;
        case "salary_details":
            return PayrollDetails;
        default:
            return null;

    }
}


function AddEmployee() {
    const [activeStepId, setActiveStepId] = useState("basic_details");
    const [activeFormState, setActiveFormState] = useState<any>(undefined);
    const [inAddModeState, setInAddModeState] = useState(true);
    const [desiredTabDetailState, setDesiredTabDetailState] = useState({
        action: "",
        stepId: "",
    });
    const history = useHistory();
    const location = useLocation();
    const currentPath = location.pathname;
    const multiFormKeysToValidate = useRef(new Set());
    const submitFormDataRef = useRef<any>({
        employeeBasicDetails: {
            isValid: false,
            formData: undefined,
        },
        employeeEducationDetails: {
            isValid: false,
            formData: undefined,
        },
        employeeContactDetails: {
            isValid: false,
            formData: undefined,
        },
        employeeDependentDetails: {
            isValid: false,
            formData: undefined,
        },
        employeeMarriageInfo: {
            isValid: false,
            formData: undefined,
        },
        employeeCurrentJob: {
            isValid: false,
            formData: undefined,
        },
        employeeDesignationDetails: {
            isValid: false,
            formData: undefined,
        },
        employeeEmergencyDetails: {
            isValid: false,
            formData: undefined,
        },
        employeePastExperience: {
            isValid: false,
            formData: undefined,
        },
        employeeBankDetails: {
            isValid: false,
            formData: undefined,
        },
        employeeSalaryDetails: {
            isValid: false,
            formData: undefined,
        },
        employeeDocumentList: {
            isValid: false,
            formData: undefined,
        }
    });

    const dispatch = useAppDispatch();
    const { addEmployeeResp, getEmployeeByIdResp,
        updateEmployeeResp, addedEmployeeId,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId, employeeManagementErrorResp } =
        useAppSelector(({ directoryEmployee, appData }) => ({
            addEmployeeResp: directoryEmployee.addEmployeeResp,
            updateEmployeeResp: directoryEmployee.updateEmployeeResp,
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp,
            addedEmployeeId: appData.addedEmployeeId,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
        }), shallowEqual);

    const addEmployeeRef = useRef<any>({
        prevAddEmployeeResp: addEmployeeResp,
        prevUpdateEmployeeResp: updateEmployeeResp,
        prevGetEmployeeByIdResp: getEmployeeByIdResp,
        prevEmployeeManagementErrorResp: employeeManagementErrorResp
    });
    useEffect(() => {
        // if (addedEmployeeId) {
        //     dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: addedEmployeeId })));
        // }
        // return () => {
        //     dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: addedEmployeeId })))
        // }
        // dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: "2598" })));
    }, []);

    // useEffect(() => {
    //     if (addEmployeePayload !== submitFormDataRef.current) {
    //     }
    // }, [addEmployeePayload, addEmployeeRef]);

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

    useEffect(() => {
        const { prevAddEmployeeResp, prevGetEmployeeByIdResp,
            prevUpdateEmployeeResp, prevEmployeeManagementErrorResp } = addEmployeeRef.current;
        if (addEmployeeResp && prevAddEmployeeResp !== addEmployeeResp) {
            if (inAddModeState) {
                toast.success("Employee added successfully.");
            } else {
                toast.success("Employee updated successfully.");
                history.push(linkTo);
                return;
            }
            const currentStepIndex = stepInfo.findIndex((item: any) => item.id === activeStepId),
                nextStepDetails = stepInfo[currentStepIndex + 1],
                { id } = nextStepDetails || {};
            if (id) {
                setActiveStepId(id);
                setActiveFormState(undefined);
            }
            const addEmployeeKeys = Object.keys(submitFormDataRef.current);
            addEmployeeKeys.forEach((item: any, index: any) => {
                if (Object.prototype.hasOwnProperty.call(addEmployeeResp, item)) {
                    submitFormDataRef.current[item].formData = addEmployeeResp[item];
                }
            })
            // setInAddModeState(false);
            const { employeeBasicDetails } = addEmployeeResp,
                { id: employeeId } = employeeBasicDetails || {};
            if (employeeId) {
                dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId })));
            }
            // props.toggle(true);
        } else if (updateEmployeeResp && prevUpdateEmployeeResp !== updateEmployeeResp) {
            toast.success("Student updated successfully.");
            // props.toggle(true);
        }
        else if (getEmployeeByIdResp && prevGetEmployeeByIdResp !== getEmployeeByIdResp) {
            const addEmployeeKeys = Object.keys(submitFormDataRef.current);
            const updateFormRefData = submitFormDataRef.current;
            addEmployeeKeys.forEach((item: any, index: any) => {
                if (Object.prototype.hasOwnProperty.call(getEmployeeByIdResp, item)) {
                    updateFormRefData[item].formData = getEmployeeByIdResp[item];
                    updateFormRefData[item].isValid = false;
                }
            })
            submitFormDataRef.current = { ...updateFormRefData };
            setInAddModeState(false);
            // props.toggle(true);
        }
        else if (employeeManagementErrorResp && prevEmployeeManagementErrorResp !== employeeManagementErrorResp) {
            const { details }: any = employeeManagementErrorResp;
            toast.error(details || "Something went wrong.");
            if (Array.isArray(activeFormState)) {
                for (let i = 0; i < activeFormState.length; i++) {
                    submitFormDataRef.current[activeFormState[i]].isValid = false;
                }
            }
        }
        addEmployeeRef.current.prevAddEmployeeResp = addEmployeeResp;
        addEmployeeRef.current.prevGetEmployeeByIdResp = getEmployeeByIdResp;
        addEmployeeRef.current.prevUpdateEmployeeResp = updateEmployeeResp;
        addEmployeeRef.current.prevEmployeeManagementErrorResp = employeeManagementErrorResp;
    }, [addEmployeeResp, getEmployeeByIdResp, updateEmployeeResp, employeeManagementErrorResp]);

    function previousStepHndlr() {
        const { stepId } = desiredTabDetailState;
        if (stepId) {
            setActiveStepId(stepId);
        }
    }

    function nextStepHndlr() {
        const { stepId, action } = desiredTabDetailState;
        if ((activeStepId === "salary_details" && inAddModeState) || (activeStepId === "photo_document")) {
            const isOtherEmployee = submitFormDataRef.current?.employeeCurrentJob?.formData?.isOtherEmployee;
            // let payloadFormData;
            // if (isOtherEmployee === "true") {
            //     payloadFormData = addEmployeePayload(submitFormDataRef.current, instituteId, undefined);
            // } else {
            const payloadFormData = addEmployeePayload(submitFormDataRef.current, instituteId, branchId, formSectionSaveKey);
            // }
            dispatch(addEmployeeAct(generateActionPayload("add_employee", undefined, payloadFormData)));
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

    function updateFormKeyDataHndlr(multiFormKey: string, formData: any) {
        if (submitFormDataRef.current[multiFormKey]) {
            submitFormDataRef.current[multiFormKey] = {
                isValid: true,
                formData
            }
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
            if (nextStepIndex >= 0) {
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
        // if (!inAddModeState) {
        //     let allFormsValid: boolean = true;
        //     for (let i = 0; i < activeFormState.length; i++) {
        //         if (!submitFormDataRef.current[activeFormState[i]].isValid) {
        //             allFormsValid = false;
        //             break;
        //         }
        //     }
        //     if (allFormsValid) {
        // setActiveStepId(stepId);
        //     }
        // }
        // if (Array.isArray(multiFormKeys)) {
        //     setActiveFormState(multiFormKeys);
        // }
        // if (!inAddModeState) {
        // setActiveStepId(stepId);
        //     setActiveFormState(undefined);
        // }
        // return;
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeStepId);
        if (TabComponent)
            return <TabComponent branchId={branchId} instituteId={instituteId} />
    }, [activeStepId]);

    const linkTo = currentPath.includes("other-employee")
        ? "/other-employee"
        : currentPath.includes("employee-management")
            ? "/employee-management"
            : "/";
            
            const cardTitle = currentPath.includes("other-employee") ? "Add Other Employee" : "Add New Employee";
    return (
        <div className="page-content add-employee-container">
            <div className="container-fluid">
                <BreadCrumb title={cardTitle} pageTitle="HRMS" />
                <div className="tw-grid tw-grid-cols-12 tw-justify-center tw-mb-4">
                    <div className="tw-col-span-10 tw-col-start-2">
                        <div className="tw-hidden tw-mb-2">
                            {currentPath.includes("other-employee") ? (
                                <Link className="tw-text-primary tw-font-bold" to={linkTo}>
                                    {"<<"} Back to Other Employees
                                </Link>
                            ) : (
                                <Link className="tw-text-primary tw-font-bold" to={linkTo}>
                                    {"<<"} Back to Employee Directories
                                </Link>
                            )}
                        </div>
                        <div className="tw-bg-white tw-rounded-xl tw-shadow-md tw-overflow-hidden tw-mb-3 tw-mt-2">
                            <div className="tw-bg-[#5870a0] tw-px-5 tw-py-4">
                                <h4 className="tw-text-[16px] tw-text-white tw-font-semibold tw-text-gray-800 text-align-center tw-mb-0">
                                    {cardTitle}
                                </h4>
                            </div>
                            <div className="tw-p-4">
                                <div className="tw-border tw-rounded-lg tw-p-4">
                                    <HorizontalWizard
                                        updateStepHndlr={updateStepHndlr}
                                        stepsList={stepInfo}
                                        activeStepId={activeStepId}
                                    />
                                </div>
                                <div className="tw-pt-4 tw-pb-1">
                                    <StepperFormContext.Provider
                                        value={{
                                            currentMultiFormKeys: activeFormState,
                                            storeMultiFormData,
                                            editEmployeeData: submitFormDataRef.current,
                                            previousStepHndlr,
                                            updateFormKeyDataHndlr,
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
    )
}


export default AddEmployee;
