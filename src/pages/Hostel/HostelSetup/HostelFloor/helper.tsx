import { HostelDetailsFloorTypes, } from "./HostelFloorTypes";
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
      Header: "Building Name",
      accessor: "buildingName",
      disableSortBy: true,
    },
    {
      Header: "Floor Name",
      accessor: "floorName",
      disableSortBy: true,
    },

    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.floorId} />
        );
      },
    },
  ];
}