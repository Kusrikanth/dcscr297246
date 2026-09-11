import { SelectInput } from "../../../../../../../Components/Common";
import React, { useContext } from "react";
import { BulkUploadStepperContext } from "../index";

const AttributeSelectInput = ({ row, fileHeaders, onChangeInputHndlr }: any) => {
  const currentFieldName = row.original.fieldName;
  const selectedValue = row.original.attributes || "";

  const dropdownOptions = fileHeaders.map((header: string) => ({
    value: header,
    label: header,
  }));

  const handleChange = (event: any) => {
    const value = event.target.value;
    onChangeInputHndlr(currentFieldName, value);
  };

  return (
    <SelectInput
      name={`attributeSelect_${currentFieldName}`}
      menuItems={dropdownOptions}
      value={selectedValue}
      onChange={handleChange}
      valueKey="value"
      textKey="label"
    />
  );
};

export const generateColumnsModalColumns = (onChangeInputHndlr?: any, fileHeaders?: string[]) => [
  {
    Header: "Unit Code",
    accessor: "unitCode",
    disableSortBy: true,
  },
  {
    Header: "Unit Name",
    accessor: "unitName",
    disableSortBy: true,
    columnClassName: "w-300px min-w-300px max-w-300px",
  },
  {
    Header: "Chapter Code",
    accessor: "chapterCode",
    disableSortBy: true,
  },
  {
    Header: "Chapter Name",
    accessor: "chapterName",
    disableSortBy: true,
    columnClassName: "w-300px min-w-300px max-w-300px",
  },
  {
    Header: "Topic Code",
    accessor: "topicCode",
    disableSortBy: true,
  },
  {
    Header: "Topic Name",
    accessor: "topicName",
    disableSortBy: true,
    columnClassName: "w-300px min-w-300px max-w-300px",
  },
];
