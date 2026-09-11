import {
  InputCheckbox,
  TextInputWithRegex,
} from '../../../../Components/Common';
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from '../../../../Components/Common/MenuOptions';

const GradeInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInputWithRegex
      name="grade"
      value={original?.grade}
      onChange={(event: any) =>
        onChangeInputHndlr(original?.id, event.target.value, 'grade')
      }
      isDisabled={!original?.isSelected}
      allowedInputRegex="^[A-Za-z+]*$"
      maxLength={2}
    />
  );
};

const LabelInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
}: any) => {
  return (
    <TextInputWithRegex
      name="label"
      value={original?.label}
      onChange={(event: any) =>
        onChangeInputHndlr(original?.id, event.target.value, 'label')
      }
      isDisabled={!original?.isSelected}
      allowedInputRegex="^[A-Za-z ]*$"
    />
  );
};

const FromRatingInputComponent = (props: any) => {
  const {
    row: { original },
    onChangeInputHndlr,
  } = props;
  const setSelectedBelowRowId =
    props.setSelectedBelowRowId || props.rowDataInfo?.setSelectedBelowRowId;
  const setSelectedAboveRowId =
    props.setSelectedAboveRowId || props.rowDataInfo?.setSelectedAboveRowId;
  const selectedBelowRowId =
    props.selectedBelowRowId || props.rowDataInfo?.selectedBelowRowId;
  const selectedAboveRowId =
    props.selectedAboveRowId || props.rowDataInfo?.selectedAboveRowId;

  const isBelowChecked = original?.fromRating === 'Below';
  const disableBelow =
    original?.toRating === 'Above' ||
    (selectedBelowRowId !== null &&
      selectedBelowRowId !== original.id &&
      !isBelowChecked);

  return (
    <div className="d-flex align-items-center">
      <TextInputWithRegex
        name="fromRating"
        value={isBelowChecked ? 'Below' : original?.fromRating || ''}
        onChange={(event: any) =>
          onChangeInputHndlr(original.id, event.target.value, 'fromRating')
        }
        isDisabled={!original.isSelected || isBelowChecked}
        maxLength={3}
        formgroupClassName="mb-0"
        allowedInputRegex="^\d*\.?\d{0,2}$"
      />
      <InputCheckbox
        name={`below-${original.id}`}
        labelName="Below"
        labelClassName="ms-2"
        value={isBelowChecked}
        isDisabled={!original.isSelected || disableBelow}
        onChange={(e: any) => {
          if (e.target.checked) {
            setSelectedBelowRowId(original.id);
            onChangeInputHndlr(original.id, 'Below', 'fromRating');
            if (original?.toRating === 'Above') {
              setSelectedAboveRowId(null);
              onChangeInputHndlr(original.id, '', 'toRating');
            }
          } else {
            setSelectedBelowRowId(null);
            onChangeInputHndlr(original.id, '', 'fromRating');
          }
        }}
        formgroupClassName="ms-2"
      />
    </div>
  );
};

const ToRatingInputComponent = (props: any) => {
  const {
    row: { original },
    onChangeInputHndlr,
  } = props;
  const setSelectedAboveRowId =
    props.setSelectedAboveRowId || props.rowDataInfo?.setSelectedAboveRowId;
  const setSelectedBelowRowId =
    props.setSelectedBelowRowId || props.rowDataInfo?.setSelectedBelowRowId;
  const selectedAboveRowId =
    props.selectedAboveRowId || props.rowDataInfo?.selectedAboveRowId;
  const selectedBelowRowId =
    props.selectedBelowRowId || props.rowDataInfo?.selectedBelowRowId;

  const isAboveChecked = original?.toRating === 'Above';
  const disableAbove =
    original?.fromRating === 'Below' ||
    (selectedAboveRowId !== null &&
      selectedAboveRowId !== original.id &&
      !isAboveChecked);

  return (
    <div className="d-flex align-items-center">
      <TextInputWithRegex
        name="toRating"
        value={isAboveChecked ? 'Above' : original?.toRating || ''}
        onChange={(event: any) =>
          onChangeInputHndlr(original.id, event.target.value, 'toRating')
        }
        isDisabled={!original.isSelected || isAboveChecked}
        maxLength={3}
        formgroupClassName="mb-0"
        allowedInputRegex="^\d*\.?\d{0,2}$"
      />
      <InputCheckbox
        name={`above-${original.id}`}
        labelName="Above"
        labelClassName="ms-2"
        value={isAboveChecked}
        isDisabled={!original.isSelected || disableAbove}
        onChange={(e: any) => {
          if (e.target.checked) {
            setSelectedAboveRowId(original.id);
            onChangeInputHndlr(original.id, 'Above', 'toRating');
            if (original?.fromRating === 'Below') {
              setSelectedBelowRowId(null);
              onChangeInputHndlr(original.id, '', 'fromRating');
            }
          } else {
            setSelectedAboveRowId(null);
            onChangeInputHndlr(original.id, '', 'toRating');
          }
        }}
        formgroupClassName="ms-2"
      />
    </div>
  );
};

export function generateColumns(
  singleUserDataCheckHndlr: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void,
  actionList: Array<IOptionsHrtl>,
  rowDataInfo?: any,
) {
  return [
    {
      Header: '',
      accessor: 'id',
      columnClassName: 'w-5',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected } = original;
        return (
          <InputCheckbox
            name={`user-data-${id}`}
            value={isSelected}
            onChange={singleUserDataCheckHndlr}
            dataId={id}
            formgroupClassName="mb-0"
          />
        );
      },
    },
    {
      Header: 'Grade',
      accessor: 'grade',
      disableSortBy: true,
      Cell: GradeInputComponent,
    },
    {
      Header: 'Label',
      accessor: 'label',
      disableSortBy: true,
      Cell: LabelInputComponent,
    },
    {
      Header: 'From Percentage',
      accessor: 'fromRating',
      disableSortBy: true,
      Cell: FromRatingInputComponent,
    },
    {
      Header: 'To Percentage',
      accessor: 'toRating',
      disableSortBy: true,
      Cell: ToRatingInputComponent,
    },
    {
      Header: 'Range',
      accessor: 'range',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { fromRating, toRating } = original;
        let rangeDisplay = '-';
        if (fromRating === 'Below' && toRating) {
          rangeDisplay = `Below ${toRating}`;
        } else if (fromRating && toRating === 'Above') {
          rangeDisplay = `Above ${fromRating}`;
        } else if (fromRating && toRating) {
          rangeDisplay = `${fromRating} - ${toRating}`;
        } else if (fromRating) {
          rangeDisplay = `From ${fromRating}`;
        } else if (toRating) {
          rangeDisplay = `To ${toRating}`;
        }
        return (
          <span className="badge bg-light text-muted p-2 me-1 mb-2">
            {rangeDisplay}
          </span>
        );
      },
    },
    {
      Header: 'Action',
      thClass: 'w-5',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}
