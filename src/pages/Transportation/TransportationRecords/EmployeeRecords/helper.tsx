
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { StatusLabel, UserDetails } from "../../../../Components/Common";


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
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] ",
      Cell: ({ row: { original } }: any) => {
        const { employeeBase64ImageUrl } = original,
          imageBaseUrl = ( employeeBase64ImageUrl) ? `data:image/jpeg;base64, ${employeeBase64ImageUrl}` : "";
        return (
          <>
            <UserDetails
              imageUrl={imageBaseUrl}
              defaultImgType="student"
              displayName={ original?.employeeName}
              displayId={original?.employeeCode}
              size="xs"
            />
          </>
        );
      },
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
      columnClassName: "tw-w-[140px] tw-min-w-[140px] tw-max-w-[140px]",
    },
    {
      Header: "New Route",
      accessor: "routeName",
      disableSortBy: true,
      columnClassName: "tw-w-[160px]  tw-min-w-[160px] tw-max-w-[160px]",
    },
    {
      Header: "Slab Name",
      accessor: "slabName",
      disableSortBy: true,
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
      Header: "Status",
      accessor: "activeStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.activeStatus} labelName={original.activeStatus} />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {

        return (
          original?.activeStatus?.toLowerCase() === "active" && <MoreActions
            actionOptions={actionsList}
            rowId={original.studentAllocationId}
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

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!( key === "academicYearId" || key === "searchString"))
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