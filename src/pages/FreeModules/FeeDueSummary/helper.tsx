import { UserDetails } from "../../../Components/Common";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import avatar1 from "../../../assets/images/users//avatar-1.jpg";
import { TotalFeedueOfClassTableData } from "./feeDueSummaryTypes";

export const selectData1 = [
  {
    academicYearType: "All",
  },
  {
    academicYearType: "option2",
  },
  {
    academicYearType: "option3",
  },
];

export const selectData2 = [
  {
    curriculumType: "CBSE",
  },
  {
    curriculumType: "option2",
  },
  {
    curriculumType: "option3",
  },
];

export const selectData3 = [
  {
    feeNameType: "All",
  },
  {
    feeNameType: "option2",
  },
  {
    feeNameType: "option3",
  },
];

export const selectData4 = [
  {
    classType: "VII",
  },
  {
    classType: "option2",
  },
  {
    classType: "option3",
  },
];

export const selectData5 = [
  {
    sectionType: "VII A",
  },
  {
    sectionType: "option2",
  },
  {
    sectionType: "option3",
  },
];

export function generateColumns() {
  return [
    {
      Header: "Student Details",
      accessor: "studentDetails",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original?.studentDetails?.imgUrl}
              displayName={original?.studentDetails?.StudName}
              displayId={original?.studentDetails?.dep_id}
            />
          </>
        );
      },
    },
    {
      Header: "Total Due Amount",
      accessor: "totalDueAmount",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-baseline">
            <RupeeSvg width="11px" height="11px" fill="#495057" />
            <span>{original?.totalDueAmount}</span>
          </div>
        );
      },
    },
  ];
}

export const TotalFeedueOfClassData: Array<TotalFeedueOfClassTableData> = [
  {
    id: 1,
    studentDetails: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    totalDueAmount: 121540,
  },
  {
    id: 2,
    studentDetails: {
      StudName: "User2",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    totalDueAmount: 121540,
  },
];
