
import { StatusLabel, TextInput, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.studentImageS3URL}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
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
      Header: "Sections",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Subjects",
      accessor: "subjects",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}

export const subjectAllocationData = [{
    id : 1,
    classId:"4",
    academicYearId:10,
    curriculumId:1,
    studentName : "John Doe",
    studentCode:"R1234567",
    curriculumName : "English",
    className : "Class 1",
    sectionName : "Section 1",
    subjects : ["English 1", "English 2", "English 3"],
}]

