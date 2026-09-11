import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

const validResults = [
  "PANEL INTERVIEW RESULT : RECOMMENDED",
  "PANEL INTERVIEW RESULT : NORMAL_ADMISSION",
  "PANEL INTERVIEW RESULT : CONDITIONAL_ADMISSION",
  "PANEL INTERVIEW RESULT : REJECTED",
  "PANEL INTERVIEW RESULT ADMISSION CANCELLED",
  "PANEL INTERVIEW RESULT : ON_HOLD"
];

const isEditAccess = (adminssionProcess: any) => {
  return !validResults.includes(adminssionProcess);
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "sNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return row.index + 1
      }
    },
    {
      Header: "Registration ID",
      accessor: "studentRegNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.studentRegNo
      },
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
          <div style={{ minWidth: "3.5rem" }}>
          <UserDetails
              displayName={original?.className}
              displayId={original?.groupShortName}
              showAvatar={false}
            />
            </div>
        )
      }
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentId}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Admission Type",
      accessor: "admissionType",
      disableSortBy: true,
    },
     {
      Header: "Admission Source",
      accessor: "admissionSource",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <span>
          {original.admissionSource
            ? original.admissionSource
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase())
            : "-"}
        </span>
      ),
    },
    {
      Header: "Date",
      accessor: "submittedDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div>{original?.submittedDate ? getDdMmYyyyWithMonthNameFormat(new Date(original?.submittedDate)) : '-'}</div>
          </>
        );
      },
    },
    {
      Header: "Status",
      accessor: "observationStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original?.observationStatus} labelName={original?.observationStatus} />;
      }
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      columnClassName:
        "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[#f3f6f9]",
      tdClass: "sticky-right !tw-z-10",
      Cell: ({ row: { original } }: any) => {
        const { observationStatus } = original,
          updateActions = actionsList.filter(item => {
            if ((observationStatus?.toLowerCase() === "absent")) {
              return item?.id !== "edit";
            }
            return true;
          });

        return (
          isEditAccess(original?.admissionProcess) && updateActions.length > 0 && <MoreActions actionOptions={updateActions} rowId={original.id} isHorizontal={true} />
        );
      },
    },
  ];
}

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!(key === "searchString" || key === "academicYearId" || key === "classId" || key === "curriculumId" || key === "startDate"))
        count += 1;
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}