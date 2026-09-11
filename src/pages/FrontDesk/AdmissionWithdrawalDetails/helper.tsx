import { UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDisplayDateForTableFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
import { StatusLabel } from "../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.studentName}
                            displayId={original?.studentCode}
                            size={"xs"}
                            defaultImgType="student"
                        />
                    </>
                );
            },
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (value || "-")
            },
        },

        {
            Header: "Request Date",
            accessor: "fromDate",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span className="tw-text-nowrap">{getDisplayDateForTableFormat(value)}</span>)
            },
        },
        {
            Header: "Attended the School ?",
            accessor: "studentAttendedSchool",
            disableSortBy: true,
        },
        {
            Header: "Last Attended Date",
            accessor: "lastAttendDate",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span className="tw-text-nowrap">{getDisplayDateForTableFormat(value)}</span>)
            },

        },
        {
            Header: "Reason",
            accessor: "reason",
            disableSortBy: true,
        },
        {
            Header: "Status",
            accessor: "approvedStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const data = original?.approvedStatus;
                return (
                    <StatusLabel type={data} labelName={data} />
                );
            },
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
                const status = original?.approvedStatus;
                if (status && status?.toLowerCase() === "approved") {
                    return null;
                }
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.admissionWithdrawlId} />
                );
            },
        },
    ];
}
