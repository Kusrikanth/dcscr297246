import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Manufacture",
      accessor: "manufacturerName",
      disableSortBy: true,
    },
    {
      Header: "Model",
      accessor: "modelName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const modelNames = original.models.map((models: { modelName: string }) => models.modelName);
        return modelNames.join(", ");
      },
    },
    {
      Header: "Vehicle Type",
      accessor: "vehicleType",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const vehicleTypes = original.models.map((models: { vehicleType: string }) => models.vehicleType);
        return vehicleTypes.join(", ");
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}