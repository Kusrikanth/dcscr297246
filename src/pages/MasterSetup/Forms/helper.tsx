import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

interface IBranches {
    id: string,
    branchName: string,
}

function getBranchesLabel(options: any) {
    if (Array.isArray(options) && options.length > 0) {
        return (
            <div className="tw-flex tw-flex-wrap tw-gap-1">
                {options.map((item, index) => {
                    return (
                        <span key={item.branchId} className="badge badge-soft-secondary">{item.branch}</span>
                    )
                })}
            </div>
        )
    } else {
        return (<span className="text">N/A</span>)
    }
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Form Name",
            accessor: "formName",
        },
        {
            Header: "Branches",
            accessor: "branchName",
            disableSortBy: true,
            // Cell: ({ row: { original } }: any) => {
            //     return (
            //         getBranchesLabel(original.assignedForms)
            //     );
            // },
        },
        {
            Header: "Url",
            accessor: "formUrl",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (
                    <>
                        <a target="_blank" href={value} className="tw-text-blue-500 hover:tw-text-blue-600">Link</a>
                    </>
                );
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            filterable: false,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original?.branchFormId} />
                );
            },
        },
    ])
}
