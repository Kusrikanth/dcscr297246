import { StatusLabel } from "../../../Components/Common";

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
export function generateColumns(viewNoofBooksModel: (event: React.MouseEvent<HTMLDivElement>) => void) {
  return [
    {
      Header: "Library Name",
      accessor: "libraryName",
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
      Header: "No. Of Books",
      accessor: "numberOfVerifiedBooks",
      disableSortBy: true,
      Cell: ({ row: { original } }: { row: { original: any } }) => {
        return (
          <div
            className="tw-text-[#008ed3] tw-cursor-pointer tw-underline"
            onClick={() => viewNoofBooksModel(original)}
          >
            {original.numberOfVerifiedBooks || "0"}/{original.numberOfTotalBooks || "0"}
          </div>
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
      disableSortBy:true,
    },
    {
      Header: "Book Name",
      accessor: "title",
      disableSortBy:true,
    },
    {
      Header: "Category",
      accessor: "category",
      disableSortBy:true,
    },
    {
      Header: "Language",
      accessor: "language",
      disableSortBy:true,
    },
    {
      Header: "Author Name",
      accessor: "author",
      disableSortBy:true,
    },
    {
      Header: "Pages",
      accessor: "pages",
      disableSortBy:true,
    },
    {
      Header: "Verification Status",
      accessor: "verificationStatus",
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        const statusLabel = original.verificationStatus === null ? "Not Verified" : original.verificationStatus;
        return (
          <StatusLabel
            type={original.verificationStatus === null ? "NOT_VERIFIED" : original.verificationStatus}
            labelName={statusLabel}
          />
        );
      },
    },
  ];
}

export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if(!(key === "libraryId" || key === "roomId" || key === "shelfId" || key === "rackId" || key === "academicYearId" || key === "searchString"))
      count += 1;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}
export const ignoredKeys = ["searchString", "academicYearId", "libraryId"]