import { HugeiconsIcon } from "@hugeicons/react";
import { StatusLabel, UserDetails } from "../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDisplayDateForTableFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
import { Book02Icon } from "@hugeicons-pro/core-stroke-standard";
import BookCountPopover from "./BookCountModal";
import { StatusLabelWithStepper } from "./StatusLabelWithStepper";

export const statusTypes = [
  {
    statusName: "Issued",
    statusType: "issued",
  },
  {
    statusName: "Not Issued",
    statusType: "notIssued",
  },
];
export const bookConditionOptions = [
  {
    bookConditionTypeName: "Good",
    bookConditionTypeType: "Good",
  },
  {
    bookConditionTypeName: "Not Usable",
    bookConditionTypeType: "not usable",
  },
  {
    bookConditionTypeName: "New",
    bookConditionTypeType: "New",
  },
  {
    bookConditionTypeName: "Spoil",
    bookConditionTypeType: "Spoil",
  },
  {
    bookConditionTypeName: "Bad",
    bookConditionTypeType: "bad",
  },
  {
    bookConditionTypeName: "Lost & Paid",
    bookConditionTypeType: "Lost & Paid",
  },
  {
    bookConditionTypeName: "Discarded",
    bookConditionTypeType: "Discarded",
  },
  {
    bookConditionTypeName: "Transfer to MH",
    bookConditionTypeType: "Transfer to MH",
  },
  {
    bookConditionTypeName: "Transfer to CAIE",
    bookConditionTypeType: "Transfer to CAIE",
  },
  {
    bookConditionTypeName: "Transfer to NG",
    bookConditionTypeType: "Transfer to NG",
  },
];

const notIssued = "notIssued";

export function generateColumns(
  actionsList: Array<IOptionsHrtl>,
) {
  return [
    {
      Header: "Title",
      accessor: "title",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Author",
      accessor: "author",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
      columnClassName: "tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px]",
    },
    {
      Header: "Library",
      accessor: "libraryName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Room",
      accessor: "roomName",
      disableSortBy: true,
    },
    {
      Header: "Shelf",
      accessor: "shelfName",
      disableSortBy: true,
    },
    {
      Header: "Rack",
      accessor: "rackName",
      disableSortBy: true,
    },
    {
      Header: "Language",
      accessor: "language",
      disableSortBy: true,
    },
    {
      Header: "Category Name",
      accessor: "category",
      disableSortBy: true,
    },
    {
      Header: "Record Type",
      accessor: "recordType",
      disableSortBy: true,
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original?.createdDate);
      },
    },
    {
      Header: "Invoice Date",
      accessor: "invoiceDate",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original?.invoiceDate);
      },
    },
    {
      Header: "Status",
      accessor: "issueStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            labelName={original?.issueStatus}
            type={original?.issueStatus}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "Book Condition",
      accessor: "bookCondition",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.bookCondition}
            labelName={original.bookCondition}
          />
        );
      },
    },
    {
      Header: "Book Status",
      accessor: "rs",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.rs}
            labelName={
              original.rs === "A"
                ? "Active"
                : original.rs === "I"
                ? "In Active"
                : "-"
            }
          />
        );
      },
    },
    {
      Header:"Created By",
      accessor:"createdBy",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return <span>{original.createdBy ? original.createdBy : "-"}</span>
      }
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

export const issueStatus = [
  {
    statusName: "Issued",
    statusType: "Y",
  },
  {
    statusName: "Not Issued",
    statusType: "N",
  },
];

export const ignoredKeys = ["searchString", "libraryId", "roomId", "shelfId"];

export const bookColletionSearchInputOptions = [
  { id: "global", name: "Global Search" },
  { id: "title", name: "Title" },
  { id: "author", name: "Author" },
  { id: "accessionNumber", name: "Accession Number" },
  { id: "accessionCode", name: "Accession Code" },
];
