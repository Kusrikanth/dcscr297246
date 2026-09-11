
import { DateInput, InputCheckbox, SelectInput, TextInput, TextInputGroup, TextInputWithRegex, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { differenceInDays, isAfter, isEqual } from "date-fns";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";


const bookConditionOptions = [
  {
    name: "Good",
    id: "Good",
  },
  {
    name: "Spoil",
    id: "Spoil",
  },
  {
    name: "Not Usable",
    id: "Not Usable",
  },
  {
    name: "Lost",
    id: "Lost",
  },
]

const DateInputComponent = ({
  row: { original, index },
  name
}: any) => {
  return (
    <DateInput
      name={`${name}-${index}`}
      value={original[name]}
      isDisabled={true}
      onChange={undefined}
    />
  )
}

const FineInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInputGroup
      name="fine"
      allowedInputRegex="^[0-9]+$"
      maxLength={10}
      value={original?.fine}
      onChange={(event: any) => onChangeInputHndlr(original?.matchId, event.target.value, "fine")}
      isDisabled={!original?.isSelected}
    >
      <RupeeSvg width="11px" height="11px" fill={"#495057"} />
    </TextInputGroup>
  )
}

const BookCostInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInputGroup
      name="bookPrice"
      allowedInputRegex="^[0-9]+$"
      maxLength={10}
      value={original?.bookPrice}
      onChange={(event: any) => onChangeInputHndlr(original?.matchId, event.target.value, "bookPrice")}
      isDisabled={!original?.isSelected}
    >
      <RupeeSvg width="11px" height="11px" fill={"#495057"} />
    </TextInputGroup>
  )
}

const TotalAmtInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInputGroup
      name="totalAmount"
      allowedInputRegex="^[0-9]+$"
      maxLength={10}
      value={original?.totalAmount}
      onChange={(event: any) => onChangeInputHndlr(original?.matchId, event.target.value, "totalAmount")}
      isDisabled={!original?.isSelected}
    >
      <RupeeSvg width="11px" height="11px" fill={"#495057"} />
    </TextInputGroup>
  )
}

const RemarksInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInput
      name="remarks"
      value={original?.remarks}
      onChange={(event: any) => onChangeInputHndlr(original?.matchId, event.target.value, "remarks")}
      isDisabled={!original?.isSelected}

    />
  )
}

export function generateColumnsUserDetails(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any, actionList: Array<IOptionsHrtl>) {
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
      columnClassName: "tw-w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { matchId, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${matchId}`}
              // labelName={shortName}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={matchId}
              formgroupClassName="tw-mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName || original?.employeeName || original?.nameOfThePerson}
              displayId={original?.studentCode || original?.employeeCode}
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
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Book Title",
      accessor: "bookName",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
    },
    {
      Header: "Accession No",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row }: any) => {
        return (<DateInputComponent row={row} name="issuanceDate" />);
      },
    },
    {
      Header: "Return Date",
      accessor: "returnDate",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row }: any) => {
        return (<DateInputComponent row={row} name="returnDate" />);
      },
    },
    {
      Header: "Current Date",
      accessor: "currentDate",
      disableSortBy: true,
      columnClassName: "tw-w-[130px] tw-min-w-[130px] tw-max-w-[130px]",
      Cell: ({ row }: any) => {
        return (<DateInputComponent row={row} name="currentDate" />);
      },
    },
    {
      Header: "No of Late dates",
      accessor: "noOfLateDays",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <TextInputWithRegex
            name="noOfLateDays"
            value={original?.noOfLateDays || "0"}
            allowedInputRegex="^[0-9]+$"
            onChange={undefined}
            isDisabled={true}
          />
        )
      },
    },
    {
      Header: "Book Condition",
      accessor: "bookCondition",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
      Cell: ({ row: { original }, onChangeInputHndlr }: any) => {
        return (
          <SelectInput
            name="bookCondition"
            value={original?.bookCondition}
            onChange={(event: any) => onChangeInputHndlr(original?.matchId, event.target.value, "bookCondition")}
            menuItems={bookConditionOptions || []}
            valueKey="id"
            textKey="name"
            defaultSelect="Good"
            isDisabled={!original?.isSelected}
          />
        )
      }
    },
    {
      Header: "Fine",
      accessor: "fine",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
      Cell: FineInputComponent,
    },
    {
      Header: "Book Cost",
      accessor: "bookPrice",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
      Cell: BookCostInputComponent,
    },
    {
      Header: "Total Amount",
      accessor: "totalAmount",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
      Cell: TotalAmtInputComponent,
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
      Cell: RemarksInputComponent,
    },
    // {
    //   Header: "Actions",
    //   accessor: "actions",
    //   disableSortBy: true,
    //   columnClassName: 'sticky-right w-100px min-w-100px max-w-100px',
    // },
  ];
}

export function renderOptionsAccessionNo(item: any) {
  return `${item?.accessionNumber}`;
}

export function renderValueAccessionNo(selectedItems: any) {
  return `${selectedItems?.accessionNumber}`;
}

export const getUserTypeId = (userType: string, response: any) => {
  const data = response?.find((item: any) => item?.userType === userType);
  return data?.id
}

export const computeSubmitButtonError = (studentList: Array<any>) => {
  if (studentList?.length && studentList?.some((item: any) => item?.isSelected)) {
    const isValid = studentList?.some((item: any) => item?.isSelected)
    const submitErr = !isValid;
    if (submitErr) return true
    else return false
  }
}


export const calculateDaysDifference = (returnDate?: any) => {
  const currentDate = new Date();
  const returnDateObj = returnDate ? new Date(returnDate) : new Date();

  if (isAfter(returnDateObj, currentDate) || isEqual(returnDateObj, currentDate)) {
    return 0;
  }

  return differenceInDays(currentDate, returnDateObj);
};

