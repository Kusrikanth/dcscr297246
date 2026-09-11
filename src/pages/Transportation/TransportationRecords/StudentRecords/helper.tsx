
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../../utility/dateutility";


export const statusData = [{
  name: "Active", id: "ACTIVE",
}, {
  name: "In Active", id: "IN-ACTIVE"
}]

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        const { studentBase64ImageUrl } = original,
          imageBaseUrl = (studentBase64ImageUrl) ? `data:image/jpeg;base64, ${studentBase64ImageUrl}` : "";
        return (
          <>
            <UserDetails
              imageUrl={imageBaseUrl}
              defaultImgType="student"
              displayName={original?.studentName}
              displayId={original?.studentCode}
              size="xs"
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy: true,
      columnClassName: "tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Contact No",
      accessor: "contactNo",
      disableSortBy: true,
    },
    {
      Header: "Alternate Phone No",
      accessor: "alternatePhoneNo",
      disableSortBy: true,
    },
    {
      Header: "Address",
      accessor: "address",
      disableSortBy: true,
    },
    {
      Header: "New Route",
      accessor: "routeName",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
    },
    {
      Header: "Slab Name",
      accessor: "slabName",
      disableSortBy: true,
    },
    {
      Header: "Term Name",
      accessor: "termName",
      disableSortBy: true,
    },
    {
      Header: "Start Date",
      accessor: "startDate",
      disableSortBy: true,
      columnClassName: "tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
      Cell: ({ row: { original } }: any) => {
        return original?.startDate ? getDdMmYyyyFormat(original?.startDate) : "-";
      },
    },
    {
      Header: "End Date",
      accessor: "endDate",
      disableSortBy: true,
      columnClassName: "tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
      Cell: ({ row: { original } }: any) => {
        return original?.endDate ? getDdMmYyyyFormat(original?.endDate) : "-";
      },
    },
    // {
    //   Header: "Distance",
    //   accessor: "distance",
    //   disableSortBy: true,
    //   columnClassName: "text-nowrap",
    //   Cell: ({ row: { original } }: any) => {
    //     if (!original?.distance) {
    //       return "-";
    //     }
    //     return (
    //       <span>{original?.distance} Kms</span>
    //     );
    //   },
    // },
    {
      Header: "Pick Up Point",
      accessor: "pickUpPoint",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
    },
    {
      Header: "Drop Point",
      accessor: "dropPoint",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
    },
    {
      Header: "Student Status",
      accessor: "studentStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.studentStatus} labelName={original.studentStatus} />
        );
      },
    },
    {
      Header: "Transport Status",
      accessor: "terminationStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.terminationStatus} labelName={original.terminationStatus} />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const updatedList = actionsList.filter((item:any)=>original?.terminationStatus?.toLowerCase() === "active")
        return (
          updatedList?.length > 0 && <MoreActions
            actionOptions={updatedList}
            rowId={original.studentId}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export const requestModeData = [
  {
    name: "OFFLINE", id: "OFFLINE"
  },
  {
    name: "ONLINE", id: "ONLINE"
  },
]

export const requestForData = [
  {
    name: "STUDENT", id: "STUDENT"
  },
  {
    name: "EMPLOYEE", id: "EMPLOYEE"
  },
]

export const requestTypeData = [
  {
    name: "STUDENT", id: "STUDENT"
  },
  {
    name: "EMPLOYEE", id: "EMPLOYEE"
  },
]

export const studentStatusOption = [
  {
    name: "ACTIVE", id: "ACTIVE"
  },
  {
    name: "INACTIVE", id: "INACTIVE"
  }
]

export const terminationStatusOption = [
  {
    name: "ACTIVE", id: "ACTIVE"
  },
  {
    name: "INACTIVE", id: "INACTIVE"
  }
]

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!( key === "academicYearId" || key === "searchString" || key === "termIds"))
        count += 1;
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}

export function renderOptionsRoute(item: any) {
  return `${item?.routeCode}`;
}

export function renderValueRoute(selectedItems: any) {
  return `${selectedItems?.routeCode}`;
}