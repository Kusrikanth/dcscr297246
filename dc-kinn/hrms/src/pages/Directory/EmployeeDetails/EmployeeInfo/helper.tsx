// import { MenuOptionHrtl } from "../../../../Components/Common";
import { Row } from "reactstrap";
import { MenuOptionHrtl } from "../../../../Components/Common";
import { getMonthDateFormat, getUpdatedMonthDateFormat } from "../../../../utility/dateutility";
import { DocumentDetailsTypes, IOptionsHrtl, ParentsDetailsTypes, SiblingDetailsTypes } from "./EmployeeInfoTypes";


export const employeeSection: Array<any> = [
    {
        id: "basic_information",
        title: "Basic Information",
        subTitle: "User Basic Info"
    },
    {
        id: "education",
        title: "Education",
        subTitle: "User Eduction Details"
    },
    {
        id: "contact_details",
        title: "Contact Details",
        subTitle: "User Class Details"
    },
    {
        id: "dependencies",
        title: "Dependencies",
        subTitle: "User dependencies Details",
    },
    {
        id: "emergency_contacts",
        title: "Emergency Contacts",
        subTitle: "User Emergency Details"
    },
    {
        id: "marriage_info",
        title: "Marriage Info",
        subTitle: "User Marriage Records"
    },
    {
        id: "current_job",
        title: "Current Job",
        subTitle: "User Current Job Records"
    },
    {
        id: "designation_details",
        title: "Designation Details",
        subTitle: "User Designation Details"
    },
    {
        id: "previous_experience",
        title: "Previous Experience",
        subTitle: "User Previous Experience"
    },
    {
        id: "bank_details",
        title: "Bank Details",
        subTitle: "User Bank Details"
    },
    {
        id: "salary_details",
        title: "Salary Details",
        subTitle: "User Salary Details"
    },
    {
        id: "documents",
        title: "Documents",
        subTitle: "User Uploaded Documents"
    }
]



export function generateDependenciesDetailsColumns(actionsList: Array<IOptionsHrtl>, data?: any) {

    return ([
        {
            Header: "Name",
            accessor: "dependentName",
            disableSortBy: true
        },
        {
            Header: "Relationship Type",
            accessor: "relationTypeId",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return data && data.find((r: any) => r.id == original.relationTypeId).relationType;
            }
        },
        {
            Header: "Phone no.",
            accessor: "dependentContactNo",
            disableSortBy: true
        },
        {
            Header: " ",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                )
            }
        },
    ])
}

export function generatePreviousExperienceDetailsColumns(actionsList: Array<IOptionsHrtl>, data?: any) {
    return ([
        {
            Header: "Organisation Name",
            accessor: "organizationName",
            disableSortBy: true
        },
        {
            Header: "Designation",
            accessor: "designationId",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return data && data.find((r: any) => r.id == original.designationId)?.designationName;
            }
        },
        {
            Header: "Date Range",
            accessor: "dateRange",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return `${getMonthDateFormat(new Date(original.fromDate))} to ${getMonthDateFormat(new Date(original.toDate))}`
            }
        },
        {
            Header: "Year Experience",
            accessor: "experience",
            disableSortBy: true
        },
        {
            Header: " ",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                )
            }
        },
    ])
}

export function generateEmergencyContactsColumns(actionsList: Array<IOptionsHrtl>, data?: any) {
    return ([
        {
            Header: "Name",
            accessor: "emergencyContactPerson",
            disableSortBy: true
        },
        {
            Header: "Relationship Type",
            accessor: "emergencyRelationId",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return data && data.find((r: any) => r.id == original.emergencyRelationId).relationType;
            }
        },
        {
            Header: "Phone no.",
            accessor: "emergencyContactNo",
            disableSortBy: true
        },
        {
            Header: " ",
            accessor: "actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                )
            }
        },
    ])
}

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
        // {
        //     Header: "Size",
        //     accessor: "size",
        //     disableSortBy: true
        // },
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
            Header: " ",
            accessor: "actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                )
            }
        },
    ])
}

// export function generateParentsDetailsColumns(actionsList: Array<IOptionsHrtl>) {
//     return ([
//         {
//             Header: "Department Name",
//             accessor: "name",
//         },
//         {
//             Header: "Short Code",
//             accessor: "shortCode",
//         },
//         {
//             Header: "Actions",
//             filterable: false,
//             Cell: ({ row: { original } }: any) => {
//                 return (
//                     <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
//                 );
//             },
//         },
//     ])
// }


export const ParentsDetailsData: Array<ParentsDetailsTypes> = [
    {
        id: 1,
        name: "Sanjiv Chandra Aelugani",
        aadharNo: "1234 5678 1254",
        relationType: "Father",
        email: "askumar72@gmail.com",
        phoneno: "+919852124585",
        isEmployee: "Yes",
    },

]
export const SiblingDetailsData: Array<SiblingDetailsTypes> = [
    {
        id: 1,
        studentId: "5346",
        name: "Ajay Aelugani",
        campus: "Nacharam",
        curriculum: "CBSE",
        class: "VII",
        section: "VII A",
        intheSameSchool: true
    },

]
export const DocumentDetailsData: Array<DocumentDetailsTypes> = [
    {
        id: 1,
        fileName: "Certificate-1.Pdf",
        documentName: "Bonafide Certificate",
        size: "1.2 Mb",
        type: "Pdf",
        dateAdded: "20-06-2022",
        addedby: "K.Krishna"
    },

]
export const IsEmployeeOptions = [
    {
        value: "Yes",
    },
    {
        value: "No",
    },
];
export const CampusTypeOptions = [
    {
        campusTypeId: 1,
        campusType: "Residential"
    },
    {
        campusTypeId: 2,
        campusType: "Non-Residential"
    }
]
export const amountType = [
    {
        id: "CASH",
        name: "CASH"
    },
    {
        id: "SAVINGS",
        name: "SAVINGS"
    },
    {
        id: "BANK TRANSFER",
        name: "BANK TRANSFER"
    },
    {
        id: "NA",
        name: "NA"
    },
]


export const details = (details: any, values: any, affectedSection?: any, otherDetails?: any, updateSectionKey?: string) => {
    const EmployeeDetails = affectedSection === "Employee Details" ? {
        "id": details.employeeBasicDetails.id,
        "employeeName": values.employeeName !== undefined ? values.employeeName : details.employeeBasicDetails.employeeName,
        "dob": values.dob !== undefined ? values.dob : details.employeeBasicDetails.dob,
        "genderId": values.genderId !== undefined ? values.genderId : details.employeeBasicDetails.genderId,
        "nationalityId": values.nationalityId !== undefined ? values.nationalityId : details.employeeBasicDetails.nationalityId,
        "religionId": values.religionId !== undefined ? values.religionId : details.employeeBasicDetails.religionId,
        "casteId": values.casteId !== undefined ? values.casteId : details.employeeBasicDetails.casteId,
        "maritalStatusId": values.maritalStatusId !== undefined ? values.maritalStatusId : details.employeeBasicDetails.maritalStatusId,
        "personalEmailId": values.personalEmailId !== undefined ? values.personalEmailId : details.employeeBasicDetails.personalEmailId,
        "aadharNo": values.aadharNo !== undefined ? values.aadharNo : details.employeeBasicDetails.aadharNo,
        "contactNo": values.contactNo !== undefined ? values.contactNo : details.employeeBasicDetails.contactNo,
        "bloodGroupId": values.bloodGroupId !== undefined ? values.bloodGroupId : details.employeeBasicDetails.bloodGroupId,
        "identificationMark1": values.identificationMark1 !== undefined ? values.identificationMark1 : details.employeeBasicDetails.identificationMark1,
        "identificationMark2": values.identificationMark2 !== undefined ? values.identificationMark2 : details.employeeBasicDetails.identificationMark2,
        "employeeCode": values.employeeId !== undefined ? values.employeeId : details.employeeBasicDetails.employeeCode,
        "employeeCodeNum": details.employeeBasicDetails.employeeCodeNum,
        "userTypeId": values.userTypeId !== undefined ? values.userTypeId : details.employeeBasicDetails.userTypeId,
        "isOtherEmployee": values.isOtherEmployee !== undefined ? values.isOtherEmployee : details.employeeBasicDetails.isOtherEmployee,
        "companyId": values.companyId !== undefined ? values.companyId : details.employeeBasicDetails.companyId,
    } : details.employeeBasicDetails;
    const EducationDetails = affectedSection === "Employee Education Details" ? {
        "employeeId": values.employeeId !== undefined ? values.employeeId : details.employeeEducationDetails.employeeId,
        "qualificationName": values.qualificationName !== undefined ? values.qualificationName : details.employeeEducationDetails.qualificationName,
        "universityName": values.universityName !== undefined ? values.universityName : details.employeeEducationDetails.universityName,
        "passoutYear": values.passoutYear !== undefined ? values.passoutYear : details.employeeEducationDetails.passoutYear,
        "specialization": values.specialization !== undefined ? values.specialization : details.employeeEducationDetails.specialization,
        "specializationName": values.specializationName !== undefined ? values.specializationName : details.employeeEducationDetails.specializationName,
        "otherAchievements": values.otherAchievements !== undefined ? values.otherAchievements : details.employeeEducationDetails.otherAchievements
    } : details.employeeEducationDetails;
    const ContactDetails = affectedSection === "Employee Contact Details" ? {
        "id": values.contactId !== undefined ? values.contactId : details.employeeContactDetails.id,
        "addressLine": values.addressLine !== undefined ? values.addressLine : details.employeeContactDetails.addressLine,
        "area": values.area !== undefined ? values.area : details.employeeContactDetails.area,
        "countryId": 100,
        "stateId": values.stateId !== undefined ? values.stateId : details.employeeContactDetails.stateId,
        "cityId": values.cityId !== undefined ? values.cityId : details.employeeContactDetails.cityId,
        "district": values.district !== undefined ? values.district : details.employeeContactDetails.district,
        "pincode": values.pincode !== undefined ? values.pincode : details.employeeContactDetails.pincode
    } : details.employeeContactDetails;
    const MarriageDetails = affectedSection === "Employee Marriage Details" ? {
        "employeeId": values.employeeId !== undefined ? values.employeeId : details.employeeMarriageInfo.employeeId,
        "marriageCertificateNo": values.marriageCertificateNo !== undefined ? values.marriageCertificateNo : details.employeeMarriageInfo.marriageCertificateNo,
        "marriageCertificateDor": values.marriageCertificateDor !== undefined ? values.marriageCertificateDor : details.employeeMarriageInfo.marriageCertificateDor
    } : details.employeeMarriageInfo;
    const CurrentJobDetails = affectedSection === "Employee Job Details" ? {
        "employeeId": values.employeeId !== undefined ? values.employeeId : details.employeeCurrentJob.employeeId,
        "biometricId": values.biometricId !== undefined ? values.biometricId : details.employeeCurrentJob.biometricId,
        "workEmailId": values.workEmailId !== undefined ? values.workEmailId : details.employeeCurrentJob.workEmailId,
        "workPhoneNo": values.workPhoneNo !== undefined ? values.workPhoneNo : details.employeeCurrentJob.workPhoneNo,
        "workLocation": values.workLocation !== undefined ? values.workLocation : details.employeeCurrentJob.workLocation,
        "employeeType": values.employeeType !== undefined ? values.employeeType : details.employeeCurrentJob.employeeType,
        "departmentId": values.departmentId !== undefined ? values.departmentId : details.employeeCurrentJob.departmentId,
        "confirmationDate": values.confirmationDate !== undefined ? values.confirmationDate : details.employeeCurrentJob.confirmationDate,
        "lastWorkingDate": values.lastWorkingDate !== undefined ? values.lastWorkingDate : details.employeeCurrentJob.lastWorkingDate,
        "sourceOfHire": values.sourceOfHire !== undefined ? values.sourceOfHire : details.employeeCurrentJob.sourceOfHire,
        "doj": values.doj !== undefined ? values.doj : details.employeeCurrentJob.doj,
        "employeeStatusId": values.employeeStatusId !== undefined ? values.employeeStatusId : details.employeeCurrentJob.employeeStatusId,
        "rfid": values.rfid !== undefined ? values.rfid : details.employeeCurrentJob.rfid,
        "dpsExperiance": values.dpsExperiance !== undefined ? values.dpsExperiance : details.employeeCurrentJob.dpsExperiance,
        "isTransfered": values.isTransfered !== undefined ? values.isTransfered : details.employeeCurrentJob.isTransfered,
        // "isOtherEmployee": values.isOtherEmployee !== undefined ? values.isOtherEmployee : details.employeeCurrentJob.isOtherEmployee,
        // "companyId": values.companyId !== undefined ? values.companyId : details.employeeCurrentJob.companyId,
    } : details.employeeCurrentJob;
    const DesignationDetails = affectedSection === "Employee Designation Details" ? {
        "id": values.desId !== undefined ? values.desId : details.employeeDesignationDetails.id,
        "designationId": values.designationId !== undefined ? values.designationId : details.employeeDesignationDetails.designationId,
        "reportingHeadId": values.reportingHeadId !== undefined ? values.reportingHeadId : details.employeeDesignationDetails.reportingHeadId,
        "isReportingHead": values.isReportingHead !== undefined ? values.isReportingHead : details.employeeDesignationDetails.isReportingHead,
        "employeeCategoryId": values.employeeCategoryId !== undefined ? values.employeeCategoryId : details.employeeDesignationDetails.employeeCategoryId,
        "isHod": values.isHod !== undefined ? values.isHod : details.employeeDesignationDetails.isHod,
        "hodId": values.hodId !== undefined ? values.hodId : details.employeeDesignationDetails.hodId,
    } : details.employeeDesignationDetails;
    const BankDetails = affectedSection === "Employee Bank Details" ? {
        "id": values.bId !== undefined ? values.bId : details.employeeBankDetails?.id,
        "bankAccountNo": values.bankAccountNo !== undefined ? values.bankAccountNo : details.employeeBankDetails?.bankAccountNo,
        "bankId": values.bankId !== undefined ? values.bankId : details.employeeBankDetails?.bankId,
        "bankBranchName": values.bankBranchName !== undefined ? values.bankBranchName : details.employeeBankDetails?.bankBranchName,
        "bankBranchAddress": values.bankBranchAddress !== undefined ? values.bankBranchAddress : details?.employeeBankDetails.bankBranchAddress,
        "bankIfscCode": values.bankIfscCode !== undefined ? values.bankIfscCode : details.employeeBankDetails?.bankIfscCode,
        "isDefaultAcc": values.isDefaultAcc !== undefined ? values.isDefaultAcc : details.employeeBankDetails?.isDefaultAcc || false
    } : details.employeeBankDetails;
    const SalaryDetails = affectedSection === "Employee Salary Details" ? {
        "id": values.sId !== undefined ? values.sId : details.employeeSalaryDetails.id,
        "taxCategoryTypeId": values.taxCategoryTypeId !== undefined ? values.taxCategoryTypeId : details.employeeSalaryDetails.taxCategoryTypeId,
        "amountType": values.amountType !== undefined ? values.amountType : details.employeeSalaryDetails.amountType,
        "salaryCategoryId": values.salaryCategoryId !== undefined ? values.salaryCategoryId : details.employeeSalaryDetails.salaryCategoryId,
        "basicSalary": values.basicSalary !== undefined ? values.basicSalary : details.employeeSalaryDetails.basicSalary,
        "grossSalary": values.grossSalary !== undefined ? values.grossSalary : details.employeeSalaryDetails.grossSalary,
        "panCardNo": values.panCardNo !== undefined ? values.panCardNo : details.employeeSalaryDetails.panCardNo,
        "isPfEligible": values.isPfEligible !== undefined ? values.isPfEligible : details.employeeSalaryDetails.isPfEligible,
        "pfAccountNo": values.pfAccountNo !== undefined ? values.pfAccountNo : details.employeeSalaryDetails.pfAccountNo,
        "uanNo": values.uanNo !== undefined ? values.uanNo : details.employeeSalaryDetails.uanNo,
        "isEsiEligible": values.isEsiEligible ? values.isEsiEligible : details.employeeSalaryDetails.isEsiEligible,
        "esiAccountNo": values.esiAccountNo !== undefined ? values.esiAccountNo : details.employeeSalaryDetails.esiAccountNo,
        "netTaxBenefitsPa": values.netTaxBenefitsPa !== undefined ? values.netTaxBenefitsPa : details.employeeSalaryDetails.netTaxBenefitsPa,
        "remarks": values.remarks !== undefined ? values.remarks : details.employeeSalaryDetails.remarks
    } : details.employeeSalaryDetails;
    const DepedenciesList = values.depedenctId !== undefined ? [...details.employeeDependentDetails.filter((dep: any) => dep.id != values.depedenctId), {
        "id": values.depedenctId,
        "dependentName": values.dependentName,
        "relationTypeId": values.relationTypeId,
        "dependentContactNo": values.dependentContactNo
    }] : affectedSection === "Dependency Details" ? details.employeeDependentDetails ? [...details.employeeDependentDetails, { dependentName: values.dependentName, dependentContactNo: values.dependentContactNo, relationTypeId: values.relationTypeId }] : [{ dependentName: values.dependentName, dependentContactNo: values.dependentContactNo, relationTypeId: values.relationTypeId }] : details.employeeDependentDetails;

    const EmergencyContactList = values.emergencyContactId !== undefined ? [...details.employeeEmergencyDetails.filter((dep: any) => dep.id != values.emergencyContactId), {
        id: values.emergencyContactId,
        emergencyContactPerson: values.emergencyContactPerson,
        emergencyContactNo: values.emergencyContactNo,
        emergencyRelationId: values.emergencyRelationId
    }] : affectedSection === "Emergency Contact" ? details.employeeEmergencyDetails ? [...details.employeeEmergencyDetails, { emergencyContactNo: values.emergencyContactNo, emergencyContactPerson: values.emergencyContactPerson, emergencyRelationId: values.emergencyRelationId }] : [{ emergencyContactNo: values.emergencyContactNo, emergencyContactPerson: values.emergencyContactPerson, emergencyRelationId: values.emergencyRelationId }] : details.employeeEmergencyDetails;

    const ExperienceDetails = values.experienceId ?
        [...details.employeePastExperience, { id: values.experienceId, organizationName: values.organizationName, designationId: values.designationId, fromDate: values.fromDate, toDate: values.toDate, experience: values.experience }] :
        (affectedSection === "Experience Details") ?
            details.employeePastExperience ?
                [...details.employeePastExperience, { organizationName: values.organizationName, designationId: values.designationId, fromDate: values.fromDate, toDate: values.toDate, experience: values.experience }] :
                [{ organizationName: values.organizationName, designationId: values.designationId, fromDate: values.fromDate, toDate: values.toDate, experience: values.experience }] : details.employeePastExperience;

    return {
        "instituteId": otherDetails.instituteId,
        "directorySaveFlow": updateSectionKey ? [updateSectionKey] : [],
        "branchId": otherDetails.branchId,
        "employeeBasicDetails": EmployeeDetails,
        "employeeEducationDetails": EducationDetails,
        "employeeContactDetails": ContactDetails,
        "employeeDependentDetails": DepedenciesList,
        "employeeEmergencyDetails": EmergencyContactList,
        "employeeMarriageInfo": MarriageDetails,
        "employeeCurrentJob": CurrentJobDetails,
        "employeeDesignationDetails": DesignationDetails,
        "employeePastExperience": ExperienceDetails,
        "employeeBankDetails": BankDetails,
        "employeeSalaryDetails": SalaryDetails
    }

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