
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { getDateWithTimeFormat } from "../../../utility/dateutility";
export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Title",
            accessor: "title",
            disableSortBy: true,
        },
        {
            Header: "Description",
            accessor: "description",
            disableSortBy: true,
            tdClass: "tw-text-wrap tw-break-words",
            columnClassName: "!tw-w-[300px] !tw-min-w-[300px] !tw-max-w-[300px]",
            Cell: ({ row: { original } }: any) => {
                return <div dangerouslySetInnerHTML={{__html : original?.description}}/>;
            }
        },
        {
            Header: "Date",
            accessor: "date",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    getDateWithTimeFormat(original?.date ? `${original?.date}z` : '')
                  );
            },
        },
        {
            Header: "Created Name",
            accessor: "createdName",
            disableSortBy: true,
        },
        {
            Header: "Contact No",
            accessor: "contactNo",
            disableSortBy: true,
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                 <MoreActions actionOptions={actionsList} rowId={original.id} isHorizontal={true} />
                );
            },
        },
    ])
}

export function renderOptionsEmployee(item: any) {
    return `${item?.employeeName} - ${item?.employeeCode}`;
  }
  
  export function renderValueSection(selectedItems: any) {
    return `${selectedItems?.employeeCode}`;
  }