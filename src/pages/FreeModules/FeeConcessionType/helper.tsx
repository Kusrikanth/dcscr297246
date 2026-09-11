import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

export interface IAcademicTermTableData {
    id: number,
    termName: string,
    shortName: string,
}

function getConcessionSubTypes(options: (Array<any> | null)) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-1">
        {options.map((item, index) => {
          return (
            <span key={item.id} title={item?.concessionSubTypeName} className="badge tw-uppercase tw-bg-gray-100 tw-text-gray-600 tw-p-2">{item.concessionSubTypeName}</span>
          )
        })}
      </div>
    )
  } else {
    return (<span className="tw-text-blue-500">N/A</span>)
  }
}


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        
        {
            Header: "Concession Type Name",
            accessor: "concessionTypeName",
            disableSortBy: true,
        },
        {
            Header: "Branch Name",
            accessor: "branchName",
            disableSortBy: true,
        },
        {
            Header: "SubTypes",
            accessor: "subTypes",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                   return getConcessionSubTypes(original.subTypes)
            }
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
    ])
}