import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";

const formatDay = (day: string) =>
  day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "serialNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        const { index } = row;
        return <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>;
      },
    },
    {
      Header: "Working Days",
      accessor: "workingDays",
      disableSortBy: true,
      columnClassName: "w-400px min-w-400px max-w-400px",
      Cell: ({ row: { original } }: any) => (

        <div className="d-flex flex-wrap g-2 row-gap-2 column-gap-3">

          {original?.workingDays?.map((day: string, idx: number) => (
            <span
              key={idx}
              className="badge rounded-pill bg-light text-muted px-4 py-2 fs-12"

            >
              {formatDay(day)}
            </span>
          ))}
        </div>
      ),
    },
    {
      Header: "Periods",
      accessor: "periodDetails",
      disableSortBy: true,
      columnClassName: "w-450px min-w-450px max-w-450px",
      Cell: ({ row: { original } }: any) => {
        const sortedPeriods = [...(original?.periodDetails || [])].sort(
          (a, b) => a.startTime.localeCompare(b.startTime)
        );

        return (
          <div className="d-flex flex-wrap gap-2">
            {sortedPeriods.map((period: any) => (
              <span
                key={period.id}
                className={`badge rounded-pill px-3 py-2 d-flex align-items-center ${period.isBreak
                    ? "tw-bg-[#FFFBEB] tw-border tw-border-[#f59e0b] text-dark fs-12"
                    : "bg-white tw-border tw-border-[#64748b] text-muted fs-12"
                  }`}
              >
                {!period.isBreak && <i className="ri-time-line me-1"></i>}
                {period.isBreak ? "Break :" : period.periodNo}{" : "}
                {period?.startTime?.slice?.(0, 5) ?? "--:--"}–
                {period?.endTime?.slice?.(0, 5) ?? "--:--"}
              </span>

            ))}
          </div>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          />
        );
      },
    },
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