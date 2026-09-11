
const generateDynamicColumns = (classTypes?: any) =>
    classTypes
        ? classTypes?.map((sub: any, index: any) => ({
            Header: sub?.shortName,
            accessor: `class_${sub?.id}`,
            disableSortBy: true,
            thClass: 'reset-wrap',
            columnClassName: 'tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px] tw-text-center',
            Cell: ({ value }: any) => {
                const style: any = Number(value) ? {} : { color: '#999' };
                return (<span style={style}>{value}</span>)
            },
        }))
        : [];


export function generateColumns(classTypes: any, viewDetailsModalHandler: any) {
    return [
        {
            Header: "S No",
            accessor: "sNo",
            columnClassName: "sticky-left",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => {
                return (<span>{index + 1}</span>)
            },
        },
        {
            Header: "Admission Process",
            accessor: "reportName",
            disableSortBy: true,
            columnClassName: 'sticky-left tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]',
        },
        ...generateDynamicColumns(classTypes),
        {
            Header: "Grand Total",
            accessor: "grandTotal",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { grandTotal, admissionProcess } = original;
                if (admissionProcess === "proposedAdmission") {
                    return (
                        <span className="fw-bold">{grandTotal}</span>
                    )
                } else {
                    return (<span className="fw-bold tw-cursor-pointer tw-text-blue-500 tw-underline"
                        data-process={admissionProcess}
                        tabIndex={-1} onClick={viewDetailsModalHandler}>
                        <u>{grandTotal}</u></span>)
                }

            },
        },
    ];
}

const info = {
    scrutinyAccepted: "ScrutinyAccepted",
    scrutinyRejected: "ScrutinyRejected"
}
export function generateReportsData(classList: any, reportTypes: any, reportsData: any) {
    if (Array.isArray(classList) && Array.isArray(reportsData) && reportTypes) {
        const reportKeys = Object.keys(reportTypes);
        const classKeys = classList.reduce((obj, item) => {
            const { id } = item,
                keyName = `class_${id}`;
            obj[keyName] = item;
            return obj;
        }, {});
        const classWiseReportsData = reportsData.reduce((obj, item) => {
            const { branchClassId } = item,
                keyName = `class_${branchClassId}`;
            obj[keyName] = item;
            return obj;
        }, {});
        const tableData: any = [];
        for (let i = 0; i < reportKeys.length; i++) {
            const classObj: any = {};
            let grandTotal = 0;
            Object.keys(classKeys).forEach(item => {
                classObj[item] = classWiseReportsData[item]?.[reportKeys[i]];
                grandTotal += Number(classWiseReportsData[item]?.[reportKeys[i]]);
            })
            tableData.push({
                reportName: reportTypes?.[reportKeys[i]],
                admissionProcess: reportKeys[i],
                ...classObj,
                grandTotal: isNaN(grandTotal) ? null : grandTotal,
            })
        }
        return tableData;
    }
    return [];
}


export function generateReportDetailsColumns(admissionProcess: string) {
    return ([
        {
            id: "academicYear",
            Header: "Academic year",
            accessor: "academicYear",
            disableSortBy: true,
        },
        {
            id: "branch",
            Header: "Campus",
            accessor: "branch",
            disableSortBy: true,
        },
        {
            id: "curriculum",
            Header: "Curriculum",
            accessor: "curriculum",
            disableSortBy: true,
        },
        {
            id: "classShortName",
            Header: "Class",
            accessor: "classShortName",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap"
        },
        {
            id: "applicationNo",
            Header: "Application Number",
            accessor: "applicationNo",
            disableSortBy: true
        },
        {
            id: "registrationNo",
            Header: "Registration Number",
            accessor: "registrationNo",
            disableSortBy: true,
        },
        {
            id: "studentName",
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px]",
        },
        {
            id: "studentId",
            Header: "Student Id",
            accessor: "studentId",
            disableSortBy: true,
        },
        {
            id: "parentName",
            Header: "Parent Name",
            accessor: "parentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px]",
        },
        {
            id: "email",
            Header: "Email",
            accessor: "email",
            disableSortBy: true,
        },
        {
            id: "contactNo",
            Header: "Contact Number",
            accessor: "contactNo",
            disableSortBy: true,
        },
        {
            id: "smsPriorityNo",
            Header: "SMS Priority No",
            accessor: "smsPriorityNo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { contactNo } = original;
                return <span>{contactNo}</span>;
            }
        },
        {
            id: "applicationSaleDate",
            Header: "Application Sale Date",
            accessor: "applicationSaleDate",
            disableSortBy: true,
        },
        {
            id: "admissionProcessReg",
            Header: "Current Status",
            accessor: "admissionProcessReg",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap"
        },
        {
            id: "scrutinyDate",
            Header: "Scrutinity Date",
            accessor: "scrutinyDate",
            disableSortBy: true
        },
        {
            id: "registrationDate",
            Header: "Registration Date",
            accessor: "registrationDate",
            disableSortBy: true,
        },
        {
            id: "examDate",
            Header: "Interview Date",
            accessor: "examDate",
            disableSortBy: true,
        },
        {
            id: "scheduleMode",
            Header: "Schedule Mode",
            accessor: "scheduleMode",
            disableSortBy: true,
        },
        // {
        //     id: "scheduleStatus",
        //     Header: "Schedule Status",
        //     accessor: "scheduleStatus",
        //     disableSortBy: true,
        // },
        {
            id: "scruitinityDateOrExamMarksSent",
            Header: "Scruitinity Date Or ExamMarksSend",
            accessor: "scruitinityDateOrExamMarksSent",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { examDate } = original;
                return <span>{examDate}</span>;
            }
        }
    ])
}

export const visibleColumns: any = {
    totalApplications: ["academicYear", "branch", "curriculum", "classShortName", "applicationNo",
        "studentName", "parentName", "email", "contactNo", "applicationSaleDate"],
    cancelledApplications: ["academicYear", "branch", "curriculum", "classShortName", "applicationNo",
        "studentName", "parentName", "email", "contactNo"],
    yetToRegister: ["academicYear", "branch", "curriculum", "classShortName", "applicationNo", "studentName", "parentName",
        "email", "contactNo", "applicationSaleDate"],
    pendingRegistrations: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "applicationSaleDate"],
    cancelledRegistrations: ["academicYear", "branch", "curriculum", "classShortName", "registrationNo",
        "studentName", "email", "smsPriorityNo"],
    registrationCompletedOrScrutinyPending: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo"],
    scrutinyOnHold: ["academicYear", "branch", "curriculum", "classShortName", "registrationNo",
        "studentName", "email", "smsPriorityNo"],
    scrutinyRejected: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo"],
    scrutinyAccepted: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo"],
    yetToExamSchedule: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "scrutinyDate", "registrationDate"],
    examinationScheduledOrYetToExamScheduleResultEntry: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],
    noOfFailed: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],
    noOfAbsent: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode", "scheduleStatus"],
    noOfCancelledExamination: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo"],
    noOfPassed: ["academicYear", "branch", "curriculum", "classShortName", "registrationNo",
        "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],
    yetToScheduleForObsTest: ["academicYear", "branch", "curriculum", "classShortName", "registrationNo",
        "studentName", "email", "smsPriorityNo", "scruitinityDateOrExamMarksSent"],
    scheduledForObsTest: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],
    noOfObsTestCancelled: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo"],
    yetToObsTestResultEntry: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],
    absent: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],
    attended: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],

    pendingOrRejected: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],

    selected: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],

    interviewResultAdmissionCancelled: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],
    siblings: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "email", "smsPriorityNo", "interviewDate", "scheduleMode"],
    paid: ["academicYear", "branch", "curriculum", "classShortName",
        "registrationNo", "studentName", "studentId", "email", "smsPriorityNo"],
}