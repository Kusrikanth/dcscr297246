
import { UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
import { StatusLabelWithStepper } from "./StatusLabelWithStepper";

export const statusTypes = [
  {
    statusName: "Issued",
    statusType: "Y",
  },
  {
    statusName: "Available",
    statusType: "AVAILABLE",
  },
  {
    statusName: "Not Issued",
    statusType: "N",
  },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.userType === "RECOMMENDATION" ? original?.nameOfThePerson : (original?.userType === "EMPLOYEE" ? original?.employeeName : original?.studentName)}
              displayId={original?.userType === "RECOMMENDATION" ? original?.recommendedPerson : (original?.userType === "EMPLOYEE" ? original?.employeeCode : original?.studentCode)}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
      Header: "Library",
      accessor: "libraryName",
      disableSortBy: true,
    },
    {
      Header: "Record Type",
      accessor: "recordType",
      disableSortBy: true,
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Title",
      accessor: "bookName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyFormat(new Date(original?.issuanceDate))
      },
    },
    {
      Header: "Return Date",
      accessor: "returnDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyFormat(new Date(original?.returnDate))
      },
    },
    {
      Header: "Issue Status",
      accessor: "issueStatus",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row: { original , index } }: any) => {
        return (
          <>
            <StatusLabelWithStepper index={index} data={original} id={`${original?.id}`} type={original?.issueStatus} labelName={original?.issueStatus} />
          </>
        );
      },
    },
    {
      Header: "Created By",
      accessor: "createdBy",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{original.createdBy ? original.createdBy : "-"}</span>
      }
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original?.createdDate?.split("T") ?? [];
        return <UserDetails
          displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
          displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
          showAvatar={false}
        ></UserDetails>
      }
    },
    {
      Header: "Actions",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let updatedActionList: any = [];
        if (original.issueStatus === "RENEWAL" || original.issueStatus === "ISSUED") {
          actionsList.forEach((action: any) => {
            (action.id === "renew")
              &&
              updatedActionList.push(action)
          })
        }
        return (
          original.issueStatus !== "RETURNED" && <MoreActions
            actionOptions={updatedActionList}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export const MenuOptions: Array<any> = [
  {
    id: "STUDENT",
    labelName: "Student",
    customPadding: "0px 20px",
  },
  {
    id: "EMPLOYEE",
    labelName: "Employee",
    customPadding: "0px 20px",
  },
  {
    id: "RECOMMENDATION",
    labelName: "Recommendation",
    customPadding: "0px 20px",
  },

];

export const getUserTypeId = (userType: string, response: any) => {
  const data = response?.find((item: any) => item?.userType === userType);
  return data?.id
}

export const issueStatusMenu = [
  {
    id: "ISSUED",
    name: "Issued"
  },
  {
    id: "RENEWAL",
    name: "Renewal",
  },
  {
    id: "RETURNED",
    name: "Returned"
  }
]

export const ignoredKeys = ["searchString", "academicYearId", "libraryId"]
export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!(key === "search" || key === "academicYearId" || key === "paymentStatus"))
        count += 1;
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}