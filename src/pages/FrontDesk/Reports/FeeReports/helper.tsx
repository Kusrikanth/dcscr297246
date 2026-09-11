import { UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header:"Fee Type",
            accessor:"feeDetails",
            disableSortBy: true,
        },
        {
            Header: "Cash (₹)",
            accessor: "cash",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.cash)}</span>
            },
        },
        {
            Header:"Cheque (₹)",
            accessor:"cheque",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.cheque)}</span>
            },
        },
        {
            Header: "Card Payment (₹)",
            accessor: "card_payment",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.card_payment)}</span>
            },
        },
        {
            Header: "Online PG (₹)",
            accessor: "online_pg",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.online_pg)}</span>
            },
        },
        {
            Header: "UPI (₹)",
            accessor: "upi",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.upi)}</span>
            },
        },
        {
            Header: "JODO Pay (₹)",
            accessor: "jodo_pay",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.jodo_pay)}</span>
            },
        },
        {
            Header: "JODO QR (₹)",
            accessor: "jodo_qr",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.jodo_qr)}</span>
            },
        },
        {
            Header: "JODO FLEX (₹)",
            accessor: "jodo_flex",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.jodo_flex)}</span>
            },
        },
        {
            Header: "JODO CRED (₹)",
            accessor: "jodo_cred",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.jodo_cred)}</span>
            },
        },
    ];
}

export function generateColumnsForFeeCollection() {
    return [
        {
            Header:"Curriculum",
            accessor:"curriculumName",
            disableSortBy: true,
        },
        {
            Header:"Class",
            accessor:"className",
            disableSortBy: true,
        },
        {
            Header: "Student Name",
            accessor: "studentName",
            columnClassName: "tw-w-[180px] tw-min-w-[180px]",
            disableSortBy: true,
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
            Header:"Fee Name",
            accessor:"feeName",
            disableSortBy: true,
        },
        {
            Header:"Receipt No.",
            accessor:"receiptNo",
            disableSortBy: true,
        },
        {
            Header:"Receipt Date",
            accessor:"receiptDate",
            disableSortBy: true,
        },
        {
            Header:"User Date",
            accessor:"userDate",
            disableSortBy: true,
        },
        {
            Header:"Paid At",
            accessor:"paidAt",
            disableSortBy: true,
        },
        {
            Header:"Payment Mode",
            accessor:"paymentMode",
            disableSortBy: true,
        },
        {
            Header:"Transaction No.",
            accessor:"transactionNo",
            disableSortBy: true,
        },
        {
            Header:"Cheque No.",
            accessor:"chequeNo",
            disableSortBy: true,
        },
        {
            Header:"Card Charges",
            accessor:"cardCharges",
            disableSortBy: true,
        },
        {
            Header: "Fine (₹)",
            accessor: "fine",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.cash)}</span>
            },
        },
        {
            Header:"Paid Amount (₹)",
            accessor:"paidAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.cheque)}</span>
            },
        },
        {
            Header: "Disbursement Amount (₹)",
            accessor: "disbursementAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.cardPayment)}</span>
            },
        },
        {
            Header:"User Name",
            accessor:"userName",
            disableSortBy: true,
        },
    ];
}

export const feeTypeWiseData = [
    { feeType: "Type A", cash: 100, cheque: 50, cardPayment: 75, onlinePg: 120, upi: 90, jodoPay: 110, jodoQr: 80 },
    { feeType: "Type B", cash: 80, cheque: 60, cardPayment: 90, onlinePg: 110, upi: 70, jodoPay: 100, jodoQr: 50 },
    { feeType: "Type C", cash: 120, cheque: 40, cardPayment: 100, onlinePg: 80, upi: 110, jodoPay: 70, jodoQr: 60 },
    { feeType: "Type D", cash: 90, cheque: 70, cardPayment: 110, onlinePg: 60, upi: 80, jodoPay: 120, jodoQr: 40 },
]

export const feeCollectionData = [
    {
      curriculumName: "CBSE",
      className: "VIII",
      studentName: "John Doe",
      feeName: "Tuition Fee",
      receiptNo: "123456",
      receiptDate: "2023-11-21",
      userDate: "2023-11-21",
      paidAt: "School Office",
      paymentMode: "Cash",
      transactionNo: "789012",
      chequeNo: "567890",
      cardCharges: 10,
      fine: 5,
      paidAmount: 1000,
      disbursementAmount: 990,
      userName: "Admin",
    },
    // Add more dummy data as needed
  ];

  export const statusMenuOptions = [
    { id : "Active" , value : "Active"},
    { id : "Inactive" , value : "Inactive"},
  ]

  export const paymentModeMenuOptions = [
    { id : "Cash" , value : "Cash"},
    { id : "Online" , value : "Online"},
  ]

  export const paidAtMenuOptions = [
    { id : "Bank" , value : "Bank"},
    { id : "School" , value : "School"},
  ]