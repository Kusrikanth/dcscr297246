import {
  Sections,
} from "./subjectTeacherTypes";
import { MenuOptionHrtl } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";

function getSectionsLabel(options: Array<Sections> | null) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-1">
        {options.map((item, index) => {
          return (
            <span key={item.id} className="badge badge-soft-secondary">
              {item.sectionName}
            </span>
          );
        })}
      </div>
    );
  } else {
    return <span className="tw-text-blue-600 text">Add Branch</span>;
  }
}

// assign student table column
export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Subject",
      accessor: "subjectName",
    },
    {
      Header: "Language Name",
      accessor: "languageName",
      disableSortBy:true,
      columnClassName: "tw-text-center",
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy:true,
    },
    {
      Header: "Sections",
      filter: false,
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return getSectionsLabel(original.sectionsResponse);
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
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

export function renderValueSubjects(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (<div className="selected-container">
      {
        selectedItems.map((item, index) => {
          return (<div key={`item-${item?.sectionId}`} className="selectedoption-item">
            <span>{item?.sectionName}</span>
            <span data-id={item?.sectionId} onClick={removeItemHandler} className="remove-icon">
              <i className="ri-close-line"></i>
            </span>

          </div>)
        })
      }
    </div>)
  }
}

export function renderOptionsSubjects(item: any) {
  return `${item?.sectionName}`;
}

