import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import Declaration from "./Declaration";
import Undertaking from "./Undertaking";
//Helper
import { StepperFormContext, stepInfo } from "../helper";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getCountriesAct } from "../../../store/masterdata/masterdataactions";
import { TABS_ACTIONS } from "../helper";
import { submitRegistrationAct } from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import {
    Button
} from "../../../Components/Common";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";

const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        id: "",
    })
}


const Submissions: React.FC<any> = ({ stepId, branchId, instituteId }) => {
    const { studentId, tabsData, setStudentIdHndlr, nextStepHndlr, submitCurrentFormCllbck, setTabsDataHandler } = useContext<any>(StepperFormContext);
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
        declaration: {
            isValid: false,
            formData: undefined,
        },
        undertaking: {
            isValid: false,
            formData: undefined,
        }
    });
    const multiFormKeysToValidate = useRef(new Set());
    const dispatch = useAppDispatch();

    const { showApiLoader, branchListResp, submitRegistrationResp } =
        useAppSelector(({ globalData, branch, admissionRegistration }) => ({
            showApiLoader: globalData.showApiLoader,
            branchListResp: branch.branchListResp,
            submitRegistrationResp: admissionRegistration.submitRegistrationResp,
        }), shallowEqual);

    const submissionRespRef = useRef({
        prevSubmitRegistrationResp: submitRegistrationResp,
    });
    const history = useHistory();

    useEffect(() => {
        const { prevSubmitRegistrationResp } = submissionRespRef.current;
        if (submitRegistrationResp && prevSubmitRegistrationResp !== submitRegistrationResp) {
            toast.success("Registration updated successfully.");
            const { studentProfile } = tabsData || {},
                { branchEmail, schoolName } = submitRegistrationResp || {},
                { regNo, registrationId } = studentProfile || {};
            history.replace(`/thank-you-page`, {
                registrationId,
                registrationNo: regNo,
                branchEmail: branchEmail,
                schoolName
            });
        }
        submissionRespRef.current.prevSubmitRegistrationResp = submitRegistrationResp;
    }, [submitRegistrationResp]);

    useEffect(() => {
        if (instituteId) {
            const payload = { pageSize: 100, pageNo: 0, instituteId };
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload, { hideLoader: true })));
        }
    }, [instituteId]);


    const { branchName, schoolName } = useMemo<any>(() => {
        if (!Array.isArray(branchListResp?.data)) {
            return {};
        }
        return branchListResp?.data?.find(item => item.branchId === branchId) || {};
    }, [branchId, branchListResp]);



    function submitHndlr(e: any) {
        multiFormKeysToValidate.current.clear();
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.NEXT_TAB);
    }


    function submitRegistrationFormApiCall() {
        const formDetails: any = childFormDataRef.current;
        const payload: any = Object.keys(formDetails).reduce((obj, item) => {
            Object.assign(obj, formDetails[item]?.formData);
            return obj
        }, {});
        const params = { studentRegNo: studentId },
            updatedPaylaod = {
                relationshipWithStudent: payload?.relationshipWithStudent,
                relationshipWithStudentSignature: payload?.relationshipWithStudentSignature,
                scheduleMode: payload?.scheduleMode,
                isOTPVerified: payload?.isOTPVerified,
            }
        dispatch(submitRegistrationAct(generateActionPayload("submit_registrationform", params, updatedPaylaod)));
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
                    submitRegistrationFormApiCall();
                }
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isValid = false;
                }
                multiFormKeysToValidate.current.clear();
            }
        }
    }

    function previousBtnHndlr(e: any) {
        multiFormKeysToValidate.current.clear();
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.PREVIOUS_TAB);
    }

    return (
        <UncontrolledAccordion open={["declaration", "undertaking"]}
            defaultOpen={["declaration", "undertaking"]} stayOpen>
            <AccordionItem>
                <Declaration
                    stepId={stepId}
                    branchId={branchId}
                    branchName={branchName}
                    formId="declaration"
                    storeMultiFormDataCallback={storeMultiFormDataCallback}
                />
            </AccordionItem>
            <AccordionItem>
                <Undertaking
                    stepId={stepId}
                    branchName={branchName}
                    branchId={branchId}
                    schoolName={schoolName}
                    formId="undertaking"
                    storeMultiFormDataCallback={storeMultiFormDataCallback}
                />
            </AccordionItem>
            <p className="tw-text-primary tw-font-bold tw-px-3">
                Note : Registration does not imply admission. Admission is subject to the availability of seats and eligibility criteria. There would be no refund of the application/registration fee in case the application is not processed
            </p>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-3">
                <div className="tw-col-span-12 tw-text-end tw-mt-2">
                    <Button
                        disabled={showApiLoader}
                        type="button"
                        variant="previous"
                        onClick={previousBtnHndlr}
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={showApiLoader}
                        type="button"
                        variant="primary"
                        onClick={submitHndlr}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </UncontrolledAccordion>
    )
}

export default Submissions;