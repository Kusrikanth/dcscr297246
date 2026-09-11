import React from "react";
import { Switch, UserDetails } from "../../../../Components/Common";

interface IModuleInfo {
  id: string;
  // eslint-disable-next-line no-restricted-globals
  moduleName: string;
}
export interface IModuleTableData {
  id: number;
  role: string;
  modules: Array<IModuleInfo>;
}

export function generateColumns() {
  return [
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Modules",
      accessor: "modules",
      Cell: ({ value }: any) => {
        return (
          <div className="tw-flex tw-flex-wrap">
            {Array.isArray(value) &&
              value.map((item: IModuleInfo) => (
                <div className="w-20" key={item.id}>
                  <Switch
                    attributeId={item.id}
                    labelName={item.moduleName}
                    className="form-switch-sm form-check-right w-70"
                  />
                </div>
              ))}
          </div>
        );
      },
    },
  ];
}

export const branchData: Array<IModuleTableData> = [
  {
    id: 1,
    role: "Branch Admin",
    modules: [
      { id: "Branch Settings", moduleName: "Branch Settings" },
      { id: "Academics", moduleName: "Academics" },
      { id: "Front Desk", moduleName: "Front Desk" },
      { id: "Directories", moduleName: "Directories" },
      { id: "Examination", moduleName: "Examination" },
      { id: "Fee Managment", moduleName: "Fee Managment" },
    ],
  },
  {
    id: 2,
    role: "Teacher",
    modules: [
      { id: "Branch Settings", moduleName: "Branch Settings" },
      { id: "Academics", moduleName: "Academics" },
      { id: "Front Desk", moduleName: "Front Desk" },
      { id: "Directories", moduleName: "Directories" },
      { id: "Examination", moduleName: "Examination" },
      { id: "Fee Managment", moduleName: "Fee Managment" },
    ],
  },
];
