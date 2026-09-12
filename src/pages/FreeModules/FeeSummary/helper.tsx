import { InputCheckbox, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../utility/commonutility";
import { getDateWithTimeFormat, getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

export function generateColumns(
  canExport: any,
  actionsList: Array<IOptionsHrtl>,
  allStudentCheckHndlr: any,
  singleStudentCheckHndlr: any,
  allStudentSelectedState: any,
  studentConcessionFilterState: any
) {
  const columns = [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="tw-mb-0"
          />
        );
      },
      accessor: "isStudentChecked",
      columnClassName: "tw-w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { studentId, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${studentId}`}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={studentId}
              formgroupClassName="tw-mb-0"
            />
          </>
        );
      }
    },

    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "w-200px min-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              showAvatar={false}
              redirectUrl={'/student-fee-ledger/fee-details'}
              urlProps={{ ...studentConcessionFilterState, studentId: original?.studentId }}
            />
          </>
        );
      },
    },
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true
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
        return (
          <span className="tw-text-nowrap">{original?.className}</span>
        );
      }
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      columnClassName: 'tw-text-center',
      Cell: ({ row: { original } }: any) => {
        return <span>{original.sectionName ? original.sectionName : "-"}</span>
      }
    },
    {
      Header: "Jodo Opted Status",
      accessor: "jodoOptedStatus",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">{original?.jodoOptedStatus || "-"}</span>
      }
    },
    {
      Header: "Total Amount (₹)",
      accessor: "netAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(+original?.amountToPay)}</span>
      },
    },
    {
      Header: "Total Actual Amount Paid (₹)",
      accessor: "totalActualAmountPaid",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.totalActualAmountPaid)}</span>
      },
    },
    {
      Header: "Paid Amount (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.amountPaid)}</span>
      },
    },
    {
      Header: "Balance Amt (₹)",
      accessor: "amountToBePaid",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.amountToBePaid)}</span>
      },
    },
    {
      Header: "Overall Due Amount (₹)",
      accessor: "totalStudentDueBl",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.totalStudentDueBl)}</span>
      },
    },
    !canExport && {
      Header: "Next Action date",
      accessor: "nextRemarksFollowUpDate",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) =>
        original?.nextRemarksFollowUpDate
          ? getDdMmYyyyWithMonthNameFormat(
              `${original?.nextRemarksFollowUpDate}Z`
            )
          : "-",
    },

    !canExport && {
      Header: "Recent Follow-Up date",
      accessor: "recentRemarksFollowUpDate",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) =>
        original?.recentRemarksFollowUpDate
          ? getDateWithTimeFormat(
              `${original?.recentRemarksFollowUpDate}Z`
            )
          : "-",
    },
    {
      Header: "Actions",
      accessor: 'actions',
      filterable: false,
      disableSortBy: true,
      columnClassName:
        "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_244_246/var(--tw-bg-opacity))]",
      tdClass: "sticky-right !tw-z-10",
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.studentId}
          />
        );
      },
    },
  ];

  return columns.filter(Boolean);
}

export const notifyOptions = [
  {
    id: "sendSms",
    name: "SMS",
    selected: true,
  },
  {
    id: "sendEmail",
    name: "EMAIL",
    selected: true,
  },
]
export const feeDueStatus: Array<any> = [
  {
    id: "ACADEMIC_DUE",
    name: "Academic Fee Due"
  },
  {
    id: "TRANSPORT_DUE",
    name: "Transport Due"
  },
  {
    id: "OVERALL_DUE",
    name: "Both Due"
  }
]
export const jodoOptedStatusOptions: Array<any> = [
  { id: "CRED_OPTED", name: "CRED Opted" },
  { id: "FLEX_OPTED", name: "FLEX Opted" },
  { id: "NON_JODO", name: "Non Jodo" }
]

export const eliteParentOptions: Array<any> = [
  { id: "true", name: "Yes" },
  { id: "false", name: "No" }
]

/** Multi-select filters are kept as option objects in state; the API expects comma-separated ids. */
export const multiSelectFilterKeys: Record<string, string> = {
  jodoOptedStatuses: "id",
  termIds: "termId",
  chronicParentTypeIds: "id",
};

export function serializeFeeSummaryFilters(filters: any) {
  const serialized: any = { ...filters };
  Object.entries(multiSelectFilterKeys).forEach(([key, idKey]) => {
    const value = filters?.[key];
    serialized[key] = Array.isArray(value) ? value.map((item: any) => item?.[idKey]).filter(Boolean).join(",") : (value || "");
  });
  return serialized;
}

// TODO: remove once the student-fee-ledger list APIs (academic years, curriculum, class, fee summary
// list) are reliable on the backend. Lets this page be reviewed without a live backend.
export const USE_SAMPLE_STUDENT_FEE_LEDGER_LIST = true;

export const sampleAcademicYearsForList: Array<any> = [
  { academicYearId: "SAMPLE-2025-26", academicYearName: "2025-26", yearStatus: "CURRENT" },
  { academicYearId: "SAMPLE-2024-25", academicYearName: "2024-25", yearStatus: "CLOSED" },
];

export const sampleCurriculumTypes: Array<any> = [
  { branchCurriculumId: "SAMPLE-CBSE", curriculumName: "CBSE" },
  { branchCurriculumId: "SAMPLE-ICSE", curriculumName: "ICSE" },
];

export const sampleClassTypes: Array<any> = [
  { id: "SAMPLE-CLASS-1", shortName: "I" },
  { id: "SAMPLE-CLASS-2", shortName: "II" },
];

export const sampleFeeSummaryListRows: Array<any> = [
  { studentId: 1260072, studentCode: "1260072", studentName: "eewW", branchName: "Main Branch", curriculumName: "CBSE", className: "II", sectionName: "B", jodoOptedStatus: "FLEX Opted", amountToPay: 25000, totalActualAmountPaid: 23000, amountPaid: 23000, amountToBePaid: 2000, totalStudentDueBl: 2000, nextRemarksFollowUpDate: "2026-09-18", recentRemarksFollowUpDate: "2026-09-12T11:40:00" },
  { studentId: 1230536, studentCode: "1230536", studentName: "AADHYA RAGINI SAMARAPALLY", branchName: "Main Branch", curriculumName: "CBSE", className: "I", sectionName: "", jodoOptedStatus: "CRED Opted", amountToPay: 169184, totalActualAmountPaid: 0, amountPaid: 0, amountToBePaid: 169184, totalStudentDueBl: 169184, nextRemarksFollowUpDate: "2026-09-30", recentRemarksFollowUpDate: "2026-09-09T09:20:00" },
  { studentId: 1230312, studentCode: "1230312", studentName: "AARAV JALAN", branchName: "Main Branch", curriculumName: "CBSE", className: "I", sectionName: "A", jodoOptedStatus: "Non Jodo", amountToPay: 169184, totalActualAmountPaid: 0, amountPaid: 0, amountToBePaid: 169184, totalStudentDueBl: 169184, nextRemarksFollowUpDate: "2026-09-11", recentRemarksFollowUpDate: "2026-09-08T11:05:00" },
  { studentId: 1260071, studentCode: "1260071", studentName: "ADMSN", branchName: "Main Branch", curriculumName: "CBSE", className: "I", sectionName: "B", jodoOptedStatus: "FLEX Opted", amountToPay: 6021, totalActualAmountPaid: 6021, amountPaid: 6021, amountToBePaid: 0, totalStudentDueBl: 0, nextRemarksFollowUpDate: "", recentRemarksFollowUpDate: "2026-09-07T10:30:00" },
];

export const sampleFeeSummaryListMeta = {
  totalPages: 1,
  totalElements: sampleFeeSummaryListRows.length,
  pageNumber: 0,
};

export const ignoredKeys = [  "searchString", "academicYearId", "curriculumId", "classId", "branchId", "type"];
