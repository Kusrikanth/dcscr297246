import {
  MenuOptionHrtl,
  StatusLabel,
  UserDetails,
} from "../../../../Components/Common";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { admissionWithdrawalTableData } from "./TcRequestsTypes";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";

export const paymentType = [{ id: "CASH", name: "Cash" },
{ id: "CHEQUE", name: "Cheque" }];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Parent Name",
      accessor: "parentName",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      )
    },
    {
      Header: "Contact No",
      accessor: "contactNo",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      )
    },
    {
      Header: "Address",
      accessor: "address",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      )
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions actionOptions={actionsList} rowId={original.admissionWithdrawlId} isHorizontal={true} />
        );
      },
    },
  ];
}