import { UserDetails } from "../../../Components/Common";

export const recordTypes = [
    { id: "NEW_ADMISSION", type: "New Admission" },
    { id: "OLD_ADMISSION", type: "Old Admission" },
    { id: "REGISTRATION", type: "Registration" }
];

export function generateColumns() {
    return [
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
            Header:"Student Name",
            accessor:"studentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px]",
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
            Header:"Health Status",
            accessor:"healthStatus",
            disableSortBy: true,
        },
        {
            Header:"Allergic",
            accessor:"allergicTo",
            disableSortBy: true,
        },
        {
            Header:"Blood Group",
            accessor:"bloodGroupName",
            disableSortBy: true,
        },
    ];
}
