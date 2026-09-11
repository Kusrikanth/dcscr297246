import { DateInput, InputCheckbox, TextInputGroup } from "../../../../Components/Common";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

const editFeeAmountTableCell = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  return (<TextInputGroup
    name={`[${index}].feeAmount`}
    formgroupClassName="tw-mb-0"
    inputgroupClassName="input-group-sm"
    inputClassName="form-control-sm"
    allowedInputRegex="^[0-9]+\.?[0-9]*$"
    inputGroupStart={true}
    value={original.feeAmount}
    onChange={onChangeInputHndlr}
    onBlur={onBlurInputHndlr}
    maxLength={10}
    isDisabled={!original?.isSelected || !original?.isEditable}
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
      formgroupClassName="tw-mb-0"
      inputClassName="form-control-sm"
      value={original.dueDate}
      onChange={onChangeInputHndlr}
      onBlur={onBlurInputHndlr}
      isDisabled={!original?.isSelected}
      // minDate={Current_Date_YYYYMMDD}
      invalid={(original?.touched?.dueDate && original?.errors?.dueDate) ? true : false}
      error={(original?.touched?.dueDate && original?.errors?.dueDate) ? original?.errors?.dueDate : ""}
    />
  )
}

export function generateModalColumns(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any) {
    return [
      {
        Header: () => {
          return (
            <InputCheckbox
              name={"all-student"}
              // labelName={shortName}
              value={allStudentSelectedState}
              onChange={allStudentCheckHndlr}
              formgroupClassName="tw-mb-0"
            />
          )
        },
        accessor: "isStudentChecked",
        columnClassName: "w-5",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          const { termId, isSelected } = original;
          return (
            <>
              <InputCheckbox
                name={`student-${termId}`}
                // labelName={shortName}
                value={isSelected}
                onChange={singleStudentCheckHndlr}
                dataId={termId}
                isDisabled={!original?.isEditable}
                formgroupClassName="tw-mb-0"
              />
            </>
          )
        }
      },
      {
        Header: "Terms",
        accessor: "termName",
        columnClassName: "w-200px min-w-200px",
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
    ];
  }