import React, { useState, useEffect, useContext } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput, RadioInputContainer } from "../../../../../Components/Common";
//Helper
import { yesNoOptions } from "../helper";
import { StepperFormContext } from "../../helper";

import ResidentialAddress from "./ResidentialAddress";
import PermanentAddress from "./PermanentAddress";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getCountriesAct } from "../../../../../store/masterdata/masterdataactions";
import { TABS_ACTIONS } from "../../helper";
import Button from "../../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        id: "",
    })
}

export const CommunicationDetails: React.FC<any> = (props) => {
    const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();

    const { countriesResp } = useAppSelector(({ masterData }) => ({
        countriesResp: masterData.countriesResp,
    }), shallowEqual);

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
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12 tw-mb-3">
                    <div className="tw-border-b tw-pb-2">
                        <h5 className="tw-text-lg tw-font-semibold">
                            4. Communication Details
                        </h5>
                    </div>
                </div>
            </div>

            <UncontrolledAccordion open="residential" defaultOpen={["residential", "permanent"]} stayOpen>
                <AccordionItem>
                    <ResidentialAddress countriesResp={countriesResp}
                        dispatch={dispatch}
                    />
                </AccordionItem>
                <AccordionItem>
                    <PermanentAddress countriesResp={countriesResp} dispatch={dispatch} />
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="tw-grid tw-grid-cols-12 tw-mt-3">
                <div className="tw-col-span-12 tw-mt-2 tw-text-right">
                    <Button
                        type="button"
                        onClick={previousBtnHndlr}
                        variant="secondary"
                    >
                        Previous
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={submitHndlr}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
}