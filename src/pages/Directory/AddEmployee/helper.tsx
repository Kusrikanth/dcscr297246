import React from "react";
//Icons
import { default as StudentIconSvg } from "../../../assets/imagesdps/directory/icons/student_info_icon.svg?react";
import { default as ParentsIconSvg } from "../../../assets/imagesdps/directory/icons/parents_icon.svg?react";
import { default as CommunicationIconSvg } from "../../../assets/imagesdps/directory/icons/communication_icon.svg?react";
import { default as BasicInfo } from "../../../assets/imagesdps/directory/icons/basic_info.svg?react";
import { default as JobInfo } from "../../../assets/imagesdps/directory/icons/job_info.svg?react";
import { default as Document } from "../../../assets/imagesdps/directory/icons/document.svg?react";
import { default as DocumentIconSvg } from "../../../assets/imagesdps/directory/icons/document_viewer_icon.svg?react";
import { default as UploadPhotoIconSvg } from "../../../assets/imagesdps/directory/icons/upload_photo_icon.svg?react";

export const stepInfo = [{
    id: "basic_details",
    title: "Basic Info",
    iconImage: <BasicInfo/>,
    multiFormKeys: ["employeeBasicDetails", "employeeEducationDetails",
        "employeeContactDetails", "employeeDependentDetails", "employeeEmergencyDetails", "employeeMarriageInfo"]
}, {
    id: "job_details",
    title: "Job Details",
    iconImage: <JobInfo />,
    multiFormKeys: ["employeeCurrentJob", "employeeDesignationDetails", "employeePastExperience"]
}, {
    id: "salary_details",
    title: "Salary Details",
    iconImage: <CommunicationIconSvg />,
    multiFormKeys: ["employeeBankDetails", "employeeSalaryDetails"]
}
    ,
//  {
//     id: "tds_details",
//     title: "TDS Details",
//     iconImage: <DocumentIconSvg />,
// }, 
{
    id: "photo_document",
    title: "Photo & Document",
    iconImage: <Document />,
    multiFormKeys: ["employeeDocumentList"]
}]

export const StepperFormContext: any = React.createContext<any>(null);

export function addEmployeePayload(sectionFormsData: any, instituteId: any, branchId: any, formSectionSaveKey?: any) {
    let payload: any = {};
    const { employeeBasicDetails,
        employeeEducationDetails, employeeContactDetails
        , employeeDependentDetails, employeeMarriageInfo, employeeCurrentJob,
        employeeDesignationDetails, employeeEmergencyDetails, employeePastExperience, employeeBankDetails,
        employeeSalaryDetails,
        studentDocumentsDetails
    } = sectionFormsData || {},
        { employeeImage, fullImageBase64, ...otherDetails } = employeeBasicDetails?.formData || {},
        { reportingCurriculum, reportingClassDivision, ...otherDesignationDetails } = employeeDesignationDetails?.formData || {};

    const formData = new FormData();
    payload = {
        employeeBasicDetails: otherDetails,
        employeeEducationDetails: employeeEducationDetails?.formData || undefined,
        employeeContactDetails: employeeContactDetails?.formData || undefined,
        employeeDependentDetails: employeeDependentDetails?.formData || undefined,
        employeeEmergencyDetails: employeeEmergencyDetails?.formData || undefined,
        employeeMarriageInfo: employeeMarriageInfo?.formData || undefined,
        employeeCurrentJob: employeeCurrentJob?.formData || undefined,
        employeeDesignationDetails: otherDesignationDetails || undefined,
        employeePastExperience: employeePastExperience?.formData || undefined,
        employeeBankDetails: employeeBankDetails?.formData || undefined,
        employeeSalaryDetails: employeeSalaryDetails?.formData || undefined,
        directorySaveFlow: formSectionSaveKey ? Object.values(formSectionSaveKey) : []
    }
    payload.instituteId = instituteId;
    if (branchId) {
        payload.branchId = branchId;
    }
    if (employeeImage) {
        formData.append("employeeImage", employeeImage);
    }
    formData.append("employeeRequest", JSON.stringify(payload));
    return formData
}

export enum TABS_ACTIONS {
    NEXT_TAB = "NEXT_TAB",
    PREVIOUS_TAB = "PREVIOUS_TAB",
    PARTICULAR_TAB = "PARTICULAR_TAB",
    SUBMIT_TAB = "SUBMIT_TAB"
}

export const formSectionSaveKey = {
    employeeProfile: "BASIC_INFO",
    educationDetails: "EDUCATION",
    contactDetails: "CONTACT_DETAILS",
    dependenciesDetails: "DEPENDENCIES",
    emergencyContactDetails: "EMERGENCY_CONTACTS",
    marriageDetails: "MARRIAGE_INFO",
    currentJobDetails: "CURRENT_JOB",
    designationDetails: "DESIGNATION_DETAILS",
    previousExperienceDetails: "PREVIOUS_EXPERIENCE",
    bankDetails: "BANK_DETAILS",
    salaryDetails: "SALARY_DETAILS",
}

