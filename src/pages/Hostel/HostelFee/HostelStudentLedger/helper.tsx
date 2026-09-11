
import { InputCheckbox, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
  
export const studentStatusData = [
  {
    id: "ACTIVE",
    status: "Active",
  },
  {
    id: "INACTIVE",
    status: "In Active",
  }
];

export const hostelStatusData = [
  {
    id: "ACTIVE",
    status: "Active",
  },
  {
    id: "INACTIVE",
    status: "In Active",
  }
];


export function generateColumns(actionsList: Array<IOptionsHrtl>,allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any) {
  return [
    {
          Header: () => {
            return (
              <InputCheckbox
                name={"all-student"}
                value={allStudentSelectedState}
                onChange={allStudentCheckHndlr}
                formgroupClassName="tw-mb-0"
              />
            );
          },
          accessor: "isStudentChecked",
          columnClassName: "tw-w-5",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            const { studentId, isSelected } = original;
            return (
              <>
                <InputCheckbox
                  name={`student-${studentId}`}
                  value={isSelected}
                  onChange={singleStudentCheckHndlr}
                  dataId={studentId}
                  formgroupClassName="tw-mb-0"
                />
              </>
            );
          }
        },
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-[200px] tw-min-w-[200px]",
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
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">{original?.className}</span>
        );
      }
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy:true,
      columnClassName:'tw-text-center',
      Cell:({row:{original}}:any)=>{
        return <span>{original.sectionName?original.sectionName:"-"}</span>
      }
    },
    {
      Header: "Total Amount (₹)",
      accessor: "netAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(+original?.amountToPay)}</span>
      },
    },
    {
      Header: "Paid Amount (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.amountPaid)}</span>
      },
    },
    {
      Header: "Balance Amt (₹)",
      accessor: "balance",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.balance)}</span>
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.studentId}
          // isHorizontal={true}
          />
        );
      },
    },
  ];
}

