import React, { useState, useContext, useEffect } from "react";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { StepperFormContext } from "../../helper";
// import BasicDetails from "./BasicDetails";
// import AcademicDetails from "./AcademicDetails";
// import IdentificationDetails from "./IdentificationDetails";
// import PastEducation from "./PastEducation";
// import MedicalInfo from "./MedicalInfo";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct
} from "../../../../../store/masterdata/masterdataactions";
import CurrentJob from "./CurrentJob";
import DesignationDetails from "./DesignationDetails";
import PreviousExperience from "./PreviousExperience";
import { TABS_ACTIONS } from "../../helper";
import Button from "../../../../../Components/Common/Button";


export const JobDetails: React.FC<any> = ({ instituteId, branchId }) => {
    const { previousStepHndlr, submitCurrentFormCllbck } = useContext<any>(StepperFormContext);

    function submitHndlr(e: any) {
        submitCurrentFormCllbck(["employeeCurrentJob", "employeeDesignationDetails", "employeePastExperience"], TABS_ACTIONS.NEXT_TAB);
    }

    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["employeeCurrentJob", "employeeDesignationDetails", "employeePastExperience"], TABS_ACTIONS.PREVIOUS_TAB);
    }

    return (
        <div>
            <div className="tw-w-full tw-mb-3">
                <div className="tw-border-b">
                    <span className="tw-text-base tw-font-bold tw-block tw-mb-2">
                        2. Job Details
                    </span>
                </div>
            </div>
            <UncontrolledAccordion open="current-job" defaultOpen={["current-job",
                "designation-details", "previous-experience"]} stayOpen>
                <AccordionItem>
                    <CurrentJob instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
                <AccordionItem>
                    <DesignationDetails instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
                <AccordionItem>
                    <PreviousExperience instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
            </UncontrolledAccordion>

            <div className="tw-mt-3">
                <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-2">
                    <Button
                        type="button"
                        onClick={previousBtnHndlr}
                        variant="secondary"
                    >
                        Previous
                    </Button>
                    <Button
                        type="button"
                        onClick={submitHndlr}
                        variant="primary"
                    >
                        Next
                    </Button>

                </div>
            </div>
        </div>
    )
}