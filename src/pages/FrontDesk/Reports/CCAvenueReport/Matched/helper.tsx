import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../../utility/commonutility";


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
      accessor: "status",
      disableSortBy: true,
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
