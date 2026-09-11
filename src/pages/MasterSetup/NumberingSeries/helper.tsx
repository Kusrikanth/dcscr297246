import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

interface IBranches {
  id: string;
  branchName: string;
}
export interface VehicalsTypesFormProps {
  search: string;
  branchType: string;
}

interface ICurriculumTableData {
  id: number;
  formName: string;
  branches: Array<IBranches>;
}

function getBranchesLabel(options: Array<IBranches> | null) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="d-flex flex-wrap gap-1">
        {options.map((item, index) => {
          return (
            <span key={item.id} className="badge badge-soft-secondary">
              {item.branchName}
            </span>
          );
        })}
      </div>
    );
  } else {
    return <span className="text-info text">Add Branch</span>;
  }
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Form Name",
      accessor: "formName",
    },
    {
      Header: "Branches",
      filter: false,
      Cell: ({ row: { original } }: any) => {
        return getBranchesLabel(original.branches);
      },
    },
    {
      Header: "Url",
      accessor: "url",
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}

export const curriculumData: Array<ICurriculumTableData> = [
  {
    id: 1,
    formName: "Enquiry Form",
    branches: [
      {
        id: "Nacharam",
        branchName: "Nacharam",
      },
    ],
  },
  {
    id: 2,
    formName: "Application Form",
    branches: [
      {
        id: "Nacharam",
        branchName: "Nacharam",
      },
      {
        id: "Nadergul",
        branchName: "Nadergul",
      },
      {
        id: "Mahendra Hills",
        branchName: "Mahendra Hills",
      },
    ],
  },
  {
    id: 3,
    formName: "Registration Form",
    branches: [
      {
        id: "Nadergul",
        branchName: "Nadergul",
      },
      {
        id: "Mahendra Hills",
        branchName: "Mahendra Hills",
      },
    ],
  },
];
