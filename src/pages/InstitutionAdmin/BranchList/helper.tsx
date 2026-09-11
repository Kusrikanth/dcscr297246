import { ITabItem } from "../../../Components/Common/Tabs";
import { IMoreActions, IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MoreActions, UserDetails } from "../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";


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
            Header: "Branch Name",
            accessor: "branchName",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayId={original.shortCode}
                        displayName={original.branchName}
                    />
                );
            },
        },
        {
            Header: "Institute Name",
            accessor: "instituteName",
        },
        {
            Header: "Cotact Name",
            accessor: "contactName",
        },
        {
            Header: "Email Id",
            accessor: "mailId",
        },
        {
            Header: "Phone Number",
            accessor: "phoneNumber",
        },
        {
            Header: "Modified Date",
            accessor: "lastModifiedAt",
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

export interface IBRanchData {
    id: number,
    branchName: string,
    branchId: string,
    instituteName: string,
    instituteId: string,
    referenceId: string,
    emailId: string,
    phoneNumber: string,
    date: string,
    // eslint-disable-next-line no-restricted-globals
    status: String
}

export const branchData: Array<IBRanchData> = [
    {
        id: 1,
        branchName: "Nacharam",
        branchId: "SC84815",
        instituteName: "Delhi Public School",
        instituteId: "INS00001",
        referenceId: "ICD000CV57",
        emailId: "delhipublic@gmail.com",
        phoneNumber: "+91-1234567890",
        date: "15-03-2022",
        status: "Rejected"
    },
    {
        id: 2,
        branchName: "Mahendra Hills",
        branchId: "SC84816",
        instituteName: "Delhi Public School",
        instituteId: "INS00002",
        referenceId: "ICD000CV59",
        emailId: "pallavschool@gmail.com",
        phoneNumber: "+91-1234567390",
        date: "15-03-2022",
        status: "Approved"
    },
    {
        id: 3,
        branchName: "Delhi",
        branchId: "SC84817",
        instituteName: "Pallavi International School",
        instituteId: "INS00002",
        referenceId: "ICD000CV59",
        emailId: "pallavschool@gmail.com",
        phoneNumber: "+91-1234567390",
        date: "15-03-2022",
        status: "Pending"
    }
]