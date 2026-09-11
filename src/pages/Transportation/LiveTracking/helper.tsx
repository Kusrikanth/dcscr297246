import { StatusLabel } from "../../../Components/Common";
import { LiveTrackingModalTableDataType } from "./LiveTrackingTypes";

export const selectData1 = [
  {
    vehicleType: "option1",
  },
  {
    vehicleType: "option2",
  },
  {
    vehicleType: "option3",
  },
];

export const selectData2 = [
  {
    driverType: "option1",
  },
  {
    driverType: "option2",
  },
  {
    driverType: "option3",
  },
];

export const selectData3 = [
  {
    attendantType: "option1",
  },
  {
    attendantType: "option2",
  },
  {
    attendantType: "option3",
  },
];

export function generateColumns() {
  return [
    {
      Header: "Stop Name",
      accessor: "stopName",
    },
    {
      Header: "Status",
      accessor: "status",
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.status} labelName={original.status} />
        );
      },
    },
    {
      Header: "Address",
      accessor: "address",
    },
    {
      Header: "Arrival Time",
      accessor: "arrivalTime",
    },
    {
      Header: "Departure Time",
      accessor: "departureTime",
    },
    {
      Header: "Actual Halt",
      accessor: "actualHalt",
    },
    {
      Header: "Students",
      accessor: "students",
    },
  ];
}

export const LiveTrackingModalTableData: Array<LiveTrackingModalTableDataType> =
  [
    {
      id: 1,
      stopName: "Janapriya Metropolis Erragandda",
      status: "Active",
      address:
        "Telangana Secretariat reads NTR Marg, Public Gardens, Khairatabad, Hyderabad, Telangana 500004.",
      arrivalTime: "07 : 45 AM",
      departureTime: "07 : 45 AM",
      actualHalt: "2 :00 MIN",
      students: "02",
    },
    {
      id: 2,
      stopName: "Turkayamajal",
      status: "Active",
      address:
        "Telangana Secretariat reads NTR Marg, Public Gardens, Khairatabad, Hyderabad, Telangana 500004.",
      arrivalTime: "07 : 45 AM",
      departureTime: "07 : 45 AM",
      actualHalt: "2 :00 MIN",
      students: "02",
    },
  ];
