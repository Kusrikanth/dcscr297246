import { StatusLabel } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Branch Time",
            accessor: "branchTime",
            disableSortBy: true,
        },
        {
            Header:"Task Name",
            accessor:"taskName",
            disableSortBy: true,
        },
        {
            Header:"Trigger Time1",
            accessor:"triggerTime1",
            disableSortBy: true,
        },
        {
            Header:"Trigger Time2",
            accessor:"triggerTime2",
            disableSortBy: true,
        },
        {
            Header:"Module",
            accessor:"module",
            disableSortBy: true,
        },
        {
            Header:"Sub Module",
            accessor:"subModule",
            disableSortBy: true,
        },
        {
            Header:"Status",
            accessor:"status",
            disableSortBy: true,
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
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const updatedAction = actionsList.filter((action: any) => {
                    if (original.status === 'ACTIVE') { 
                      return action.actionName === 'Edit' || action.actionName === 'Inactive Task';
                    } else if (original.status === 'INACTIVE') {
                      return action.actionName === 'Edit' || action.actionName === 'Active Task';
                    }
                  });
                return (
                updatedAction?.length && <MenuOptionHrtl actionOptions={updatedAction} rowId={original.id}  />
                );
              },
          },
    ];
}

export const activeStatus = [
    {
        name: "Active",
        id: "ACTIVE",
    },
    {
        name: "In Active",
        id: "INACTIVE",
    },
]