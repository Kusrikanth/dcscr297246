import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { UserDetails, AvatarGroupUpdated, StatusLabel } from "../../../Components/Common";

import {
  IOptionsHrtl,
  MoreActions,
} from "../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../utility/commonutility";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";

function getClassList(options: (Array<any> | null)) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="d-flex flex-wrap gap-1">
        {options.map((item, index) => {
          return (
            <span key={`class-${index}-${item.id}`}>{item.shortName}{((index !== (options.length - 1))) ? "," : ""}</span>
          )
        })}
      </div>
    )
  } else {
    return (<span className="text-info text">N/A</span>)
  }
}


export function generateColumns(actionsList: Array<IOptionsHrtl>, offset: any, onClickMoreStudentHndlr: any) {
  return [
    {
      Header: "S.No",
      disableSortBy: true,
      Cell: ({ row: { index } }: any) => {
        const sNo = !isNaN(offset) ? (+offset + (index + 1)) : (index + 1);
        return (
          <span>{sNo}</span>
        );
      },
    },
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true,
    },
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "branchCurriculumName",
      disableSortBy: true,
    },
    {
      Header: "Category",
      accessor: "categoryName",
      disableSortBy: true,
    },
    {
      Header: "Fee Collection Name",
      accessor: "specialFeeName",
      disableSortBy: true,
    },
    {
      Header: "Fee Type",
      accessor: "feeTypeName",
      disableSortBy: true,
    },
    {
      Header: "Applicable to",
      accessor: "applicableTo",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px",
      Cell: ({ row: { original } }: any) => {
        const { id, applicableTo, studentDetails, branchClasses } = original;
        if (applicableTo === "STUDENT") {
          return (
            <AvatarGroupUpdated
              avatars={Array.isArray(studentDetails) && studentDetails}
              imageKey="stundentImg"
              tooltipKey="studentName"
              numberOfAvatarToShow={3}
              showLimitedAvatar={true}
              dataId={id}
              uniqueAvatarKey="studentRegId"
              onClickMoreAvatarHndlr={onClickMoreStudentHndlr}
            />
          )
        } else {
          return (getClassList(branchClasses));
        }

      },
    },
    {
      Header: "Amount (₹)",
      accessor: "amount",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.amount)}</span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "isActive",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original?.isActive ? "Active" : "Inactive"} labelName={original?.isActive ? "Active" : "Inactive"} />
      }
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const updatedAction = actionsList.filter((item:any) => {
          if(item?.id === "viewDetails" && original?.feeType === "ONETIME"){
            return false
          }
          if(item?.id === "downloadSpecialFeeDoc" && !original?.studentDetails[0]?.systemFile){
            return false
          }
          return true
        })
        return (
          <MoreActions
            actionOptions={updatedAction}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export function generateModalColumns() {
  return [
    {
      Header: "Terms",
      accessor: "terms",
    },
    {
      Header: "Last Date to Pay",
      accessor: "lastDatetoPay",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-0 border-bottom border-[#38414A26] rounded-0">
              <i
                className="ri-calendar-2-line"
                style={{ color: "#878A99" }}
              ></i>
            </span>
            <input
              type="text"
              className="form-control border-0 border-bottom border-[#38414A26] rounded-0"
            />
          </div>
        );
      },
    },
    {
      Header: "Fee",
      accessor: "fee",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-0 border-bottom border-[#38414A26] rounded-0">
              <RupeeSvg width="11px" height="11px" fill="#878A99" />
            </span>
            <input
              type="text"
              className="form-control border-0 border-bottom border-[#38414A26] rounded-0"
            />
          </div>
        );
      },
    },
    {
      Header: "New Admission Fee",
      accessor: "newAdmissionFee",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-0 border-bottom border-[#38414A26] rounded-0">
              <RupeeSvg width="11px" height="11px" fill="#878A99" />
            </span>
            <input
              type="text"
              className="form-control border-0 border-bottom border-[#38414A26] rounded-0"
            />
          </div>
        );
      },
    },
  ];
}

export function generateFeeDetailsModalColumns() {
  return [
    {
      Header: "Term Name",
      accessor: "termName",
      disableSortBy: true,
    },
    {
      Header: "Fee Amount (₹)",
      accessor: "feeAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          original?.feeAmount ? <span>{getDisplayAmountValue(original?.feeAmount)}</span> : ""
        );
      },
    },
    {
      Header: "Due Date",
      accessor: "dueDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (original?.dueDate ? <span className="text-nowrap">{getDdMmYyyyFormat(original.dueDate)}</span> : "-")
      },
    },
  ];
}

export const applicableToOptions = [
  {
    id: "CLASS",
    name: "Class"
  }, {
    id: "STUDENT",
    name: "Student"
  }
];

export function showStudentModalColumns() {
  return [
    {
      Header: "Student",
      accessor: "student",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original.thumbnailImage}
              displayName={original?.name}
              displayId={original?.shortName}
              defaultImgType="student"
              size="xs"
            />

          </>
        );
      },
    },
  ]
}

export function hasStateChanged(newState: any) {
  let count: number = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!(key === "name" || key === "academicYearId" || key === "branchCurriculumId"))
        count += 1;
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}


export const searchInputOptions = [
  {
    id:"SPECIAL_FEE_NAME",name : "Fee Collection Name"
  },
  {
    id:"ADMISSION_NO",name : "Admission No"
  },
  {
    id:"STUDENT_NAME",name : "Student Name"
  },
  {
    id:"STUDENT_CODE",name : "Student Code"
  }
]