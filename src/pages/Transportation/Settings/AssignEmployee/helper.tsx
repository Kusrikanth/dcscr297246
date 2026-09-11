import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { SlabsTermsTypes } from "./SlabsTerms";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Route",
      thClass: "tw-w-16",
      accessor: "slabName",
    },
    {
      Header: "Vehicle No.",
      thClass: "tw-w-24",
      accessor: "fromDistance",
    },
    {
      Header: "Driver Name",
      thClass: "tw-w-20",
      accessor: "toDistance",
    },
    {
      Header: "Attendant Name",
      thClass: "tw-w-20",
      
      accessor: "attendantname",
    },
    {
      Header: "In charge",
      thClass: "tw-w-20",
      accessor: "amount",
    },
    {
      Header: "Actions",
      disableSortBy: true,
      thClass: "tw-w-20 tw-text-center",
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}

export const SlabsData: Array<SlabsTermsTypes> = [
  {
    id: 1,
    slabName: "Slab 1",
    fromDistance: "0.0 Kms",
    toDistance: "5.0 Kms",
    attendantname:"raju",
    amount: "12,1540",
  },
  {
    id: 2,
    slabName: "Slab 2",
    fromDistance: "5.0 Kms",
    toDistance: "10.0 Kms",
    attendantname:"raju",
    amount:"13,600.00",
  },
  {
    id: 3,
    slabName: "Slab 3",
    fromDistance: "10.0 Kms",
    toDistance: "15.0 Kms",
    attendantname:"raju",
    amount: "15,200.00",
  },
  {
    id: 4,
    slabName: "Slab 4",
    fromDistance: "15.0 Kms",
    toDistance: "20.0 Kms",
    attendantname:"raju",
    amount: "16,600.00",
  },
  {
    id: 5,
    slabName: "Slab 5",
    fromDistance: "20.0 Kms",
    toDistance: "25.0 Kms",
    attendantname:"raju",
    amount:"9,800.00",
  },
];
export const AcademicYear = [
  { academicYearId: 1, academicYear: "2022-23" },
  { academicYearId: 2, academicYear: "2023-24" },
];
export const TermsTypes = [
  { TermsId: 1, TermsType: "Term Name" },
  { TermsId: 2, TermsType: "ABC" },
];
export const select1 = [
  {
    vehicleId: 1,
    vehicalType: "Bike",
  },
  {
    vehicleId: 2,
    vehicalType: "Bike",
  },
];
export const select2 = [
  {
    driverId: 1,
    driverName: "ABC",
  },
  {
    driverId: 2,
    driverName: "XYZ",
  },
];
export const select3 = [
  {
    attendantId: 1,
    attendantName: "ABC",
  },
  {
    attendantId: 2,
    attendantName: "XYZ",
  },
];
