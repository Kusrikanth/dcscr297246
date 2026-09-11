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
import Select from "react-select";
import PersonalDetails from "./PersonalDetails";
import EductionDetails from "./EducationDetails";
import ContactDetails from "./ContactDetails";
import DependencyDetails from "./DependencyDetails";
import EmergencyContacts from "./EmergencyContacts";
import MarriageInfo from "./MarriageInfo";
import { TABS_ACTIONS } from "../../helper";
import Button from "../../../../../Components/Common/Button";

export const BasicInfo: React.FC<any> = ({ instituteId, branchId }) => {
    const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);

    function submitHndlr(e: any) {
        submitCurrentFormCllbck(["employeeBasicDetails", "employeeEducationDetails",
            "employeeContactDetails", "employeeDependentDetails", "employeeEmergencyDetails", "employeeMarriageInfo"], TABS_ACTIONS.NEXT_TAB);
    }

    return (
        <div>
            <div className="tw-w-full tw-mb-3">
                <div className="tw-border-b">
                    <span className="tw-text-base tw-font-bold tw-block tw-mb-2">
                        1. Basic Info
                    </span>
                </div>
            </div>

            <UncontrolledAccordion
                open="personal-details"
                defaultOpen={[
                    "personal-details",
                    "education",
                    "contact-details",
                    "dependent-details",
                    "emergency-details",
                    "marriage-info",
                ]}
                stayOpen
            >
                <AccordionItem>
                    <PersonalDetails instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
                <AccordionItem>
                    <EductionDetails instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
                <AccordionItem>
                    <ContactDetails instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
                <AccordionItem>
                    <DependencyDetails instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
                <AccordionItem>
                    <EmergencyContacts instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
                <AccordionItem>
                    <MarriageInfo instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
            </UncontrolledAccordion>

            <div className="tw-mt-3">
                <div className="tw-w-full tw-flex tw-justify-end tw-mt-2">
                    {/* Cancel Button (Optional) */}
                    {/*
                        <button
                            type="submit"
                            className="tw-bg-green-100 tw-text-green-600 tw-px-4 tw-py-2 tw-rounded-lg tw-mr-2"
                        >
                            Cancel
                        </button>
                        */}

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