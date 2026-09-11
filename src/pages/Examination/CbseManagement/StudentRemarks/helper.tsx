import React, { useState } from "react";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { SelectInput, UserDetails, MenuOptionHrtl, TextInput, InputCheckbox, TimeInput, DateInput, TextArea } from "../../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

const RemarksDropdown = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurTableHndlr,
  rowDataInfo
}: any) => {
  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].remarkContextId`}
        inputClassName=""
        value={original?.remarkContextId}
        onChange={onChangeInputHndlr}
        menuItems={rowDataInfo}
        valueKey="remarkContextId"
        textKey="content"
        isDisabled={!original.isSelected}
      />
    </div>
  )
}

const RemarksTextField = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  const [isEditable, setIsEditable] = useState(false);

  const editRemarksText = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsEditable(!isEditable);
  };

  return (
    <div style={{ minWidth: "20rem", display: "flex", alignItems: "center" }}>
      <TextArea
        name={`[${index}].remarks`}
        inputClassName="h-100 w-100"
        formgroupClassName="w-75"
        maxLength={500}
        value={original?.remarks}
        onChange={onChangeInputHndlr}
        onBlur={onBlurInputHndlr}
        isDisabled={!original.isSelected || !isEditable}
        invalid={(original?.touched?.remarks && original?.errors?.remarks) ? true : false}
        error={(original?.touched?.remarks && original?.errors?.remarks) ? original?.errors?.remarks : ""}
      />
      <button
        onClick={editRemarksText}
        className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white ms-3 ps-1"
      >
        <i className="text-primary ri-pencil-fill fs-16"></i>
      </button>
    </div>
  );
};

export function generateColumnsModel(allStockCheckHndlr: any, singleStockCheckHndlr: any, allStockSelectedState: any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name="all-students"
            value={allStockSelectedState}
            onChange={allStockCheckHndlr}
            formgroupClassName="mb-0"
          />
        );
      },
      accessor: "id",
      disableSortBy: true,
      columnClassName: "w-5 sticky-left z-index-1",
      Cell: ({ row: { original, index } }: any) => {
        return (
          <InputCheckbox
            name={`student-${index}`}
            value={original.isSelected ?? false}
            onChange={() => {
              singleStockCheckHndlr(original.studentId);
            }}
            dataId={original.studentId}
            formgroupClassName="mb-0"
            isDisabled={false}
          />
        );
      }
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "sticky-left-checkbox  min-w-250px w-250px max-w-250px z-index-1",
       Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName || "-"}
              displayId={original?.studentCode || "-"}
              imageUrl={original?.studentImageBase64}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Roll No.",
      accessor: "rollNo",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "shortName",
      disableSortBy: true,
      columnClassName: "w-100px min-w-100px max-w-100px text-truncate",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.classShortName || "-"}
              displayId={original?.branchCurriculumName || "-"}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      columnClassName: "w-50px min-w-50px max-w-50px text-truncate",
    },
    {
      Header: "Modified By",
      accessor: "userTypeName",
      disableSortBy: true,
      Cell: ({ row: { original } }) => original.userTypeName || "-",
    },
    {
      Header: "Modified Date",
      accessor: "modifiedDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.modifiedDate || "-")}</span>)
      },
    },
    {
      Header: "Select Remarks",
      accessor: "remarks",
      disableSortBy: true,
      Cell: RemarksDropdown
    },
    {
      Header: "	Remarks",
      accessor: "remarkContextId",
      disableSortBy: true,
      Cell: RemarksTextField
    },
  ];
}

export const ignoredKeys = ["searchString", "academicYearId"];