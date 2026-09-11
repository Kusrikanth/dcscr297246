import { StatusLabel, UserDetails } from "../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Digital Curriculum",
      accessor: "subjectCurriculumName",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Class",
      accessor: "curriculumName",
      disableSortBy: true,
      columnClassName: "w-150px min-w-150px max-w-150px sticky-left text-wrap",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.curriculumName || "-"}
            displayId={original.className || "-"}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Units",
      accessor: "unitsCount",
      disableSortBy: true,
      Cell: ({ value }: any) => value ?? "-",
    },
    {
      Header: "Chapters",
      accessor: "chaptersCount",
      disableSortBy: true,
      Cell: ({ value }: any) => value ?? "-",
    },
    {
      Header: "Topics",
      accessor: "topicsCount",
      disableSortBy: true,
      Cell: ({ value }: any) => value ?? "-",
    },
    {
      Header: "Created By",
      accessor: "createdByName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.createdByName || "-"}
            size="xs"
          />
        );
      },
    },
    {
      Header: "Updated",
      accessor: "lastModifiedAt",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original?.lastModifiedAt?.split("T") ?? [];
        return <UserDetails
          displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
          displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
          showAvatar={false}
        />
      }
    },
    {
      Header: "Status",
      accessor: "curriculumStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        if (!original.curriculumStatus) {
          return null;
        }
        return (
          <StatusLabel
            type={original.curriculumStatus}
            labelName={original.curriculumStatus}
          />
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          />
        );
      },
    },
  ];
}