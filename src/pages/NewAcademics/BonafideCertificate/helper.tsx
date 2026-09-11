import { StatusLabel, UserDetails } from "../../../Components/Common";
import {
  IOptionsHrtl,
  MoreActions,
} from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";


export const selectData3 = [
  {
    statusType: "Issued",
    statusTypeId: "ISSUED"
  },
  {
    statusType: "Not Issued",
    statusTypeId: "NOTISSUED",
  },
];



export function generateColumns(
  actionsList: Array<IOptionsHrtl>,
  toggleConfimationModalModal: any,
  toggleApprovalStatusModalModal: any,
  toggleApprovalStatusBatchModalModal: any
) {
  return [
    {
      Header: "Request Date",
      accessor: "requestDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyWithMonthNameFormat(new Date(original.requestDate))
      },
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
      disableSortBy: true,
      // Cell: ({ row: { original } }: any) => {
      //   return (
      //     <>
      //       <div onClick={() => toggleConfimationModalModal()}>
      //         {original.className}
      //       </div>
      //     </>
      //   );
      // },
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      // Cell: ({ row: { original } }: any) => {
      //   return (
      //     <>
      //       <div onClick={() => toggleApprovalStatusModalModal()}>
      //         {original.section}
      //       </div>
      //     </>
      //   );
      // },
    },
    {
      Header: "Request Type",
      accessor: "requestType",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => <>{original?.requestType || '-'}</>
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original.issuanceDate ? getDdMmYyyyWithMonthNameFormat(new Date(original.issuanceDate)) : "-"
      },
    },
    {
      Header: "Preparation Status",
      accessor: "preparationStatus",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.preparationStatus} labelName={original.preparationStatus} />
        );
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
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        let filterMenuOptions = actionsList,
          { preparationStatus } = original;
        if (preparationStatus?.toLowerCase() === "issued") {
          filterMenuOptions = actionsList.filter(item => item.id === "email" || item.id === "edit" || item.id === "print");
        } else {
          filterMenuOptions = actionsList.filter(item => item.id === "edit" || item.id === "issue");
        }
        return (
          <MoreActions
            actionOptions={filterMenuOptions}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

