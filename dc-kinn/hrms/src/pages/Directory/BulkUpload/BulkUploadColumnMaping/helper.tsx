import { SelectInput } from "../../../../Components/Common";

const AttributeSelectInput = () => {
  return (
    <SelectInput
      name="selectInput"
      menuItems={[]}
      value={""}
      onChange={() => {}}
      valueKey=""
      textKey=""
      formgroupClassName="tw-mb-0"
    ></SelectInput>
  );
};

export function generateColums() {
  return [
    {
      Header: "File Header",
      accessor: "fileHeader",
      disableSortBy: true,
    },
    {
      Header: "Attributes",
      accessor: "attributes",
      disableSortBy: true,
      Cell: AttributeSelectInput,
    },
    {
      Header: "",
      accessor: "attributesValues",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        console.log(original);
        return (
          <span className="text-muted fs-14">{original.attributesValues}</span>
        );
      },
    },
  ];
}
