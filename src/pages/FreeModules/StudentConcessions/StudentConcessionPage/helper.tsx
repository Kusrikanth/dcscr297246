import { useEffect, useState } from "react";
import { InputCheckbox, TextInput } from "../../../../Components/Common";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getAmountValueWithDecimal, percentageConverter, valueConverter } from "../../../../utility/commonutility";
import { NewStudentConcessionTableData } from "./studentConcessionTypes";

export const selectData1 = [
  {
    Type: "Term Wise",
  },
  {
    Type: "option2",
  },
  {
    Type: "option3",
  },
];

export const selectData2 = [
  {
    academicYearType: "2022-23",
  },
  {
    academicYearType: "option2",
  },
  {
    academicYearType: "option3",
  },
];

export const selectData3 = [
  {
    curriculumType: "CBSE",
  },
  {
    curriculumType: "option2",
  },
  {
    curriculumType: "option3",
  },
];

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

export const selectData4 = [
  {
    concessionType: "Academics",
  },
  {
    concessionType: "option2",
  },
  {
    concessionType: "option3",
  },
];
export const selectData5 = [
  {
    classType: "IV",
  },
  {
    classType: "V",
  },
  {
    classType: "VI",
  },
];
export const selectData6 = [
  {
    termType: "Term Wise"
  }
]
export const concessionType = [
  {
    concessionType: "MANAGEMENT"
  },
  {
    concessionType: "ACADEMIC"
  },
  {
    concessionType: "PVA"
  },
  {
    concessionType: "SIBLING"
  },
  {
    concessionType: "EMPLOYEE"
  },
  {
    concessionType: "SPORTS"
  },
  {
    concessionType: "ANNUAL_PAYMENT_DISCOUNT"
  },
  {
    concessionType: "SCHOLARSHIP"
  },
  {
    concessionType: "ALUMNI_CONCESSION"
  },
  {
    concessionType: "OTHER_CONCESSION"
  },

]

export const Data1 = [
  {
    key: "Class",
    value: "VII",
  },
  {
    key: "Section",
    value: "VII A",
  },
];

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

function onChange (event:any){
  
  onChangeInputHndlr(original.id,event.target.value,original.concessionAmount || 0)

}

  return (
    <>
      <div className="input-group input-group-sm w-120px">
        <span className="input-group-text">
          <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
        </span>
        <input type="text" className="form-control" value={original.isSelected ? (+valueConverter((+original.remainingAmount), rowDataInfo?.concessionMode, rowDataInfo?.concessionMode === "AMOUNT" ? (+original?.concessionAmount || 0) : +rowDataInfo?.concessionValue)) : 0} 
        // onBlur={onBlur}
        onChange={onChange}
        disabled={original.isSelected ? ( (rowDataInfo.concessionMode === "AMOUNT" && false) || (rowDataInfo.concessionMode === "PERCENTAGE" && true) ) : true}
        />
      </div>
    </>
  );
};

export function generateColumns(Mode: any, value: any, isAllSelected: any, allCheckHndlr: any, studentCheckHndlr: any,globalConcessionValue:any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
            value={isAllSelected}
            // isDisabled={+globalConcessionValue === 0}
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
              // labelName={shortName}
              value={isSelected}
              onChange={studentCheckHndlr}
              dataId={id}
              formgroupClassName="mb-0"
              // isDisabled={+original.amountToPay < +value || (Mode === "PERCENTAGE" && value > 100) || (!isSelected && +rowDataInfo?.globalConcessionValue === 0)}
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
              formgroupClassName="mb-0 form-control-sm p-0"
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
            <div className="input-group input-group-sm w-120px">
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
      Header: "Con. Can be Allocated On",
      accessor: "studentConcessionAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm w-120px">
              <span className="input-group-text">
                <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
              </span>
              <input type="text" className="form-control" value={getAmountValueWithDecimal(original?.remainingAmount) || 0}
                disabled={true}
              />
            </div>
          </>
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
            <div className="input-group input-group-sm w-120px">
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
            <div className="input-group input-group-sm w-120px">
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
      Cell : EditConcessionAmount,
    },
    {
      Header: "Payable Amount",
      accessor: "",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm w-120px">
              <span className="input-group-text">
                <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
              </span>
              <input type="text" className="form-control" value={original.isSelected ? getAmountValueWithDecimal(+original.remainingAmount -  +valueConverter((+original.remainingAmount), Mode, Mode === "AMOUNT" ? (original?.concessionAmount || 0) : value)) : "0.00"}
                disabled={true}
              />
            </div>
          </>
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

export const NewStudentConcessionData: Array<NewStudentConcessionTableData> = [
  {
    id: 1,
    feeName: "Tuition Feet",
    feeAmount: 121540,
    paidAmount: 123,
    conc: "",
    concAmount: "0.00",
    payableAmount: 121540,
  },
  {
    id: 2,
    feeName: "Tuition Feet",
    feeAmount: 121540,
    paidAmount: 123,
    conc: "",
    concAmount: "0.00",
    payableAmount: 121540,
  },
];
