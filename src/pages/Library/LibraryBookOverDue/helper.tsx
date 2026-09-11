
import { UserDetails } from "../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";

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

export function generateColumns() {
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
      Header: "No.of Due Days",
      accessor: "dueDays",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.dueDays > 0 ? original?.dueDays : 0
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

export const ignoredKeys = ["searchString", "academicYearId", "libraryId", "fromDate", "toDate"]
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