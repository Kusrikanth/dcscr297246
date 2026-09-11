import { UserDetails } from "../../../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../../utility/dateutility";

export function generateColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Father Name",
      accessor: "fatherName",
      disableSortBy: true,
    },
    {
      Header: "Admission Date",
      accessor: "admissionDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.admissionDate)}</span>)
      },
    },
    {
      Header: "Admission Type",
      accessor: "admissionType",
      disableSortBy: true,
    },
  ];
}

export const admissionTypeOptions = [
  {
    name : "Residential",
    id : "Residential",
  },
  {
    name : "Non Residential",
    id : "Non-Residential",
  }
]
