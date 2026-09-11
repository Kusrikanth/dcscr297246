
import { DateInput, MenuOptionHrtl, TextInputGroup } from "../../../../Components/Common";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../utility/commonutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [

    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Hostel",
      accessor: "hostelName",
      disableSortBy: true,
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
      disableSortBy: true,
    },
    {
      Header: "Fee Type",
      accessor: "feeType",
      disableSortBy: true,
    },
    {
      Header: "Room Type",
      accessor: "roomTypeName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "classes",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { classes } = original || {};
        return (
          (Array.isArray(classes) && classes.length > 0) ? <>
            <div className="" > {classes.join(' , ')} </div>
          </> : "-"
        )
      }
    },
    {
      Header: "Amount",
      accessor: "amount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amount)}</span>
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.feeStructureId} />
        );
      },
    },

  ];
}

const editFromDateTableCell = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  return (
    <DateInput
      name={`[${index}].fromDate`}
      formgroupClassName="tw-mb-0"
      inputClassName="form-control-sm"
      value={original.fromDate}
      onChange={onChangeInputHndlr}
      // onBlur={onBlurInputHndlr}
      // minDate={Current_Date_YYYYMMDD}
      invalid={(original?.touched?.fromDate && original?.errors?.fromDate) ? true : false}
      error={(original?.touched?.fromDate && original?.errors?.fromDate) ? original?.errors?.fromDate : ""}
    />
  )
}

const editToDateTableCell = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  return (
    <DateInput
      name={`[${index}].toDate`}
      formgroupClassName="tw-mb-0"
      inputClassName="form-control-sm"
      value={original.toDate}
      onChange={onChangeInputHndlr}
      // onBlur={onBlurInputHndlr}
      // minDate={Current_Date_YYYYMMDD}
      invalid={(original?.touched?.toDate && original?.errors?.toDate) ? true : false}
      error={(original?.touched?.toDate && original?.errors?.toDate) ? original?.errors?.toDate : ""}
    />
  )
}

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
    // onBlur={onBlurInputHndlr}
    maxLength={10}
    invalid={(original?.touched?.feeAmount && original?.errors?.feeAmount) ? true : false}
    error={(original?.touched?.feeAmount && original?.errors?.feeAmount) ? original?.errors?.feeAmount : ""}
  >
    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
  </TextInputGroup>)
}


export function generateModalColumns(onChangeHndlr: any) {
  return [
    {
      Header: "Terms",
      accessor: "termName",
      Cell: ({ value }: any) => {
        return (
          <span className="tw-text-nowrap">{value}</span>
        )
      }
    },
    {
      Header: "Fee",
      accessor: "feeAmount",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      Cell: editFeeAmountTableCell
    },
    {
      Header: "From Date",
      accessor: "fromDate",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      Cell: editFromDateTableCell
    },
    {
      Header: "To Date",
      accessor: "toDate",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      Cell: editToDateTableCell
    },
  ];
}

