
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { UserDetails } from "../../../Components/Common";
import { convertUTCToISTTimeOnly, getDdMmYyyyFormatFromString, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              size={"xs"}
              defaultImgType="student"
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
      accessor: "classShortName",
      disableSortBy: true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "From Date",
      accessor: "fromDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.fromDate ? getDdMmYyyyFormatFromString(original?.fromDate) : "-";
      },
    },
    {
      Header: "User Date",
      accessor: "userDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.userDate ? getDdMmYyyyFormatFromString(original?.userDate) : "-";
      },
    },
    {
      Header: "User Name",
      accessor: "userName",
      disableSortBy: true,
    },
    {
      Header: "Remark",
      accessor: "remarks",
      disableSortBy: true,
      columnClassName: "w-200px min-w-100px max-w-200px",
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
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },

  ];
}
