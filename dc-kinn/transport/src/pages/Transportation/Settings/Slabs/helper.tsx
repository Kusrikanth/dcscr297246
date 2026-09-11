import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Slab Name",
      accessor: "slabName",
      disableSortBy: true,
    },
    {
      Header: "From Distance",
      accessor: "distanceFrom",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.distanceFrom} Kms</span>
        );
      },
    },
    {
      Header: "To Distance",
      accessor: "distanceTo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.distanceTo} Kms</span>
        );
      },
    },
    {
      Header: "Action",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.slabId} />
        );
      },
    },
  ];
}

export const numberOfSlabsMenu = [
  {
    key:"1"
  },
  {
    key:"2"
  },
  {
    key:"3"
  },
  {
    key:"4"
  },
  {
    key:"5"
  },
  {
    key:"6"
  },
  {
    key:"7"
  },
  {
    key:"8"
  },
  {
    key:"9"
  },
  {
    key:"10"
  },
]

export const radiusMenuOptions = [
  {
    key : "0-5",
    name : "0 Kms - 5 Kms"
  },
  {
    key : "5-10",
    name : "5 Kms - 10 Kms"
  },
  {
    key : "10-15",
    name : "10 Kms - 15 Kms"
  },
  {
    key : "15-20",
    name : "15 Kms - 20 Kms"
  },
  {
    key : "20-25",
    name : "20 Kms - 25 Kms"
  },
  {
    key : "25-30",
    name : "25 Kms - 30 Kms"
  },
  {
    key : "30-35",
    name : "30 Kms - 35 Kms"
  },
  {
    key : "35-40",
    name : "35 Kms - 40 Kms"
  },
  {
    key : "40-45",
    name : "40 Kms - 45 Kms"
  },
  {
    key : "45-50",
    name : "45 Kms - 50 Kms"
  },
]