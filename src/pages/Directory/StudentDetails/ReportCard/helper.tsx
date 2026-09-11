import { MenuOptionHrtl, MoreActions, StatusLabel } from "../../../../Components/Common";
interface IOptionsHrtl {
    id: string;
    actionIcon: React.ReactNode;
    actionName: string;
    onClickHndlr?: any;
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
      {
        Header: "Exam Name",
        accessor: "examName",
        disableSortBy: true,
        
      },
      {
        Header: "Term Name",
        accessor: "termName",
        disableSortBy: true,
       
      },
      {
        Header: "Exam Date",
        accessor: "examDate",
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return (
              <StatusLabel type={original.status} labelName={original.status} />
            );
          },
      },
      {
        Header: "Actions",
        filterable: false,
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <MenuOptionHrtl actionOptions={actionsList} rowId={original.id}/>
          );
        },
      },
    ];
  }

  export const StudentReportData = [
    {
        examName : "Concept Test-1",
        termName : "Term 1",
        examDate : "22 July 2022",
        status:"ACTIVE"
    }
  ]
