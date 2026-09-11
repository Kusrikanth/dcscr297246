import { InputCheckbox, UserDetails } from '../../../../../Components/Common';
import grayHand from '../../../../../assets/imagesdps/examination/gray-hand.png';
import greenHand from '../../../../../assets/imagesdps/examination/green-hand.png';

export function generateColumns(
  allStudentCheckHndlr: any,
  singleStudentCheckHndlr: any,
  allStudentSelectedState: any,
  isEy: boolean,
  isIgcse: boolean,
  objectivesData: any[],
  handleHandSelectionChange: any,
  handleStudentDetailsModalOpen: any,
) {
  const dynamicColumns = generateDynamicColumns(
    objectivesData,
    handleHandSelectionChange,
  );
  return [
    {
      Header: () => (
        <InputCheckbox
          name="all-student"
          value={allStudentSelectedState}
          onChange={allStudentCheckHndlr}
          formgroupClassName="mb-0"
        />
      ),
      accessor: 'id',
      columnClassName: 'w-5 sticky-left z-index-1',
      disableSortBy: true,
      rowSpan: 2,
      columns: [
        {
          Header: 'hidden',
          displayNone: true,
          accessor: 'isStudentChecked',
          columnClassName: 'sticky-left w-5 z-index-1',
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            const { studentId, isSelected } = original;
            return (
              <InputCheckbox
                name={`student-${studentId}`}
                value={isSelected}
                onChange={singleStudentCheckHndlr}
                dataId={studentId}
                formgroupClassName="mb-0"
              />
            );
          },
          Footer: '',
          footerClassName: 'text-white fw-bold',
        },
      ],
    },
    {
      Header: 'Student Name',
      accessor: 'studentName',
      disableSortBy: true,
      columnClassName:
        'sticky-left-checkbox min-w-200px w-200px max-w-200px z-index-1',
      columns: [
        {
          Header: 'Student Name',
          displayNone: true,
          accessor: 'studentName',
          columnClassName:
            'sticky-left-checkbox min-w-200px w-200px max-w-200px z-index-1',
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => (
            <UserDetails
              showAvatar
              imageUrl={original.studentImageBase64}
              displayName={original.studentName}
              displayId={original.studentCode}
              size="xs"
            />
          ),
          Footer: '',
          footerClassName: 'text-white fw-bold',
        },
      ],
      rowSpan: 2,
    },
    ...dynamicColumns,
    {
      Header: 'Individual Project Details',
      accessor: 'studentDetails',
      columnClassName: 'text-center min-w-150px',
      disableSortBy: true,
      rowSpan: 2,
      columns: [
        {
          Header: 'Student Details',
          displayNone: true,
          accessor: 'studentDetailsAction',
          columnClassName: 'text-center min-w-150px',
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <button
                type="button"
                className="text-info cursor-pointer text-decoration-underline btn btn-sm btn-link"
                onClick={() => handleStudentDetailsModalOpen(original)}
                disabled={!original.isSelected}
              >
                Fill Student Details
              </button>
            );
          },
          Footer: '',
          footerClassName: 'text-center',
        },
      ],
    },
    {
      Header: 'Total',
      accessor: 'total',
      columnClassName: 'text-center',
      disableSortBy: true,
      Cell: ({ row }: any) => <TotalSelected row={row} />,
      footerClassName: 'text-center fw-bold',
    },
  ];
}

export function generateDynamicColumns(
  objectivesData: any[],
  handleHandSelectionChange: any,
) {
  return objectivesData
    .filter((category) => category.subCategories?.length)
    .map((category, categoryIndex) => ({
      Header: category.title,
      accessor: `category_${category.id ?? categoryIndex}`,
      columnClassName: 'text-center',
      disableSortBy: true,
      columns: (category.subCategories || []).map(
        (subCategory: any, subCategoryIndex: number) => ({
          Header: subCategory.title,
          accessor: `objective_${subCategory.id}_${categoryIndex}_${subCategoryIndex}`,
          columnClassName: 'text-center min-w-200px',
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => (
            <HandSelection
              studentId={original.studentId}
              objectiveId={subCategory.id}
              value={original[`objective_${subCategory.id}`] || 0}
              isEnabled={original.isSelected}
              onChange={handleHandSelectionChange}
            />
          ),
          Footer: '',
          footerClassName: 'text-center',
        }),
      ),
    }));
}

export const HandSelection = ({
  studentId,
  objectiveId,
  value = 0,
  isEnabled,
  onChange,
}: any) => {
  const isChecked = Number(value) > 0;

  const handleHandClick = () => {
    if (!isEnabled) return;

    onChange(studentId, objectiveId, isChecked ? 0 : 1);
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <button
        type="button"
        className="border-0 bg-transparent p-0"
        disabled={!isEnabled}
        onClick={handleHandClick}
        style={{
          cursor: isEnabled ? 'pointer' : 'not-allowed',
          opacity: isEnabled ? 1 : 0.5,
        }}
      >
        <img
          src={isChecked ? greenHand : grayHand}
          alt="hand"
          className="tw-w-7 tw-h-7"
        />
      </button>
    </div>
  );
};
export const TotalSelected = ({ row }: any) => {
  let total = 0;

  Object.keys(row.original).forEach((key) => {
    if (key.startsWith('objective_')) {
      total += Number(row.original[key]) || 0;
    }
  });

  return (
    <div className="text-center">
      <span className="ms-1">{total} Selected</span>
    </div>
  );
};
export function getTotalColumn() {
  return {
    Header: 'Total',
    accessor: 'total',
    columnClassName: 'text-center',
    disableSortBy: true,
    Cell: ({ row }: any) => <TotalSelected row={row} />,
    Footer: '',
    footerClassName: 'text-center fw-bold',
  };
}
