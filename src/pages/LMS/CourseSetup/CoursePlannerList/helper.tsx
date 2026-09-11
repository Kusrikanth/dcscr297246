import { StatusLabel, UserDetails } from "../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
  MoreActions,
} from "../../../../Components/Common/MenuOptions";

const statusStyles: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  published: {
    bg: "tw-bg-green-100",
    text: "tw-text-green-800",
    border: "tw-border-green-500",
    dot: "tw-bg-green-500",
  },
  insetup: {
    bg: "tw-bg-yellow-100",
    text: "tw-text-yellow-800",
    border: "tw-border-yellow-500",
    dot: "tw-bg-yellow-500",
  },
  pending: {
    bg: "tw-bg-orange-100",
    text: "tw-text-orange-800",
    border: "tw-border-orange-500",
    dot: "tw-bg-orange-500",
  },
  inreview: {
    bg: "tw-bg-blue-100",
    text: "tw-text-blue-800",
    border: "tw-border-blue-500",
    dot: "tw-bg-blue-500",
  },
  draft: {
    bg: "tw-bg-gray-100",
    text: "tw-text-gray-800",
    border: "tw-border-gray-500",
    dot: "tw-bg-gray-500",
  },
  archived: {
    bg: "tw-bg-red-100",
    text: "tw-text-red-800",
    border: "tw-border-red-500",
    dot: "tw-bg-red-500",
  },
  default: {
    bg: "tw-bg-gray-100",
    text: "tw-text-gray-800",
    border: "tw-border-gray-500",
    dot: "tw-bg-gray-500",
  },
};

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Code",
      accessor: "Code",
      disableSortBy: true,
    },
    {
      Header: "Course",
      accessor: "Course",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "class",
      disableSortBy: true,
    },
    {
      Header: "Subject",
      accessor: "subject",
      disableSortBy: true,
    },
    {
      Header: "Ayacademic year",
      accessor: "ayacademicYear",
      disableSortBy: true,
    },
    {
      Header: "Branch",
      accessor: "branch",
      disableSortBy: true,
    },
    {
      Header: "Sections",
      accessor: "sections",
      disableSortBy: true,
    },
    {
      Header: "Teachers",
      accessor: "teachers",
      disableSortBy: true,
    },
    {
      Header: "Students",
      accessor: "students",
      disableSortBy: true,
    },
    {
      Header: "Updated",
      accessor: "updated",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const style =
          statusStyles[original.status.toLowerCase().split(" ").join("")] ||
          statusStyles.default;
        return (
          <div
            className={`tw-inline-flex tw-items-center tw-gap-1 tw-px-2 tw-py-1 tw-text-[10px] tw-font-medium tw-rounded-full tw-border-[0.6px] ${style.bg} ${style.text} ${style.border}`}
          >
            <span
              className={`tw-w-2 tw-h-2 tw-rounded-full ${style.dot}`}
            ></span>
            {original.status.toUpperCase()}
          </div>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions
            actionOptions={actionsList}
            rowId={original.id}
            isHorizontal={true}
          ></MoreActions>
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: 1,
    Code: "MATH10-2526",
    Course: "CBSE Class 10 – Mathematics",
    class: "10",
    subject: "Mathematics",
    status: "Published",
    ayacademicYear: "2025–26",
    branch: "PMS – Alwal",
    sections: 6,
    teachers: 2,
    students: 320,
    updated: "30 Jul 2025",
  },
  {
    id: 2,
    Code: "MATH10-2526-SEC2",
    Course: "CBSE Class 10 – Mathematics",
    class: "10",
    subject: "Mathematics",
    status: "Pending",
    ayacademicYear: "2025–26",
    branch: "PMS – Alwal",
    sections: 2,
    teachers: 2,
    students: 310,
    updated: "30 Jul 2025",
  },
  {
    id: 3,
    Code: "SCI10-2526",
    Course: "CBSE Class 10 – Science",
    class: "10",
    subject: "Science",
    status: "In Setup",
    ayacademicYear: "2025–26",
    branch: "PMS – AS Rao Nagar",
    sections: 3,
    teachers: 2,
    students: 300,
    updated: "29 Jul 2025",
  },
  {
    id: 4,
    Code: "PHY10-2526",
    Course: "CBSE Class 10 – Physics",
    class: "10",
    subject: "Physics",
    status: "In Review",
    ayacademicYear: "2025–26",
    branch: "DPS – Nacharam",
    sections: 2,
    teachers: 1,
    students: 160,
    updated: "28 Jul 2025",
  },
  {
    id: 5,
    Code: "CHE10-2526",
    Course: "CBSE Class 10 – Chemistry",
    class: "10",
    subject: "Chemistry",
    status: "Draft",
    ayacademicYear: "2025–26",
    branch: "PMS – Alwal",
    sections: 1,
    teachers: 1,
    students: 140,
    updated: "24 Jul 2025",
  },
];
