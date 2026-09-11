import { MoreActions, StatusLabel } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Identifier",
      accessor: "identifier",
      disableSortBy: true,
    },
    {
      Header: "Received At",
      accessor: "receivedAt",
      disableSortBy: true,
    },
    {
      Header: "Parent Rule Name",
      accessor: "parentRuleName",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.status}
            labelName={original.status}
          />
        );
      },
    },
    {
      Header: "Item Rules",
      accessor: "itemRules",
      disableSortBy: true,
    },
    {
      Header: "Category",
      accessor: "category",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let updatedActionList: any = [];
        if (original.status === "FAILED") {
          actionsList.forEach((action: any) => {
            ( action.id === "statusUpdate" )
              &&
              updatedActionList.push(action)
          })
        }
        return (
          original.status === "FAILED" && <MoreActions
            actionOptions={updatedActionList}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export const statusData: Array<any> = [
  {
    id: "COMPLETED",
    name: "COMPLETED",
  },
  {
    id: "FAILED",
    name: "FAILED",
  },
];

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!(key === "search" || key === "category" || key === "status" || key === "receivedEndDate")) {
        count += 1;
      }
    }
  }
  if (count > 0) {
    return {
      stateChange: showState,
      count: count,
    };
  } else {
    return {
      stateChange: showState,
      count: count,
    };
  }
}
