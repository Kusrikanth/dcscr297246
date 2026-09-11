import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../../utility/dateutility";

export function generateColumns(attendanceReportFilterState: any,toggleStudentCountModal:any) {
    return [

        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "shortName",
            disableSortBy: true,
        },
        {
            Header: "Section",
            accessor: "sectionName",
            disableSortBy: true,
        },
        {
            Header: attendanceReportFilterState?.attendanceStatus === "NOT_MARKED" ? "Not Marked Day" : "Marked Day",
            accessor: "date",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return getDdMmYyyyFormat(new Date(original?.date));
            },
        },
        {
            Header: "Absent Count",
            accessor: "absentCount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { absentCount } = original;
                return (
                    <>
                       { absentCount ? <div onClick={()=>toggleStudentCountModal(original,"ABSENT")} className="text-info cursor-pointer text-decoration-underline" >{absentCount}</div> : absentCount}
                    </>
                );
            },
        },
        {
            Header: "Present Count",
            accessor: "presentCount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { presentCount } = original;
                return (
                    <>
                       { presentCount ? <div onClick={()=>toggleStudentCountModal(original,"PRESENT")} className="text-info cursor-pointer text-decoration-underline" >{presentCount}</div> : presentCount}
                    </>
                );
            },
        },
        {
            Header: "Not Marked Count",
            accessor: "notMarkedCount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { notMarkedCount } = original;
                return (
                    <>
                       { notMarkedCount ? <div onClick={()=>toggleStudentCountModal(original,"NOT_MARKED")} className="text-info cursor-pointer text-decoration-underline" >{notMarkedCount}</div> : notMarkedCount}
                    </>
                );
            },
        },
        {
            Header: "Teacher Name",
            accessor: "employeeName",
            disableSortBy: true,
        },

    ];
}

export function generateColumnsForStuCount() {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
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
            Header: "Roll Number",
            accessor: "rollNo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <span>{original?.rollNo || "N/A"}</span>
                    </>
                );
            },
        },
        {
            Header: "Attendance Status",
            accessor: "attendance",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const status = original?.attendance;
                return <StatusLabel type={status} labelName={status} />;
            }
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true,
        },
    ];
}

export const MonthNames = [
    { id: "JANUARY", name: "JANUARY" },
    { id: "FEBRUARY", name: "FEBRUARY" },
    { id: "MARCH", name: "MARCH" },
    { id: "APRIL", name: "APRIL" },
    { id: "MAY", name: "MAY" },
    { id: "JUNE", name: "JUNE" },
    { id: "JULY", name: "JULY" },
    { id: "AUGUST", name: "AUGUST" },
    { id: "SEPTEMBER", name: "SEPTEMBER" },
    { id: "OCTOBER", name: "OCTOBER" },
    { id: "NOVEMBER", name: "NOVEMBER" },
    { id: "DECEMBER", name: "DECEMBER" }
];

