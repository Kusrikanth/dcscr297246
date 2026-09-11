import { Switch } from "../../../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Setting Type",
      accessor: "settingType",
      disableSortBy: true,
    },
    {
      Header: "Action",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <Switch
            attributeId={`action-${original.id}`}
            checked={original.enabled}
            onChangeHndlr={(event: any) => {}}
            className="form-switch-sm form-check-left w-70"
          />
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: 1,
    settingType: "Grace Period for Late Submissions (days)",
    enabled: true,
  },
  {
    id: 2,
    settingType: "Allow Re-Submissions",
    enabled: false,
  },
  {
    id: 3,
    settingType: "Lock After Grading",
    enabled: false,
  },
];
