import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { UserDetails } from "../../../../Components/Common";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [{
    Header: "Class",
    accessor: "className",
    disableSortBy: true,
    columnClassName: "w-250px min-w-250px max-w-250px",
    Cell: ({ row: { original } }: any) => {
      return (
        <UserDetails
          displayName={original?.className || "-"}
          displayId={original?.branchCurriculumName || "-"}
          showAvatar={false}
        />
      );
    },
  },
  {
    Header: "From Marks (%)",
    accessor: "fromMarks",
    disableSortBy: true,
  },
  {
    Header: "To Marks (%)",
    accessor: "toMarks",
    disableSortBy: true,
  }, 
  {
    Header: "Grade",
    accessor: "overAllGrade",
    disableSortBy: true,
  },
  {
    Header: "Grade Color",
    accessor: "gradeColor",
    disableSortBy: true,
    Cell:({row:{original}}:any)=>{
      return <div className="">
            <span
              className="rounded"
              style={{
                width: "24px",
                height: "16px",
                display: "inline-block",
                backgroundColor: `${original.gradeColor}`,
              }}
            ></span>
          </div>
    }
  },
  {
    Header: "Description",
    accessor: "description",
    disableSortBy: true,
    columnClassName: "w-250px min-w-250px max-w-250px",
  },
  {
    Header:"Created By",
    accessor:"createdBy",
    disableSortBy:true,
    Cell:({row:{original}}:any)=>{
      return <span>{original.createdBy ? original.createdBy : "-"}</span>
    }
  },
  {
      Header: "Created Date",
      accessor: "createdAt",
      disableSortBy: true,
      Cell:({row:{original}}:any)=>{
          const [date,time] = original?.createdAt?.split("T") ?? [];
          return <UserDetails
          displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
          displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
          showAvatar={false}
          ></UserDetails>
      }
  },
  {
    Header: "Action",
    thClass: "w-5",
    disableSortBy: true,
    Cell: ({ row: { original } }: any) => {
      return (
        <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
      );
    },
  },
  ];
} 

  export const ignoredKeys = ["searchString",];