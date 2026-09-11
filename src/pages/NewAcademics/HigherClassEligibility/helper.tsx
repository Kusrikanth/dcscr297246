
import { original } from "@reduxjs/toolkit";
import {
  InputCheckbox,
  MenuOptionHrtl,
  StatusLabel,
  UserDetails,
} from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../utility/commonutility";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      // disableSortBy:true,
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
      Header: "Class",
      accessor: "className",
      disableSortBy: true
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true
    },
    {
      Header: "Roll Number",
      accessor: "rollNo",
      disableSortBy: true
    },
    {
      Header: "Phone No.",
      accessor: "contactNo",
      disableSortBy: true
    },
    {
      Header: "Email id",
      accessor: "emailId",
      disableSortBy: true
    },
    {
      Header: "Promotion Status",
      accessor: "promotionStatus",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.promotionStatus === "PROMOTED" ? "current" : original.promotionStatus} labelName={original.promotionStatus} />
        );
      },
    },
    {
      Header: "Fee Due",
      accessor: "isFeeDue",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <span>{value ? "Yes" : "No"}</span>
        );
      },
    },
    {
      Header: "Fee Amount (₹)",
      accessor: "feeDueAmount",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(value)}</span>
      },
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
        accessor: "lastModifiedAt",
        disableSortBy: true,
        Cell:({row:{original}}:any)=>{
            const [date,time] = original?.lastModifiedAt?.split("T") ?? [];
            return <UserDetails
            displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
            displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
            showAvatar={false}
            ></UserDetails>
        }
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let actionList: any = [];
        if (original.promotionStatus == "PROMOTED") {
          actionList.push(actionsList[0])
        }
        else {
          actionList.push(actionsList[1])
        }
        return (
          original?.promotionStatus !== "NON_ELIGIBLE" && <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}

export function generateHigherClassModalColumns(isAllSelected: any, allCheckHndlr: any, studentCheckHndlr: any) {
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
      // disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original.studentName}
              displayId={original.studentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true
    },
    {
      Header: "Roll Number",
      accessor: "rollNo",
      disableSortBy: true
    },
    {
      Header: "Phone No.",
      accessor: "contactNo",
      disableSortBy: true
    },
    {
      Header: "Email id",
      accessor: "emailId",
      disableSortBy: true
    },
    {
      Header: "Fee Due",
      accessor: "isFeeDue",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <span>{value ? "Yes" : "No"}</span>
        );
      },
    },
    {
      Header: "Fee Amount (₹)",
      accessor: "feeDueAmount",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(value)}</span>
      },
    },
  ];
}


export const feeDueOptions = [
  {
    id: "true",
    name: "YES"
  }, {
    id: "false",
    name: "No"
  }
]
export const promotionStatusList = [
  {
    id: "PROMOTED", name: "Promoted",
  },
  {
    id: "NOT_PROMOTED", name: "Not Promoted",
  },
  {
    id: "NOT_MARKED_ELIGIBLE", name: "Non Marked Eligible",
  }
]

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
    }
  }
  if (count > 0) { return { stateChange: showState } }
  else { return { stateChange: showState } }
}