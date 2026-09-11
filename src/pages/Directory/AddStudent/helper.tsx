
import React from "react";
//Icons
import { default as StudentIconSvg } from "../../../assets/imagesdps/directory/step-icons/student_profile.svg?react";
import { default as SiblingDetailsIconSvg } from "../../../assets/imagesdps/directory/step-icons/sibling_details.svg?react";

import { default as ParentDetailsIconSvg } from "../../../assets/imagesdps/directory/step-icons/parent_details.svg?react";
import { default as CommunicationDetailsIconSvg } from "../../../assets/imagesdps/directory/step-icons/communication_details.svg?react";
import { default as DocumentIconSvg } from "../../../assets/imagesdps/directory/step-icons/documents.svg?react";
//Utility
import { getValidMobileNumber } from "../../../utility/commonutility";

export const formSectionSaveKey = {
    studentProfile: "STUDENT_PROFILE",
    academicDetails: "ACADEMIC_DETAILS",
    identification: "IDENTIFICATION",
    pastEducation: "PAST_EDUCATION",
    medicalInfo: "MEDICAL_INFO",
    parentFather: "PARENT_FATHER",
    parentMother: "PARENT_MOTHER",
    parentGuardian: "PARENT_GUARDIAN",
    communicationDetails: "COMMUNICATION_DETAILS",
    permanentAddressDetails: "PERMANENT_ADDRESS_DETAILS",
    siblingDetails: "SIBLING_DETAILS"
};

export const stepInfo = [{
    id: "student_info",
    title: "Student Info",
    iconImage: <StudentIconSvg />,
    multiFormKeys: ["studentDetails", "studentAcademicDetails", "identificationDetail", "pastEducation", "medicalInfo"]
}, {
    id: "sibling_details",
    title: "Sibling Details",
    iconImage: <SiblingDetailsIconSvg />,
    multiFormKeys: ["studentSiblingDetails"]
}, {
    id: "parents_details",
    title: "Parents Details",
    iconImage: <ParentDetailsIconSvg />,
    multiFormKeys: ["fatherDetails", "motherDetails", "guardianDetails"]
}, {
    id: "communication_details",
    title: "Communication Details",
    iconImage: <CommunicationDetailsIconSvg />,
    multiFormKeys: ["permanentAddress", "residentialAddress"]
}, {
    id: "documents",
    title: "Documents",
    iconImage: <DocumentIconSvg />,
    multiFormKeys: ["studentDocumentsDetails"]
}
    // {
    //     id: "upload_photo",
    //     title: "Upload Photo",
    //     iconImage: UploadPhotoIconSvg,
    // }
]

export const breadcrumbOptions = [
    {
        id: "directory",
        redirectUrl: "/#",
        breadcrumbLabel: "Directory"
    },
    {
        id: "student-management",
        redirectUrl: "/student-management",
        breadcrumbLabel: "Student Management"
    }
]

export function addStudentPayload(sectionFormsData: any, instituteId: any, branchId: any) {
    let payload: any = {};
    const { studentDetails,
        studentAcademicDetails, identificationDetail
        , pastEducation, medicalInfo, studentSiblingDetails,
        fatherDetails, motherDetails, guardianDetails,
        residentialAddress, permanentAddress,
        studentDocumentsDetails
    } = sectionFormsData || {},
    { studentImage, studentImageBase64, fullImageUrlId, ...otherStudentDetails } = studentDetails?.formData || {}, 
    {  houseId, ...otherAcademicDetails } = studentAcademicDetails?.formData || {},
    { fatherImage, fatherImageBase64, ...otherFatherDetails } = fatherDetails?.formData || {},
    { motherImage, motherImageBase64, ...otherMotherDetails } = motherDetails?.formData || {},
    { guardianImage, isGuardianRequired, guardianImageBase64, ...otherGuardianDetails } = guardianDetails?.formData || {};

    const sectionKeyToEnum: Record<string, string> = {
        studentDetails: formSectionSaveKey.studentProfile,
        studentAcademicDetails: formSectionSaveKey.academicDetails,
        identificationDetail: formSectionSaveKey.identification,
        pastEducation: formSectionSaveKey.pastEducation,
        medicalInfo: formSectionSaveKey.medicalInfo,
        studentSiblingDetails: formSectionSaveKey.siblingDetails,
        fatherDetails: formSectionSaveKey.parentFather,
        motherDetails: formSectionSaveKey.parentMother,
        guardianDetails: formSectionSaveKey.parentGuardian,
        residentialAddress: formSectionSaveKey.communicationDetails,
        permanentAddress: formSectionSaveKey.permanentAddressDetails,
    };

    const directorySaveFlow: string[] = [];
    Object.entries(sectionKeyToEnum).forEach(([formKey, enumValue]) => {
        if (sectionFormsData[formKey]?.formData) {
            directorySaveFlow.push(enumValue);
        }
    });


    const formData = new FormData();
    payload = {
        studentDetails: {
            ...otherStudentDetails, houseId, studentAcademicDetail: otherAcademicDetails,
            ...identificationDetail?.formData, ...pastEducation?.formData, ...medicalInfo?.formData
        },
        studentSiblingDetails: studentSiblingDetails?.formData,
        studentParentDetails: {
            ...otherFatherDetails, singleParentType: "Father", ...otherMotherDetails, ...otherGuardianDetails
        },
        studentCommunicationDetailDto: { ...residentialAddress?.formData, ...permanentAddress?.formData },
        directorySaveFlow
    };
    // const documentTypesList: any = [];
    // if (Array.isArray(studentDocumentsDetails?.formData)) {
    //     studentDocumentsDetails.formData.forEach((item: any, index: number) => {
    //         const { id, fileKeyName, uploadedFile } = item;
    //         if (uploadedFile) {
    //             documentTypesList.push({
    //                 typeId: id
    //             })
    //             formData.append(fileKeyName, uploadedFile);
    //         }
    //     })
    // }
    payload.instituteId = instituteId;
    payload.branchId = branchId;
    // payload.studentDocumentsDetails = documentTypesList;

    // formData.append("studentImage", studentImage);
    // formData.appendp("fatherImage", studentImage);
    // formData.append("motherImage", studentImage);
    // formData.append("guardianImage", studentImage);
    // formData.append("bonafideCertificate", studentImage);
    // formData.append("addressProof", studentImage);
    // formData.append("ageProof", studentImage);
    // formData.append("reportCard", studentImage);
    // formData.append("idProof", studentImage);
    formData.append("studentRequest", JSON.stringify(payload));
    return formData;
}
export const StepperFormContext: any = React.createContext<any>(null);

export function getFatherDetails(studentParentDetails: any) {
    if (Array.isArray(studentParentDetails)) {
        const fatherIndexOf = studentParentDetails.findIndex(item => item.relationType === "Father");
        if (fatherIndexOf >= 0) {
            return {
                // id: studentParentDetails[fatherIndexOf]?.id,
                fatherName: studentParentDetails[fatherIndexOf]?.name,
                fatherNationalityId: studentParentDetails[fatherIndexOf]?.nationalityId,
                fatherEmailId: studentParentDetails[fatherIndexOf]?.emailId,
                fatherContactNo: getValidMobileNumber(studentParentDetails[fatherIndexOf]?.contactNo),
                isFatherEmployee: studentParentDetails[fatherIndexOf]?.isEmployee,
                fatherEmployeeId: studentParentDetails[fatherIndexOf]?.employeeId,
                fatherQualificationId: studentParentDetails[fatherIndexOf]?.qualificationId,
                fatherOccupationId: studentParentDetails[fatherIndexOf]?.occupationId,
                fatherOrganizationName: studentParentDetails[fatherIndexOf]?.organizationName,
                fatherDesignationId: studentParentDetails[fatherIndexOf]?.designationId,
                fatherIncomeId: studentParentDetails[fatherIndexOf]?.incomeId,
                fatherOfficeAddress: studentParentDetails[fatherIndexOf]?.officeAddress,
                fatherDocumentType: studentParentDetails[fatherIndexOf]?.documentType,
                fatherDocumentNumber: studentParentDetails[fatherIndexOf]?.documentNumber,
                isSingleParent: studentParentDetails[fatherIndexOf]?.isSingleParent,
                fatherImageBase64: studentParentDetails[fatherIndexOf]?.imageBase64,
                fatherEmployeeCode: studentParentDetails[fatherIndexOf]?.employeeCode,
            };
        }
        return undefined;
    }
    return undefined;
}

export function getMotherDetails(studentParentDetails: any) {
    if (Array.isArray(studentParentDetails)) {
        const motherDetailIndex = studentParentDetails.findIndex(item => item.relationType === "Mother");
        if (motherDetailIndex >= 0) {
            return ({
                // id: studentParentDetails[motherDetailIndex]?.id,
                motherName: studentParentDetails[motherDetailIndex]?.name,
                motherNationalityId: studentParentDetails[motherDetailIndex]?.nationalityId,
                motherEmailId: studentParentDetails[motherDetailIndex]?.emailId,
                motherContactNo: getValidMobileNumber(studentParentDetails[motherDetailIndex]?.contactNo),
                motherEmployeeId: studentParentDetails[motherDetailIndex]?.employeeId,
                isMotherEmployee: studentParentDetails[motherDetailIndex]?.isEmployee ? "true" : "false",
                motherQualificationId: studentParentDetails[motherDetailIndex]?.qualificationId,
                motherOccupationId: studentParentDetails[motherDetailIndex]?.occupationId,
                motherOrganizationName: studentParentDetails[motherDetailIndex]?.organizationName,
                motherDesignationId: studentParentDetails[motherDetailIndex]?.designationId,
                motherIncomeId: studentParentDetails[motherDetailIndex]?.incomeId,
                motherOfficeAddress: studentParentDetails[motherDetailIndex]?.officeAddress,
                motherDocumentType: studentParentDetails[motherDetailIndex]?.documentType,
                motherDocumentNumber: studentParentDetails[motherDetailIndex]?.documentNumber,
                isSingleParent: studentParentDetails[motherDetailIndex]?.isSingleParent,
                motherImageBase64: studentParentDetails[motherDetailIndex]?.imageBase64,
                motherEmployeeCode: studentParentDetails[motherDetailIndex]?.employeeCode,
            })
        }
        return undefined;
    }
    return undefined;
}

export function getGuardianDetails(studentParentDetails: any) {
    if (Array.isArray(studentParentDetails)) {
        const GuardianDetailIndex = studentParentDetails.findIndex(item => item.relationType === "Guardian");
        if (GuardianDetailIndex >= 0) {
            return ({
                // id: studentParentDetails[GuardianDetailIndex]?.id,
                guardianName: studentParentDetails[GuardianDetailIndex]?.name,
                guardianDocumentType: studentParentDetails[GuardianDetailIndex]?.documentType,
                guardianDocumentNumber: studentParentDetails[GuardianDetailIndex]?.documentNumber,
                guardianEmailId: studentParentDetails[GuardianDetailIndex]?.emailId,
                guardianContactNo: getValidMobileNumber(studentParentDetails[GuardianDetailIndex]?.contactNo),
                guardianRelationTypeId: studentParentDetails[GuardianDetailIndex]?.guardianRelationTypeId,
                guardianOccupationId: studentParentDetails[GuardianDetailIndex]?.occupationId,
                guardianDesignationId: studentParentDetails[GuardianDetailIndex]?.designationId,
                guardianImageBase64: studentParentDetails[GuardianDetailIndex]?.imageBase64,
                isGuardianRequired: studentParentDetails[GuardianDetailIndex]?.name ? "true" : "false"
            })
        }
        return undefined;
    }
    return undefined;
}

export enum TABS_ACTIONS {
    NEXT_TAB = "NEXT_TAB",
    PREVIOUS_TAB = "PREVIOUS_TAB",
    PARTICULAR_TAB = "PARTICULAR_TAB",
    SUBMIT_TAB = "SUBMIT_TAB"
}