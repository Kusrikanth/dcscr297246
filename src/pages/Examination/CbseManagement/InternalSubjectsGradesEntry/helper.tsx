import { InternalSubjectsGradesEntryDataTypes } from "./InternalSubjectsGradesEntryTypes";
import { InputCheckbox, SelectInput, UserDetails } from "../../../../Components/Common";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";

const GradeInput = ({ row: { original, index }, onChangeInputHndlr, rowDataInfo}: any) => {  
  return (
    <SelectInput
      name={`[${index}].grade`}
      menuItems={rowDataInfo}
      value={ original?.grade || ""}
      onChange={onChangeInputHndlr}
      valueKey="grade"
      textKey="grade"
      isDisabled={!original.isSelected}
      formgroupClassName="mb-0"
      error={(original?.touched?.grade && original?.errors?.grade) ? original?.errors?.grade : ""}
      invalid={(original?.touched?.grade && original?.errors?.grade) ? true : false}
    />
  )
}

export function generateColumns(allStudentSelectedState: any, allStudentCheckHndlr: any, singleStudentCheckHndlr: any) {
        return [
          {
                Header: () => {
                  return (
                    <InputCheckbox
                      name={"all-student"}
                      // labelName={shortName}
                      value={allStudentSelectedState}
                      onChange={allStudentCheckHndlr}
                      formgroupClassName="mb-0"
                    />
                  )
                },
                accessor: "isStudentChecked",
                columnClassName: "w-5",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => {
                  const { studentId, isSelected } = original;
                  return (
                    <>
                      <InputCheckbox
                        name={`student-${studentId}`}
                        // labelName={shortName}
                        value={isSelected}
                        onChange={singleStudentCheckHndlr}
                        dataId={studentId}
                        formgroupClassName="mb-0"
                      />
                    </>
                  )
                }
              },
            {
                Header: "Student Name",
                accessor: "studentName",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => {
                  return (
                    <>
                      <UserDetails
                        imageUrl={original?.studentName?.imgUrl}
                        displayName={original?.studentName}
                        displayId={original?.studentCode}
                        size="xs"
                      />
                    </>
                  );
                },
            },
            
            {
                Header: "Roll No.",
                accessor: "rollNo",
                disableSortBy: true,
            },
            {
                Header: "Grade",
                accessor: "studentGradeId",
                disableSortBy: true,
                Cell: GradeInput
            }
        ];
}
export const InternalSubjectsGradesEntryTableData: Array<InternalSubjectsGradesEntryDataTypes> = [
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    rollNo: "1",
  },
  {
    id: 2,
    studentName: {
      StudName: "User2",
      dep_id: "DCIP000002",
      imgUrl: avatar1,
    },
    rollNo: "2",
  },
  {
    id: 3,
    studentName: {
      StudName: "User3",
      dep_id: "DCIP000003",
      imgUrl: avatar1,
    },
    rollNo: "3",
  },
];