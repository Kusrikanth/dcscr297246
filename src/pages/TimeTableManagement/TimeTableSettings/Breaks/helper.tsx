import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";
import { formatToTimeWithPeriod } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>,openViewBreaksModal:any) {
  return [
    {
      Header: "S.No",
      accessor: "id",
      disableSortBy: true,
      columnClassName: "tw-w-[100px] tw-w-min-[100px] tw-w-max-[100px]",
      Cell: ({ row }: any) => {
        return row.index + 1;
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Break Count",
      accessor: "breakCount",
      disableSortBy: true,  
      Cell: ({ row: { original } }: any) => {        
        return(
          <div onClick={()=>openViewBreaksModal(original)} className="tw-text-blue-400 tw-cursor-pointer">
            {original?.breaksCount}
          </div>
        )
      }
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export function viewGenerateColumns() {
    return [
      {
        Header: "S.No",
        accessor: "id",
        disableSortBy: true,
        columnClassName: "tw-w-[100px] tw-w-min-[100px] tw-w-max-[100px]",
        Cell: ({ row }: any) => {
          return row.index + 1;
        },
      },
      {
        Header: "Break Name",
        accessor: "breakName",
        disableSortBy: true,
      },
      {
        Header: "Break Type",
        accessor: "breakType",
        disableSortBy: true,
      },
      {
        Header: "Start Time",
        accessor: "startTime",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <div>
              {formatToTimeWithPeriod(original?.startTime)}
            </div>
          );
        }
      },
      {
        Header: "End Time",
        accessor: "endTime",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <div>
              {formatToTimeWithPeriod(original?.endTime)}
            </div>
          );
        }
      }
    ];
  }

