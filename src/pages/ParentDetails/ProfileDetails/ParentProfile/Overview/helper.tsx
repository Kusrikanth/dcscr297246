import { MenuOptionHrtl } from "../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";

export const details = (details: any, values: any, otherProps?: any, updateSectionKey?: string) => {
    const fatherDetails = details.studentParentDetails.find((parent: any) => parent.relationType === "Father");
    const motherDetails = details.studentParentDetails.find((parent: any) => parent.relationType === "Mother");
    const guardianDetails = details.studentParentDetails.find((parent: any) => parent.relationType === "Guardian");
    let id = values.parentId ? values.parentId : fatherDetails?.id || motherDetails?.id || guardianDetails?.id;

    const parentsDetails = {
        "id": id,
        "fatherName": values.fatherName !== undefined ? values.fatherName : fatherDetails?.name || "",
        "fatherNationalityId": values.fatherNationalityId !== undefined ? values.fatherNationalityId : fatherDetails?.nationalityId || "",
        "fatherEmailId": values.fatherEmailId !== undefined ? values.fatherEmailId : fatherDetails?.emailId || "",
        "fatherContactNo": values.fatherContactNo !== undefined ? values.fatherContactNo : fatherDetails?.contactNo,
        "fatherWhatsappNo": values.fatherWhatsappNo !== undefined ? values.fatherWhatsappNo : fatherDetails?.fatherWhatsappNo,
        "isFatherEmployee": values.isFatherEmployee !== undefined ? values.isFatherEmployee : fatherDetails?.isEmployee,
        "fatherEmployeeId": values.fatherEmployeeId !== undefined ? values.fatherEmployeeId : fatherDetails?.employeeId,
        "fatherQualificationName": values.fatherQualificationName !== undefined ? values.fatherQualificationName : fatherDetails?.qualificationName,
        "fatherOccupationName": values.fatherOccupationName !== undefined ? values.fatherOccupationName : fatherDetails?.occupationName,
        "fatherOrganizationName": values.fatherOrganizationName !== undefined ? values.fatherOrganizationName : fatherDetails?.organizationName,
        "fatherDesignationName": values.fatherDesignationName !== undefined ? values.fatherDesignationName : fatherDetails?.designationName,
        "fatherIncomeData": values.fatherIncomeData !== undefined ? values.fatherIncomeData : fatherDetails?.incomeData,
        "fatherOfficeAddress": values.fatherOfficeAddress !== undefined ? values.fatherOfficeAddress : fatherDetails?.officeAddress,
        "fatherDocumentType": values.fatherDocumentType !== undefined ? values.fatherDocumentType : fatherDetails?.documentType,
        "fatherDocumentNumber": values.fatherDocumentNumber !== undefined ? values.fatherDocumentNumber : fatherDetails?.documentNumber,
        "isSingleParent": true,
        "singleParentType": "Father",
        "motherName": values.motherName !== undefined ? values.motherName : motherDetails?.name,
        "motherNationalityId": values.motherNationalityId !== undefined ? values.motherNationalityId : motherDetails?.nationalityId,
        "motherEmailId": values.motherEmailId !== undefined ? values.motherEmailId : motherDetails?.emailId,
        "motherContactNo": values.motherContactNo !== undefined ? values.motherContactNo : motherDetails?.contactNo,
        "motherWhatsappNo": values.motherWhatsappNo !== undefined ? values.motherWhatsappNo : motherDetails?.motherWhatsappNo,
        "motherEmployeeId": values.motherEmployeeId !== undefined ? values.motherEmployeeId : motherDetails?.employeeId,
        "isMotherEmployee": values.isMotherEmployee !== undefined ? values.isMotherEmployee : motherDetails?.isEmployee,
        "motherQualificationName": values.motherQualificationName !== undefined ? values.motherQualificationName : motherDetails?.qualificationName,
        "motherOccupationName": values.motherOccupationName !== undefined ? values.motherOccupationName : motherDetails?.occupationName,
        "motherOrganizationName": values.motherOrganizationName !== undefined ? values.motherOrganizationName : motherDetails?.organizationName,
        "motherDesignationName": values.motherDesignationName !== undefined ? values.motherDesignationName : motherDetails?.designationName,
        "motherIncomeData": values.motherIncomeData !== undefined ? values.motherIncomeData : motherDetails?.incomeData,
        "motherOfficeAddress": values.motherOfficeAddress !== undefined ? values.motherOfficeAddress : motherDetails?.officeAddress,
        "motherDocumentType": values.motherDocumentType !== undefined ? values.motherDocumentType : motherDetails?.documentType,
        "motherDocumentNumber": values.motherDocumentNumber !== undefined ? values.motherDocumentNumber : motherDetails?.documentNumber,
        "guardianName": values.guardianName !== undefined ? values.guardianName : guardianDetails.name,
        "guardianDocumentType": values.guardianDocumentType !== undefined ? values.guardianDocumentType : guardianDetails.documentType,
        "guardianDocumentNumber": values.guardianDocumentNumber !== undefined ? values.guardianDocumentNumber : guardianDetails.documentNumber,
        "guardianEmailId": values.guardianEmailId !== undefined ? values.guardianEmailId : guardianDetails.emailId,
        "guardianContactNo": values.guardianContactNo !== undefined ? values.guardianContactNo : guardianDetails?.contactNo,
        "guardianWhatsappNo": values.guardianWhatsappNo !== undefined ? values.guardianWhatsappNo : guardianDetails?.guardianWhatsappNo,
        "guardianRelationTypeId": values.guardianRelationTypeId !== undefined ? values.guardianRelationTypeId : guardianDetails.guardianRelationTypeId,
        "guardianOccupationId": values.guardianOccupationId !== undefined ? values.guardianOccupationId : guardianDetails.occupationId,
        "guardianDesignationId": values.guardianDesignationId !== undefined ? values.guardianDesignationId : guardianDetails.designationId
    }

    const studentAcademicDetail = {
        "id": values.academicId !== undefined ? values.academicId : details.studentAcademicDetails.id,
        "branchCurriculumId": values.curriculumId !== undefined ? values.curriculumId : details.studentAcademicDetails.curriculumId,
        "branchClassId": values.classId !== undefined ? values.classId : details.studentAcademicDetails.classId,
        "academicSectionId": values.sectionId !== undefined ? values.sectionId : details.studentAcademicDetails.sectionId,
        "rollNo": values.rollNo !== undefined ? values.rollNo : details.studentAcademicDetails.rollNo,
        "firstLanguageId": values.firstLanguageId !== undefined ? values.firstLanguageId : details.studentAcademicDetails.firstLanguageId,
        "secondLanguageId": values.secondLanguageId !== undefined ? values.secondLanguageId : details.studentAcademicDetails.secondLanguageId,
        "thirdLanguageId": values.thirdLanguageId !== undefined ? values.thirdLanguageId : details.studentAcademicDetails.thirdLanguageId
    }

    const studentDetails = {
        "id": details.studentDetails.id,
        "studentName": values.studentName !== undefined ? values.studentName : details.studentDetails.studentName,
        "admissionNo": values.admissionNo !== undefined ? values.admissionNo : details.studentDetails.admissionNo,
        "dateOfAdmission": values.dateOfAdmission !== undefined ? values.dateOfAdmission : details.studentDetails.dateOfAdmission,
        "dob": values.dob !== undefined ? values.dob : details.studentDetails.dob,
        "genderId": values.genderId !== undefined ? values.genderId : details.studentDetails.genderId,
        "emailId": values.emailId !== undefined ? values.emailId : details.studentDetails.emailId,
        "birthPlace": values.birthPlace !== undefined ? values.birthPlace : details.studentDetails.birthPlace,
        "bloodGroupId": values.bloodGroupId !== undefined ? values.bloodGroupId : details.studentDetails.bloodGroupId,
        "studentImageBase64": null,
        "contactNo": values.contactNo !== undefined ? values.contactNo : details.studentDetails.contactNo,
        "aadharCardNo": values.aadharCardNo !== undefined ? values.aadharCardNo : details.studentDetails.aadharCardNo,
        "admissionAcademicYearId": values.admissionAcademicYearId !== undefined ? values.admissionAcademicYearId : details.studentDetails.admissionAcademicYearId,
        "thumbnailImageUrlId": values.fullImageUrlId !== undefined ? values.fullImageUrlId : details.studentDetails.thumbnailImageUrlId,
        "studentCode": details.studentDetails.studentCode,
        "studentCodeNum": details.studentDetails.studentCodeNum,
        "admissionType": values.admissionType !== undefined ? values.admissionType : details.studentAcademicDetails.admissionType,
        "admissionCategory": values.admissionCategory !== undefined ? values.admissionCategory : details.studentAcademicDetails.admissionCategory,
        "studentAcademicDetail": studentAcademicDetail,
        "nationalityId": values.nationalityId !== undefined ? values.nationalityId : details.identificationDetail.nationalityId,
        "religionId": values.religionId !== undefined ? values.religionId : details.identificationDetail.religionId,
        "casteId": values.casteId !== undefined ? values.casteId : details.identificationDetail.casteId,
        "subCasteId": values.subCasteId !== undefined ? values.subCasteId : details.identificationDetail.subCasteId,
        "motherToungeId": values.motherToungeId !== undefined ? values.motherToungeId : details.identificationDetail.motherToungeId,
        "identificationMark1": values.identificationMark1 !== undefined ? values.identificationMark1 : details.identificationDetail.identificationMark1,
        "identificationMark2": values.identificationMark2 !== undefined ? values.identificationMark2 : details.identificationDetail.identificationMark2,
        "foreignNationalPassportNumber": values.foreignNationalPassportNumber !== undefined ? values.foreignNationalPassportNumber : details.identificationDetail.foreignNationalPassportNumber,
        "lastSchoolStudied": values.lastSchoolStudied !== undefined ? values.lastSchoolStudied : details.pastEducation.lastSchoolStudied,
        "lastCurriculumId": values.lastCurriculumId !== undefined ? values.lastCurriculumId : details.pastEducation.lastCurriculumId,
        "lastClassId": values.lastClassId !== undefined ? values.lastClassId : details.pastEducation.lastClassId,
        "lastClassPerc": values.lastClassPerc !== undefined ? values.lastClassPerc : details.pastEducation.lastClassPerc,
        "reasonForAdmission": values.reasonForAdmission !== undefined ? values.reasonForAdmission : details.pastEducation.reasonForAdmission,
        "isSpecialChild": values?.isSpecialChild !== undefined ? values?.isSpecialChild : details.medicalInfo.isSpecialChild,
        "isAllergitic": values?.isAllergitic !== undefined ? values?.isAllergitic : details.medicalInfo.isAllergitic,
        "allergiticDetails": values.allergiticDetails !== undefined ? values.allergiticDetails : details.medicalInfo.allergiticDetails,
        "emergencyContactNo": values.emergencyContactno !== undefined ? values.emergencyContactno : details.medicalInfo.emergencyContactNo,
        "otherHealthIssue": values.otherHealthIssue !== undefined ? values.otherHealthIssue : details.medicalInfo.otherHealthIssue,
        "isIdCardRequest": values.isIdCardRequest !== undefined ? values.isIdCardRequest : false,
    }

    const studentCommunicationDetails = {
        "id": details.communicationDetails?.id,
        "currentAddress": values.currentAddress !== undefined ? values.currentAddress : details.communicationDetails?.currentAddress,
        "currentHouseNo": values.currentHouseNo !== undefined ? values.currentHouseNo : details.communicationDetails?.currentHouseNo,
        "currentLandmark": values.currentLandmark !== undefined ? values.currentLandmark : details.communicationDetails?.currentLandmark,
        "currentCountryId": values.currentCountryId !== undefined ? values.currentCountryId : details.communicationDetails?.currentCountryId,
        "currentStateId": values.currentStateId !== undefined ? values.currentStateId : details.communicationDetails?.currentStateId,
        "currentCityId": values.currentCityId !== undefined ? values.currentCityId : details.communicationDetails?.currentCityId,
        "currentPincode": values.currentPincode !== undefined ? values.currentPincode : details.communicationDetails?.currentPincode,
        "permanentAddress": values.permanentAddress !== undefined ? values.permanentAddress : details.communicationDetails?.permanentAddress,
        "isPermanentAddress": values.isPermanentAddress !== undefined ? values.isPermanentAddress : details.communicationDetails?.isPermanentAddress,
        "permanentHouseNo": values.permanentHouseNo !== undefined ? values.permanentHouseNo : details.communicationDetails?.permanentHouseNo,
        "permanentLandmark": values.permanentLandmark !== undefined ? values.permanentLandmark : details.communicationDetails?.permanentLandmark,
        "permanentCountryId": values.permanentCountryId !== undefined ? values.permanentCountryId : details.communicationDetails?.permanentCountryId,
        "permanentStateId": values.permanentStateId !== undefined ? values.permanentStateId : details.communicationDetails?.permanentStateId,
        "permanentCityId": values.permanentCityId !== undefined ? values.permanentCityId : details.communicationDetails?.permanentCityId,
        "permanentPincode": values.permanentPincode !== undefined ? values.permanentPincode : details.communicationDetails?.permanentPincode
    }

    const studentSiblingDetails = details.studentSiblingDetails.map((d: any) => {
        return values.siblingId === d.id ? {
            "id": values.siblingId,
            "siblingClassId": values.siblingClassId,
            "siblingCurriculumId": values.siblingCurriculumId,
            "siblingSectionId": values.siblingSectionId,
            "siblingCampusTypeId": null,
            "inSameSchool": values.isSameSchool,
            "siblingDetails": values.siblingDetails,
            "siblingName": values.siblingName,
            "siblingSchoolName": "",
            "siblingStudentId": values.siblingStudentId
        } : {
            "id": d.id,
            "siblingClassId": d.siblingClassId,
            "siblingCurriculumId": d.siblingCurriculumId,
            "siblingSectionId": values.siblingSectionId,
            "siblingCampusTypeId": null,
            "inSameSchool": d.inSameSchool,
            "siblingDetails": "",
            "siblingName": d.siblingName,
            "siblingSchoolName": "",
            "siblingStudentId": d.siblingStudentId
        }
        // if(!values.id){
        //     abc.push({
        //         "siblingClassId": values.siblingClassId,
        //         "siblingCurriculumId": values.siblingCurriculumId,
        //         "siblingDetails": "",
        //         "siblingName": values.siblingName,
        //         "siblingSchoolName": "",
        //         "siblingStudentId": values.siblingStudentId
        //     })
        // }
        // return abc
    })
    if (values.siblingId === "") {
        studentSiblingDetails.push({
            "siblingClassId": values.siblingClassId,
            "siblingCurriculumId": values.siblingCurriculumId,
            "siblingSectionId": values.siblingSectionId,
            "siblingCampusTypeId": values.siblingCampusTypeId,
            "inSameSchool": values.isSameSchool,
            "siblingDetails": values.siblingDetails,
            "siblingName": values.siblingName,
            "siblingSchoolName": "",
            "siblingStudentId": values.siblingStudentId
        })
    }
    return {
        "studentDetails": studentDetails,
        "studentSiblingDetails": studentSiblingDetails,
        "studentParentDetails": parentsDetails,
        "studentCommunicationDetailDto": studentCommunicationDetails,
        "instituteId": otherProps.instituteId,
        "directorySaveFlow": updateSectionKey ? [updateSectionKey] : [],
        "branchId": otherProps.branchId
    }

}

export function generateParentsDetailsColumns(actionsList: any) {
    return ([
        {
            Header: "Name",
            accessor: "name",
            disableSortBy: true
        },
        {
            Header: "Aadhar No.",
            accessor: "documentNumber",
            disableSortBy: true
        },
        {
            Header: "Relation Type",
            accessor: "relationType",
            disableSortBy: true
        },
        {
            Header: "Email",
            accessor: "emailId",
            disableSortBy: true
        },
        {
            Header: "Phone no.",
            accessor: "contactNo",
            disableSortBy: true
        },
        {
            Header: "WhatsApp Number",
            accessor: "whatsappNo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                let savedWhatsappNo = "";
                const { relationType, fatherWhatsappNo, motherWhatsappNo, guardianWhatsappNo } = original;
                if (relationType === "Father") {
                    savedWhatsappNo = fatherWhatsappNo;
                } else if (relationType === "Mother") {
                    savedWhatsappNo = motherWhatsappNo;
                } else if (relationType === "Guardian") {
                    savedWhatsappNo = guardianWhatsappNo;
                }
                return (
                    <span>{savedWhatsappNo || "-"}</span>
                )
            }
        },
        {
            Header: "Is Employee ?",
            accessor: "isEmployee",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original.isEmployee ? "Yes" : "No"
            }
        },
        {
            Header: " ",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                if (!original?.name) {
                    return null;
                }
                return (
                    <MenuOptionHrtl actionOptions={actionsList(original?.relationType)} rowId={original.relationType} />
                )
            }
        },
    ])
}
export function generateSiblingfDetailsColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Student Id",
            accessor: "siblingStudentCode",
            disableSortBy: true
        },
        {
            Header: "Name",
            accessor: "siblingName",
            disableSortBy: true
        },
        // {
        //     Header: "Campus",
        //     accessor: "siblingCampusTypeId",
        //     disableSortBy: true
        // },
        {
            Header: "Curriculum",
            accessor: "siblingCurriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "siblingClassName",
            disableSortBy: true
        },
        {
            Header: "Section",
            accessor: "siblingSectionName",
            disableSortBy: true
        },
        {
            Header: "In the Same School ?",
            accessor: "inSameSchool",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original.inSameSchool ? "Yes" : "No"
            }
        },
        // {
        //     Header: " ",
        //     filterable: false,
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         return (
        //             <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        //         )
        //     }
        // },
    ])
}

export const relationTypeOptions = [
    {
        relationType: "Father"
    },
    {
        relationType: "Mother"
    },
    {
        relationType: "Guardian"
    },
]

export function generateDocumentDetailsColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "File Name",
            accessor: "fileName",
            disableSortBy: true
        },
        {
            Header: "Document Name",
            accessor: "documentName",
            disableSortBy: true
        },
        {
            Header: "Type",
            accessor: "type",
            disableSortBy: true
        },
        {
            Header: "Date Added",
            accessor: "dateAdded",
            disableSortBy: true
        },
        {
            Header: "Added by",
            accessor: "addedby",
            disableSortBy: true
        },
        {
            Header: "Action",
            filterable: false,
            accessor: "actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                )
            }
        },
    ])
}

export function renderValueSection(selectedItem: any) {
  return selectedItem?.categoryName || "";
}

export function renderOptionsSubCaste(item: any) {
  return   item?.categoryName?.toString() || "";
}