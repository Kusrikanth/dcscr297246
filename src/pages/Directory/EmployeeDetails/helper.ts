import { ITabItem } from "../../../Components/Common/Tabs";

export const tabsOptions: Array<ITabItem> = [
    {
        tabId: "personal-info",
        tabName: "Personal Information"
    },
    {
        tabId : "job-info",
        tabName : 'Job Information'
    },
    {
        tabId : "salary-info",
        tabName : 'Salary Information'
    },
    {
        tabId : "documents",
        tabName : 'Documents'
    }
    // ,
    // {
    //     tabId: "reporting-manager",
    //     tabName: "Reporting Manager"
    // },
    // {
    //     tabId: "attendance",
    //     tabName: "Attendance"
    // },
    // {
    //     tabId: "leaves",
    //     tabName: "Leaves"
    // },
    // {
    //     tabId: "feedback",
    //     tabName: "Feedback"
    // },
]

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

export const BooleanType=[
    {
        id: "true",
        value: "Yes"
    },
    {
        id: "false",
        value: "No"
    }
]

export const EligibilityStatus=[
    {
        eligibilityId:"true",
        eligibilityValue: "Eligible",
    },
    {
        eligibilityId:"false",
        eligibilityValue: "Not Eligible",
    },
]

export const EmployeeType = [
    {
        employeeType:"FULL_TIME"
    },
    {
        employeeType:"HALF_TIME"
    }
]

export const SourceOfHire = [
    {
        sourceOfHire:"naukri-portal"
    },
    {
        sourceOfHire:"Linkedin"
    },
    {
        sourceOfHire:"Indeed"
    },
    {
        sourceOfHire:"Referral"
    },
    {
        sourceOfHire:"Others"
    }
]