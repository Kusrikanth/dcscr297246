import { StatusLabel, UserDetails } from "../../../Components/Common";

export function generateColumns() {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                      displayName={original?.studentName}
                      displayId={original?.studentCode}
                      size={"xs"}
                      imageUrl={original?.imageUrl}
                      defaultImgType="student"
                    />
                );
            },
        },
        {
            Header:"Curriculum",
            accessor:"curriculumName",
            disableSortBy: true,
        },
        {
            Header:"Class",
            accessor:"className",
            disableSortBy: true,
        },
        {
            Header:"Section",
            accessor:"sectionName",
            disableSortBy: true,
        },
        {
            Header:"SMS Priority No.",
            accessor:"smspriorityNo",
            disableSortBy: true,
        },
       
          {
            Header:"Remarks",
            accessor:"remarks",
            disableSortBy: true,
        },
        {
            Header:"Status",
            accessor:"confirmationStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return <StatusLabel type={original?.confirmationStatus} labelName={original?.confirmationStatus} />
            }
        },
    ];
}
