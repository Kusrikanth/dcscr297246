import { InputCheckbox, TextInput } from "../../../../Components/Common";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getAmountValueWithDecimal, percentageConverter, valueConverter } from "../../../../utility/commonutility";

export const concessionMode = [
  {
    concessionMode: "Amount",
    concessionModeType: "AMOUNT"
  },
  {
    concessionMode: "Percentage",
    concessionModeType: "PERCENTAGE"
  },

]

export function checkDisablePreviousBtn(formData: any) {
  if (!formData?.curriculumId || !formData?.classId || !formData?.studentId) {
    return true;
  }
  return false;
}

const EditConcessionAmount = ({ row: { original },
  onChangeInputHndlr,
rowDataInfo
}: any) => {

function onChange (event:React.ChangeEvent<HTMLInputElement>) {
  
  onChangeInputHndlr(original.id,event.target.value)

}

  return (
    <>
      <div className="input-group input-group-sm tw-w-120px">
        <span className="input-group-text">
          <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
        </span>
        <input type="text" className="form-control" value={original.isSelected ? Math.ceil((+valueConverter((+original.remainingAmount), rowDataInfo?.concessionMode, rowDataInfo?.concessionMode === "AMOUNT" ? (+original?.concessionAmount || 0) : +rowDataInfo?.concessionValue))) : 0} 
        onChange={onChange}
        disabled={original.isSelected ? ( (rowDataInfo.concessionMode === "AMOUNT" && false) || (rowDataInfo.concessionMode === "PERCENTAGE" && true) ) : true}
        />
      </div>
    </>
  );
};

export function generateColumns(Mode: any, value: any, isAllSelected: any, allCheckHndlr: any, studentCheckHndlr: any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            value={isAllSelected}
            onChange={allCheckHndlr}
            formgroupClassName="mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original },rowDataInfo }: any) => {
        const { id, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${id}`}
              value={isSelected}
              onChange={studentCheckHndlr}
              dataId={id}
              formgroupClassName="mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Fee Name",
      accessor: "feeDetails",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <TextInput
              name={`feeDetails-${original.id}`}
              value={original?.feeDetails}
              formgroupClassName="tw-mb-0 form-control-sm tw-p-0"
              inputClassName="w-300px"
              onChange={undefined}
              isDisabled={true}
            />
          </>
        );
      },
    },
    {
      Header: "Fee Amount",
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm tw-w-120px">
              <span className="input-group-text">
                <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
              </span>
              <input type="text" className="form-control" value={getAmountValueWithDecimal(original.amountToPay) || 0}
                disabled={true}
              />
            </div>
          </>
        );
      },
    },
    {
      Header: "Prev Concession",
      accessor: "totalConcession",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="input-group input-group-sm tw-w-120px">
            <span className="input-group-text">
              <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
            </span>

            <input
              type="text"
              className="form-control"
              value={
                getAmountValueWithDecimal(original.totalConcession) || 0
              }
              disabled={true}
            />
          </div>
        );
      },
    },
    {
      Header: "Con. Can be Allocated On",
      accessor: "amountTobePaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="input-group input-group-sm tw-w-120px">
            <span className="input-group-text">
              <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
            </span>
            <input type="text"
              className="form-control"
              value={
                getAmountValueWithDecimal(
                  original?.amountTobePaid
                ) || 0
              }
              disabled={true}
            />
          </div>
        );
      },
    },
    {
      Header: "Paid Amount",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm tw-w-120px">
              <span className="input-group-text">
                <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
              </span>
              <input type="text" className="form-control" value={getAmountValueWithDecimal(original.amountPaid) || 0}
                disabled={true}
              />
            </div>
          </>
        );
      },
    },
    {
      Header: "Conc.%",
      accessor: "conc",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm tw-w-[120px]">
              <span className="input-group-text">
                %
              </span>
              <input type="text" className="form-control" value={original.isSelected ? getAmountValueWithDecimal(percentageConverter(+original.remainingAmount, Mode, Mode === "AMOUNT" ? (original?.concessionAmount || 0) : value)) : "0.00"}
                disabled={true}
              />
            </div>
          </>
        );
      },
    },
    {
      Header: "Conc.Amount",
      accessor: "concAmount",
      disableSortBy: true,
      Cell: EditConcessionAmount,
    },
    {
      Header: "Payable Amount",
      accessor: "",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const allocatedAmount = +original?.amountTobePaid || 0;

        const concessionAmount =
          Mode === "AMOUNT"
            ? +original?.concessionAmount || 0
            : +valueConverter(
              allocatedAmount,
              Mode,
              value
            );

        const payableAmount = Math.max(
          allocatedAmount - concessionAmount,
          0
        );

        return (
          <div className="input-group input-group-sm tw-w-[120px]">
            <span className="input-group-text">
              <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
            </span>
            <input
              type="text"
              className="form-control"
              value={
                original.isSelected
                  ? getAmountValueWithDecimal(payableAmount)
                  : "0.00"
              }
              disabled={true}
            />
          </div>
        );
      },
    },
  ];
}

export function generatePreviousConcessionColumns() {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true
    },
    {
      Header: "Fee Details",
      accessor: "feeName",
      disableSortBy: true
    },
    {
      Header: "Assigned Fee (₹)",
      accessor: "assignedFee",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <span>{getAmountValueWithDecimal(original?.assignedFee)}</span>
          </div>
        );
      },
    },
    {
      Header: "Concession Amount (₹)",
      accessor: "concessionAmount",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <div className="d-flex align-items-center">
            <span>{getAmountValueWithDecimal(value)}</span>
          </div>
        );
      },
    },
    {
      Header: "Concession Type",
      accessor: "concessionType",
      disableSortBy: true
    },
    {
      Header: "Amount to Pay (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <div className="d-flex align-items-center">
            <span>{getAmountValueWithDecimal(value)}</span>
          </div>
        );
      },
    },
    {
      Header: "Concession Remarks",
      accessor: "remarks",
      disableSortBy: true
    },
  ];
}
