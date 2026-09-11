
import {
  IOptionsHrtl,
} from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      thClass: "w-15",
      accessor: "id",
    },
    {
      Header: "Vehicle Type",
      thClass: "w-85",
      accessor: "vehicleType",
    },
    // {
    //   Header: "Action",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
    //     );
    //   },
    // },
  ];
}

