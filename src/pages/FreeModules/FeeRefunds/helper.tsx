
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
import {  getDisplayAmountValue } from "../../../utility/commonutility";
import { UserDetails } from "../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Refund Date",
      accessor: "refundDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.refundDate)}</span>)
      },
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      // thClass: "w-10",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px]",
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
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      thClass: "w-5",
      disableSortBy: true
    },
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-whitespace-nowrap">{original?.classShortName}</span>)
      },
    },
    {
      Header: "Refunded Amount (₹)",
      accessor: "refundAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.refundAmount)}</span>
        );
      },
    },
    {
      Header: "Payment Mode",
      accessor: "paymentMode",
      thClass: "w-5",
      disableSortBy: true
    },
    {
      Header: "Transaction Id",
      accessor: "transactionId",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.transactionId || "-"}</span>
        );
      },
    },
    {
      Header: "Transaction Date",
      accessor: "transactionDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-whitespace-nowrap">{getDdMmYyyyWithMonthNameFormat(original.transactionDate)}</span>)
      },
    },
    {
      Header: "Adjustment Amount (₹)",
      accessor: "adjustAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.adjustAmount)}</span>
        );
      }
    },
    {
      Header: "Adjusted to",
      accessor: "adjustedTo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.adjustedStudentName}
              displayId={original?.adjustedStudentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Cash Amount (₹)",
      accessor: "cashAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDisplayAmountValue(original.cashAmount)}</span>)
      },
    },
    {
      Header: "Cheque Amount (₹)",
      accessor: "chequeAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDisplayAmountValue(original.chequeAmount)}</span>)
      },
    },
    {
      Header: "Cheque No",
      accessor: "chequeNumber",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.chequeNumber || "n/a"}</span>
        );
      },
    },
    {
      Header: "In the Name Of",
      accessor: "accountPayeeName",
      thClass: "w-10",
      disableSortBy: true
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
        accessor: "createdAt",
        disableSortBy: true,
        Cell:({row:{original}}:any)=>{
            const [date,time] = original?.createdAt?.split("T") ?? [];
            return <UserDetails
            displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
            displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
            showAvatar={false}
            ></UserDetails>
        }
    },
    {
      Header: "Attachment",
      accessor: "fileInfo",
      disableSortBy: true,
      // Frozen to the right edge so the supporting document stays visible while scrolling.
      columnClassName: "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_244_246/var(--tw-bg-opacity))] tw-w-[180px] tw-min-w-[180px] tw-max-w-[180px]",
      tdClass: "sticky-right !tw-z-10",
      Cell: ({ row: { original } }: any) => {
        const files = Array.isArray(original?.fileInfo) ? original.fileInfo : [];
        if (files.length === 0) {
          return <span>-</span>;
        }
        return (
          <div className="tw-flex tw-flex-col tw-gap-1">
            {files.map((file: any, index: number) => {
              const fileName = file?.originalFileName || "Attachment";
              const isPdf = fileName.toLowerCase().endsWith(".pdf");
              return (
                <button
                  key={file?.id || index}
                  type="button"
                  title={fileName}
                  className="tw-flex tw-items-center tw-gap-1 tw-max-w-[160px] tw-bg-transparent tw-border-0 tw-p-0 tw-text-left tw-text-[#405189] hover:tw-underline disabled:tw-text-gray-500 disabled:tw-no-underline"
                  onClick={() => window.open(file.s3URL, "_blank")}
                  disabled={!file?.s3URL}
                >
                  <i className={isPdf ? "ri-file-pdf-2-line" : "ri-image-line"}></i>
                  <span className="tw-truncate">{fileName}</span>
                </button>
              );
            })}
          </div>
        );
      },
    },
  ];
}

// TODO: remove once the fee refund list API returns rows (and their fileInfo attachments) reliably.
// Used only when the live list comes back empty, so the Attachment column can be reviewed.
export const USE_SAMPLE_FEE_REFUNDS_LIST = true;

export const sampleFeeRefundsList = {
  pageNumber: 0,
  totalPages: 1,
  totalElements: 3,
  data: [
    {
      id: 1, refundDate: "2026-09-18", studentName: "2nd feb17th", studentCode: "1250286",
      branchName: "Mahendra Hills", curriculumName: "CBSE", classShortName: "II",
      refundAmount: 500, paymentMode: "", transactionId: "", transactionDate: "",
      adjustAmount: 500, adjustedStudentName: "2nd feb17th", adjustedStudentCode: "1250286",
      cashAmount: 0, chequeAmount: 0, chequeNumber: "", accountPayeeName: "",
      createdBy: "ANCY THOMAS", createdAt: "2026-09-18T05:42:10",
      fileInfo: [{ id: 501, originalFileName: "fine-waiver-approval.pdf", s3URL: "" }],
    },
    {
      id: 2, refundDate: "2026-09-12", studentName: "Aarav Sharma", studentCode: "1250114",
      branchName: "Mahendra Hills", curriculumName: "CBSE", classShortName: "V",
      refundAmount: 1500, paymentMode: "ONLINE", transactionId: "REF1122334455", transactionDate: "2026-09-12",
      adjustAmount: 0, adjustedStudentName: "", adjustedStudentCode: "",
      cashAmount: 0, chequeAmount: 0, chequeNumber: "", accountPayeeName: "",
      createdBy: "ANCY THOMAS", createdAt: "2026-09-12T09:15:32",
      fileInfo: [{ id: 502, originalFileName: "excess-payment-proof.jpg", s3URL: "" }],
    },
    {
      id: 3, refundDate: "2026-08-28", studentName: "Diya Reddy", studentCode: "1250233",
      branchName: "Mahendra Hills", curriculumName: "CBSE", classShortName: "VIII",
      refundAmount: 4000, paymentMode: "CHEQUE", transactionId: "", transactionDate: "2026-08-28",
      adjustAmount: 0, adjustedStudentName: "", adjustedStudentCode: "",
      cashAmount: 0, chequeAmount: 4000, chequeNumber: "004512", accountPayeeName: "Ravi Reddy",
      createdBy: "ANCY THOMAS", createdAt: "2026-08-28T11:03:47",
      fileInfo: [],
    },
  ],
};


export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}}