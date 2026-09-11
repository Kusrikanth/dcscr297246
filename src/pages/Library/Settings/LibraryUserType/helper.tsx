import { InputCheckbox, MenuOptionHrtl, TextInput, TextInputGroup } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

interface RelocateButtonProps {
  row: {
    original: {
      id: number;
      maximumDays: number;
      maximumBooks: number;
      fineAmountPerDay: number;
      isSelected: boolean;
    };
  };
  handleRelocate: (id: number, maximumDays: number, maximumBooks: number, fineAmountPerDay: number) => void;
}

const MaxBooksInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInput
      name="maximumBooks"
      value={original?.maximumBooks}
      onChange={(event: any) => onChangeInputHndlr(original?.id, event.target.value, "maximumBooks")}
      isDisabled={!original?.isSelected}
      inputType="number"
    />
  )
}
const MaxDaysInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInput
      name="maximumDays"
      value={original?.maximumDays}
      onChange={(event: any) => onChangeInputHndlr(original?.id, event.target.value, "maximumDays")}
      isDisabled={!original?.isSelected}
      inputType="number"
    />
  )
}
const FineAmountInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInput
      name="fineAmountPerDay"
      value={original?.fineAmountPerDay}
      onChange={(event: any) => onChangeInputHndlr(original?.id, event.target.value, "fineAmountPerDay")}
      isDisabled={!original?.isSelected}
      inputType="number"
    />
  )
}

const RelocateButton: React.FC<RelocateButtonProps> = ({ row, handleRelocate }) => {
  const { id, maximumDays, maximumBooks, fineAmountPerDay, isSelected } = row.original;

  return (
    <div className="mb-0 d-flex align-items-center justify-content-start">
      <button className="btn btn-3"
        style={{ background: "#405189", border: "none" }}
        onClick={() => handleRelocate(id, maximumDays, maximumBooks, fineAmountPerDay)}
        disabled={!isSelected}>
        <div className="d-flex align-items-center text-white">
          <span>Update</span>
        </div>
      </button>
    </div>
  );
};



export function generateColumns(singleUserDataCheckHndlr: any, handleRelocate: any) {
  return [
    {
      Header: "",
      accessor: "id",
      columnClassName: "tw-w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected } = original;
        return (
          <InputCheckbox
            name={`user-data-${id}`}
            value={isSelected}
            onChange={singleUserDataCheckHndlr}
            dataId={id}
            formgroupClassName="tw-mb-0"
          />
        );
      },
    },

    {
      Header: "User Type",
      accessor: "userType",
      disableSortBy: true,
    },
    {
      Header: "Maximum Books",
      accessor: "maximumBooks",
      disableSortBy: true,
      Cell: MaxBooksInputComponent,
    },
    {
      Header: "Maximum Days",
      accessor: "maximumDays",
      disableSortBy: true,
      Cell: MaxDaysInputComponent,
    },
    {
      Header: "Fine Amount (Per Day)",
      accessor: "fineAmountPerDay",
      disableSortBy: true,
      Cell: FineAmountInputComponent,
    },
    {
      Header: "",
      accessor: "saveUserData",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return (<RelocateButton row={row} handleRelocate={handleRelocate} />);
      },
    },
  ];
}