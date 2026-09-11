import { HostelDetailsRoomTypes, } from "./HostelRoomTypes";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "id",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return row.index + 1
      }
    },
    {
      Header: "Hostel Name",
      accessor: "hostelName",
      disableSortBy: true,
    },
    {
      Header: "Room Type",
      accessor: "roomType",
      disableSortBy: true,
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
    },

    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.roomTypeId} />
        );
      },
    },
  ];
}