import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>, offset: any) {
  return [
    {
      Header: "S.No",
      disableSortBy: true,
      Cell: ({ row: { index } }: any) => {
        const sNo = !isNaN(offset) ? (+offset + (index + 1)) : (index + 1);
        return (
          <span>{sNo}</span>
        );
      },
    },
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      columnClassName: "text-nowrap"
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Due Date",
      accessor: "dueDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
              return (
                <span>{getDdMmYyyyWithMonthNameFormat(original?.dueDate)}</span>
              );
            },
    },
    {
      Header: "Fine Amount (₹)",
      accessor: "finePerDay",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.finePerDay)}</span>
        );
      },

    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions
            actionOptions={actionsList}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}