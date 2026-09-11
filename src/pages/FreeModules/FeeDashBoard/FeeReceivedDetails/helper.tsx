import { StatusLabel, UserDetails } from "../../../../Components/Common";
import {
  IOptionsHrtl,
  MoreActions,
} from "../../../../Components/Common/MenuOptions";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { IFeeDetailsData } from "./feeReceivedDetailsTypes";

// academics table select filter
export const selectData1 = [
  {
    branchType: "Curriculum",
  },
  {
    branchType: "CBSE",
  },
  {
    branchType: "ICSE",
  },
  {
    branchType: "CBSE-1",
  },
];

// academics table select filter
export const selectData2 = [
  {
    classType: "Curriculum",
  },
  {
    classType: "CBSE",
  },
  {
    classType: "ICSE",
  },
  {
    classType: "CBSE-1",
  },
];

export function generateColumns() {
  return [
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            imageUrl={original?.name?.imgUrl}
            displayName={original?.name?.name}
            displayId={original?.name?.dep_id}
          />
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculum",
    },
    {
      Header: "Class",
      accessor: "class",
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Last Date to Pay",
      accessor: "lastDatetoPay",
    },
    {
      Header: "Payable Amount",
      accessor: "payableAmount",
    },
    {
      Header: "Amount Paid",
      accessor: "amountPaid",
    },
    {
      Header: "Payment Mode",
      accessor: "paymentMode",
    },
    {
      Header: "Balance",
      accessor: "balance",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.status} labelName={original.status} />
        );
      },
    },
  ];
}

export const classData: Array<IFeeDetailsData> = [
  {
    id: 1,
    name: {
      name: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    curriculum: "CBSE",
    class: "XII-SCI",
    feeName: "Term Tuition Fee",
    lastDatetoPay: "Jun 23, 2022",
    payableAmount: "12,1540",
    amountPaid: "12,1540",
    paymentMode: "Online",
    balance: "0.00",
    status: "Full Payment",
  },
  {
    id: 2,
    name: {
      name: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    curriculum: "CBSE",
    class: "XII-SCI",
    feeName: "Term Tuition Fee",
    lastDatetoPay: "Jun 23, 2022",
    payableAmount: "12,1540",
    amountPaid: "12,1540",
    paymentMode: "Online",
    balance: "0.00",
    status: "Full Payment",
  },
  {
    id: 3,
    name: {
      name: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    curriculum: "CBSE",
    class: "XII-SCI",
    feeName: "Term Tuition Fee",
    lastDatetoPay: "Jun 23, 2022",
    payableAmount: "12,1540",
    amountPaid: "12,1540",
    paymentMode: "Online",
    balance: "0.00",
    status: "Full Payment",
  },
];
