
import { SelectInput, StatusLabel, TextInput, TextInputGroup, UserDetails } from "../../../Components/Common";
import { SpecimenBookIssuancesDataTypes, EmployeeDataTypes, StudentDataTypes } from "./SpecimenBookIssuancesTypes";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { useState } from "react";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

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
export const selectData3 = [

  {
   userType: "Employee",
  },
  {
   userType: "Recommended",
  },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [

  
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
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
      accessor: "class",
      disableSortBy: true,
    },
    {
      Header: "Section",
      accessor: "section",
      disableSortBy: true,
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Title",
      accessor: "title",
      disableSortBy: true,
    },
    {
      Header: "Book Cost",
      accessor: "bookCost",
      disableSortBy: true,
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
    },
    {
      Header: "Return Date",
      accessor: "returnDate",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.status} labelName={original.status} />
        );
      },
    },
    {
      Header: "Returned Status",
      accessor: "returnedStatus",
      disableSortBy: true,
    },
    {
      Header: "Returned Date",
      accessor: "returnedDate",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}
export const SpecimenBookIssuancesTableData: Array<SpecimenBookIssuancesDataTypes> =
  [
    {
      id: 1,
      class: "Pre Primary Library",
      studentName: "Lingam Prkruth",
      studentCode: "124000012",
      section: "Gitika Kalasthi",
      title: "Lata Mangeshkar",
      accessionNumber: "3466",
      bookCost: "3466",
      issuanceDate: "26-04-2024",
      returnDate: "26-04-2024",
      latereturnDate: "26-05-2024",
      status : "Issued",
    },
    {
      id: 2,
      class: "Pre Primary Library",
      studentName: "Lingam Prkruth",
      studentCode: "124000012",
      section: "Gitika Kalasthi",
      title: "Lata Mangeshkar",
      accessionNumber: "3466",
      bookCost: "3466",
      issuanceDate: "26-04-2024",
      returnDate: "26-04-2024",
      latereturnDate: "26-05-2024",
      status : "Issued",
    },
    {
      id: 3,
      class: "Pre Primary Library",
      studentName: "Lingam Prkruth",
      studentCode: "124000012",
      section: "Gitika Kalasthi",
      title: "Lata Mangeshkar",
      accessionNumber: "3466",
      bookCost: "3466",
      issuanceDate: "26-04-2024",
      returnDate: "26-04-2024",
      latereturnDate: "26-05-2024",
      status : "Issued",
    },
    {
      id: 4,
      class: "Pre Primary Library",
      studentName: "Lingam Prkruth",
      studentCode: "124000012",
      section: "Gitika Kalasthi",
      title: "Lata Mangeshkar",
      accessionNumber: "3466",
      bookCost: "3466",
      issuanceDate: "26-04-2024",
      returnDate: "26-04-2024",
      status : "Issued",
      latereturnDate: "26-05-2024",
    },
  ];