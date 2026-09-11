import { StatusLabel } from "../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Vehicle Number",
      accessor: "vehicleNo",
      disableSortBy: true,
    },
    {
      Header: "Vehicle Model Name",
      accessor: "vehicleModelName",
      disableSortBy: true,
    },
    {
      Header: "Manufacturer",
      accessor: "manufacturerName",
      disableSortBy: true,
    },
    {
      Header: "Year of Model",
      disableSortBy: true,
      accessor: "yearOfModel",
    },
  
    {
      Header: "Max Speed (Km / h)",
      accessor: "maxSpeed",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "vehicleStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const status = original?.vehicleStatus;
        return <StatusLabel type={status} labelName={status} />;
      },
    },
    {
      Header: "Effected Date",
      accessor: "effectedDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">
            {getDdMmYyyyWithMonthNameFormat(original.effectedDate)}
          </span>
        );
      },
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.remarks || "-";
      },
    },
    {
      Header: "Previous Branch Name",
      accessor: "previousBranchName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.previousBranchName || "-";
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}

export const vehicleStatsOptions = [
  { id: "ACTIVE", name: "Active" },
  { id: "INACTIVE", name: "InActive" },
  { id: "TRANSFER", name: "Transfer" },
  { id: "SOLD", name: "Sold" },
];
