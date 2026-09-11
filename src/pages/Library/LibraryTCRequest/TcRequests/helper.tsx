import {
  MenuOptionHrtl,
  StatusLabel,
  UserDetails,
} from "../../../../Components/Common";
import { tcRequestsTableData } from "./TcRequestsTypes";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";


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

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "student",
      disableSortBy:true,
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
      disableSortBy:true,
    },
    {
      Header: "Class",
      accessor: "class",
      disableSortBy:true,
    },
    {
      Header: "Section",
      accessor: "section",
      disableSortBy:true,
    },
    {
      Header: "TC Request Date",
      accessor: "tcApplicationDate",
      disableSortBy:true,
      
    },
    {
      Header: "Last Attended Date",
      accessor: "lastAttendedDate",
      disableSortBy:true,
      
    },
    {
      Header: "Approve Status",
      accessor: "feePaidStatus",
      filterable: false,
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.feePaidStatus} labelName={original.feePaidStatus} />
        );
      },
    },
    {
      Header: "Tc Status",
      accessor: "status",
      disableSortBy:true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.status} labelName={original.status} />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.tcRequestId} />
        );
      },
    },
  ];
}

export const PaymentReceivedData: Array<tcRequestsTableData> = [
  {
    id: 1,
    studentName: "Lingam Prkruth",
      studentCode: "124000012",
    curriculumName: "CBSE",
    class: "I",
    section: "I-D",
    tcApplicationDate: "June 17,2022",
    lastAttendedDate: "June 17,2022",
    feePaidStatus: "Issued",
    status: "Issued",
  },
  {
    id: 2,
    studentName: "Lingam Prkruth",
      studentCode: "124000012",
    curriculumName: "CBSE",
    class: "I",
    section: "I-D",
    tcApplicationDate: "June 17,2022",
    lastAttendedDate: "June 17,2022",
    feePaidStatus: "Not Issued",
    status: "Not Issued",
  },
  {
    id: 3,
    studentName: "Lingam Prkruth",
      studentCode: "124000012",
    curriculumName: "CBSE",
    class: "I",
    section: "I-D",
    tcApplicationDate: "June 17,2022",
    lastAttendedDate: "June 17,2022",
    feePaidStatus: "Not Issued",
    status: "Not Issued",
  },
  {
    id: 4,
    studentName: "Lingam Prkruth",
    studentCode: "124000012",
    curriculumName: "CBSE",
    class: "I",
    section: "I-D",
    tcApplicationDate: "June 17,2022",
    lastAttendedDate: "June 17,2022",
    feePaidStatus: "Not Issued",
    status: "Not Issued",
  },
];
