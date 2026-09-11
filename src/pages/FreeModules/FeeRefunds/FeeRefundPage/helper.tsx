import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { StatusLabel, TextInput, InputCheckbox } from "../../../../Components/Common";

import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { FeeDetailsTableData, NewRefundTableData } from "./feeRefundPageTypes";
import { TextInputGroup } from "../../../../Components/Common";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";

export const receiptForOptions = [
  {
    id: "EXCESS_AMOUNT",
    name: "Excess Amount"
  },
  {
    id: "AMOUNT_PAID",
    name: "Amount Paid"
  },
  {
    id: "ADMISSION_WITH_DRAWL",
    name: "Admission Withdrawal"
  }
]


export const paymentOptions = [
  {
    id: "ONLINE",
    name: "ONLINE"
  },
  {
    id: "CASH",
    name: "CASH"
  },
  {
    id: "CHEQUE",
    name: "CHEQUE"
  },
  {
    id: "ADJUSTMENT",
    name: "ADJUSTMENT"
  },
  {
    id: "CT_ADJUSTMENT",
    name: "Campus Transfer"
  }
]

export function generateColumns() {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYear",
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Payable Amount",
      accessor: "payableAmount",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center">
            <RupeeSvg width="11px" height="11px" fill="#0ab39c" />
            <span>{original?.payableAmount}</span>
          </div>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.status} labelName={original.status} />
        );
      },
    },
    {
      Header: "Amount Due",
      accessor: "amountDue",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center">
            <RupeeSvg width="11px" height="11px" fill="#0ab39c" />
            <span>{original?.amountDue}</span>
          </div>
        );
      },
    },
  ];
}

const EditConcessionAmount = ({ row: { original, index },
  onChangeInputHndlr,
  rowDataInfo
}: any) => {

  function onChange(event: any) {
    if (event.target.value <= original?.refundedAmount) {
      onChangeInputHndlr(event, original.id)
    }

  }

  return (
    <>
      <div className="input-group input-group-sm tw-w-[120px]">
        <span className="input-group-text">
          <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
        </span>
        <input name={`refundAmount`} type="text" className="form-control" value={+original?.refundAmount || "0"}
          // onBlur={onBlur}
          onChange={onChange}
          disabled={original.isSelected ? false : true}
        />
      </div>
    </>
  );
};


export function feeRefundColumns(isAllSelected: any, studentCheckHndlr: any, selectAllFeeHndlr: any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
            value={isAllSelected}
            onChange={selectAllFeeHndlr}
            formgroupClassName="tw-mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${id}`}
              // labelName={shortName}
              value={isSelected}
              onChange={studentCheckHndlr}
              dataId={id}
              formgroupClassName="tw-mb-0"
            // isDisabled={+original.amountToPay<+value||(Mode==="PERCENTAGE"&&value>100)}
            />
          </>
        )
      }
    },
    {
      Header: "Fee Names",
      accessor: "feeName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <TextInput
              name={`feeName-${original.id}`}
              value={original?.feeName}
              formgroupClassName="tw-mb-0 form-control-sm p-0"
              inputClassName="w-200px"
              onChange={undefined}
              isDisabled={true}
            />
          </>
        );
      },
    },
    {
      Header: "Amount to Pay",
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm tw-w-[120px]">
              <span className="input-group-text">
                <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
              </span>
              <input type="text" className="form-control" value={original.amountToPay || 0}
                disabled={true}
              />
            </div>
          </>
        );
      },
    },
    {
      Header: "Net Amount",
      accessor: "netAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm tw-w-[120px]">
              <span className="input-group-text">
                <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
              </span>
              <input type="text" className="form-control" value={original.netAmount || 0}
                disabled={true}
              />
            </div>
          </>
        );
      },

    },
    {
      Header: "Amount Paid",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm tw-w-[120px]">
              <span className="input-group-text">
                <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
              </span>
              <input type="text" className="form-control" value={original.amountPaid || 0}
                disabled={true}
              />
            </div>
          </>
        );
      },
    },
    {
      Header: "Refundable Amount",
      accessor: "refundedAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm tw-w-[120px]">
              <span className="input-group-text">
                <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
              </span>
              <input type="text" className="form-control" value={original.refundedAmount || 0}
                disabled={true}
              />
            </div>
          </>
        );
      },
    },
    {
      Header: "Refund Amount",
      accessor: "refundAmount",
      disableSortBy: true,
      Cell: EditConcessionAmount,
    }

  ];
}


const editFeeRefundTableCell = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr
}: any) => {
  return (<TextInputGroup
    name={`[${index}].adjustAmount`}
    formgroupClassName="tw-mb-0"
    inputgroupClassName="input-group-sm tw-w-[120px]"
    inputClassName="form-control-sm"
    allowedInputRegex="^[0-9]+\.?[0-9]*$"
    inputGroupStart={true}
    value={original.adjustAmount}
    onChange={onChangeInputHndlr}
    onBlur={onBlurInputHndlr}
    maxLength={10}
    isDisabled={!original?.isSelected}
    invalid={(original?.touched?.adjustAmount && original?.errors?.adjustAmount) ? true : false}
    error={(original?.touched?.adjustAmount && original?.errors?.adjustAmount) ? original?.errors?.adjustAmount : ""}
  >
    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
  </TextInputGroup>)
}


export function feeAdjustmentColumns(isAllSelected: any, allFeeLedgerCheckHndlr: any, feeLedgerCheckHndlr: any, isCTAdjustment: boolean = false) {
  const columns: any[] = [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
            value={isAllSelected}
            onChange={allFeeLedgerCheckHndlr}
            formgroupClassName="tw-mb-0"
          />
        );
      },
      accessor: "studentFeeLedger",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        const { studentLedgerId, isSelected } = original;
        return (
          <>
          <InputCheckbox
            name={`student-feeledger-${index}`}
            // labelName={shortName}
            value={isSelected}
            onChange={feeLedgerCheckHndlr}
            dataId={studentLedgerId}
            formgroupClassName="tw-mb-0"
            isDisabled={
              isCTAdjustment
                ? original?.canSelect === false
                : false
            }
          />
          </>
        );
      },
    },
    {
      Header: "Academic Year",
      accessor: "academicYear",
      disableSortBy: true,
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {

        return (
          <>
            <div style={{ width: "220px" }}>
              <TextInput
                name={`feeDetails-${original.id}`}
                value={original?.feeDetails}
                formgroupClassName="tw-mb-0 form-control-sm p-0"
                // inputClassName="w-220px"
                onChange={undefined}
                isDisabled={true}
              />
            </div>
          </>
        );
      },
    },
    {
      Header: "Amount Payable (₹)",
      accessor: "netAmount",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.netAmount)}</span>
        );
      },
    },
    {
      Header: "Amount Paid (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.amountPaid)}</span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
        );
      },
    },
    {
      Header: "Amount to Pay (₹)",
      accessor: "amountToBePaid",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.amountToBePaid)}</span>
        );
      },
    },
    {
      Header: "Adjust Amount",
      accessor: "adjustAmount",
      disableSortBy: true,
      Cell: editFeeRefundTableCell,
    },
  ];

  if (isCTAdjustment) {
    columns.push({
      Header: "Excess Amount",
      accessor: "excessAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return +original?.excessAmount > 0 ? (
          <span className="text-success fw-bold">
            ₹ {getAmountValueWithDecimal(original.excessAmount)}
          </span>
        ) : null;
      },
    });
  }

  return columns;
}

export function generateFeeDetailsColumns() {
  return [
    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Amount Payable",
      accessor: "amountPayable",
    },
    {
      Header: "Net Amount",
      accessor: "netAmount",
    },
    {
      Header: "Amount Paid",
      accessor: "amountPaid",
    },
    {
      Header: "Refund Amount",
      accessor: "refundAmount",
    },
  ];
}
export const FeeDetailsData: Array<FeeDetailsTableData> = [
  {
    id: 1,
    feeName: "Tuition Fee1",
    amountPayable: "46000.00",
    netAmount: "46000.00",
    amountPaid: "00.00",
    refundAmount: "46000.00",
  },
  {
    id: 2,
    feeName: "Tuition Fee2",
    amountPayable: "46000.00",
    netAmount: "46000.00",
    amountPaid: "00.00",
    refundAmount: "46000.00",
  },
];

export function createRefundPayload(formValues: any, refundLedgers: any, adjustmentLedgers: any) {
  let feeDetailDTOList: Array<any> = [], feeRefundAdjustDetailDTO: any = null,
    feeRefundChequeDTO = null, onlineDetailDTO = null;

  if (Array.isArray(refundLedgers)) {
    feeDetailDTOList = refundLedgers.map(item => ({
      studentLedgerId: item.id,
      refundAmount: item.refundAmount
    }))
  }
  switch (formValues.paymentMode) {
    case "CHEQUE": {
      feeRefundChequeDTO = formValues.feeRefundChequeDTO;
      break;
    }
    case "ONLINE": {
      onlineDetailDTO = formValues.onlineDetailDTO;
      break;
    }
    case "ADJUSTMENT": {
      let feeRefundAdjustLedgerDTOList: any = [];
      if (Array.isArray(adjustmentLedgers)) {
        feeRefundAdjustLedgerDTOList = adjustmentLedgers.filter((item: any) => item.isSelected && Number(item.adjustAmount) > 0)
          .map((item: any) => {
            return ({
              studentLedgerId: item?.studentLedgerId,
              adjustAmount: item?.adjustAmount
            })
          })
      }
      feeRefundAdjustDetailDTO = {
        studentDetailId: formValues?.adjustedStudentDetailsId,
        feeRefundAdjustLedgerDTOList
      }
      break;
    }
    case "CT_ADJUSTMENT": {
      let feeRefundAdjustLedgerDTOList: any = [];

      if (Array.isArray(adjustmentLedgers)) {
        feeRefundAdjustLedgerDTOList = adjustmentLedgers
          .filter(
            (item: any) =>
              item.isSelected &&
              (
                Number(item.adjustAmount) > 0 ||
                Number(item.excessAmount) > 0
              )
          )
          .map((item: any) => ({
            studentLedgerId: item?.studentLedgerId,
            adjustAmount: item?.adjustAmount || "0.00",
            excessAmount: item?.excessAmount || "0.00",
          }));
      }

      feeRefundAdjustDetailDTO = {
        studentDetailId: formValues?.newStudentId,
        feeRefundAdjustLedgerDTOList,
      };

      break;
    }
  }
  return {
    academicYearId: formValues.academicYearId,
    branchCurriculumId: formValues.branchCurriculumId,
    branchClassId: formValues.branchClassId,
    feeDetailDTOList,
    refundFor: formValues.refundFor,
    refundableAmount: formValues.finalRefundableAmount,
    instituteId: "",
    branchId: "",
    studentDetailId: formValues.studentDetailId,
    paymentAmount: formValues.paymentAmount,
    feeRefundAdjustDetailDTO,
    feeRefundChequeDTO,
    onlineDetailDTO,
    paymentMode: formValues.paymentMode,
    remarks: formValues.remarks,
  }
}
