import { UserDetails } from "../../../../../../Components/Common";

export function generateColumnsTopStudents() {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "w-200px min-w-200px max-w-200px",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayName={original?.studentName}
                        displayId={original?.studentCode}
                        size={"xs"}
                        defaultImgType="student"
                    />
                );
            },
        },
        {
            Header: "Section",
            accessor: "sectionName",
            disableSortBy: true,
        }, {
            Header: "Score",
            accessor: "totalScore",
            Cell: ({ row }: any) => {
                const { totalScore, totalMarks } = row.original;
                return `${totalScore}/${totalMarks}`;
            },
        },
        {
            Header: "Accuracy (in %)",
            accessor: "accuracyPerc",
            Cell: ({ value }: any) => `${value}%`,
        },
        {
            Header: "Time Used (mins)",
            accessor: "timeUsedMinutes",
        },
        {
            Header: "Rank",
            accessor: "position",
        },
    ];
}
