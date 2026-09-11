import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

interface IRegistrationInstructionTableData {
    id: number,
    instituteId: number,
    branchId: number,
    curriculumId: number,
    type: string,
    createdDate: string
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Type",
            accessor: "type",
            disableSortBy: true,
        },
        {
            Header: "Branch Name",
            accessor: "branchName",
            disableSortBy: true,
        },
        {
            Header: "Curriculum Name",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Created Date",
            accessor: "createdDate",
            disableSortBy: true,
            Cell:({row:{original}}:any)=>{
                return getDdMmYyyyWithMonthNameFormat(new Date(original.createdDate))
              }
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

