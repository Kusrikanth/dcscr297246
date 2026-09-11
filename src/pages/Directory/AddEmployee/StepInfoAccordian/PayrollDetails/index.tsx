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
import BankDetails from "./BankDetails";
import SalaryDetails from "./SalaryDetails";
import { TABS_ACTIONS } from "../../helper";
import Button from "../../../../../Components/Common/Button";


export const PayrollDetails: React.FC<any> = ({ instituteId, branchId }) => {
    const { submitCurrentFormCllbck, previousStepHndlr } = useContext<any>(StepperFormContext);

    function submitHndlr(e: any) {
        submitCurrentFormCllbck(["employeeBankDetails", "employeeSalaryDetails"], TABS_ACTIONS.NEXT_TAB);
    }

    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["employeeBankDetails", "employeeSalaryDetails"], TABS_ACTIONS.PREVIOUS_TAB);
    }

    return (
        <div>
            <div className="tw-mb-6">
                <div className="tw-border-b">
                    <span className="tw-block tw-text-base tw-font-semibold tw-mb-2">
                        3. Payroll Details
                    </span>
                </div>
            </div>
            <UncontrolledAccordion open="personal-details" defaultOpen={["bank-details",
                "salary-details"]} stayOpen>
                <AccordionItem>
                    <BankDetails instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
                <AccordionItem>
                    <SalaryDetails instituteId={instituteId} branchId={branchId} />
                </AccordionItem>
            </UncontrolledAccordion>

            <div className="tw-mt-6 tw-flex tw-justify-end tw-gap-3">
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
    )
}