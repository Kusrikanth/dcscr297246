import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Academic Year",
            accessor: "academicYearName",
            disableSortBy: true
        },
        {
            Header: "Curriculum Name",
            accessor: "curriculumName",
            disableSortBy: true
        },
        {
            Header: "Short Name",
            accessor: "shortName",
            disableSortBy: true
        },
        {
            Header: "Affiliation Number",
            accessor: "affiliationNo",
            disableSortBy: true
        },
        {
            Header: "School Code",
            accessor: "schoolCode",
            disableSortBy: true
        },
        // {
        //     Header: "Actions",
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         return (
        //             <MenuOptionHrtl actionOptions={actionsList} rowId={original?.branchCurriculumId} />
        //         );
        //     },
        // },
    ])
}