
import { FinesTableData } from "./FinesType";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { MoreActions } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
//Utility
import { getDisplayAmountValue } from "../../../utility/commonutility";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

export const feeTypes = [
  {
    id: "FEE STRUCTURE",
    name: "Academics Fee"
  },
  {
    id: "TRANSPORT FEE",
    name: "Transport Fee"
  }
]

export const admissionTypeOptions = [
  {
    id: "NEW_ADMISSION",
    name: "New Admission"
  },
  {
    id: "OLD_ADMISSION",
    name: "Old Admission"
  },
  {
    id: "BOTH",
    name: "Both"
  }
]

export function generateColumns(actionsList: Array<IOptionsHrtl>, offset: any) {
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
      columnClassName: "text-nowrap"
    },
    {
      Header: "Branch Name",
      accessor: "branchName",
      columnClassName: "text-nowrap"
    },
    {
      Header: "Fee Type",
      accessor: "feeType",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{(original?.feeType === "FEE STRUCTURE") ? "ACADEMICS FEE" : original?.feeType}</span>
        );
      },
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
      // disableSortBy: true
    },
    {
      Header: "Admission Type",
      accessor: "admissionTypesForFines",
      Cell: ({ value }: any) => {
        return (
          <span>
            {value
              ?.toLowerCase()
              ?.split("_")
              ?.map(
                (word: string) =>
                  word.charAt(0).toUpperCase() + word.slice(1)
              )
              ?.join(" ") || "-"}
          </span>
        );
      },
    },
    {
      Header: "Due Date",
      accessor: "dueDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDdMmYyyyWithMonthNameFormat(original?.dueDate)}</span>
        );
      },
    },
    {
      Header: "Fine Amount (₹)",
      accessor: "finePerDay",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.finePerDay)}</span>
        );
      },

    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions
            actionOptions={actionsList}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export function getGracePeriodItems(maxDays: number) {
  const gracePeriodItems: any = [];
  for (let i = 0; i < maxDays; i++) {
    gracePeriodItems.push({
      id: (i + 1),
      name: (i + 1)
    })
  }
  return gracePeriodItems;
}

export const fineCalculationOptions = [
  {
    id: "ACTUAL",
    name: "Actual Amount"
  }, {
    id: "DUE",
    name: "Due Amount"
  }
]
export const fineModuleOptions = [
  {
    id: "AMOUNT",
    name: "Amount"
  }, {
    id: "PERCENTAGE",
    name: "Percentage"
  }
]

export function generateModalColumns() {
  return [
    {
      Header: "Department",
      accessor: "department",
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Percentage",
      accessor: "percentage",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control border-0 border-bottom border-[#707070] rounded-0"
            />
            <span className="input-group-text bg-white border-0 border-bottom border-[#707070] rounded-0">
              %
            </span>
          </div>
        );
      },
    },
  ];
}
