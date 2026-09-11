import { nanoid } from 'nanoid';
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export function generateReportCardSettingsColumns(actionList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Progress Card Type",
            accessor: "progressCardType",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "classShortName",
            disableSortBy: true,
        },
        {
            Header: "Exam",
            accessor: "examinationJson",
            disableSortBy: true,
            columnClassName: "tw-w-[45%] tw-min-w-[45%] tw-max-w-[45%]",
            Cell: ({ row: { original } }: any) => {
                const exams = original?.examinationJson || [];
                if (!exams.length) {
                    return <span className="ms-2">-</span>;
                }
                return (
                    <div className="d-flex gap-2 flex-wrap">
                        {exams.map((exam: any) => (
                            <span
                                key={exam.id}
                                className="badge text-uppercase bg-light text-muted p-2"
                            >
                                {exam.name}
                            </span>
                        ))}
                    </div>
                );
            }
        },
        {
            Header: "Terms",
            accessor: "termJson",
            disableSortBy: true,
            columnClassName: "tw-w-[25%] tw-min-w-[25%] tw-max-w-[25%]",
            Cell: ({ row: { original } }: any) => {
                const terms = original?.termJson || [];
                if (!terms.length) {
                    return <span className="ms-2">-</span>;
                }
                return (
                    <div className="d-flex gap-2 flex-wrap">
                        {terms.map((term: any) => (
                            <span
                                key={term.id}
                                className="badge text-uppercase bg-light text-muted p-2"
                            >
                                {term.name || "Both Terms"}
                            </span>
                        ))}
                    </div>
                );
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


export const yesNoOptions: Array<any> = [
    {
        id: "true",
        name: "Yes"
    },
    {
        id: "false",
        name: "No"
    }
]

export const generationType = [
    {
        id: 'TERM',
        name: 'Term',
    },
    {
        id: 'EXAM',
        name: 'Exam',
    },
];


export const ignoredKeys = ["searchString",];

export const progressCardTypes = [
    { id: "PVA", name: "PVA" },
];


export const displayOptions = [{ id: "MARKS", name: "Marks", itemDisabled: false }, { id: "GRADES", name: "Grades", itemDisabled: false }, { id: "BOTH_MARKS_GRADES", name: "Both", itemDisabled: false }]

export function mapDisplayOptions(
    generationType: string,
    progressCardType: string,
    filterListCbse: {
        isOnlyMarks?: boolean;
        isOnlyGrades?: boolean;
        isBothMarksGrades?: boolean;
    }
) {
    const { isOnlyMarks = false, isOnlyGrades = false, isBothMarksGrades = false } = filterListCbse || {};
    return displayOptions.map((option: any) => {
        if (generationType === "TERM" && progressCardType === "ACADEMIC") {
            if (option.id === "MARKS" && isOnlyMarks) return { ...option, itemDisabled: false };
            if (option.id === "GRADES" && isOnlyGrades) return { ...option, itemDisabled: false };
            if (option.id === "BOTH_MARKS_GRADES" && isBothMarksGrades) return { ...option, itemDisabled: false };
        }
        return { ...option, itemDisabled: true };
    });
}


export function generatePayload(formValues: any, otherConfig: any) {
    return (
        {
            instituteId: otherConfig?.instituteId,
            branchId: otherConfig?.branchId,
            academicYearId: formValues.academicYearId,
            branchCurriculumId: formValues.branchCurriculumId,
            configClasses: [
                {
                    branchClassId: Number(formValues.branchClassId),
                    progressCardType: formValues?.progressCardType,
                    processType: otherConfig?.processType,
                    examinationJson: formValues.configClasses
                        .filter((c: any) => c.generationType === "EXAM")
                        .map((c: any) => ({
                            generationType: c.generationType,
                            id: c.id || null,
                            isFeeCheckEnabled: c.isFeeCheckEnabled,
                            remarks: c.remarks,
                            displayOrder: c.displayOrder

                        })),
                    termJson: formValues.configClasses
                        .filter((c: any) => c.generationType === "TERM")
                        .map((c: any) => ({
                            generationType: c.id ? c.generationType : "BOTH_TERMS",
                            id: c.id || null,
                            displayTypes: c.displayTypes ? [c.displayTypes] : [],
                            isFeeCheckEnabled: c.isFeeCheckEnabled,
                            remarks: c.remarks,
                            displayOrder: c.displayOrder
                        }))
                }
            ]
        }
    )
}

export function generateFormData(progressCardType: string, classData: any = []) {
    const DEFAULT_ENTRY = [
        {
            uniqueId: nanoid(),
            generationType: "",
            id: "",
            displayTypes: "",
            isFeeCheckEnabled: true,
            remarks: "",
            displayOrder: 1
        }
    ];

    if (!Array.isArray(classData) || classData.length === 0) {
        return DEFAULT_ENTRY;
    }

    const result: any[] = [];
    const reportCardConfig = classData[0];
    if (reportCardConfig.progressCardType !== progressCardType) {
        return DEFAULT_ENTRY;
    }

    if (Array.isArray(reportCardConfig.examinationJson)) {
        reportCardConfig.examinationJson.forEach((exam: any) => {
            result.push({
                uniqueId: nanoid(),
                generationType: "EXAM",
                id: exam?.id ?? "",
                displayTypes: exam?.displayTypes?.[0] ?? "",
                isFeeCheckEnabled: !!exam?.isFeeCheckEnabled,
                remarks: exam?.remarks ?? "",
                displayOrder: exam?.displayOrder ?? 999
            });
        });
    }

    if (Array.isArray(reportCardConfig.termJson)) {
        reportCardConfig.termJson.forEach((term: any) => {
            result.push({
                uniqueId: nanoid(),
                generationType: "TERM",
                id: term?.id ?? "",
                displayTypes: term?.displayTypes?.[0] ?? "",
                isFeeCheckEnabled: !!term?.isFeeCheckEnabled,
                remarks: term?.remarks ?? "",
                displayOrder: term?.displayOrder ?? 999
            });
        });
    }

    result.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

    return result.length ? result : DEFAULT_ENTRY;
}
