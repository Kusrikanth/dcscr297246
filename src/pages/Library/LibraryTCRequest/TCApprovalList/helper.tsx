import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { tcApprovalListTableData } from "./TCApprovalListTypes";
import { getDisplayDateForTableFormat } from "../../../../utility/dateutility";

export const selectData4 = [
  {
    curriculumType: "Curriculum",
  },
  {
    curriculumType: "option2",
  },
  {
    curriculumType: "option3",
  },
];

export const selectData1 = [
  {
    yearType: "2022-23",
  },
  {
    yearType: "option2",
  },
  {
    yearType: "option3",
  },
];

export const selectData2 = [
  {
    classType: "Class",
  },
  {
    classType: "option2",
  },
  {
    classType: "option3",
  },
];

export function generateColumns() {
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
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculum",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "class",
      disableSortBy: true,
    },
    {
      Header: "Section",
      accessor: "section",
      disableSortBy: true,
    },
    {
      Header: "Approval Date",
      accessor: "approvalDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original.approvalDate)
      }
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
    },
    {
      Header: "Tc Status",
      accessor: "status",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.status} labelName={original.status} />
        );
      },
    },
  ];
}

export const DefaultersStudentsData: Array<tcApprovalListTableData> = [
  {
    id: 1,
    approvalDate: "June 17,2022",
    studentName: "Lingam Prkruth",
    studentCode: "124000012",
    curriculum: "CBSE",
    class: "I",
    section: "I-D",
    remarks: "",
    status: "Approved",
  },
  {
    id: 2,
    approvalDate: "June 17,2022",
    studentName: "Lingam Prkruth",
    studentCode: "124000012",
    curriculum: "CBSE",
    class: "I",
    section: "I-D",
    remarks: "",
    status: "Rejected",
  },
  {
    id: 3,
    approvalDate: "June 17,2022",
    studentName: "Lingam Prkruth",
    studentCode: "124000012",
    curriculum: "CBSE",
    class: "I",
    section: "I-D",
    remarks: "",
    status: "Approved",
  },
  {
    id: 4,
    approvalDate: "June 17,2022",
    studentName: "Lingam Prkruth",
    studentCode: "124000012",
    curriculum: "CBSE",
    class: "I",
    section: "I-D",
    remarks: "",
    status: "Rejected",
  },
];
