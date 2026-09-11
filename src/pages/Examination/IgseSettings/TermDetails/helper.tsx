import { MenuOptionHrtl, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>, igcse: boolean, isInstituteAdmin: boolean) {
  return [
    {
      Header: "Term Name",
      accessor: "termName",
      disableSortBy: true,
    },
    {
      Header: "From date",
      accessor: "fromDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(new Date(original.fromDate || "-"))}</span>)
      },
    },
    {
      Header: "To Date",
      accessor: "toDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(new Date(original.toDate || "-"))}</span>)
      },
    },
    ...(igcse
      ? [
         {
      Header: "Dated",
      accessor: "dated",
      disableSortBy: true,
    },
    {
      Header: "Term Review Name",
      accessor: "termReviewName",
      disableSortBy: true,
    },
    {
      Header: "Term Review Date",
      accessor: "termReviewDate",
      disableSortBy: true,
    },
      ]
      : [{
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
    },]),
    ...(isInstituteAdmin
        ? [
            {
              Header: "Action",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
            },
          ]
        : []),
  ];
}

export const ignoredKeys = ["searchString","academicYearId", "branchId", "curriculumId","classId"];