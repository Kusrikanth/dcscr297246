import { MenuOptionHrtl, StatusLabel } from "../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
      return [
        {
          Header: "Grade",
          accessor: "grade",
          disableSortBy: true,
        },
        {
          Header: "From",
          accessor: "fromPerc",
          disableSortBy: true,
        },
        {
          Header: "To",
          accessor: "toPerc",
          disableSortBy: true,
        },
        {
          Header: "Remarks",
          accessor: "remarks",
          disableSortBy: true,
        },
        {
          Header: "Result",
          accessor: "result",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <StatusLabel type={original.result} labelName={original.result} />
            );
          },
        },
        {
              Header: "Actions",
              disableSortBy: true,
              Cell: ({ row: { original } }: any) => {
                return (
                  <MenuOptionHrtl
                    actionOptions={actionList}
                    rowId={original.id}
                  ></MenuOptionHrtl>
                );
              },
            }
      ];
}