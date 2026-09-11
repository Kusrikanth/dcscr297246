
import { UserDetails } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Library",
      accessor: "libraryName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Name",
      accessor: "userName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.userName}
              displayId={original?.userCode}
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
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.className}
              displayId={original?.curriculumName}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.sectionName || "-"
      }
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Title",
      accessor: "title",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyFormat(new Date(original?.issuanceDate))
      },
    },
    {
      Header: "Return Date",
      accessor: "returnDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyFormat(new Date(original?.returnDate))
      },
    },
    {
      Header: "Late Return Date",
      accessor: "lateReturnDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyFormat(new Date(original?.lateReturnDate))
      },
    },
    {
      Header: "Created By",
      accessor: "createdBy",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{original.createdBy ? original.createdBy : "-"}</span>
      }
    },
    {
      Header: "Created Date",
      accessor: "createdAt",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original?.createdAt?.split("T") ?? [];
        return <UserDetails
          displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
          displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
          showAvatar={false}
        ></UserDetails>
      }
    },
    // {
    //   Header: "Actions",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
    //     );
    //   },
    // },
  ];
}

export const MenuOptions: Array<any> = [
  {
    id: "student",
    labelName: "Student",
    customPadding: "0px 20px",
  },
  {
    id: "employee",
    labelName: "Employee",
    customPadding: "0px 20px",
  },
  {
    id: "recommendation",
    labelName: "Recommendation",
    customPadding: "0px 20px",
  },

];

export const getUserTypeId = (userType: string) => {
  switch (userType) {
    case "student":
      return 2
    case "employee":
      return 1
    case "recommendation":
      return 3
    default:
      return 2
  }
} 

export const ignoredKeys = ["searchString", "academicYearId", "libraryId","returnDate"]