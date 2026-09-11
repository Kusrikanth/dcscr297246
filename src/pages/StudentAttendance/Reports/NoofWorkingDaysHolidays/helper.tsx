import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../../utility/dateutility";

export function generateColumns() {
    return [
{
  id: "expander",
  Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
    <span
      {...getToggleAllRowsExpandedProps()}
      className={`expander-btn fs-18 fw-normal ${
        isAllRowsExpanded ? "bg-danger" : "bg-success"
      }`}
    >
      {isAllRowsExpanded ? "-" : "+"}
    </span>
  ),
  accessor: "expander",
  disableSortBy: true,
  Cell: ({ row }: any) =>
    row.canExpand ? (
      <span
        {...row.getToggleRowExpandedProps({
          style: {
            paddingLeft: `${row.depth * 2}rem`,
          },
        })}
        className={`expander-btn fs-18 ${
          row.isExpanded ? "bg-danger" : "bg-success"
        }`}
      >
        {row.isExpanded ? "-" : "+"}
      </span>
    ) : null,
},
     {
  Header: "Curriculum",
  accessor: "curriculumName",
  disableSortBy: true,
  Cell: ({ row }: any) => {
    return row.depth === 0
      ? row.original.curriculumName
      : "";
  },
},
{
  Header: "Class",
  accessor: "className",
  disableSortBy: true,
  Cell: ({ row }: any) => {
    return row.depth === 1
      ? row.original.className
      : "";
  },
},
{
  Header: "Section",
  accessor: "sectionName",
  disableSortBy: true,
  Cell: ({ row }: any) => {
    return row.depth === 2
      ? row.original.sectionName
      : "";
  },
},
{
  Header: "Working Days",
  accessor: "totalWorkingDays",
  disableSortBy: true,
  Cell: ({ row }: any) => {
    return row.original.totalWorkingDays || 0;
  },
},
{
  Header: "Holidays",
  accessor: "totalHolidays",
  disableSortBy: true,
  Cell: ({ row }: any) => {
    return row.original.totalHolidays || 0;
  },
},
    ];
}


export function renderValueStudent(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (
      <div className="selected-container">
        {selectedItems.map((item) => (
          <div key={`item-${item?.sectionId}`} className="selectedoption-item">
            <span>{item?.shortName}</span>
            <span
              data-id={item?.id}
              onClick={removeItemHandler}
              className="remove-icon"
            >
              <i className="ri-close-line"></i>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function renderOptionsStudent(item: any) {
  return item?.shortName;
}