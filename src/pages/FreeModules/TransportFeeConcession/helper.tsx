import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

export interface IAcademicTermTableData {
    id: number,
    termName: string,
    shortName: string,
}

export function generateColumns(actionsList: Array<IOptionsHrtl>, offset: any) {
    return ([
        {
            Header: "S.No",
            disableSortBy: true,
            Cell: ({ row: { index } }: any) => {
                const sNo = !isNaN(offset) ? (+offset + (index + 1)) : (index + 1);
                return (
                    <span>{sNo}</span>
                );
            },
        },
        {
            Header: "Branch Name",
            accessor: "branchName",
            disableSortBy: true,
        },
        {
            Header: "Concession Type",
            accessor: "concessionType",
            disableSortBy: true,
        },
        {
            Header: "Exp ( Yrs )",
            accessor: "experience",
            disableSortBy: true,
        },
        {
            Header: "Fee Particulars",
            accessor: "feeParticulars",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { transportDetails } = original;
                return (
                    <span>{transportDetails?.feeParticularName || "N/A"}</span>
                );
            },
        },
        {
            Header: "Discount Mode",
            accessor: "mode",
            disableSortBy: true,
        },
        {
            Header: "Concession",
            accessor: "percent",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { transportDetails } = original;
                return (
                    <span>{`${transportDetails?.percValue} %` || "-"}</span>
                );
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ])
}

export const concessionOptions = [
    {
        id: "EMPLOYEE",
        name: "Employee Concession"
    },
    // {
    //     id: "STUDENT",
    //     name: "Student Concession"
    // }
]

export const modeOptions = [
    {
        id: "PERCENTAGE",
        name: "Percentage"
    }, {
        id: "AMOUNT",
        name: "Amount"
    }
]

export function getExperienceOptions(totalExp: number) {
    const gracePeriodItems: any = [];
    for (let i = 0; i < totalExp; i++) {
        gracePeriodItems.push({
            id: (i + 1),
            name: (i + 1)
        })
    }
    return gracePeriodItems;
}