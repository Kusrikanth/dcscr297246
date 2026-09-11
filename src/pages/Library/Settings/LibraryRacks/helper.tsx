import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { TextInput } from "../../../../Components/Common";
import { useState } from "react";
import { LibraryRacksDataTypes } from "./LibraryRacksTypes";


export const selectData1 = [
  {
    libraryNameType: "Secondary Library",
  },
  {
    libraryNameType: "Sr. Secondary Library",
  },
  {
    libraryNameType: "Junior Library",
  }
]
export const numberofRacks = [
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
export const selectData3 = [
  {
    roomNameType: "Room1",
  },
  {
    roomNameType: "Room2",
  },
  {
    roomNameType: "Room3",
  },
  {
    roomNameType: "Room4",
  },
]
export const selectData4 = [
  {
    noracksType: "1",
  },
  {
    noracksType: "2",
  },
  {
    noracksType: "3",
  },
  {
    noracksType: "4",
  },
]

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Library Name",
      accessor: "libraryName",
      disableSortBy: true,
    },
    {
      Header: "Rooms Name",
      accessor: "roomName",
      disableSortBy: true,
    },

    {
      Header: "Shelf Name",
      accessor: "shelfName",
      disableSortBy: true,
    },
    {
      Header: "Rack",
      accessor: "rackName",
      disableSortBy: true,
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
  const RackName = ({ row: { index, original }, onChangeInputHndlr }: any) => {
    const [search, setSearch] = useState(""); 


    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setSearch(event.target.value);
    };
  
    return (
      <div className="tw-mb-0 tw-w-[70%]">
        <TextInput
          value={search}
          onChange={handleChange} 
          name="mathematics"
        />
      </div>
    );
  }
  export function addStuAttGenerateColumns() {
    return [
    {
      Header: "S No.",
      accessor: "sNo",
      disableSortBy: true,
    },
        {
          Header: "Rack Name",
          accessor: "RackName",
          disableSortBy: true,
          Cell : RackName,
      },
       
    ];
}
export const addStuAttData = [
  {
      sNo : "1",

  },
  {
      sNo : "2",
  }
]
export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if(!(key === "shelfId" || key === "roomId" || key === "libraryId" || key === "searchString"))
      count += 1;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}