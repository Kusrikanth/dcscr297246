import React from "react";
import { default as ReportIconSvg } from "../../../../assets/imagesdps/directory/registration-icons/student_profile.svg?react";
import { default as AssessmentIconSvg } from "../../../../assets/imagesdps/directory/registration-icons/sibling_details.svg?react";
import { default as SummaryIconSvg } from "../../../../assets/imagesdps/directory/registration-icons/parent_details.svg?react";
import { default as CommunicationDetailsIconSvg } from "../../../../assets/imagesdps/directory/registration-icons/communication_details.svg?react";

export const stepInfo = [{
    id: "generalInformation",
    title: "General Information",
    iconImage: <ReportIconSvg />,
    isFilled: false,
    isDisabled: false,
    multiFormKeys: ["studentInfo", "basicDetails", "contactInfo"]
}, {
    id: "studentSurroundings",
    title: "Student Surroundings",
    isFilled: false,
    isDisabled: false,
    iconImage: <AssessmentIconSvg />,
    multiFormKeys: ["familyInfo", "environment", "supportSystem"]
}, {
    id: "domainAssessment",
    title: "Domain Assessment",
    isFilled: false,
    isDisabled: false,
    iconImage: <CommunicationDetailsIconSvg />,
    multiFormKeys: ["academicDomain", "socialDomain", "emotionalDomain"]
}, {
    id: "summary",
    title: "Summary",
    isFilled: false,
    isDisabled: false,
    iconImage: <SummaryIconSvg />,
    multiFormKeys: ["reportSummary", "keyFindings", "recommendations"]
},
];

export const StepperFormContext = React.createContext<any>(null);

export enum TABS_ACTIONS {
    NEXT_TAB = "NEXT_TAB",
    PREVIOUS_TAB = "PREVIOUS_TAB",
    PARTICULAR_TAB = "PARTICULAR_TAB",
    SUBMIT_TAB = "SUBMIT_TAB"
}

