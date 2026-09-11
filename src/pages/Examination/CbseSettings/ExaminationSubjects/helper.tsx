import { UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export function generateCoscholasticGradeColumns(actionList: Array<IOptionsHrtl>, location: any) {
  return [
  {
    Header: "Subject",
    accessor: "subjectName",
    disableSortBy: false,
  },
  ...(location
    ? [
        {
          Header: "Display In ProgressCard",
          accessor: "isDisplayProgressCard",
          disableSortBy: true,
          Cell: ({ value }: any) => (value ? "Yes" : "No"),
        },
        {
    Header: "Include In Percentage",
    accessor: "isIncludePercentage",
    disableSortBy: true,
    Cell: ({ value }: any) => (value ? "Yes" : "No"),
  }
      ]
    : []),
  {
    Header: "Display Order",
    accessor: "displayOrder",
    disableSortBy: false,
  },
  {
    Header: "Grade Order",
    accessor: "gradeBookOrder",
    disableSortBy: false,
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
];

}

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId"];

export const subjectType = [
  {
    id: 'SCHOLASTIC',
    name: 'Scholastic',
  },
  {
    id: 'COSCHOLASTIC',
    name: 'Co-Scholastic',
  },
];

export const scholasticSubjects = [
  {
    id: 'CORE',
    name: 'Core',
  },
  {
    id: 'LANGUAGE',
    name: 'Language',
  },
];
export const coScholasticSubjects = [
  {
    id: 'AREA',
    name: 'Area',
  },
  {
    id: 'ACTIVITY',
    name: 'Activity',
  },
];