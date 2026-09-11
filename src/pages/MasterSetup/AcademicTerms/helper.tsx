import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

export interface IAcademicTermTableData {
    id: number,
    termName: string,
    shortName: string,
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Term Name",
      accessor: "termName",
      Cell: ({ value }: any) => {
        // const { termName } = value || {};
        return <span>{value || "n/a"}</span>;
      },
    },
    {
      Header: "Term Type",
      accessor:"termTypeName",
      disableSortBy:true,
    },
    {
      Header: "From Date",
      accessor: "startDate",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return getDdMmYyyyWithMonthNameFormat(new Date(original.startDate))
      }
    },
    {
      Header: "To Date",
      accessor: "endDate",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return getDdMmYyyyWithMonthNameFormat(new Date(original.endDate))
      }
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.instituteAcademicTermId}
          />
        );
      },
    },
  ];
}


export const academicTermTableData: Array<IAcademicTermTableData> = [
    {
        id: 1,
        termName: "Term I",
        shortName: "T1"
    }, {
        id: 2,
        termName: "Term II",
        shortName: "T2"
    },
    {
        id: 3,
        termName: "Term III",
        shortName: "T3"
    },
]