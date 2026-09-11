import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
//Helper
import { yesNoOptions } from "../helper";
import { StepperFormContext, stepInfo } from "../../helper";

import ResidentialAddress from "./ResidentialAddress";
import PermanentAddress from "./PermanentAddress";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import { getCountriesAct } from "../../../../../../../store/masterdata/masterdataactions";
import { TABS_ACTIONS } from "../../helper";

const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        id: "",
    })
}

export const CommunicationDetails: React.FC<any> = ({ stepId }) => {
    const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();

    const { countriesResp } = useAppSelector(({ masterData }) => ({
        countriesResp: masterData.countriesResp,
    }), shallowEqual);

    const communicationFormDataRef = useRef<any>({
        permanentAddress: {
            isValid: false,
            formData: undefined,
        }, residentialAddress: {
            isValid: false,
            formData: undefined,
        }
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
        if (!countriesResp)
            dispatch(getCountriesAct(generateActionPayload("get_countries")));
    }, [countriesResp]);


    function submitHndlr(e: any) {
        submitCurrentFormCllbck(["residentialAddress", "permanentAddress"], TABS_ACTIONS.NEXT_TAB);
    }
    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["residentialAddress", "permanentAddress"], TABS_ACTIONS.PREVIOUS_TAB);
    }
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="border-bottom">
                        <h5>3. Communication Details</h5>
                    </div>

                </div>
            </div>

            <UncontrolledAccordion open={["residentialAddress", "permanentAddress"]}
            defaultOpen={["residentialAddress", "permanentAddress"]}
            stayOpen>
                <AccordionItem>
                    <ResidentialAddress
                        stepId={stepId}
                        formId="residentialAddress"
                        countriesResp={countriesResp}
                        dispatch={dispatch}
                    />
                </AccordionItem>
                <AccordionItem>
                    <PermanentAddress
                        stepId={stepId}
                        formId="permanentAddress"
                        countriesResp={countriesResp}
                        dispatch={dispatch} />
                </AccordionItem>
            </UncontrolledAccordion>
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
        </React.Fragment>
    )
}