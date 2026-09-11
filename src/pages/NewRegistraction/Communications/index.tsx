import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
//Helper
import { StepperFormContext, stepInfo } from "../helper";

import ResidentialAddress from "./ResidentialAddress";
import PermanentAddress from "./PermanentAddress";
import {
    Button
} from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getCountriesAct } from "../../../store/masterdata/masterdataactions";
import { getBranchAreasAct } from "../../../store/branchsettings/branchinfo/branchinfoactions";
import { TABS_ACTIONS } from "../helper";
import {
    getCommunicationDetailsByIdAct, addCommunicationDetailsAct
} from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";


const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        id: "",
    })
}

const CommunicationDetails: React.FC<any> = ({ stepId, branchId }) => {
    const { tabsData, nextStepHndlr, setTabsDataHandler, studentId, submitCurrentFormCllbck
    } = useContext<any>(StepperFormContext);
    const [residentialAddressInfo, setResidentialAddressInfo] = useState<any>(null);
    const [triggerResidentialKey, setTriggerResidentialKey] = useState("");
    const childFormDataRef = useRef<any>({
        residentialAddress: {
            isValid: false,
            isDirty: false,
            formData: undefined,
        }, permanentAddress: {
            isValid: false,
            isDirty: false,
            formData: undefined
        }
    });
    const multiFormKeysToValidate = useRef(new Set());
    const dispatch = useAppDispatch();

    const { showApiLoader, countriesResp, branchAreasResp, communicationDetailsByIdResp, updateCommunicationDetailsResp } =
        useAppSelector(({ globalData, masterData, branchInfo, admissionRegistration }) => ({
            showApiLoader: globalData.showApiLoader,
            countriesResp: masterData.countriesResp,
            branchAreasResp: branchInfo.branchAreasResp,
            communicationDetailsByIdResp: admissionRegistration.communicationDetailsByIdResp,
            updateCommunicationDetailsResp: admissionRegistration.updateCommunicationDetailsResp,
        }), shallowEqual);

    const communicationRespRef = useRef({
        prevCommunicationDetailsByIdResp: communicationDetailsByIdResp,
        prevUpdateCommunicationDetailsResp: updateCommunicationDetailsResp
    });

    useEffect(() => {
        const { prevCommunicationDetailsByIdResp, prevUpdateCommunicationDetailsResp } = communicationRespRef.current;
        if (communicationDetailsByIdResp && prevCommunicationDetailsByIdResp !== communicationDetailsByIdResp) {
            setTabsDataHandler(stepId, communicationDetailsByIdResp);
        } else if (updateCommunicationDetailsResp && prevUpdateCommunicationDetailsResp !== updateCommunicationDetailsResp) {
            toast.success("Communication details added successfully.");
            nextStepHndlr(stepId, null);
        }
        communicationRespRef.current.prevCommunicationDetailsByIdResp = communicationDetailsByIdResp;
        communicationRespRef.current.prevUpdateCommunicationDetailsResp = updateCommunicationDetailsResp;
    }, [communicationDetailsByIdResp, updateCommunicationDetailsResp]);

    useEffect(() => {
        if (!countriesResp)
            dispatch(getCountriesAct(generateActionPayload("get_countries")));
    }, [countriesResp]);

    useEffect(() => {
        if (branchId) {
            const params = { branchId },
                payload = { pageNo: 0, pageSize: 500 };
            dispatch(getBranchAreasAct(generateActionPayload("get_branch_area", params, payload)));
        }
    }, [branchId]);

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
        if (studentId) {
            const params = { studentRegNo: studentId };
            dispatch(getCommunicationDetailsByIdAct(generateActionPayload("communication_byregNo", params)));
        }
    }, [studentId]);

    function submitCommunicationApiCall() {
        const formDetails: any = childFormDataRef.current;
        const payload: any = Object.keys(formDetails).reduce((obj, item) => {
            Object.assign(obj, formDetails[item]?.formData);
            return obj
        }, {});
        const params = { studentRegNo: studentId };
        dispatch(addCommunicationDetailsAct(generateActionPayload("addcommunication_byregNo", params, payload)));
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
                    submitCommunicationApiCall();
                } else if (!anyFormDirty) {
                    nextStepHndlr(stepId, null);
                }
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isValid = false;
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isDirty = false;
                }
                multiFormKeysToValidate.current.clear();
            }
        }
    }

    function updateResidentialAddressHndlr(addressInfo: any) {
        setResidentialAddressInfo({...addressInfo});
    }

    function getResidentialAddress() {
        setTriggerResidentialKey(nanoid());
    }

    function submitHndlr(e: any) {
        multiFormKeysToValidate.current.clear();
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.NEXT_TAB);
    }

    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["residentialAddress", "permanentAddress"], TABS_ACTIONS.PREVIOUS_TAB);
    }

    return (
        <React.Fragment>
            <UncontrolledAccordion open={["residentialAddress", "permanentAddress"]}
                defaultOpen={["residentialAddress", "permanentAddress"]} stayOpen>
                <AccordionItem>
                    <ResidentialAddress
                        stepId={stepId}
                        formId="residentialAddress"
                        countriesResp={countriesResp}
                        branchAreasResp={branchAreasResp}
                        triggerResidentialKey={triggerResidentialKey}
                        updateResidentialAddress={updateResidentialAddressHndlr}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                        branchId={branchId}
                    />
                </AccordionItem>
                <AccordionItem>
                    <PermanentAddress
                        stepId={stepId}
                        formId="permanentAddress"
                        countriesResp={countriesResp}
                        branchAreasResp={branchAreasResp}
                        getResidentialAddress={getResidentialAddress}
                        residentialAddressInfo={residentialAddressInfo}
                        storeMultiFormDataCallback={storeMultiFormDataCallback}
                    />
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-5">
                <Button
                    type="button"
                    variant="previous"
                    disabled={showApiLoader}
                    onClick={previousBtnHndlr}
                >
                    Previous
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    disabled={showApiLoader}
                    onClick={submitHndlr}
                >
                    Next
                </Button>
            </div>
        </React.Fragment>
    )
}

export default CommunicationDetails;