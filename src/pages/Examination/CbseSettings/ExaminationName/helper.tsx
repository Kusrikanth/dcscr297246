import React from "react";
import { MenuOptionHrtl, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export const examinationOrder = [
  {
    examinationOrder: "1",
  },
  {
    examinationOrder: "2",
  },
  {
    examinationOrder: "3",
  },
  {
    examinationOrder: "4",
  },
  {
    examinationOrder: "5",
  },
  {
    examinationOrder: "6",
  },
  {
    examinationOrder: "7",
  },
  {
    examinationOrder: "8",
  },
  {
    examinationOrder: "9",
  },
  {
    examinationOrder: "10",
  },
];

export function generateExaminationColumns(actionList: Array<IOptionsHrtl>, isTermWiseExamPath: boolean) {
  return [
    {
      Header: "Examination Order",
      accessor: "examinationOrder",
      disableSortBy: true,
    },
    ...(isTermWiseExamPath
      ? [
          {
            Header: "Term Name",
            accessor: "termName",
            disableSortBy: true,
          },
        ]
      : []),
    {
      Header: "Examination Name",
      accessor: "examinationName",
      disableSortBy: true,
    },
    {
      Header: "Short Name",
      accessor: "examinationShortName",
      disableSortBy: true,
    },
    {
      Header: "Exam Category Name",
      accessor: "examCategoryName",
      disableSortBy: true,
    },
    // {
    //   Header: "Classes",
    //   accessor: "classShortName",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const classShortNames = original?.branchClassDtos?.map((classDto: { classShortName: string }) => (
    //       <span key={classDto.classShortName} className="badge text-uppercase bg-light text-muted p-2 me-1">
    //         {classDto.classShortName}
    //       </span>
    //     ));

    //     return classShortNames?.length > 0
    //       ? <>{classShortNames}</>
    //       : <span className="ms-2">-</span>;
    //   }
    // },
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

export const ignoredKeys = ["searchString","academicYearId","curriculumId","classId"];