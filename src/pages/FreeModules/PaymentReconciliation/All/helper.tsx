import { format, parseISO } from "date-fns";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { MenuOptionHrtl, StatusLabel } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [

    {
      Header: "Order",
      accessor: "orderRef",
      disableSortBy: true,
    },
    {
      Header: "Identifier",
      accessor: "identifier",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<div>{original?.identifier?.value}</div>)
      }
    },
    {
      Header: "Identifier Type",
      accessor: "identifierType",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<div>{original?.identifier?.type}</div>)
      }
    },
    {
      Header: "Amount",
      accessor: "amount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDisplayAmountValue(original.amount);
      }
    },
    {
      Header: "Status",
      accessor: "reconStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.reconStatus} labelName={original.reconStatus} />
        );
      },
    },
    {
      Header: "Action",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original?.orderRef} />
        );
      },
    },
  ];
}

export const dateFormatter = (date: string): string => {
  const currentDate = new Date();
  const time = format(currentDate, "HH:mm:ss");
  const formattedDate = format(new Date(parseISO(date)), "yyyy-MM-dd");
  return `${formattedDate}T${time}Z`;
}