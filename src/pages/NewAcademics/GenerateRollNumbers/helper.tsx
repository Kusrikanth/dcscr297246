
import { TextInput, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { Input } from "reactstrap";

const editRollNumber = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  return <div className="tw-mb-0 tw-w-30 tw-flex tw-items-center">
    <TextInput
      name={`rollNo`}
      value={original?.rollNo}
      onChange={(event:any)=>onChangeInputHndlr(event, original?.academicStudentId)}
      formgroupClassName="tw-mb-0"
      isDisabled={!original?.isEdit}
    />
  </div>
}


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      thClass: "tw-w-32",
      // disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original.studentName}
              displayId={original.studentCodeNum}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      // thClass: "w-15",
      disableSortBy: true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      // thClass: "w-15",
      disableSortBy: true,
    },
    {
      Header: "Roll Number",
      accessor: "rollNo",
      // thClass: "w-60",
      disableSortBy: true,
      Cell: editRollNumber
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      // columnClassName: "w-30",
      Cell: ({ row: { original } }: any) => {
        const newActionList = actionsList?.map((i: any) => {
          if (original?.isEdit === false && i?.id === "edit") {
            return i
          } else if (original?.isEdit === true && i?.id === "success") {
            return i
          }
        })
        return (
          <MenuOptionHrtl
            actionOptions={newActionList.filter((i: any) => i)}
            rowId={original.academicStudentId}
          />
        );
      },
    },
  ];
}

export function generateRollModalColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original.studentName}
              displayId={original.studentCodeNum}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Roll Number",
      accessor: "rollNo",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <Input
              name="rollNo"
              value={original.rollNo}
              onChange={() => { }}
              inputClassName="tw-bg-gray-100"
              readOnly
            />
          </>
        );
      },
    },
  ];
}

export const rollType = [
  {
    id: "STUDENT_NAME",
    type: "Alphabetical Order"
  },
  {
    id: "STUDENT_CODE",
    type: "Student Id Order"
  },

]