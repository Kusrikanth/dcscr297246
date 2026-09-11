
import React from "react";
import { nanoid } from 'nanoid';
import { getTrueFalseOptions } from "../../utility/commonutility";
//Icons
import { default as StudentIconSvg } from "../../assets/imagesdps/directory/registration-icons/student_profile.svg?react";
import { default as SiblingDetailsIconSvg } from "../../assets/imagesdps/directory/registration-icons/sibling_details.svg?react";
import { default as CocurricularIconSvg } from "../../assets/imagesdps/directory/registration-icons/cocurricular-activity.svg?react";

import { default as ParentDetailsIconSvg } from "../../assets/imagesdps/directory/registration-icons/parent_details.svg?react";
import { default as CommunicationDetailsIconSvg } from "../../assets/imagesdps/directory/registration-icons/communication_details.svg?react";
import { default as DocumentIconSvg } from "../../assets/imagesdps/directory/registration-icons/documents.svg?react";

export const stepInfo = [{
    id: "studentProfile",
    title: "Student Profile",
    iconImage: <StudentIconSvg />,
    isFilled: false,
    isEnabled: true,
    multiFormKeys: ["basicInfo", "academics", "identification", "pastEducation", "medicalInfo", "facilityRequired"]
}, {
    id: "coCurriculumActivity",
    title: "Co-Curricular Activities",
    isFilled: false,
    isEnabled: true,
    iconImage: <CocurricularIconSvg />,
    multiFormKeys: ["coCurriculumActivity"]
}, {
    id: "siblingDetails",
    title: "Sibling Details",
    isFilled: false,
    isEnabled: true,
    iconImage: <SiblingDetailsIconSvg />,
    multiFormKeys: ["siblingDetails"]
}, {
    id: "parentData",
    title: "Parents Data",
    isFilled: false,
    isEnabled: true,
    iconImage: <ParentDetailsIconSvg />,
    multiFormKeys: ["fatherInfo", "motherInfo", "guardianInfo", "singleParentTypeReason", "document"]
}, {
    id: "communicationDetails",
    title: "Communication Details",
    isFilled: false,
    isEnabled: true,
    iconImage: <CommunicationDetailsIconSvg />,
    multiFormKeys: ["permanentAddress", "residentialAddress"]
}, {
    id: "documents",
    title: "Documents",
    isFilled: false,
    isEnabled: true,
    iconImage: <DocumentIconSvg />,
    multiFormKeys: ["uploadDocument", "academicDetails"]
}, {
    id: "upload",
    title: "Uploads",
    isFilled: false,
    isEnabled: true,
    iconImage: <DocumentIconSvg />,
    multiFormKeys: ["uploadPhotos"]
}, {
    id: "submission",
    title: "Submissions",
    isFilled: false,
    isEnabled: true,
    iconImage: <DocumentIconSvg />,
    multiFormKeys: ["declaration", "undertaking"]
}
]

export const distanceOptions = [{ text: '5-10 Km' }, { text: '10-15 Km' },
    , { text: '15-20 Km' }, { text: '20-25 Km' }];
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
export const trueFalseOptions = [
    {
        id: "true",
        name: "Yes",
    },
    {
        id: "false",
        name: "No",
    }
]

export const dipSiteParentOptions = [
    {
        id: "FATHER",
        name: "Father"
    }, {
        id: "MOTHER",
        name: "Mother"
    }
]

export const admissionTypes = [
    {
        id: "Non-Residential",
        name: "Non-Residential"
    }, {
        id: "Residential",
        name: "Residential"
    }
]

export const uuidTypes = [
    {
        id: "aadhar",
        name: "Aadhar Card"
    }, {
        id: "passport",
        name: "Foreign National Passport Number"
    }
]


export const levelOptions = [
    {
        id: "STATE",
        name: "State"
    },
    {
        id: "NATIONAL",
        name: "National"
    },
    {
        id: "INTERNATIONAL",
        name: "International"
    }
]

export const StepperFormContext: any = React.createContext<any>(null);



export enum TABS_ACTIONS {
    NEXT_TAB = "NEXT_TAB",
    PREVIOUS_TAB = "PREVIOUS_TAB",
    PARTICULAR_TAB = "PARTICULAR_TAB",
    SUBMIT_TAB = "SUBMIT_TAB"
}

export function getAdmissionTypeOptions(filterInfo: any) {
    const { genderName, hostelFacility, branchId } = filterInfo || {};
    if (hostelFacility?.toString().toLowerCase() === 'yes') {
        return admissionTypes;
    } else {
        return admissionTypes.filter(item => item.id === "Non-Residential");
    }
}

export function generateSiblingPayload(branchId: string, siblingsInfo: any) {
    const firstSiblingInfo = siblingsInfo.siblings[0] || null,
        secondSiblingInfo = siblingsInfo.siblings[1] || null;
    return {
        hasSibling: siblingsInfo?.hasSibling,
        siblingFromDPS: siblingsInfo?.siblingFromDPS,
        siblingCode: firstSiblingInfo?.siblingCode || "",
        siblingName: firstSiblingInfo?.siblingName || "",
        siblingBranchId: branchId,
        siblingCurriculumId: firstSiblingInfo?.siblingCurriculumId || "",
        siblingClassId: firstSiblingInfo?.siblingClassId || "",
        siblingSectionId: firstSiblingInfo?.siblingSectionId || "",
        siblingDetails: firstSiblingInfo?.siblingDetails || "",
        hasSecondSibling: secondSiblingInfo ? "true" : "false",
        secondSiblingFromDPS: siblingsInfo?.siblingFromDPS,
        secondSiblingCode: secondSiblingInfo?.siblingCode || "",
        secondSiblingName: secondSiblingInfo?.siblingName || "",
        secondSiblingBranchId: secondSiblingInfo ? branchId : "",
        secondSiblingCurriculumId: secondSiblingInfo?.siblingCurriculumId || "",
        secondSiblingClassId: secondSiblingInfo?.siblingClassId || "",
        secondSiblingSectionId: secondSiblingInfo?.siblingSectionId || "",
        secondSiblingDetails: secondSiblingInfo?.siblingDetails || "",
    }
}

export function getSiblingFormState(studentSiblingDetails: any) {
    const siblingList: any = [];
    const siblingUniqueId = nanoid();
    siblingList.push({
        uniqueId: siblingUniqueId,
        siblingCode: studentSiblingDetails?.siblingCode || "",
        selectedSiblingInfo: studentSiblingDetails?.siblingCode ? {
            studentName: studentSiblingDetails?.siblingName || "",
            studentCode: studentSiblingDetails?.siblingCode || "",
        } : undefined,
        siblingName: studentSiblingDetails?.siblingName || "",
        siblingCurriculumId: studentSiblingDetails?.siblingCurriculumId || "",
        siblingCurriculumName: studentSiblingDetails?.siblingCurriculumName || "",
        siblingClassId: studentSiblingDetails?.siblingClassId || "",
        siblingClassName: studentSiblingDetails?.siblingClassName || "",
        siblingSectionId: studentSiblingDetails?.siblingSectionId || "",
        siblingSectionName: studentSiblingDetails?.siblingSectionName || "",
        siblingDetails: studentSiblingDetails?.siblingDetails || "",
    });
    if (studentSiblingDetails?.hasSecondSibling) {
        const uniqueId = nanoid();
        siblingList.push({
            uniqueId: uniqueId,
            siblingCode: studentSiblingDetails?.secondSiblingCode || "",
            selectedSiblingInfo: studentSiblingDetails?.secondSiblingCode ? {
                studentName: studentSiblingDetails?.secondSiblingName || "",
                studentCode: studentSiblingDetails?.secondSiblingCode || "",
            } : undefined,
            siblingName: studentSiblingDetails?.secondSiblingName || "",
            siblingCurriculumId: studentSiblingDetails?.secondSiblingCurriculumId || "",
            siblingCurriculumName: studentSiblingDetails?.secondSiblingCurriculumName || "",
            siblingClassId: studentSiblingDetails?.secondSiblingClassId || "",
            siblingClassName: studentSiblingDetails?.secondSiblingClassName || "",
            siblingSectionId: studentSiblingDetails?.secondSiblingSectionId || "",
            siblingSectionName: studentSiblingDetails?.secondSiblingSectionName || "",
            siblingDetails: studentSiblingDetails?.secondSiblingDetails || "",
        });
    }
    return {
        hasSibling: getTrueFalseOptions(studentSiblingDetails?.hasSibling),
        siblingFromDPS: getTrueFalseOptions(!!studentSiblingDetails?.siblingCode),
        siblings: siblingList
    }
}

export function getProfileDataFromSaleInfo(applicationSaleInfo: any) {
    const { saleFormDetails } = applicationSaleInfo || {};
    return ({
        studentName: saleFormDetails?.fullName,
        smsPriorityNo: saleFormDetails?.contactNumber,
        applicationNo: saleFormDetails?.applicationNumber,
        applicationId: saleFormDetails?.applicationId,
        priorityMail: saleFormDetails?.emailId,
        academicYearId: saleFormDetails?.academicYearId,
        genderId: saleFormDetails?.genderId,
        dateOfBirth: saleFormDetails?.dob,
        admissionType: saleFormDetails?.admissionType,
        genderName: saleFormDetails?.genderName,
        curriculumSoughtId: saleFormDetails?.curriculumId,
        curriculumSoughtName: saleFormDetails?.curriculumName,
        admissionSoughtId: saleFormDetails?.admissionClassId,
        groupId: saleFormDetails?.groupId,
        classSequence: saleFormDetails?.classSequence,
        secondLanguageId: saleFormDetails?.secondLanguageId,
        secondLanguageName: saleFormDetails?.secondLanguageName,
        thirdLanguageId: saleFormDetails?.thirdLanguageId,
        transportAccept: saleFormDetails?.transportAccept,
        latitude: saleFormDetails?.latitude,
        longitude: saleFormDetails?.longitude,
        address: saleFormDetails?.address,
    })
}