import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";

const formatDay = (day: string) =>
  day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

export function generateColumns(actionList: Array<IOptionsHrtl>,) {
  return [
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Min Units",
      accessor: "minUnits",
      disableSortBy: true,
    },
    {
      Header: "Min Chapters",
      accessor: "minChapters",
      disableSortBy: true,
    },
    {
      Header: "Min Topics",
      accessor: "minTopics",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    }
  ];
}

export function renderValueWorkingDays(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (<div className="selected-container">
      {
        selectedItems.map((item, index) => {
          return (<div key={`item-${item?.id}`} className="selectedoption-item">
            <span>{item?.label}</span>
            <span data-id={item?.id} onClick={removeItemHandler} className="remove-icon">
              <i className="ri-close-line"></i>
            </span>

          </div>)
        })
      }
    </div>)
  }
}

export function renderOptionsWorkingDays(item: any) {
  return item?.label;
}

export const WORKING_DAYS_OPTIONS = [
  { id: "MON", label: "Mon" },
  { id: "TUE", label: "Tue" },
  { id: "WED", label: "Wed" },
  { id: "THU", label: "Thu" },
  { id: "FRI", label: "Fri" },
  { id: "SAT", label: "Sat" },
  { id: "SUN", label: "Sun" },
];