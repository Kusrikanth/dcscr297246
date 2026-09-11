import { FeeCollectorsTableData } from "./FeeCollectorsType";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { UserDetails } from "../../../Components/Common";
export const selectData4 = [
  {
    boardType: "option1",
  },
  {
    boardType: "option2",
  },
  {
    boardType: "option3",
  },
];
export const selectData1 = [
  {
    branchType: "Department",
  },
  {
    branchType: "option2",
  },
  {
    branchType: "option3",
  },
];
export const selectData2 = [
  {
    experience: "Experince",
  },
  {
    experience: "option2",
  },
  {
    experience: "option3",
  },
];

export const selectData3 = [
  {
    departmentType: "Department",
  },
  {
    departmentType: "2023-24",
  },
  {
    departmentType: "2024-25",
  },
];

export const selectData5 = [
  {
    CurriculumType: "option1",
  },
  {
    CurriculumType: "option2",
  },
  {
    CurriculumType: "option3",
  },
];

export const selectData6 = [
  {
    academicYearType: "option1",
  },
  {
    academicYearType: "option2",
  },
  {
    academicYearType: "option3",
  },
];

export function generateColumns() {
  return [
    {
      Header: "Personal Info",
      accessor: "personalInfo",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="text-info">
              <UserDetails
                imageUrl={original?.personalInfo?.imgUrl}
                displayName={original?.personalInfo?.name}
                displayId={original?.personalInfo?.dep_id}
              />
            </div>
          </>
        );
      },
    },
    {
      Header: "User Type",
      accessor: "userType",
    },
    {
      Header: "Mobile No.",
      accessor: "mobileNo",
    },
  ];
}

export const FeeCollectorsData: Array<FeeCollectorsTableData> = [
  {
    id: 1,
    personalInfo: {
      id: 1,
      name: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    userType: "Sr. Accountant",
    mobileNo: "99909552",
  },
  {
    id: 2,
    personalInfo: {
      id: 1,
      name: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    userType: "Sr. Accountant",
    mobileNo: "99909552",
  },
  {
    id: 3,
    personalInfo: {
      id: 1,
      name: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    userType: "Sr. Accountant",
    mobileNo: "99909552",
  },
  {
    id: 4,
    personalInfo: {
      id: 1,
      name: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    userType: "Sr. Accountant",
    mobileNo: "99909552",
  },
  {
    id: 5,
    personalInfo: {
      id: 1,
      name: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    userType: "Sr. Accountant",
    mobileNo: "99909552",
  },
];
