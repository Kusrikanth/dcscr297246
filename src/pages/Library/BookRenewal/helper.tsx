

import { UserDetails } from "../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";
import { BookRenewalDataTypes } from "./BookRenewalTypes";

export const selectData1 = [

  {
    libraryType: "Junior Library",
  },
  {
    libraryType: "Sr. Secondary Library",
  },
  {
    libraryType: "Secondary Library",
  },
];

export const MenuOptions: Array<any> = [
  {
    id: "student",
    labelName: "Student",
    customPadding: "0px 20px",
  },
  {
    id: "employee",
    labelName: "Employee",
    customPadding: "0px 20px",
  },
  {
    id: "recommendation",
    labelName: "Recommendation",
    customPadding: "0px 20px",
  },

];

export const getUserTypeId = (userType: string) => {
  switch (userType) {
    case "student":
      return 2
    case "employee":
      return 1
    case "recommendation":
      return 3
    default:
      return 2
  }
}

export function generateColumns() {
  return [
    {
      Header: "Library",
      accessor: "libraryName",
      disableSortBy: true,
    },
    {
      Header: "Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="text-info cursor-pointer">
              <UserDetails
                displayName={original?.studentName || original?.employeeName || original?.recommendedPerson}
                displayId={original?.studentCode || original?.employeeCode || original?.nameOfThePerson}
                showAvatar={false}
              />
            </div>
          </>
        );
      },
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Book Name",
      accessor: "bookName",
      disableSortBy: true,
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
      Header: "Renewal Date",
      accessor: "renewalDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyFormat(new Date(original?.renewalDate))
      },
    },
  ];
}
