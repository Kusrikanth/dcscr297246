import {
  MoreActions,
  StatusLabel,
  UserDetails,
} from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
import {  getDisplayAmountValue } from "../../../utility/commonutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Receipt No.",
      accessor: "receiptNo",
    },
    {
      Header: "Receipt Date",
      accessor: "receiptDate",
      Cell: ({ value }: any) => {
        return (<span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(value)}</span>)
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              showAvatar={false}
              displayName={original?.studentName}
              displayId={original?.studentCode}
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      columnClassName: "tw-w-[120px] tw-min-w-[120px]",
      disableSortBy: true,
    },
    // {
    //   Header: "Section",
    //   accessor: "sectionName",
    //   disableSortBy: true,
    // },
    {
      Header: "Cheque No.",
      accessor: "chequeNo",
      disableSortBy: true,
    },
    {
      Header: "Settlement Date",
      accessor: "chequeDate",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(value)}</span>)
      },
    },
    {
      Header: "Amount Paid  (₹)",
      accessor: "amountPaid",
      columnClassName: "tw-text-center",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <span>{getDisplayAmountValue(value)}</span>
        );
      },
    },
    {
      Header: "Fine  (₹)",
      accessor: "fine",
      columnClassName: "tw-text-center",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <span>{getDisplayAmountValue(value)}</span>
        );
      },
    },
    {
      Header: "Bank Name",
      accessor: "bankName",
      disableSortBy: true,
    },
    {
      Header: "Cheque Status",
      accessor: "chequeStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.chequeStatus}
            labelName={original.chequeStatus}
          />
        );
      },
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
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
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { chequeStatus } = original;
        return (
          <>
            {(chequeStatus === "APPROVED" || chequeStatus === "REJECTED") ? <></> : <MoreActions
              actionOptions={actionsList}
              rowId={original.chequeId}
              isHorizontal={true}
            />}
          </>
        );
      },
    },
  ];
}

export const initialFilterState = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  branchClassId: "",
  startDate: "",
  endDate: "",
};

export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
     if(key === "startDate"){
        count += 1;
      }
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}