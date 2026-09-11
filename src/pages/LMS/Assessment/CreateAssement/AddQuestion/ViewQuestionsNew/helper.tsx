import { Cell } from "ketcher-core/dist/domain/entities/canvas-matrix/Cell";
import { InputCheckbox, MenuOptionHrtl, StatusLabel, TextArea, TextInput } from "../../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../../Components/Common/MenuOptions";

const MarksInput = ({ row: { original, index }, onChangeInputHndlr }: any) => {  
  return (
    <TextInput
      name={`[${index}].marks`}
      value={original.marks}
      onChange={onChangeInputHndlr}
      formgroupClassName="mb-0"
      isDisabled={!original.isSelectedStudent} 
    />
  )
}
const QuestionOrder = ({ row: { original, index }, onChangeInputHndlr }: any) => {  
  return (
    <TextInput
      name={`[${index}].questionOrder`}
      value={original.questionOrder}
      onChange={onChangeInputHndlr}
      formgroupClassName="mb-0"
      isDisabled={!original.isSelectedStudent} 
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
            const { id, isSelectedStudent, isDisabled } = original;                        
            return (
              <>
                <InputCheckbox
                  name={`student-${id}`}
                  value={isSelectedStudent}
                  onChange={singleStudentCheckHndlr}
                  dataId={id}
                  formgroupClassName="mb-0"
                  isDisabled={isDisabled} 
                />
              </>
            )
          }
        },
    // {
    //   Header: "S.No",
    //   accessor: "questionId",
    //   disableSortBy: true,
    // },
    {
      Header: "Question",
      accessor: "questionTitle",
      disableSortBy: true,
      columnClassName: "w-300px min-w-300px max-w-300px",
    },
    {
      Header: "Question Order",
      accessor: "questionOrder",
      disableSortBy: true,
      columnClassName: "w-100px min-w-100px max-w-100px",
      Cell: QuestionOrder

    },
    {
      Header: "Difficulty",
      accessor: "difficulty",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.difficultyLevelName}
            labelName={original.difficultyLevelName}
          />
        );
      },
    },
    {
      Header: "Type",
      accessor: "type",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.questionTypeName}
            labelName={original.questionTypeName}
          />
        );
      },
    },
    {
      Header: "Marks",
      accessor: "marks",
      disableSortBy: true,
      columnClassName: "w-100px min-w-100px max-w-100px",
      Cell: MarksInput
    },
  ];
}
export function questionTableData() {
  return [
    {
      id: 1,
      sNo: 1,
      question: "What is the capital of Germany?",
      time: "30 sec",
      difficulty: "Easy",
      type: "Multiple Choice",
    },
  ];
}
