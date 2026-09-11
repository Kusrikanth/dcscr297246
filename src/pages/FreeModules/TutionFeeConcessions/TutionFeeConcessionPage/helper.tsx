import { useEffect, useState } from "react";
import { InputCheckbox, TextInput } from "../../../../Components/Common";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getAmountValueWithDecimal, percentageConverter, valueConverter } from "../../../../utility/commonutility";
import { NewStudentConcessionTableData } from "./tutionFeesConcessionTypes";

const EditConcessionAmount = ({
  row: { index, original },
  onChangeInputHndlr,
  rowDataInfo,
  onBlurInputHndlr
}: any) => {


  function onChange (event:any){
    if(event.target.value <= +rowDataInfo){
      // setState(event.target.value)
      onChangeInputHndlr(original.id,event.target.value)
    }
  }
  return (
    <div className="input-group input-group-sm w-120px">
      <span className="input-group-text">
        <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
      </span>
      <input type="text" className="form-control" value={original.isSelected ? original?.concessionAmount : "0.00"}
        disabled={original?.isSelected ? original?.mode === "PERCENTAGE" ? true : false : true}
        onChange={onChange}
  
      />
    </div>
  )
}

export function generateColumns(Mode:any,value:any,isAllSelected: any, allCheckHndlr: any, studentCheckHndlr: any,setFullConcessionErr:any) {
  return [
    {
      // Header: "",
      accessor: "isStudentChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected } = original;
        return (
          <>
          <div onClick={(event:any)=>{
            if((+original?.remainingAmount) == 0){
              setFullConcessionErr(true)
            }
          }}>
            <InputCheckbox
              name={`student-${id}`}
              // labelName={shortName}
              value={isSelected}
              onChange={studentCheckHndlr}
              dataId={id}
              formgroupClassName="mb-0"
              isDisabled={(Mode ? (Mode === "AMOUNT" ? !value : Mode === "PERCENTAGE" ? value > 100 : true) : true) || ((+original.remainingAmount) == 0 && true)}
            />
              </div>
          </>
        )
      }
    },
    {
      Header: "Fee Names",
      accessor: "feeDetails",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <TextInput
              name={`feeDetails-${original.id}`}
              value={original?.feeDetails}
              formgroupClassName="mb-0 form-control-sm p-0"
              inputClassName="w-200px"
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
      accessor: "conAllocatedOn",
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
              <input type="text" className="form-control" value={original.isSelected ? original?.mode === "AMOUNT" ? getAmountValueWithDecimal(percentageConverter(original?.remainingAmount,Mode,original.concessionAmount)) : getAmountValueWithDecimal(value) :"0.00"}
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
      Cell: EditConcessionAmount
    },
    {
      Header: "Payable Amount",
      accessor: "payableAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="input-group input-group-sm w-120px">
              <span className="input-group-text">
                <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
              </span>
              <input type="text" className="form-control" value={original.isSelected?getAmountValueWithDecimal(+original?.remainingAmount - +original.concessionAmount) : 0}
                disabled={true}
              />
            </div>
          </>
        );
      },
    },
  ];
}

export const concessionMode=[
  {
    concessionMode:"Amount",
    concessionModeType:"AMOUNT"
  },
  {
    concessionMode:"Percentage",
    concessionModeType:"PERCENTAGE"
  },

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
    concessionType: "OTHER_CONCESSION"
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

]