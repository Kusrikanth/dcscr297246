import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import UploadDocuments from "./UploadDocument";
import AcademicDetails from "./AcademicDetails";
//Helper
import { StepperFormContext, stepInfo } from "../helper";
import { Button } from "../../../Components/Common";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getCountriesAct } from "../../../store/masterdata/masterdataactions";
import { TABS_ACTIONS } from "../helper";
import {
    addAcademicResultsAct
} from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";

const validationSchema = Yup.object().shape({

});

export const Documents: React.FC<any> = ({ stepId, instituteId, branchId }) => {
    const { studentId, nextStepHndlr, isResubmission = false, submitCurrentFormCllbck, setTabsDataHandler } = useContext<any>(StepperFormContext);
    const multiFormKeysToValidate = useRef(new Set());
    const childFormDataRef = useRef<any>({
        uploadDocument: {
            isValid: false,
            isDirty: false,
            formData: undefined,
        }, academicDetails: {
            isValid: false,
            isDirty: true,
            formData: undefined,
        }
    });
    const dispatch = useDispatch();
    const { showApiLoader, addAcademicResultResp } =
        useAppSelector(({ globalData, admissionRegistration }) => ({
            showApiLoader: globalData.showApiLoader,
            addAcademicResultResp: admissionRegistration.addAcademicResultResp,
        }), shallowEqual);
    const documentsRespRef = useRef({
        prevAddAcademicResultResp: addAcademicResultResp
    });

    const currentStepMultiFormKeys = useMemo(() => {
        if (stepId) {
            const { multiFormKeys } = stepInfo.find(item => item.id === stepId) || {};
            if (Array.isArray(multiFormKeys) && !isResubmission) {
                return multiFormKeys;
            }
            return multiFormKeys?.filter(item => item === 'uploadDocument');
        }
        return [];
    }, [stepId, isResubmission]);

    useEffect(() => {
        const { prevAddAcademicResultResp } = documentsRespRef.current;
        if (addAcademicResultResp && prevAddAcademicResultResp !== addAcademicResultResp) {
            const { academicDetails } = childFormDataRef.current,
                { formData } = academicDetails || {};
            toast.success("Academic result updated successfully.");
            nextStepHndlr(stepId, null);
        }
        documentsRespRef.current.prevAddAcademicResultResp = addAcademicResultResp;
    }, [addAcademicResultResp]);

    function submitHndlr(e: any) {
        multiFormKeysToValidate.current.clear();
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.NEXT_TAB);
    }

    function previousBtnHndlr(e: any) {
        multiFormKeysToValidate.current.clear();
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.PREVIOUS_TAB);
    }

    function submitDocumentApiCall() {
        const { academicDetails } = childFormDataRef.current,
            { formData } = academicDetails || {};
        multiFormKeysToValidate.current.clear();
        const params = { studentId };
        dispatch(addAcademicResultsAct(generateActionPayload("add_academic_results", params, formData)));
    }

    const storeMultiFormDataCallback = useCallback((multiFormKey: string, isValid: boolean, isDirty: boolean, formData: any) => {
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
                if (isResubmission || !anyFormDirty) {
                    nextStepHndlr(stepId, null);
                } else if (allFormsValid && anyFormDirty) {
                    submitDocumentApiCall();
                }
                multiFormKeysToValidate.current.clear();
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isValid = false;
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isDirty = false;
                }
            }
        }
    }, [currentStepMultiFormKeys, isResubmission]);

    return (
        <React.Fragment>
            <UncontrolledAccordion open={["uploadDocument", "academicDetails"]}
                defaultOpen={["uploadDocument", "academicDetails"]} stayOpen>
                <AccordionItem>
                    <UploadDocuments
                        stepId={stepId}
                        formId="uploadDocument"
                        dispatch={dispatch}
                        instituteId={instituteId}
                        branchId={branchId}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                    />
                </AccordionItem>
                {!isResubmission && <AccordionItem>
                    <AcademicDetails
                        stepId={stepId}
                        branchId={branchId}
                        instituteId={instituteId}
                        formId="academicDetails"
                        dispatch={dispatch}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                    />
                </AccordionItem>}
            </UncontrolledAccordion>
            <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-5">
                {!isResubmission && (
                    <Button
                        type="button"
                        variant="previous"
                        disabled={showApiLoader}
                        onClick={previousBtnHndlr}
                    >
                        Previous
                    </Button>
                )}
                <Button
                    type="button"
                    variant="primary"
                    disabled={showApiLoader}
                    onClick={submitHndlr}
                >
                    Next
                </Button>
            </div>
        </React.Fragment >
    )
}

export default Documents;