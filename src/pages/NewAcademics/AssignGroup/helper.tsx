
import { InputCheckbox, MenuOptionHrtl, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";


// assign student table column
export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      // thClass: "text-end",
      // disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          />
        );
      },
    },
  ];
}

// assign student table data


export function generateAssignGroupStudentColumns(isAllSelected: any, allCheckHndlr: any, studentCheckHndlr: any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
            value={isAllSelected}
            onChange={allCheckHndlr}
            formgroupClassName="tw-mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "tw-w-[5%]",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { studentId, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${studentId}`}
              // labelName={shortName}
              value={isSelected}
              onChange={studentCheckHndlr}
              dataId={studentId}
              formgroupClassName="tw-mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original?.studentPic}
              displayName={original?.studentName}
              displayId={original?.studentCode}
              defaultImgType={"student"}
              size="xs"
            />
          </>
        );
      },
    },
  ];
}
