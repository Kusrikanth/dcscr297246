import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl, UserDetails } from "../../../../Components/Common";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export function generateWeightageColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
      columnClassName:"w-250px min-w-250px max-w-250px",
      
    },
    {
      Header: "Class",
      accessor: "shortName",
      disableSortBy: true,
  },
  {
    Header: "Term",
    accessor: "termName",
    disableSortBy: true,
  },
    {
      Header: "Examination with Marks Weightage",
      accessor: "examinationName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const examinationWeightageName = original?.weightageDtos?.map((examinationWeightageDtos: { examinationName: string, examinationId: number,weightagePercentage: string, weightageChildId: number }) => (
          <span key={examinationWeightageDtos.examinationId} className="badge text-uppercase bg-light text-muted p-2 me-1 mb-2">
            {examinationWeightageDtos.examinationName}-({examinationWeightageDtos.weightagePercentage})
          </span>
        ));

        return examinationWeightageName?.length > 0
          ? <>{examinationWeightageName}</>
          : <span className="ms-2">-</span>;
      }
    
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

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId"];