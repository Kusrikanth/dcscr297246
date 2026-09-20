// Active / Inactive student analysis for the Directory dashboard.
// Active counts are a snapshot "as on" a date: admissions after that date are excluded and the
// status is derived from the student's last attended date (mse_student_details) on the backend.

export const admissionTypeFilterOptions = [
    { id: "BOTH", name: "Both" },
    { id: "NEW_ADMISSION", name: "New Admissions" },
    { id: "OLD_ADMISSION", name: "Old Admissions" },
];

// "Day Scholar" is the user-facing name for the "Non-Residential" value the Directory
// module already stores, so the ids stay aligned with the existing student data.
export const residentialStatusFilterOptions = [
    { id: "BOTH", name: "Both" },
    { id: "Non-Residential", name: "Day Scholar" },
    { id: "Residential", name: "Residential" },
];

// Metric keys the API returns per section row. Everything else (class / curriculum totals,
// the two group totals) is rolled up from these on the client.
export const STATUS_METRIC_KEYS = [
    "activeNewAdmissions",
    "activeOldAdmissions",
    "inactiveTcApplied",
    "inactiveNotReporting",
    "inactiveAdmissionWithdraw",
];

// TODO: remove once the student-status-analysis API is available. Lets the UI be reviewed without a backend.
export const USE_SAMPLE_STUDENT_STATUS_ANALYSIS = true;
export const sampleStudentStatusAnalysis: Array<any> = [
    { curriculumId: 1, curriculumName: "CBSE", classId: 11, className: "I", classShortName: "I", classSequence: 1, sectionId: 111, sectionName: "I-A", activeNewAdmissions: 6, activeOldAdmissions: 12, inactiveTcApplied: 1, inactiveNotReporting: 2, inactiveAdmissionWithdraw: 0 },
    { curriculumId: 1, curriculumName: "CBSE", classId: 11, className: "I", classShortName: "I", classSequence: 1, sectionId: 112, sectionName: "I-B", activeNewAdmissions: 4, activeOldAdmissions: 9, inactiveTcApplied: 0, inactiveNotReporting: 1, inactiveAdmissionWithdraw: 1 },
    { curriculumId: 1, curriculumName: "CBSE", classId: 12, className: "II", classShortName: "II", classSequence: 2, sectionId: 121, sectionName: "II-A", activeNewAdmissions: 3, activeOldAdmissions: 14, inactiveTcApplied: 2, inactiveNotReporting: 0, inactiveAdmissionWithdraw: 0 },
    { curriculumId: 1, curriculumName: "CBSE", classId: 13, className: "III", classShortName: "III", classSequence: 3, sectionId: 131, sectionName: "III-A", activeNewAdmissions: 2, activeOldAdmissions: 16, inactiveTcApplied: 0, inactiveNotReporting: 3, inactiveAdmissionWithdraw: 1 },
    { curriculumId: 1, curriculumName: "CBSE", classId: 19, className: "IX", classShortName: "IX", classSequence: 9, sectionId: 191, sectionName: "IX-A", activeNewAdmissions: 1, activeOldAdmissions: 21, inactiveTcApplied: 3, inactiveNotReporting: 1, inactiveAdmissionWithdraw: 2 },
    { curriculumId: 2, curriculumName: "CAMBRIDGE INTERNATIONAL", classId: 21, className: "I", classShortName: "I", classSequence: 1, sectionId: 211, sectionName: "I-A", activeNewAdmissions: 5, activeOldAdmissions: 7, inactiveTcApplied: 1, inactiveNotReporting: 0, inactiveAdmissionWithdraw: 0 },
    { curriculumId: 2, curriculumName: "CAMBRIDGE INTERNATIONAL", classId: 22, className: "II", classShortName: "II", classSequence: 2, sectionId: 221, sectionName: "II-A", activeNewAdmissions: 2, activeOldAdmissions: 11, inactiveTcApplied: 0, inactiveNotReporting: 2, inactiveAdmissionWithdraw: 1 },
];

// Sample-mode only: mimics the admission-type filter so the UI can be exercised without a backend.
// Delete along with USE_SAMPLE_STUDENT_STATUS_ANALYSIS.
export function applySampleAdmissionTypeFilter(rows: Array<any>, admissionType: string) {
    if (!admissionType || admissionType === "BOTH") return rows;
    return rows.map((row: any) => ({
        ...row,
        activeNewAdmissions: admissionType === "NEW_ADMISSION" ? row.activeNewAdmissions : 0,
        activeOldAdmissions: admissionType === "OLD_ADMISSION" ? row.activeOldAdmissions : 0,
    }));
}

function sumMetrics(rows: Array<any>) {
    return STATUS_METRIC_KEYS.reduce((acc: any, key: string) => {
        acc[key] = rows.reduce((total: number, row: any) => total + (+row?.[key] || 0), 0);
        return acc;
    }, {});
}

function withDerivedTotals(row: any) {
    const activeTotal = (+row?.activeNewAdmissions || 0) + (+row?.activeOldAdmissions || 0);
    const inactiveTotal =
        (+row?.inactiveTcApplied || 0) +
        (+row?.inactiveNotReporting || 0) +
        (+row?.inactiveAdmissionWithdraw || 0);
    return { ...row, activeTotal, inactiveTotal };
}

// Flattens the API's section-level rows into the Curriculum > Class > Section tree the
// expandable table renders, rolling counts up at each level.
export function buildStudentStatusRows(response: any) {
    if (!Array.isArray(response) || response.length === 0) return [];

    const grouped = response.reduce((acc: any[], curr: any) => {
        const {
            curriculumId, curriculumName,
            classId, className, classShortName, classSequence,
            sectionId, sectionName,
        } = curr || {};

        const sectionRow = withDerivedTotals({
            ...STATUS_METRIC_KEYS.reduce((acc1: any, key: string) => {
                acc1[key] = +curr?.[key] || 0;
                return acc1;
            }, {}),
            sectionId,
            sectionName,
            showName: sectionName,
        });

        const curriculumIdx = acc.findIndex((item: any) => `${item.curriculumId}` === `${curriculumId}`);

        if (curriculumIdx === -1) {
            acc.push({
                curriculumId,
                curriculumName,
                showName: "Total",
                subRows: [{
                    classId, className, classSequence,
                    showName: classShortName || className,
                    subRows: [sectionRow],
                }],
            });
            return acc;
        }

        const classIdx = acc[curriculumIdx].subRows.findIndex((item: any) => `${item.classId}` === `${classId}`);

        if (classIdx === -1) {
            acc[curriculumIdx].subRows.push({
                classId, className, classSequence,
                showName: classShortName || className,
                subRows: [sectionRow],
            });
        } else {
            acc[curriculumIdx].subRows[classIdx].subRows.push(sectionRow);
        }

        return acc;
    }, []);

    return grouped.map((curriculum: any) => {
        const classRows = [...curriculum.subRows]
            .sort((a: any, b: any) => (+a.classSequence || 0) - (+b.classSequence || 0))
            .map((classRow: any) => withDerivedTotals({ ...classRow, ...sumMetrics(classRow.subRows) }));

        return withDerivedTotals({ ...curriculum, ...sumMetrics(classRows), subRows: classRows });
    });
}

function countColumn(header: string, accessor: string) {
    return {
        Header: header,
        accessor,
        columnClassName: "tw-text-center",
        footerClassName: "tw-text-center",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => original?.[accessor] || 0,
    };
}

export function generateColumns() {
    return [
        {
            id: "expander",
            disableSortBy: true,
            Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
                <span
                    {...getToggleAllRowsExpandedProps()}
                    className={`expander-btn fs-18 fw-normal ${isAllRowsExpanded ? "bg-danger" : "bg-success"}`}
                >
                    {isAllRowsExpanded ? "-" : "+"}
                </span>
            ),
            rowSpan: 2,
            columnClassName: "sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
            footerClassName: "bg-light sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
            Footer: "",
            columns: [
                {
                    Header: "Hidden",
                    displayNone: true,
                    disableSortBy: true,
                    columnClassName: "sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
                    footerClassName: "bg-light sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
                    Footer: "",
                    Cell: ({ row }: any) =>
                        row.canExpand ? (
                            <span
                                {...row.getToggleRowExpandedProps({
                                    style: { paddingLeft: `${row.depth * 2}rem` },
                                })}
                                className={`expander-btn fs-18 ${row.isExpanded ? "bg-danger" : "bg-success"}`}
                            >
                                {row.isExpanded ? "-" : "+"}
                            </span>
                        ) : null,
                },
            ],
        },
        {
            Header: "Curriculum Name",
            accessor: "hiddenCurriculumName",
            disableSortBy: true,
            rowSpan: 2,
            columnClassName: "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            footerClassName: "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            Footer: "",
            columns: [
                {
                    Header: "hidden",
                    displayNone: true,
                    accessor: "curriculumName",
                    disableSortBy: true,
                    columnClassName: "tw-text-nowrap tw-p-0 tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
                    footerClassName: "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] bg-light",
                    Footer: "Total",
                    Cell: ({ row }: any) => {
                        const { curriculumName, showName } = row.original || {};
                        const displayName = row.depth === 0 && showName === "Total" ? curriculumName : "";
                        return (
                            <div
                                className="tw-flex tw-items-center tw-text-center tw-justify-center"
                                style={{ padding: "0.4rem 0.7rem" }}
                            >
                                <span>{displayName}</span>
                            </div>
                        );
                    },
                },
            ],
        },
        {
            Header: "Classes",
            accessor: "",
            disableSortBy: true,
            rowSpan: 2,
            columnClassName: "tw-text-center",
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [
                {
                    Header: "Class",
                    displayNone: true,
                    accessor: "showName",
                    columnClassName: "tw-text-center",
                    disableSortBy: true,
                    Footer: "",
                    footerClassName: "text-white fw-bold",
                },
            ],
        },
        {
            Header: "Active",
            accessor: "",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [
                countColumn("New Admissions", "activeNewAdmissions"),
                countColumn("Old Admissions", "activeOldAdmissions"),
                countColumn("Total", "activeTotal"),
            ],
        },
        {
            Header: "Inactive",
            accessor: "",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [
                countColumn("TC Applied", "inactiveTcApplied"),
                countColumn("Not Reporting", "inactiveNotReporting"),
                countColumn("Admission Withdraw", "inactiveAdmissionWithdraw"),
                countColumn("Total", "inactiveTotal"),
            ],
        },
    ];
}
