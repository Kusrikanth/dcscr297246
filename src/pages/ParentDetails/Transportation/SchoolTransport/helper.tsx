import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { StatusLabelWithStepper } from "../../../NewAcademics/TransferCertificate/StatusLabelWithStepper";



export const requestType = [
  {
    reqType: "Offline",
  },
  {
    reqType: "Online",
  }
]

// generate roll number table select filter
export const statusTypes = [
  {
    statusType: "Yet_to_prepare",
  },
  {
    statusType: "Prepared",
  },
  {
    statusType: "Issued",
  },
];

export const menuItems = [{ id: "true", name: "Yes" }, { id: "false", name: "No" }]

export function generateColumns() {
  return [
    {
      Header: "Terms",
      accessor: "termName",
      disableSortBy: true,
    },
    {
      Header: "Amount (₹)",
      accessor: "termAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDisplayAmountValue(original?.termAmount)
      }
    }
  ];
}

export const requestTypeOptions = [
  {
    id: "NEW_REQUEST",
    name: "NEW REQUEST"
  },
  {
    id: "CHANGE_REQUEST",
    name: "CHANGE REQUEST"
  },
  {
    id: "TERMINATION_REQUEST",
    name: "TERMINATION REQUEST"
  }
]