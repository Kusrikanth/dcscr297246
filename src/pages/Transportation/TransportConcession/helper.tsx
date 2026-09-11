import { InputCheckbox, TextInput, UserDetails } from "../../../Components/Common";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import {
  TransportConcessionTableDataTypes,
} from "./TransportConcessionTypes";
import { getAmountValueWithDecimal, getDisplayAmountValue, percentageConverter, valueConverter } from "../../../utility/commonutility";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{ original.className || '-'}</span>
        );
      },
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{ original.sectionName || '-'}</span>
        );
      },
    },
    {
      Header: "Employee Name",
      accessor: "employeeName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{ original.employeeName || '-'}</span>
        );
      },
    },
    // {
    //   Header: "Sibling Name",
    //   accessor: "siblingName",
    //   disableSortBy: true,
    // },
    {
      Header: "Concession Amount (₹)",
      accessor: "totalConcessionAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.totalConcessionAmount)}</span>
        );
      },
    },
    // {
    //   Header: "Type",
    //   accessor: "feetypeName",
    //   disableSortBy: true,
    // },
    // {
    //   Header: "Concession Type",
    //   accessor: "concessionType",
    //   disableSortBy: true,
    // },
    {
      Header: "Document",
      accessor: "fileInfo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { fileInfo } = original,
          { s3URL } = fileInfo || {};
        return (
          <>
            {
              s3URL ? <a target="_blank" href={s3URL} className="ttw-text-blue-500">Link</a> : "-"
            }
          </>
        );
      },
    },
    {
      Header:"Created By",
      accessor:"createdBy",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return <span>{original.createdBy ? original.createdBy : "-"}</span>
      }
    },
    {
        Header: "Created Date",
        accessor: "createdAt",
        disableSortBy: true,
        Cell:({row:{original}}:any)=>{
            const [date,time] = original?.createdAt?.split("T") ?? [];
            return <UserDetails
            displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
            displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
            showAvatar={false}
            ></UserDetails>
        }
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions
            actionOptions={actionsList}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}
export function generateNewTransportConcessionColumns() {
  return [
    {
      Header: "Fee Name",
      accessor: "feeName",
      thClass: "tw-w-30",
    },
    {
      Header: "Fee Amount",
      accessor: "feeAmount",
      thClass: "tw-w-24",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.feeAmount}</span>
          </div>
        );
      },
    },
    {
      Header: "Conc.Amount",
      accessor: "concAmount",
      thClass: "w-20",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="input-group input-group-sm">
            <span className="input-group-text tw-bg-white tw-border-e-0">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            </span>
            <input type="text" className="form-control tw-border-s-0" />
          </div>
        );
      },
    },
    {
      Header: "Payable Amount",
      accessor: "payableAmount",
      thClass: "tw-w-20",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.payableAmount}</span>
          </div>
        );
      },
    },
  ];
}
export const TransportConcessionTableData: Array<TransportConcessionTableDataTypes> =
  [
    {
      id: 1,
      studentName: {
        StudName: "User1",
        dep_id: "DCIP000001",
        imgUrl: avatar1,
      },
      curriculum: "CBSE",
      class: "NUR",
      section: "NUR-A",
      employeeName: "",
      concessionAmount: "12,1540",
      document:
        "http://demo.studease.co.in/Files/DownLoad_1.ashx?FILENAME=CONCESSION-249936-1200207.png",
    },
  ];



export const radioInputs = [
  {
    value: "%",
  },
  {
    value: "Amount",
  },
];


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

function onChange (event:any){
  
  onChangeInputHndlr(original.id,event.target.value,original.concessionAmount || 0)

}

  return (
    <>
      <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
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

export function generateColumnsForConcession(Mode: any, value: any, isAllSelected: any, allCheckHndlr: any, studentCheckHndlr: any) {
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
            formgroupClassName="tw-mb-0"
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
              formgroupClassName="tw-mb-0"
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
              formgroupClassName="tw-mb-0 form-control-sm tw-p-0"
              inputClassName="tw-w-[300px]"
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
            <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
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
      accessor: "transportConcession",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
              </span>
              <input type="text" className="form-control" value={getAmountValueWithDecimal(+original.remainingAmount) || 0}
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
            <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
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
      Cell : EditConcessionAmount,
    },
    {
      Header: "Payable Amount",
      accessor: "",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
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
          <div className="tw-flex tw-items-center">
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
          <div className="tw-flex tw-items-center">
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
          <div className="tw-flex tw-items-center">
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