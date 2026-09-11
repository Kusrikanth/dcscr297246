import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

interface IRoleTypesTableData {
    id: number,
    roleName: string
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Role Name",
            accessor: "name"
        },
        {
            Header: "Role Type",
            accessor: "roleType",
            disableSortBy: true,
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


export const roleTypeData: Array<IRoleTypesTableData> = [
    {
        id: 1,
        roleName: "Admin"
    }, {
        id: 2,
        roleName: "Teacher"
    },
    {
        id: 3,
        roleName: "Accountant"
    },
    {
        id: 4,
        roleName: "Librarian"
    },
    {
        id: 5,
        roleName: "Students"
    },
    {
        id: 6,
        roleName: "Parents"
    }
]

export const userRoleTypes = [
    {
        id: "STUDENT",
        name: "Student"
    },
    {
        id: "PARENT",
        name: "Parent"
    },
    {
        id: "EMPLOYEE",
        name: "Employee"
    }
]