import { InputCheckbox, MenuOptionHrtl, StatusLabel, UserDetails } from "../../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../../Components/Common/MenuOptions";

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
        const { id, isSelected, isDisabled } = original;            
        return (
          <>
            <InputCheckbox
              name={`student-${id}`}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={id}
              formgroupClassName="mb-0"
              isDisabled={isDisabled} 
            />
            {/* {isDisabled && (
              <span className="badge bg-success text-white ms-2" style={{fontSize: '10px'}}>
                Selected
              </span>
            )} */}
          </>
        )
      }
    },
    {
      Header: "Question",
      accessor: "question",
      disableSortBy: true,
      columnClassName: "w-300px min-w-300px max-w-300px sticky-left",
      Cell: ({ row: { original } }: any) => {
        const { isDisabled } = original;
        return (
          <div style={isDisabled ? { opacity: 0.6 } : {}}>
            <UserDetails
              displayName={original?.questionTitle}
              displayId={original?.questionId}
              showAvatar={false}
            />
          </div>
        );
      },
    },
    {
      Header: "Options",
      accessor: "option",
      disableSortBy: true,
      Cell: ({row: {original}}: any) => {
        if (!Array.isArray(original?.questionOptions)) return null;
        const { isDisabled } = original;

        return (
          <div style={isDisabled ? { opacity: 0.6 } : {}}>
            {original.questionOptions?.map((opt: any, index: number) => (
              <div key={index}>
                <span className="text-muted p-2">
                  {String.fromCharCode(65 + opt.order).toUpperCase() + ". "}
                </span>
                {opt.optionText}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      Header: "Difficulty",
      accessor: "difficulty",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { isDisabled } = original;
        return (
          <div style={isDisabled ? { opacity: 0.6 } : {}}>
            <StatusLabel
              type={original.difficultyLevelName}
              labelName={original.difficultyLevelName}
            />
          </div>
        );
      },
    },
    {
      Header: "Type",
      accessor: "type",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { isDisabled } = original;
        return (
          <div style={isDisabled ? { opacity: 0.6 } : {}}>
            <span className="badge text-uppercase bg-light text-muted p-2">
              {original.questionTypeName}
            </span>
          </div>
        );
      },
    }
  ];
}