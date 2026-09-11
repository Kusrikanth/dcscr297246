import React from "react";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { MoreActions, TextInputGroup, DateInput, SelectInput, InputCheckbox } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../utility/commonutility";

const editFeeAmountTableCell = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  return (<TextInputGroup
    name={`[${index}].feeAmount`}
    formgroupClassName="mb-0"
    inputgroupClassName="input-group-sm"
    inputClassName="form-control-sm"
    allowedInputRegex="^[0-9]+\.?[0-9]*$"
    inputGroupStart={true}
    value={original.feeAmount}
    onChange={onChangeInputHndlr}
    onBlur={onBlurInputHndlr}
    maxLength={10}
    invalid={(original?.touched?.feeAmount && original?.errors?.feeAmount) ? true : false}
    error={(original?.touched?.feeAmount && original?.errors?.feeAmount) ? original?.errors?.feeAmount : ""}
  >
    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
  </TextInputGroup>)
}

const editLastDateTableCell = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  return (
    <DateInput
      name={`[${index}].dueDate`}
      formgroupClassName="mb-0"
      inputClassName="form-control-sm"
      value={original.dueDate}
      onChange={onChangeInputHndlr}
      onBlur={onBlurInputHndlr}
      // minDate={Current_Date_YYYYMMDD}
      invalid={(original?.touched?.dueDate && original?.errors?.dueDate) ? true : false}
      error={(original?.touched?.dueDate && original?.errors?.dueDate) ? original?.errors?.dueDate : ""}
    />
  )
}

const editAdmissionFeeAmountTableCell = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  return (<TextInputGroup
    name={`[${index}].admissionFeeAmount`}
    formgroupClassName="mb-0"
    inputgroupClassName="input-group-sm"
    inputClassName="form-control-sm"
    allowedInputRegex="^[0-9]+\.?[0-9]*$"
    inputGroupStart={true}
    value={original.admissionFeeAmount}
    onChange={onChangeInputHndlr}
    onBlur={onBlurInputHndlr}
    maxLength={10}
    invalid={(original?.touched?.admissionFeeAmount && original?.errors?.admissionFeeAmount) ? true : false}
    error={(original?.touched?.admissionFeeAmount && original?.errors?.admissionFeeAmount) ? original?.errors?.admissionFeeAmount : ""}
  >
    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
  </TextInputGroup>)
}

const newStudentJodoCode = ({
  row: { index, original },
  onChangeInputHndlr,
  rowDataInfo,
  onBlurInputHndlr
}: any) => {
  const menuItems = rowDataInfo?.jodoOptions?.newStudentJodoCodes?.map((code: string) => ({
    key: code,
    name: code
  })) || [];

  return (
    <SelectInput
      name={`[${index}].newStudentJodoCode`}
      menuItems={menuItems}
      valueKey="key"
      textKey="name"
      formgroupClassName="mb-0 input-group-sm"
      inputClassName="form-control-sm"
      value={original.newStudentJodoCode}
      onChange={onChangeInputHndlr}
      invalid={(original?.touched?.newStudentJodoCode && original?.errors?.newStudentJodoCode) ? true : false}
      error={(original?.touched?.newStudentJodoCode && original?.errors?.newStudentJodoCode) ? original?.errors?.newStudentJodoCode : ""}
    />
  )
}

const newStudentDisplay = ({
  row: { index, original },
  onChangeInputHndlr,
  rowDataInfo,
  onBlurInputHndlr
}: any) => {
  const menuItems = rowDataInfo?.jodoOptions?.newStudentDisplays?.map((display: string) => ({
    key: display,
    name: display
  })) || [];

  return (
    <SelectInput
      name={`[${index}].newStudentDisplay`}
      menuItems={menuItems}
      valueKey="key"
      textKey="name"
      formgroupClassName="mb-0 input-group-sm"
      inputClassName="form-control-sm"
      value={original.newStudentDisplay}
      onChange={onChangeInputHndlr}
      invalid={(original?.touched?.newStudentDisplay && original?.errors?.newStudentDisplay) ? true : false}
      error={(original?.touched?.newStudentDisplay && original?.errors?.newStudentDisplay) ? original?.errors?.newStudentDisplay : ""}
    />
  )
}

const oldStudentJodoCode = ({
  row: { index, original },
  onChangeInputHndlr,
  rowDataInfo,
  onBlurInputHndlr
}: any) => {
  const menuItems = rowDataInfo?.jodoOptions?.oldStudentJodoCodes
    ?.filter((code: string) => code !== null)
    ?.map((code: string) => ({
      key: code,
      name: code
    })) || [];

  return (
    <SelectInput
      name={`[${index}].oldStudentJodoCode`}
      menuItems={menuItems}
      valueKey="key"
      textKey="name"
      formgroupClassName="mb-0 input-group-sm"
      inputClassName="form-control-sm"
      value={original.oldStudentJodoCode}
      onChange={onChangeInputHndlr}
      invalid={(original?.touched?.oldStudentJodoCode && original?.errors?.oldStudentJodoCode) ? true : false}
      error={(original?.touched?.oldStudentJodoCode && original?.errors?.oldStudentJodoCode) ? original?.errors?.oldStudentJodoCode : ""}
    />
  )
}

const oldStudentDisplay = ({
  row: { index, original },
  onChangeInputHndlr,
  rowDataInfo,
  onBlurInputHndlr
}: any) => {
  const menuItems = rowDataInfo?.jodoOptions?.oldStudentDisplays
    ?.filter((display: string) => display !== null)
    ?.map((display: string) => ({
      key: display,
      name: display
    })) || [];

  return (
    <SelectInput
      name={`[${index}].oldStudentDisplay`}
      menuItems={menuItems}
      valueKey="key"
      textKey="name"
      formgroupClassName="mb-0 input-group-sm"
      inputClassName="form-control-sm"
      value={original.oldStudentDisplay}
      onChange={onChangeInputHndlr}
      invalid={(original?.touched?.oldStudentDisplay && original?.errors?.oldStudentDisplay) ? true : false}
      error={(original?.touched?.oldStudentDisplay && original?.errors?.oldStudentDisplay) ? original?.errors?.oldStudentDisplay : ""}
    />
  )
}

const existingStudentCell = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <InputCheckbox
      name={`[${index}].existingStudent`}
      value={original.existingStudent}
      onChange={onChangeInputHndlr}
    />
  );
};

const newStudentCell = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <InputCheckbox
      name={`[${index}].newStudent`}
      value={original.newStudent}
      onChange={onChangeInputHndlr}
    />
  );
};

export function generateModalColumns(onChangeHndlr: any) {
  return [
    {
      Header: "Terms",
      accessor: "termName",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <span className="text-nowrap">{value}</span>
        )
      }
    },
    {
      Header: "Last Date to Pay",
      accessor: "dueDate",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px",
      Cell: editLastDateTableCell
    },
    {
      Header: "Fee",
      accessor: "feeAmount",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px",
      Cell: editFeeAmountTableCell
    },
    {
      Header: "New Admission Fee",
      accessor: "admissionFeeAmount",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px",
      Cell: editAdmissionFeeAmountTableCell
    },
    {
      Header: "New Student JODO Code",
      accessor: "newStudentJodoCodeForOneTime",
      disableSortBy: true,
      columnClassName: "min-w-200px",
      Cell: newStudentJodoCode
    },
    {
      Header: "New Student Display",
      accessor: "newStudentDisplayForOneTime",
      disableSortBy: true,
      columnClassName: "min-w-200px",
      Cell: newStudentDisplay
    },
    {
      Header: "Old Student Jodo Code",
      accessor: "oldStudentJodoCodeForTerms",
      disableSortBy: true,
      columnClassName: "min-w-200px",
      Cell: oldStudentJodoCode
    },
    {
      Header: "Old Student Display",
      accessor: "oldStudentDisplayForTerms",
      disableSortBy: true,
      columnClassName: "min-w-200px",
      Cell: oldStudentDisplay
    },
    {
      Header: "Existing Student",
      accessor: "existingStudent",
      disableSortBy: true,
      columnClassName: "min-w-200px",
      Cell: existingStudentCell,
    },
    {
      Header: "New Student",
      accessor: "newStudent",
      disableSortBy: true,
      columnClassName: "min-w-200px",
      Cell: newStudentCell,
    },
  ];
}

function getClassList(options: (Array<any> | null)) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="d-flex flex-wrap gap-1">
        {options.map((item, index) => {
          return (
            <span key={`class-${index}-${item.id}`}>{item.shortCode}{((index !== (options.length - 1))) ? "," : ""}</span>
          )
        })}
      </div>
    )
  } else {
    return (<span className="text-info text">N/A</span>)
  }
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
    },
    {
      Header: "Fee Name",
      accessor: "feeParticularName",
      Cell: ({ value }: any) => {
        return (
          <span className="text-nowrap">{value}</span>
        )
      }
    },
    {
      Header: "Fee Type",
      accessor: "feeType",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "classes",
      disableSortBy: true,
      columnClassName: "w-400px min-w-400px",
      Cell: ({ value }: any) => {
        return (
          getClassList(value)
        );
      },
    },
    {
      Header: "Amount (₹)",
      accessor: "feeAmount",
      disableSortBy: true,
      // columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.feeAmount)}</span>
        );
      },
    },
    {
      Header: "New Admission Amount (₹)",
      accessor: "newAdmissionAmount",
      disableSortBy: true,
      // columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.newAdmissionAmount)}</span>
        );
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions
            actionOptions={actionsList}
            rowId={original.feeStructureId}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}