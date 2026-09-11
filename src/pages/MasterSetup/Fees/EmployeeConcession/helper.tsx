import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import {
  checkBoxOptionTypes,
} from "./EmployeeConcessionTypes";


export const selectData2 = [
  {
    experience: "1",
  },
  {
    experience: "2",
  },
  {
    experience: "3",
  },
  {
    experience: "4",
  },
  {
    experience: "5",
  },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Department",
      accessor: "instituteDepartmentName",
    },
    {
      Header: "Experience",
      accessor: "experience",
      disableSortBy: true,
    },
    {
      Header: "Fee Name",
      accessor: "instituteFeeName",
      disableSortBy: true,
    },
    {
      Header: "Concession %",
      accessor: "concession",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.feeEmployeeConcessionId}
          // isHorizontal={true}
          />
        );
      },
    },
  ];
}


export function generateModalColumns(inputChangeHandler: (event: any) => void) {
  return [
    {
      Header: "Department",
      accessor: "instituteDepartmentName",
      // disableSortBy: true,
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
      disableSortBy: true,
    },
    {
      Header: "Percentage",
      accessor: "percentage",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center">
            <input
              type="text"
              className="tw-block tw-w-full tw-text-sm tw-border-0 tw-border-b tw-border-gray-300 tw-px-0 tw-bg-transparent focus:tw-outline-none focus:tw-ring-0 focus:tw-border-[#1bb3a6]"
              name={`${original.instituteFeeNameId}`}
              onChange={inputChangeHandler}
              defaultValue={original.percentage}
            />
            <span className="tw-ml-1 tw-text-sm tw-text-gray-500">
              %
            </span>
          </div>
        );
      },
    },
  ];
}


export const InputCheckBoxes: Array<checkBoxOptionTypes> = [
  {
    name: "accounts",
    label: "Accounts",
  },
  {
    name: "academics",
    label: "Academics",
  },
  {
    name: "administration",
    label: "Administration",
  },
  {
    name: "admission",
    label: "Admission",
  },
  {
    name: "ayah",
    label: "Ayah",
  },
  {
    name: "economics",
    label: "Economics",
  },
  {
    name: "hostel",
    label: "Hostel",
  },
  {
    name: "transportation",
    label: "Transportation",
  },
  {
    name: "hR",
    label: "HR",
  },
  {
    name: "maintenance",
    label: "Maintenance",
  },
  {
    name: "security",
    label: "Security",
  },
  {
    name: "library",
    label: "Library",
  },
  {
    name: "houseKeeping",
    label: "House Keeping",
  },
  {
    name: "computers",
    label: "Computers",
  },
];
