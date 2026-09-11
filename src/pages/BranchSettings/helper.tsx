import { IOptionsHrtl,MenuOptionHrtl,MoreActions } from "../../Components/Common/MenuOptions"

interface IMenuOptions {
    id: string,
    labelName: string
}
export const MenuOptions: Array<IMenuOptions> = [
    {
        id: "branch-profile",
        labelName: "Branch Profile"
    },
    {
        id: "academics",
        labelName: "Academics"
    },
    // {
    //     id: "class-wise-academic-year",
    //     labelName: "Class Wise Academic Year"
    // },
    {
        id: "branch-area",
        labelName: "Branch Area"
    },
    {
        id: "branch-logo",
        labelName: "Branch Logo's"
    },
    // {
    //     id: "departments",
    //     labelName: "Departments"
    // },
    // {
    //     id: "academic-years",
    //     labelName: "Academic Years"
    // },
    {
        id: "academic-terms",
        labelName: "Class Wise Term Date"
    },
    {
        id: "approval-configuration",
        labelName: "Approval Configuration"
    }
]

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Subject",
            accessor: "subject",
            disableSortBy:true,
        },
        {
            Header: "Type of Work",
            accessor: "typeofWork",
            disableSortBy:true,
        },
        {
            Header: "File Name",
            accessor: "fileName",
            disableSortBy:true,
        },
        {
            Header: "Posted Date",
            accessor: "postedDate",
            disableSortBy:true,
        },
        {
            Header: "Download",
            disableSortBy:true,
            filterable: false,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ])
}
export const homeWorkData=[
    {
        id:1,
        subject:"Telugu",
        typeofWork:"Holiday Work/Home Work",
        fileName:"7Th Class 2Nd Lang Text Book",
        postedDate:"10-12-2022",
    },
    {
        id:2,
        subject:"Telugu",
        typeofWork:"Holiday Work/Home Work",
        fileName:"7Th Class 2Nd Lang Text Book",
        postedDate:"10-12-2022",
    }
]