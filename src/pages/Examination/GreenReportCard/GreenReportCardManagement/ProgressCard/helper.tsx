import { InputCheckbox, UserDetails } from '../../../../../Components/Common';
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from '../../../../../Components/Common/MenuOptions';

export const generationType = [
  {
    id: 'term',
    name: 'Term',
  },
];

export function generateColumns(
  allStudentCheckHndlr: any,
  singleStudentCheckHndlr: any,
  allStudentSelectedState: any,
  actionsList: Array<IOptionsHrtl>,
  isEarlyYearsManagement: any,
) {
  return [
    {
      Header: () => (
        <InputCheckbox
          name={'all-student'}
          value={allStudentSelectedState}
          onChange={allStudentCheckHndlr}
          formgroupClassName="mb-0"
        />
      ),
      accessor: 'id',
      columnClassName: 'w-5 sticky-left z-index-1',
      disableSortBy: true,
      Cell: ({ row: { original } }) => {
        const { studentId, isSelected, progressCardStatus } = original;
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
    },
    {
      Header: 'Student Name',
      accessor: 'studentName',
      thClass: 'w-15',
      disableSortBy: true,
      Cell: ({ row: { original } }) => (
        <UserDetails
          displayName={original?.studentName || '-'}
          displayId={original?.studentCode || '-'}
          imageUrl={original?.studentThumbImageUrl}
          size={'xs'}
          defaultImgType="student"
        />
      ),
    },
    {
      Header: 'Roll No.',
      accessor: 'rollNo',
      disableSortBy: true,
    },
    {
      Header: 'Class',
      accessor: 'branchClassName',
      disableSortBy: true,
    },
    {
      Header: 'Section',
      accessor: 'sectionName',
      disableSortBy: true,
    },
    {
      Header: 'Actions',
      disableSortBy: true,
      Cell: ({ row: { original } }) => {
        const { progressCardStatus, studentId, systemFileId } = original;
        const actionIds =
          progressCardStatus === 'INPROGRESS' || progressCardStatus === null
            ? ['space-left', 'generate', 'space-right']
            : ['regenerate', 'preview', 'download'];
        const actionOptions = isEarlyYearsManagement
          ? (actionsList ?? [])
              .filter((action) => actionIds.includes(action.id))
              .map((action) => ({
                ...action,
                onClickHndlr: (event: any) => {
                  event.currentTarget?.setAttribute(
                    'data-studentId',
                    studentId?.toString() || '',
                  );
                  event.currentTarget?.setAttribute(
                    'data-systemFileId',
                    systemFileId?.toString() || '',
                  );
                  action.onClickHndlr(event);
                },
              }))
          : actionsList;
        return actionOptions.length ? (
          <MenuOptionHrtl actionOptions={actionOptions} rowId={studentId} />
        ) : null;
      },
    },
  ];
}

export const filterOptions = [
  { id: 'ONLY_MARKS', name: 'Marks', itemDisabled: false },
  { id: 'ONLY_GRADES', name: 'Grades', itemDisabled: false },
];
