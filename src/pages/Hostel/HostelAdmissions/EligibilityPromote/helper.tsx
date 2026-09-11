import { useState } from "react";
import { InputCheckbox, MenuOptionHrtl, StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { EligibilityPromoteDataTypes, ExaminationMarksModelDataTypes, } from "./EligibilityPromoteTypes";


export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.studentName}
            displayId={original?.studentCode}
            showAvatar={false}
          />
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
      accessor: "shortName",
      disableSortBy: true,
      columnClassName: "tw-text-nowrap"
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Roll Number",
      accessor: "rollNo",
      disableSortBy: true,
      Cell: ({ value }: any) => <>{value || '-'}</>
    },
    {
      Header: "Phone No.",
      accessor: "contactNo",
      disableSortBy: true,
      Cell: ({ value }: any) => <>{value || '-'}</>
    },
    {
      Header: "Email Id",
      accessor: "emailId",
      disableSortBy: true,
      Cell: ({ value }: any) => <>{value || '-'}</>
    },
    {
      Header: "Promotion Status",
      accessor: "promotionStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.promotionStatus} labelName={original.promotionStatus} />
        );
      },
    },
    {
      Header: "Action",
      thClass: "tw-w-[5%]",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let updatedActionList: any = [];
        if (original?.promotionStatus?.toLowerCase() === "promoted") {
          updatedActionList = actionList.filter(item => item.id === "remove-promotion");
        } else if (original?.promotionStatus?.toLowerCase() === "not_promoted") {
          updatedActionList = actionList.filter(item => item.id === "revert");
        }
        return (
          <MenuOptionHrtl actionOptions={updatedActionList} rowId={original.id} />
        );
      },
    },
  ];
}

function Eligible() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the value of isChecked
  };
  return (
    <div className="tw-flex tw-items-center">
      <InputCheckbox
        name={"all-student"}
        value={isChecked}
        onChange={handleCheckboxChange}
        formgroupClassName="tw-mb-0"
      />
      <div className="tw-grid">
        <label className="tw-ms-2 tw-m-0 tw-font-bold">
          Eligible To
        </label>
        <label className="tw-ms-2 tw-font-bold">
          Promote All
        </label>
      </div>
    </div>
  );
}

function Checkbox() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the value of isChecked
  };

  return (
    <div className="tw-flex tw-justify-center">
      <InputCheckbox
        name={"all-student"}
        value={isChecked}
        onChange={handleCheckboxChange}
        formgroupClassName="tw-mb-0"
      />
    </div>
  );
}
export function generateColumnsModel() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.studentName}
            displayId={original?.studentCode}
            showAvatar={false}
          />
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
      columnClassName: "tw-text-nowrap"
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Roll Number",
      accessor: "rollNo",
      disableSortBy: true,
      Cell: ({ value }: any) => <>{value || '-'}</>
    },
    {
      Header: "Phone No.",
      accessor: "phoneNo",
      disableSortBy: true,
      Cell: ({ value }: any) => <>{value || '-'}</>
    },
    {
      Header: "Email Id",
      accessor: "email",
      disableSortBy: true,
      Cell: ({ value }: any) => <>{value || '-'}</>
    },
  ];
}

export function checkFitlersApplied(applieFilters: any) {
  return Object.keys(applieFilters).some(item => {
    if (item === "academicYearId" || item === "branchId" || item === "pageNo" || item === "pageSize") {
      return false;
    }
    return !!applieFilters[item];
  });
}

export const promotionStatusList = [
  {
    id: "PROMOTED", name: "Promoted",
  },
  {
    id: "NOT_PROMOTED", name: "Not Promoted",
  },
  {
    id: "NOT_MARKED_ELIGIBLE", name: "Non Marked Eligible",
  }
]

