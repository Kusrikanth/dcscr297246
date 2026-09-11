import {
  IOptionsHrtl,
} from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Routes",
      accessor: "routeName",
      disableSortBy: true,
    },
    {
      Header: "Stops Order",
      accessor: "stopOrderSeq",
       disableSortBy: true,
    },
    {
      Header: "Stop Name",
      accessor: "stopName",
       disableSortBy: true,
    },
    {
      Header: "Slabs",
      accessor: "slabName",
       disableSortBy: true,
    },
    {
      Header: "Pick-Up Time",
      accessor: "pickUpTime",
      disableSortBy: true,
    },
    {
      Header: "Drop Time",
      accessor: "dropTime",
       disableSortBy: true,
    },

  ];
}


export const timeDurations = [
  { id: 5, name: "5 Min" },
  { id: 10, name: "10 Min" },
  { id: 15, name: "15 Min" },
  { id: 20, name: "20 Min" },
  { id: 25, name: "25 Min" },
  { id: 30, name: "30 Min" },
  { id: 35, name: "35 Min" },
  { id: 40, name: "40 Min" },
  { id: 45, name: "45 Min" },
  { id: 50, name: "50 Min" },
  { id: 55, name: "55 Min" },
  { id: 60, name: "60 Min" }
];

export function renderOptionsRoute(item: any) {
  return `${item?.routeName}`;
}

export function renderValueRoute(selectedItems: any) {
  return `${selectedItems?.routeName}`;
}

export function hasStateChanged(newState:any) {
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
    }
  }
  return {stateChange : showState }
}