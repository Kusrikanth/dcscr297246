import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { FormikProvider, useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import StudentImgIcon from "../../../../../../../../assets/imagesdps/directory/user-img.png";


//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
} from "../../../../../../../Components/Common";

import { StepperFormContext, stepInfo } from "../../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct
} from "../../../../../../../store/masterdata/masterdataactions";
import {
    registerStudentAct, getRegisterStudentByIdAct, updateRegisterStudentAct
} from "../../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import Select from "react-select";
import { TABS_ACTIONS } from "../../helper";
import { toast } from "react-toastify";
import { generateApiUrl } from "../../../../../../../api/apihelper";
import BasicDetails from "./BasicDetails";
import AcademicDetails from "./AcademicDetails";
import IdentificationDetails from "./IdentificationDetails";
import PastEducation from "./PastEducation";
import MedicalInfo from "./MedicalInfo";
import FacilitiesRequired from "./FacilitiesRequired";


export const StudentInfo: React.FC<any> = ({ stepId, branchId, instituteId }) => {
    const { studentId, tabsData, setStudentIdHndlr, nextStepHndlr, submitCurrentFormCllbck, setTabsDataHandler } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();
    const { registerStudentResp, updateRegisterStudentResp, registerStudentByIdResp } =
        useAppSelector(({ admissionRegistration }) => ({
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
            toast.success("Student registered successfully.");
            const { registrationId } = registerStudentResp;
            setStudentIdHndlr(registrationId);
            nextStepHndlr();
        } else if (updateRegisterStudentResp && prevUpdateRegisterStudentResp !== updateRegisterStudentResp) {
            toast.success("Student updated successfully.");
            nextStepHndlr();
        } else if (registerStudentByIdResp && prevRegisterStudentByIdResp !== registerStudentByIdResp) {
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
            formData: undefined,
        }, academics: {
            isValid: false,
            formData: undefined
        }, identification: {
            isValid: false,
            formData: undefined
        },
        pastEducation: {
            isValid: false,
            formData: undefined
        }, medicalInfo: {
            isValid: false,
            formData: undefined
        }, facilityRequired: {
            isValid: false,
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
        const payload = Object.keys(formDetails).reduce((obj, item) => {
            Object.assign(obj, formDetails[item]?.formData);
            return obj
        }, {});
        if (studentId) {
            const params = { studentId };
            dispatch(updateRegisterStudentAct(generateActionPayload("update_register_student", params, payload)));
        } else {
            dispatch(registerStudentAct(generateActionPayload("register_student", undefined, payload)));
        }
    }

    function storeMultiFormDataCallback(multiFormKey: string, isValid: boolean, formData: any) {
        if (Array.isArray(currentStepMultiFormKeys) && childFormDataRef.current[multiFormKey]) {
            let allFormsValid: boolean = true;
            childFormDataRef.current[multiFormKey] = {
                isValid,
                formData
            }
            multiFormKeysToValidate.current.add(multiFormKey);
            if (multiFormKeysToValidate.current.size === currentStepMultiFormKeys.length) {
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    if (allFormsValid && !childFormDataRef.current[currentStepMultiFormKeys[i]].isValid) {
                        allFormsValid = false;
                        break;
                    }
                }
                if (allFormsValid) {
                    submitAddStudentInfoApiCall();
                }
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isValid = false;
                }
                multiFormKeysToValidate.current.clear();
            }
        }
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
                        branchId={branchId}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        formId="basicInfo"
                        stepId={stepId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <AcademicDetails
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId} instituteId={instituteId}
                        formId="academics"
                        stepId={stepId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <IdentificationDetails
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId} instituteId={instituteId}
                        formId="identification"
                        stepId={stepId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <PastEducation
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId} instituteId={instituteId}
                        formId="pastEducation"
                        stepId={stepId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <MedicalInfo
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId}
                        instituteId={instituteId}
                        formId="medicalInfo"
                        stepId={stepId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <FacilitiesRequired
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId} instituteId={instituteId}
                        formId="facilityRequired"
                        stepId={stepId}
                    />
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="row mt-3">
                <div className="col-12 text-end mt-2">
                    {/* <button type="submit" className="btn btn-soft-success me-2">
                        Cancel
                    </button> */}
                    <button type="button" onClick={submitHndlr} className="btn btn-success">
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}