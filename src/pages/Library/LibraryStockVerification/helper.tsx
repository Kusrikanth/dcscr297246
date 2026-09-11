import { useState } from "react";
import { StockingCheckingDataTypes } from "./LibraryStockVerificationTypes";
import { InputCheckbox, StatusLabel } from "../../../Components/Common";

export const statusTypes = [
  {
    statusName: "Verified",
    statusType: "VERIFIED",
  },
  {
    statusName: "Not Verified",
    statusType: "null",
  },
];

export function stockCheckingColumns(allStockCheckHndlr: any, singleStockCheckHndlr: any, allStockSelectedState: any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            value={allStockSelectedState}
            onChange={allStockCheckHndlr}
            formgroupClassName="tw-mb-0"
          />
        );
      },
      accessor: "bookId",
      columnClassName: "tw-w-5",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        const { bookId, isSelected, verificationStatus } = original;

        const isDisabled = verificationStatus === "VERIFIED";

        return (
          <InputCheckbox
            name={`book-stock-${index}`}
            value={isSelected}
            onChange={singleStockCheckHndlr}
            dataId={bookId}
            formgroupClassName="tw-mb-0"
            isDisabled={isDisabled}
          />
        );
      },
    },
    {
      Header: "Library Name",
      accessor: "libraryName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      disableSortBy: true,
    },
    {
      Header: "Room Name",
      accessor: "roomName",
      disableSortBy: true,
    },
    {
      Header: "Shelf Name",
      accessor: "shelfName",
      disableSortBy: true,
    },
    {
      Header: "Rack",
      accessor: "rackName",
      disableSortBy: true,
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Book Name",
      accessor: "title",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Category",
      accessor: "category",
      disableSortBy: true,
    },
    {
      Header: "Language",
      accessor: "language",
      disableSortBy: true,
    },
    {
      Header: "Author Name",
      accessor: "author",
      disableSortBy: true,
    },
    {
      Header: "Pages",
      accessor: "pages",
      disableSortBy: true,
    },
    {
      Header:"Book Condition",
      accessor: "bookCondition",
      disableSortBy: true,
      Cell:({row:{original}}:any)=>{
        return <StatusLabel
        type = {original.bookCondition}
        labelName={original.bookCondition}
        ></StatusLabel>
      }
    },
    {
      Header: "Status",
      accessor: "verificationStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const statusLabel = original.verificationStatus === null ? "Not Verified" : original.verificationStatus;
        return (
          <span className= {`tw-font-semibold tw-text-[12px] tw-text-nowrap tw-uppercase ${statusLabel === "Not Verified" ? "tw-text-warning" : "tw-text-success"}`}>{statusLabel}</span>
        );
      },
    },
  ];
}
export function relocateColumns() {
  return [
    {
      Header: "Library Name",
      accessor: "libraryName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      disableSortBy: true,
    },
    {
      Header: "Room Name",
      accessor: "roomName",
      disableSortBy: true,
    },
    {
      Header: "Shelf Name",
      accessor: "shelfName",
      disableSortBy: true,
    },
    {
      Header: "Rack",
      accessor: "rackName",
      disableSortBy: true,
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Book Name",
      accessor: "title",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
    },
    {
      Header: "Category",
      accessor: "category",
      disableSortBy: true,
    },
    {
      Header: "Language",
      accessor: "language",
      disableSortBy: true,
    },
    {
      Header: "Author Name",
      accessor: "author",
      disableSortBy: true,
    },
    {
      Header: "Pages",
      accessor: "pages",
      disableSortBy: true,
    },
    {
      Header:"Book Condition",
      accessor: "bookCondition",
      disableSortBy: true,
      Cell:({row:{original}}:any)=>{
        return <StatusLabel
        type = {original.bookCondition}
        labelName={original.bookCondition}
        ></StatusLabel>
      }
    },
    {
      Header: "Status",
      accessor: "verificationStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const statusLabel = original.verificationStatus === null ? "Not Relocated" : original.verificationStatus;
        return (
          <StatusLabel
            type={original.verificationStatus === null ? "NOT_RELOCATED" : original.verificationStatus}
            labelName={statusLabel}
          />
        );
      },
    },
  ];
}
export function generateColumnsStockCheckingBooks() {
  return [
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Book Name",
      accessor: "title",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Category",
      accessor: "category",
      disableSortBy: true,
    },
    {
      Header: "Language",
      accessor: "language",
      disableSortBy: true,
    },
    {
      Header: "Author Name",
      accessor: "author",
      disableSortBy: true,
    },
    {
      Header: "Pages",
      accessor: "pages",
      disableSortBy: true,
    },
  ];
}
export const StockCheckingTableData: StockingCheckingDataTypes[] = [
  {
    id: 1,
    studentId: "3466",
    bookName: "Comprehension cl-1",
    authorName: "Shyam Dua",
    languages: "English",
    category: "Activity",
    pages: "165",
  },
  {
    id: 2,
    studentId: "16613",
    bookName: "Fun with leaves",
    authorName: "Ruskin Bond",
    languages: "English",
    category: "Admin",
    pages: "165",
  },
  {
    id: 3,
    studentId: "2799",
    bookName: "Comprehension cl-1",
    authorName: "Singh,A.K",
    languages: "English",
    category: "Accounts",
    pages: "165",
  },
  {
    id: 4,
    studentId: "25688",
    bookName: "Fun with leaves",
    authorName: "Shyam Dua",
    languages: "English",
    category: "Accounts",
    pages: "165",
  },
];


export function hasStateChanged(newState: any) {
  let count = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!(key === "libraryId" || key === "roomId" || key === "shelfId" || key === "rackId" || key === "academicYearId" || key === "searchString"))
        count += 1;
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}

export const ignoredKeys = ["searchString", "academicYearId", "libraryId", "bedStatus"];