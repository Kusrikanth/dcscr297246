import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { FormikProvider, useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
} from "../../../../../../Components/Common";

import { StepperFormContext, stepInfo } from "../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct
} from "../../../../../../store/masterdata/masterdataactions";
import {
    registerStudentAct, getRegisterStudentByIdAct, updateRegisterStudentAct
} from "../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import Select from "react-select";
import { TABS_ACTIONS } from "../helper";
import { toast } from "react-toastify";
import { generateApiUrl } from "../../../../../../api/apihelper";
import BasicDetails from "./BasicDetails";
import AcademicDetails from "./AcademicDetails";
import IdentificationDetails from "./IdentificationDetails";
import PastEducation from "./PastEducation";
import MedicalInfo from "./MedicalInfo";
import FacilitiesRequired from "./FacilitiesRequired";
import Button from "../../../../../../Components/Common/Button";


export const StudentDetails: React.FC<any> = ({ isEditMode, stepId, branchId, instituteId }) => {
    const { isViewMode, studentId, tabsData, setStudentIdHndlr, nextStepHndlr, submitCurrentFormCllbck, setTabsDataHandler } = useContext<any>(StepperFormContext);
    const [sharedFieldState, setSharedFieldState] = useState<any>(null);
    const dispatch = useAppDispatch();
    const { showApiLoader, registerStudentResp, updateRegisterStudentResp, registerStudentByIdResp } =
        useAppSelector(({ globalData, admissionRegistration }) => ({
            showApiLoader: globalData.showApiLoader,
            registerStudentResp: admissionRegistration.registerStudentResp,
            updateRegisterStudentResp: admissionRegistration.updateRegisterStudentResp,
            registerStudentByIdResp: admissionRegistration.registerStudentByIdResp,
        }), shallowEqual);
    const studentInfoRespRef = useRef({
        prevRegisterStudentResp: registerStudentResp,
        prevUpdateRegisterStudentResp: updateRegisterStudentResp,
        prevRegisterStudentByIdResp: registerStudentByIdResp
    });

    useEffect(() => {
        const { prevRegisterStudentResp, prevUpdateRegisterStudentResp, prevRegisterStudentByIdResp } = studentInfoRespRef.current;
        if (registerStudentResp && prevRegisterStudentResp !== registerStudentResp) {
            const formDetails: any = childFormDataRef.current;
            toast.success("Student profile updated successfully.");
            const { registrationId } = registerStudentResp;
            setStudentIdHndlr(registrationId);
            const tabsData = Object.keys(formDetails).reduce((obj, item) => {
                Object.assign(obj, formDetails[item]?.formData);
                return obj
            }, {});
            Object.assign(tabsData, registerStudentResp);
            nextStepHndlr(stepId, tabsData);
        } else if (updateRegisterStudentResp && prevUpdateRegisterStudentResp !== updateRegisterStudentResp) {
            const formDetails: any = childFormDataRef.current;
            toast.success("Student updated successfully.");
            const tabsData = Object.keys(formDetails).reduce((obj, item) => {
                Object.assign(obj, formDetails[item]?.formData);
                return obj
            }, {});
            Object.assign(tabsData, updateRegisterStudentResp);
            nextStepHndlr(stepId, tabsData);
        } else if (registerStudentByIdResp && prevRegisterStudentByIdResp !== registerStudentByIdResp) {
            const { isStudentActive } = registerStudentByIdResp;
            if (typeof isStudentActive !== 'boolean') {
                setSharedFieldState(isStudentActive);
            }
            setTabsDataHandler(stepId, registerStudentByIdResp);
        }
        studentInfoRespRef.current.prevRegisterStudentResp = registerStudentResp;
        studentInfoRespRef.current.prevUpdateRegisterStudentResp = updateRegisterStudentResp;
        studentInfoRespRef.current.prevRegisterStudentByIdResp = registerStudentByIdResp;
    }, [registerStudentResp, updateRegisterStudentResp, registerStudentByIdResp]);

    useEffect(() => {
        if (studentId) {
            const params = { studentId };
            dispatch(getRegisterStudentByIdAct(generateActionPayload("get_register_student_byid", params)));
        }
    }, [studentId]);


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

    const childFormDataRef = useRef<any>({
        basicInfo: {
            isValid: false,
            isDirty: false,
            formData: undefined,
        }, academics: {
            isValid: false,
            isDirty: false,
            formData: undefined
        }, identification: {
            isValid: false,
            isDirty: false,
            formData: undefined
        },
        pastEducation: {
            isValid: false,
            isDirty: false,
            formData: undefined
        }, medicalInfo: {
            isValid: false,
            isDirty: false,
            formData: undefined
        }, facilityRequired: {
            isValid: false,
            isDirty: false,
            formData: undefined
        }
    });
    const multiFormKeysToValidate = useRef(new Set());

    function submitHndlr(e: any) {
        multiFormKeysToValidate.current.clear();
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.NEXT_TAB);
    }

    function submitAddStudentInfoApiCall() {
        const formDetails: any = childFormDataRef.current;
        const payload: any = Object.keys(formDetails).reduce((obj, item) => {
            Object.assign(obj, formDetails[item]?.formData);
            return obj
        }, {});
        if (studentId) {
            const params = { studentId };
            dispatch(updateRegisterStudentAct(generateActionPayload("update_register_student", params, payload)));
        } else {
            payload['mode'] = 'OFFLINE';
            dispatch(registerStudentAct(generateActionPayload("register_student", undefined, payload)));
        }
    }

    function storeMultiFormDataCallback(multiFormKey: string, isValid: boolean, isDirty: boolean, formData: any) {
        if (Array.isArray(currentStepMultiFormKeys) && childFormDataRef.current[multiFormKey]) {
            let allFormsValid: boolean = true, anyFormDirty = false;
            childFormDataRef.current[multiFormKey] = {
                isValid,
                isDirty,
                formData
            }
            multiFormKeysToValidate.current.add(multiFormKey);
            if (multiFormKeysToValidate.current.size === currentStepMultiFormKeys.length) {
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    if (allFormsValid && !childFormDataRef.current[currentStepMultiFormKeys[i]].isValid) {
                        allFormsValid = false;
                        break;
                    }
                    if (!anyFormDirty && childFormDataRef.current[currentStepMultiFormKeys[i]].isDirty) {
                        anyFormDirty = true;
                    }
                }
                if (allFormsValid && anyFormDirty) {
                    submitAddStudentInfoApiCall();
                } else if (!anyFormDirty) {
                    nextStepHndlr(stepId, tabsData[stepId]);
                }
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isValid = false;
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isDirty = false;
                }
                multiFormKeysToValidate.current.clear();
            }
        }
    }

    function updatedSharedFieldHndlr(keyName: string, keyValue: string) {
        setSharedFieldState((prevState: any) => ({ ...prevState, [keyName]: keyValue }));
    }

    return (
        <div>
            {/* <div className="row">
                <div className="col-12 mb-3">
                    <div className="border-bottom">
                        <span className="fs-normal fw-bold d-block mb-2">1. Student Profile</span>
                    </div>

                </div>
            </div> */}
            <UncontrolledAccordion
                open="basicInfo"
                defaultOpen={["basicInfo", "academics", "identification",
                    "pastEducation",
                    "medicalInfo", "facilityRequired"]} stayOpen>
                <AccordionItem>
                    <BasicDetails
                        isViewMode={isViewMode}
                        isEditMode={isEditMode}
                        branchId={branchId}
                        instituteId={instituteId}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        formId="basicInfo"
                        updatedSharedField={updatedSharedFieldHndlr}
                        stepId={stepId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <AcademicDetails
                        isViewMode={isViewMode}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId} instituteId={instituteId}
                        formId="academics"
                        stepId={stepId}
                        sharedField={sharedFieldState}
                    />
                </AccordionItem>
                <AccordionItem>
                    <IdentificationDetails
                        isViewMode={isViewMode}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId} instituteId={instituteId}
                        formId="identification"
                        stepId={stepId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <PastEducation
                        isViewMode={isViewMode}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId} instituteId={instituteId}
                        formId="pastEducation"
                        stepId={stepId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <MedicalInfo
                        isViewMode={isViewMode}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId}
                        instituteId={instituteId}
                        formId="medicalInfo"
                        stepId={stepId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <FacilitiesRequired
                        isViewMode={isViewMode}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId} instituteId={instituteId}
                        formId="facilityRequired"
                        stepId={stepId}
                    />
                </AccordionItem>
            </UncontrolledAccordion>
            {!isViewMode && <div className="tw-grid tw-grid-cols-12 tw-mt-3">
                <div className="tw-col-span-12 tw-text-end tw-mt-2 tw-ml-auto">
                    {/* <button type="submit" className="btn btn-soft-success me-2">
                        Cancel
                    </button> */}
                    <Button disabled={showApiLoader} type="button" onClick={submitHndlr} variant="primary">
                        Next
                    </Button>
                </div>
            </div>}
        </div>
    )
}

export default StudentDetails;