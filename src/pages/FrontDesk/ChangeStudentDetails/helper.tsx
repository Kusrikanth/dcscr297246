import { MoreActions, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header:"Registration ID",
            accessor:"registrationId",
            disableSortBy: true,
        },
        {
            Header: "Student Name",
            accessor: "studentName",
            columnClassName: "tw-w-[180px] tw-min-w-[180px]",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.studentName}
                            displayId={original?.studentCode}
                            showAvatar={false}
                        />
                    </>
                );
            },
        },
        {
            Header:"Applied for Curriculum",
            accessor:"appliedForCurriculum",
            disableSortBy: true,
        },
        {
            Header: "Change to Curriculum",
            accessor: "changeToCurriculum",
            disableSortBy: true,
        },
        {
            Header: "Applied for Class",
            accessor: "appliedForClass",
            disableSortBy: true,
        },
        {
            Header: "Change to Class",
            accessor: "changeToClass",
            disableSortBy: true,
        },
        {
            Header: "Applied for Second Language",
            accessor: "appliedForSecondLanguage",
            columnClassName: "w-200px min-w-200px",
            disableSortBy: true,
        },
        {
            Header: "Change to Second Language",
            accessor: "changeToSecondLanguage",
            disableSortBy: true,
        },
        {
            Header: "Applied for Third Language",
            accessor: "appliedForThirdLanguage",
            disableSortBy: true,
        },
        {
            Header: "Change to Third Language",
            accessor: "changeToThirdLanguage",
            disableSortBy: true,
        },
        {
            Header:"Created By",
            accessor:"createdBy",
            disableSortBy:true,
            Cell:({row:{original}}:any)=>{
              return <span>{original.createdBy ? original.createdBy : "-"}</span>
            }
        },
        {
            Header: "Created Date",
            accessor: "createdAt",
            disableSortBy: true,
            Cell:({row:{original}}:any)=>{
                const [date,time] = original?.createdAt?.split("T") ?? [];
                return <UserDetails
                displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
                displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
                showAvatar={false}
                ></UserDetails>
            }
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (
              <MenuOptionHrtl actionOptions={actionsList} rowId={original.id}  />
              );
            },
          },
    ];
}