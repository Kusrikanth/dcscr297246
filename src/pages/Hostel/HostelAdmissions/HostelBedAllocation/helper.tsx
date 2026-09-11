import {
  StatusLabel,
  UserDetails,
} from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../utility/commonutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Hostel",
      accessor: "hostelName",
      disableSortBy: true,
    },
    {
      Header: "Building",
      accessor: "buildingName",
      disableSortBy: true,
    },
    {
      Header: "Floor Name",
      accessor: "floorName",
      disableSortBy: true,
    },
    {
      Header: "Room Type",
      accessor: "roomType",
      disableSortBy: true,
    },
    {
      Header: "Bed No.",
      accessor: "bedNo",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px",
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
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Fine Amount (₹)",
      accessor: "fine",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(+original?.fine)}</span>
      },
    },
    {
      Header: "Promotion Status",
      accessor: "allocationStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          original?.allocationStatus && <StatusLabel
            type={original.allocationStatus}
            labelName={original.allocationStatus}
          />
        )
      },
    },
    {
      Header: "Action",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const updatedList = actionsList.filter(i => original?.allocationStatus?.toLowerCase() === "allocated");
        return (
          <MenuOptionHrtl actionOptions={updatedList} rowId={original.bedAllocationId} />
        );
      },
    },
  ];
}

export const bedStatusOptions = [
  {
    id: "ALLOCATED",
    name: "ALLOCATED",
  },
  {
    id: "NOT_ALLOCATED",
    name: "NOT ALLOCATED",
  }
]

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!(key === "academicYearId" || key === "searchString" || key === "bedStatus")) {
        count += 1;
      }
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}

export const ignoredKeys = ["searchString", "academicYearId", "bedStatus"];