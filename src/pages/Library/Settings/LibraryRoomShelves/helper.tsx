import { LibraryRoomShelvesDataTypes, } from "./LibraryRoomShelvesTypes";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { TextInput } from "../../../../Components/Common";
import { useState } from "react";


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
export const numberofShelfs = [
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
  const Shelfs = ({ row: { index, original }, onChangeInputHndlr }: any) => {
    const [search, setSearch] = useState(""); 


    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setSearch(event.target.value);
    };
  
    return (
      <div className="mb-0 w-70">
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
      Header:"Room Name",
      accessor:"roomName",
      disableSortBy: true,
  },
        {
          Header: "Shelfs",
          accessor: "shelfs",
          disableSortBy: true,
          Cell : Shelfs,
      },
       
    ];
}
export const addStuAttData = [
  {
      sNo : "1",
      roomName : "Room1",

  },
  {
      sNo : "2",
      roomName : "Room2",
  }
]
export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if(!(key === "libraryId" || key === "roomId" || key === "searchString"))
      count += 1;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}