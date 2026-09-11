import { ITabItem } from "../../../Components/Common/Tabs";
import { IMoreActions, IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MoreActions, UserDetails } from "../../../Components/Common";

import { getDdMmYyyyFormat } from "../../../utility/dateutility";
export interface IAcademicTermTableData {
    id: number,
    termName: string,
    shortName: string,
}
export const tabsOptions: Array<ITabItem> = [
    {
        tabId: "",
        tabName: "All Institute",
        badgeCount: 60,
    },
    {
        tabId: "APPROVED",
        tabName: "Approved Institute",
        badgeCount: 30,
    },
    {
        tabId: "PENDING",
        tabName: "Pending Institute",
        badgeCount: 10
    },
    {
        tabId: "REJECTED",
        tabName: "Rejected Institute",
        badgeCount: 10
    }
]

function getMenuOptionByStatus(status: string, menuOptions: Array<any>) {
    switch (status) {
        case "REJECTED":
        case "APPROVED":
            return menuOptions.filter(item => (item.id === "view" || item.id === "delete"));
        default:
            return menuOptions;
    }
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Institute Name",
            accessor: "instituteName",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayId={original.instituteCode}
                        displayName={original.instituteName}
                    />
                );
            },
        },
        {
            Header: "Website",
            accessor: "website",
            Cell: ({ value }: any) => {
                return (<span className="text-info">{value}</span>)
            }
        },
        {
            Header: "Email Id",
            accessor: "emailid",
        },
        {
            Header: "Phone Number",
            accessor: "phoneno",
        },
        {
            Header: "License Expiry Date",
            accessor: "licenseExpiryDate",
            Cell: ({ value }: any) => {
                return (<span>{getDdMmYyyyFormat(value)}</span>)
            }
        },
        {
            Header: "Status",
            accessor: "status",
            filterable: false,
            Cell: ({ row: { original } }: any) => {
                return (
                    <StatusLabel type={original.status} labelName={original.status} />
                );
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MoreActions
                        actionOptions={getMenuOptionByStatus(original.status, actionsList)}
                        rowId={original.id} isHorizontal={true} />
                );
            },
        },
    ])
}

export interface IInstituteData {
    id: number,
    instituteName: string,
    instituteId: string,
    referenceId: string,
    emailId: string,
    phoneNumber: string,
    date: string,
    // eslint-disable-next-line no-restricted-globals
    status: String
}

export const branchData: Array<IInstituteData> = [
    {
        id: 1,
        instituteName: "Delhi Public School",
        instituteId: "INS00001",
        referenceId: "ICD000CV57",
        emailId: "delhipublic@gmail.com",
        phoneNumber: "+91-1234567890",
        date: "15-03-2022",
        status: "Approved"
    },
    {
        id: 2,
        instituteName: "Pallavi International School",
        instituteId: "INS00002",
        referenceId: "ICD000CV59",
        emailId: "pallavschool@gmail.com",
        phoneNumber: "+91-1234567390",
        date: "15-03-2022",
        status: "Pending"
    }
]