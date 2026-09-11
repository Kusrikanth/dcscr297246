import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "id",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return row.index + 1;
      },
    },
    {
      Header: "Class Name",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Room No.",
      accessor: "roomNo",
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
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: 1,
    className: "Class 1",
    roomNo: "101",
    buildingName: "Main Building",
    floorName: "Ground Floor",
  },
  {
    id: 2,
    className: "Class 2",
    roomNo: "102",
    buildingName: "Main Building",
    floorName: "Ground Floor",
  },
  {
    id: 3,
    className: "Class 3",
    roomNo: "201",
    buildingName: "Science Block",
    floorName: "First Floor",
  },
  {
    id: 4,
    className: "Class 4",
    roomNo: "202",
    buildingName: "Science Block",
    floorName: "First Floor",
  },
  {
    id: 5,
    className: "Class 5",
    roomNo: "301",
    buildingName: "Arts Block",
    floorName: "Second Floor",
  },
  {
    id: 6,
    className: "Class 6",
    roomNo: "302",
    buildingName: "Arts Block",
    floorName: "Second Floor",
  },
  {
    id: 7,
    className: "Class 7",
    roomNo: "401",
    buildingName: "Commerce Block",
    floorName: "Third Floor",
  },
  {
    id: 8,
    className: "Class 8",
    roomNo: "402",
    buildingName: "Commerce Block",
    floorName: "Third Floor",
  },
  {
    id: 9,
    className: "Class 9",
    roomNo: "501",
    buildingName: "Math Block",
    floorName: "Fourth Floor",
  },
  {
    id: 10,
    className: "Class 10",
    roomNo: "502",
    buildingName: "Math Block",
    floorName: "Fourth Floor",
  },
];

export default tableData;
