import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>, toggleNoofBedsModel: any) {
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
      Header: "Room No.",
      accessor: "roomNo",
      disableSortBy: true,
    },
    {
      Header: "Hostel Name",
      accessor: "hostelName",
      disableSortBy: true,
    },
    {
      Header: "Room Type",
      accessor: "roomTypeName",
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
      Header: "No Of Beds",
      accessor: "noOfBeds",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div
            className="tw-text-blue-600 tw-cursor-pointer tw-underline"
            onClick={() => original?.id && toggleNoofBedsModel(original?.id)}
          >
            {original?.noOfBeds || 'N/A'}
          </div>
        );
      },
    },

    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}

const maxBeds = 20;

export const numberofBeds = Array.from({ length: maxBeds }, (_, i) => ({
  key: (i + 1).toString(),
}));


export function generateDetailsColumns() {
  return [
    {
      Header: "Room Number",
      accessor: "roomNo",
      disableSortBy:true,
    },
    {
      Header: "Number of Beds",
      accessor: "noOfBeds",
      disableSortBy:true,
    },
    {
      Header: "Bed Name",
      accessor: "bedNames",
      disableSortBy: true,
      Cell: ({ row }: { row: { original: { bedDtos?: { bedName: string }[] } } }) => {
        const bedNames = row.original.bedDtos?.map(bed => bed.bedName) || [];
        return bedNames.length > 0 ? bedNames.join(', ') : "No Beds";
      }
    }
  ];
}
export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if(!(key === "RoomDetailsName"))
      count += 1;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}