
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Academic Year",
            accessor: "academicYearName",
            disableSortBy: true,
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "classShortName",
            disableSortBy: true,
        },
        {
            Header: "Subject Name",
            accessor: "subjectName",
            disableSortBy: true,
        },
        {
            Header: "Language Name",
            accessor: "languageName",
            disableSortBy: true,
        },
        {
            Header: "Language Type",
            accessor: "languageType",
            disableSortBy: true,
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ];
}

export const languagesType = [
    {
        id : "SECOND",
        name : "SECOND",
    },
    {
        id : "THIRD",
        name : "THIRD",
    }
]