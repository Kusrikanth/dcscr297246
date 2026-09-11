import { UserDetails } from '../../../../../Components/Common';
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";


export function generateInternalSubjectGradesColumns(actionList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
            columnClassName: "w-250px min-w-250px max-w-250px",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayName={original?.className || "-"}
                        displayId={original?.curriculumName || "-"}
                        showAvatar={false}
                    />
                );
            },
        },
        {
            Header: "Domain",
            accessor: "domainName",
            disableSortBy: true,
        },
        {
            Header: "Grade",
            accessor: "grade",
            disableSortBy: true,
        },
        {
            Header: "Grade Point",
            accessor: "gradePoints",
            disableSortBy: true,
        },
        {
            Header:"Created By",
            accessor:"createdBy",
            disableSortBy:true,
            Cell:({row:{original}}:any)=>{
              return <span>{original.createdByName ? original.createdByName : "-"}</span>
            }
        },
        {
            Header: "Action",
            thClass: "w-5",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
                );
            },
        },
    ];
}
