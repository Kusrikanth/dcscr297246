import { StatusLabel, UserDetails } from "../../../../Components/Common";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { PaymentReceivedTableData } from "./PaymentReceivedTypes";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";

export const selectData4 = [
  {
    status: "Active",
  },
  {
    status: "DisActive",
  },
];

export const selectData3 = [
  {
    termNameType: "Term Name",
  },
  {
    termNameType: "option2",
  },
  {
    termNameType: "option3",
  },
];

export const selectData1 = [
  {
    yearType: "2022-23",
  },
  {
    yearType: "option2",
  },
  {
    yearType: "option3",
  },
];

export const selectData2 = [
  {
    classType: "Class",
  },
  {
    classType: "option2",
  },
  {
    classType: "option3",
  },
];

export function generateColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              showAvatar={false}
              displayName={original?.studentName?.StudName}
              displayId={original?.studentName?.dep_id}
            />
          </>
        );
      },
    },

    {
      Header: "Class Section",
      accessor: "classSection",
    },

    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Receipt No.",
      accessor: "receiptNo",
    },
    {
      Header: "Transection ID",
      accessor: "transectionId",
    },
    {
      Header: "Receipt Date",
      accessor: "receiptDate",
    },
    {
      Header: "Payment Mode",
      accessor: "paymentMode",
    },
    {
      Header: "Received Amount (₹)",
      accessor: "receivedAmount",
      Cell: ({ row: { original } }: any) => {
        return (
            <span>{getAmountValueWithDecimal(original?.receivedAmount)}</span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.status} labelName={original.status} />
        );
      },
    },
  ];
}

export const PaymentReceivedData: Array<PaymentReceivedTableData> = [
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    classSection: "NUR-A",
    feeName: "Term Tuition Fee",
    receiptNo: "MESNH4",
    transectionId: "-",
    receiptDate: "June 17,2022",
    paymentMode: "Cash",
    receivedAmount: 121540,
    status: "Active",
  },
  {
    id: 2,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    classSection: "NUR-A",
    feeName: "Term Tuition Fee",
    receiptNo: "MESNH4",
    transectionId: "-",
    receiptDate: "June 17,2022",
    paymentMode: "Cash",
    receivedAmount: 121540,
    status: "Active",
  },
  {
    id: 3,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    classSection: "NUR-A",
    feeName: "Term Tuition Fee",
    receiptNo: "MESNH4",
    transectionId: "-",
    receiptDate: "June 17,2022",
    paymentMode: "Cash",
    receivedAmount: 121540,
    status: "Active",
  },
];
