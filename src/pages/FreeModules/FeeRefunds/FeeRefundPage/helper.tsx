import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { StatusLabel, TextInput, InputCheckbox } from "../../../../Components/Common";

import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { FeeDetailsTableData, NewRefundTableData } from "./feeRefundPageTypes";
import { TextInputGroup } from "../../../../Components/Common";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

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
    id: "FINE_PAID",
    name: "Fine Paid"
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


export const getRefundableFineAmount = (receipt: any) =>
  Math.max((+receipt?.fine || 0) - (+receipt?.refundedFineAmount || 0), 0);

const EditFineAdjustAmount = ({ row: { original }, onChangeInputHndlr }: any) => {

  function onChange(event: any) {
    const { value } = event.target;
    // A ledger can take at most its due amount.
    if (/^[0-9]*\.?[0-9]*$/.test(value) && +value <= (+original?.amountToBePaid || 0)) {
      onChangeInputHndlr(event, original.id)
    }
  }

  return (
    <div className="input-group input-group-sm tw-w-[120px]">
      <span className="input-group-text">
        <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
      </span>
      <input name={`refundAmount`} type="text" className="form-control" value={original?.refundAmount ?? "0"}
        onChange={onChange}
        disabled={!original.isSelected}
      />
    </div>
  );
};

const finePaidReceiptInfoColumns = () => [
  {
    Header: "Receipt No",
    accessor: "receiptNumber",
    disableSortBy: true,
  },
  {
    Header: "Receipt Date",
    accessor: "receiptDate",
    disableSortBy: true,
    Cell: ({ row: { original } }: any) => {
      return (
        <span className="tw-text-nowrap">
          {original?.receiptDate ? getDdMmYyyyWithMonthNameFormat(new Date(original.receiptDate)) : "-"}
        </span>
      );
    },
  },
  {
    Header: "Fee Names",
    accessor: "feeDetailVOList",
    disableSortBy: true,
    Cell: ({ row: { original } }: any) => {
      return (
        <span>
          {Array.isArray(original?.feeDetailVOList)
            ? original.feeDetailVOList.map((fee: any) => fee?.feeDetail).join(", ")
            : "-"}
        </span>
      );
    },
  },
  {
    Header: "Payment Mode",
    accessor: "paymentMode",
    disableSortBy: true,
  },
  {
    Header: "Receipt Amount (₹)",
    accessor: "currentPaidAmount",
    disableSortBy: true,
    Cell: ({ row: { original } }: any) => {
      return (
        <span>{getAmountValueWithDecimal(original?.currentPaidAmount)}</span>
      );
    },
  },
  {
    Header: "Fine Paid (₹)",
    accessor: "fine",
    disableSortBy: true,
    Cell: ({ row: { original } }: any) => {
      return (
        <span>{getAmountValueWithDecimal(original?.fine)}</span>
      );
    },
  },
];

// Editable for the selected receipt only: how much of its fine to refund, up to what is still refundable.
// The modal's draft selection and amount arrive through the table's rowDataInfo.
const EditRefundableFine = ({ row: { original }, rowDataInfo, onChangeInputHndlr }: any) => {
  const maxRefundableFine = getRefundableFineAmount(original);
  const isSelected = String(original.id) === String(rowDataInfo?.selectedReceiptId);

  function onChange(event: any) {
    const { value } = event.target;
    if (/^[0-9]*\.?[0-9]*$/.test(value) && +value <= maxRefundableFine) {
      onChangeInputHndlr(event, original.id)
    }
  }

  return (
    <>
      <div className="input-group input-group-sm tw-w-[120px]">
        <span className="input-group-text">
          <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
        </span>
        <input name={`refundFineAmount`} type="text" className="form-control"
          value={isSelected ? rowDataInfo?.refundFineAmount : getAmountValueWithDecimal(maxRefundableFine)}
          onChange={onChange}
          disabled={!isSelected}
        />
      </div>
      {isSelected && (
        <span className="tw-text-xs tw-text-gray-500">Max {getAmountValueWithDecimal(maxRefundableFine)}</span>
      )}
    </>
  );
};

// Receipts on which a fine was collected, listed in the select-receipt modal (single select).
export function finePaidReceiptSelectColumns(fineReceiptSelectHndlr: any) {
  return [
    {
      Header: "",
      accessor: "isSelected",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original }, rowDataInfo }: any) => {
        return (
          <input
            type="radio"
            className="form-check-input"
            name="fine-paid-receipt"
            data-id={original.id}
            checked={String(original.id) === String(rowDataInfo?.selectedReceiptId)}
            onChange={fineReceiptSelectHndlr}
            disabled={getRefundableFineAmount(original) <= 0}
          />
        );
      }
    },
    ...finePaidReceiptInfoColumns(),
    {
      Header: "Refundable Fine",
      accessor: "refundFineAmount",
      disableSortBy: true,
      Cell: EditRefundableFine,
    },
  ];
}

const readOnlyAmountCell = (key: string) => ({ row: { original } }: any) => {
  return (
    <div className="input-group input-group-sm tw-w-[120px]">
      <span className="input-group-text">
        <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
      </span>
      <input type="text" className="form-control" value={getAmountValueWithDecimal(original?.[key])}
        disabled={true}
      />
    </div>
  );
};

// The student's ledgers with an amount due, across which the selected receipt's fine is adjusted.
export function finePaidAdjustLedgerColumns(isAllSelected: any, studentCheckHndlr: any, selectAllFeeHndlr: any) {
  // Same select and Fee Names columns the other refund types use.
  const [selectColumn, feeNameColumn] = feeRefundColumns(isAllSelected, studentCheckHndlr, selectAllFeeHndlr);
  return [
    selectColumn,
    feeNameColumn,
    {
      Header: "Net Amount",
      accessor: "netAmount",
      disableSortBy: true,
      Cell: readOnlyAmountCell("netAmount"),
    },
    {
      Header: "Amount Paid",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: readOnlyAmountCell("amountPaid"),
    },
    {
      Header: "Due Amount",
      accessor: "amountToBePaid",
      disableSortBy: true,
      Cell: readOnlyAmountCell("amountToBePaid"),
    },
    {
      Header: "Adjust Amount",
      accessor: "refundAmount",
      disableSortBy: true,
      Cell: EditFineAdjustAmount,
    },
  ];
}

// TODO: remove once the fine-paid receipts API for refunds is available. The existing
// /studentFeeLedgers/for/refund endpoint returns ledgers and fails for refundFor=FINE_PAID.
export const USE_SAMPLE_FINE_PAID_REFUND = true;

export const sampleFinePaidReceipts = [
  {
    id: 90101, receiptNumber: "RCPT-2026-0512", receiptDate: "2026-07-18",
    feeDetailVOList: [{ feeDetail: "Tuition Fee - Term 1" }],
    paymentMode: "ONLINE", currentPaidAmount: 23500, fine: 500, refundedFineAmount: 0,
  },
  {
    id: 90102, receiptNumber: "RCPT-2026-0587", receiptDate: "2026-08-20",
    feeDetailVOList: [{ feeDetail: "Transport Fee - Term 1" }],
    paymentMode: "CASH", currentPaidAmount: 4250, fine: 250, refundedFineAmount: 0,
  },
  {
    id: 90103, receiptNumber: "RCPT-2026-0633", receiptDate: "2026-09-10",
    feeDetailVOList: [{ feeDetail: "Tuition Fee - Term 2" }, { feeDetail: "Transport Fee - Term 2" }],
    paymentMode: "CHEQUE", currentPaidAmount: 15800, fine: 300, refundedFineAmount: 100,
  },
];

// Same shape as the get_ledgers_fee_adjust response (the student's ledgers with an amount due).
export const samplePendingLedgersForFineAdjust = [
  {
    id: 90201, feeDetails: "Tuition Fee - Term 2", academicYear: "2026-2027",
    amountToPay: 25000, netAmount: 23000, amountPaid: 11500, amountToBePaid: 11500, paymentStatus: "PARTIALLY_PAID",
  },
  {
    id: 90202, feeDetails: "Transport Fee - Term 2", academicYear: "2026-2027",
    amountToPay: 8000, netAmount: 8000, amountPaid: 0, amountToBePaid: 8000, paymentStatus: "UNPAID",
  },
  {
    id: 90203, feeDetails: "Tuition Fee - Term 3", academicYear: "2026-2027",
    amountToPay: 25000, netAmount: 23000, amountPaid: 0, amountToBePaid: 23000, paymentStatus: "UNPAID",
  },
];


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
