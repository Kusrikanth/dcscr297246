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
};

export function serializeFeeSummaryFilters(filters: any) {
  const serialized: any = { ...filters };
  Object.entries(multiSelectFilterKeys).forEach(([key, idKey]) => {
    const value = filters?.[key];
    serialized[key] = Array.isArray(value) ? value.map((item: any) => item?.[idKey]).filter(Boolean).join(",") : (value || "");
  });
  return serialized;
}

export const ignoredKeys = [  "searchString", "academicYearId", "curriculumId", "classId", "branchId", "type"];
