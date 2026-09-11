import { ITabItem } from "../../../Components/Common/Tabs";

export const tabsOptions: Array<ITabItem> = [
    {
        tabId: "overview",
        tabName: "Overview"
    },
    {
        tabId: "parent-guardian",
        tabName: "Parent / Guardian"
    },
    {
        tabId: "attendance",
        tabName: "Attendance"
    },
    {
        tabId: "student-ledger",
        tabName: "Student Ledger"
    },
    // {
    //     tabId: "schedules",
    //     tabName: "Schedules"
    // },
    {
        tabId: "report-card",
        tabName: "Report Card"
    },
    {
        tabId: "academic-performance",
        tabName: "Academic Performance"
    }
]

export const admissionTypes: Array<any> = [
    {
        id: "Non Residential",
        name: "Non-Residential"
    },
    {
        id: "Residential",
        name: "Residential"
    }
]
export const admissionCategory: Array<any> = [
    {
        id: "Sports Category",
        name: "Sports Category"
    }, {
        id: "Curriculum Category",
        name: "Curriculum Category"
    },
    {
        id: "Recommendation Category",
        name: "Recommendation Recommendation"
    }
]
export const Categories=[
    {
        id:"transferCertificate",
        value:"Transfer Certificate"
    },
    {
        id:"bonafideCertificate",
        value:"Bonafide Certificate"
    },
    {
        id:"changeStream",
        value:"Change Stream"
    },
    {
        id:"changeCurriculum",
        value:"Change Curriculum"
    },
    {
        id:"changeCampus",
        value:"Change Campus"
    }
]