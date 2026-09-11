import { StatusLabel } from "../../Components/Common";
import {
  MenuOptionHrtl,
  MenuOptionVrtl,
  MoreActions,
} from "../../Components/Common/MenuOptions";
import { getDisplayDateForTableFormat } from "../../utility/dateutility";

export function generateColumns(actionsList: any) {
  return [
    {
      Header: "Time Table Name",
      accessor: "timeTableName",
      disableSortBy: true,
    },
    {
      Header: "Time Table Type",
      accessor: "timeTableType",
      disableSortBy: true,
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
      Header: "Start Date",
      accessor: "startDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
              return getDisplayDateForTableFormat(original?.startDate);
            },
    },
    {
      Header: "End Date",
      accessor: "endDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
              return getDisplayDateForTableFormat(original?.endDate);
            },
    },
    {
      Header: "Actions",
      filterable: false,
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
    timeTableName: "Morning Batch",
    timeTableType: "Regular",
    className: "10th Grade",
    section: "A",
    startDate: "2024-06-10",
    endDate: "2024-12-20",
    status: "Active",
  },
  {
    timeTableName: "Afternoon Batch",
    timeTableType: "Regular",
    className: "10th Grade",
    section: "B",
    startDate: "2024-06-11",
    endDate: "2024-12-21",
    status: "Inactive",
  },
  {
    timeTableName: "Evening Batch",
    timeTableType: "Supplementary",
    className: "9th Grade",
    section: "C",
    startDate: "2024-07-01",
    endDate: "2024-12-15",
    status: "Draft",
  },
  {
    timeTableName: "Weekend Classes",
    timeTableType: "Special",
    className: "8th Grade",
    section: "A",
    startDate: "2024-08-05",
    endDate: "2024-11-30",
    status: "Active",
  },
  {
    timeTableName: "Bridge Course",
    timeTableType: "Bridge",
    className: "7th Grade",
    section: "B",
    startDate: "2024-05-15",
    endDate: "2024-09-30",
    status: "Draft",
  },
  {
    timeTableName: "Exam Preparation",
    timeTableType: "Intensive",
    className: "12th Grade",
    section: "A",
    startDate: "2024-09-01",
    endDate: "2025-02-28",
    status: "Inactive",
  },
];
