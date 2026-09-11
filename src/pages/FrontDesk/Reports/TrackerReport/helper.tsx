
import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../../utility/dateutility";

export function generateColumns() {
    return [
        {
            Header: 'Application No',
            accessor: 'applicationNo',
            disableSortBy: true,
        },
        {
            Header: "Reg No",
            accessor: "regNo",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
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
                            displayId={original?.studentCode || "-"}
                            showAvatar={false}
                        />
                    </>
                );
            },
        },
        {
            Header: "Parent Name",
            accessor: "parentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
            Cell: ({ row: { original } }: any) => {
                return <div style={{ minWidth: "5rem" }}>{original?.className}</div>
            }
        },
        {
            Header: "Admission Type",
            accessor: "admissionType",
            disableSortBy: true,
        },
        {
            Header: "Email",
            accessor: "email",
            disableSortBy: true,
        },
        {
            Header: "Contact No",
            accessor: "smsPriorityNo",
            disableSortBy: true,
        },
        {
            Header: "Father No",
            accessor: "fatherNo",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Father Email",
            accessor: "fatherEmail",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Mother No",
            accessor: "motherNo",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Mother Email",
            accessor: "motherEmail",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Application Sale",
            accessor: "applicationSale",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Application Sale Date",
            accessor: "applicationSaleDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Registration",
            accessor: "registration",
            disableSortBy: true,
            Cell: ({ value }: any) => <>
                {value ? <StatusLabel type={value} labelName={value} /> : '-'}
            </>
        },
        {
            Header: "Registration Date",
            accessor: "registrationDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Scrutiny",
            accessor: "scrutiny",
            disableSortBy: true,
            Cell: ({ value }: any) => <>
                {value ? <StatusLabel type={value} labelName={value} /> : '-'}
            </>
        },
        {
            Header: "Scrutiny Date",
            accessor: "scrutinyDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Examination Schedule",
            accessor: "examinationSchedule",
            disableSortBy: true,
            Cell: ({ value }: any) => <>
                {(value && value !== 'NA') ? <StatusLabel type={value} labelName={value} /> : '-'}
            </>
        },
        {
            Header: "Examination Schedule Date",
            accessor: "examinationScheduleDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Examination Date",
            accessor: "examinationDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Marks Entry",
            accessor: "marksEntry",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Marks Entry Date",
            accessor: "marksEntryDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Interview Schedule",
            accessor: "interviewSchedule",
            disableSortBy: true,
            Cell: ({ value }: any) => <>
                {value ? <StatusLabel type={value} labelName={value} /> : '-'}
            </>
        },
        {
            Header: "Interview Scheduled Date",
            accessor: "interviewScheduledDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Interview Date",
            accessor: "interviewDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Observation And Interview Result",
            accessor: "observationAndInterviewResult",
            disableSortBy: true,
            Cell: ({ value }: any) => <>
                {value ? <StatusLabel type={value} labelName={value} /> : '-'}
            </>
        },
        {
            Header: "Interview Result",
            accessor: "interviewResult",
            disableSortBy: true,
            Cell: ({ value }: any) => <>
                {value ? <StatusLabel type={value} labelName={value} /> : '-'}
            </>
        },
        {
            Header: "Interview Result Date",
            accessor: "interviewResultDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Changed Class",
            accessor: "changedClass",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Changed Class Date",
            accessor: "changedClassDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
        {
            Header: "Admission",
            accessor: "admission",
            disableSortBy: true,
            Cell: ({ value }: any) => <>
                {value ? <StatusLabel type={value} labelName={value} /> : '-'}
            </>
        },
        {
            Header: "Admission Date",
            accessor: "admissionDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || '-'}</>
        },
    ];
}
