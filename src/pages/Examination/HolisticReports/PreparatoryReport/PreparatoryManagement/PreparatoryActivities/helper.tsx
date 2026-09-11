import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../../Components/Common/MenuOptions";
import { getDateWithTimeFormat } from "../../../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>,  showInstituteAdminUI: boolean) {
  return [
    {
      Header: "S.No",
      accessor: "sNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return <span>{row.index + 1}</span>;
      },
    },
    {
      Header: "Title",
      accessor: "title",
      disableSortBy: true,
    },
     ...(showInstituteAdminUI
      ? [
          {
            Header: "Branch",
            accessor: "branchName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
              <span>{original.branchName}</span>
            ),
          },
        ]
      : []),
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    }, {
      Header: "Classes",
      accessor: "classes",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const classBadges = original?.classes?.map(
          (cls: { classShortName: string; className: string; classId: number }) => (
            <span
              key={cls.classId}
              className="badge text-uppercase bg-light text-muted p-2 me-1 mb-2"
            >
              {cls.classShortName || cls.className}
            </span>
          )
        );

        return classBadges?.length > 0 ? (
          <>{classBadges}</>
        ) : (
          <span className="ms-2">-</span>
        );
      },
    },
    {
      Header: "Created Date",
      accessor: "createdAt",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          getDateWithTimeFormat(original?.createdAt ? `${original?.createdAt}Z` : '')
        )
      }
    },
    {
      Header: "Domain",
      accessor: "domainName",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const filteredActions = showInstituteAdminUI
          ? actionsList 
          : actionsList.filter((a: any) => a.id !== "copy");

        return (
          <MenuOptionHrtl
            actionOptions={filteredActions}
            rowId={original.id}
          />
        );
      },
    },
  ];
}


export function renderValueSection(
  selectedItems: any,
  removeItemHandler: any,
  isDisabled: boolean
) {
  if (Array.isArray(selectedItems)) {
    return (
      <div className="selected-container">
        {selectedItems.map((item) => (
          <div key={`item-${item?.branchId}`} className="selectedoption-item">
            <span>{item?.branchName}</span>
            <span
              data-id={item?.branchId}
              onClick={!isDisabled ? removeItemHandler : undefined} 
              className={`remove-icon ${isDisabled ? "disabled" : ""}`}
              style={{ cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.5 : 1 }}
            >
              <i className="ri-close-line"></i>
            </span>
          </div>
        ))}
      </div>
    );
  }
}

export function renderValueInstitute(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (<div className="selected-container">
      {
        selectedItems.map((item, index) => {
          return (<div key={`item-${item?.id}`} className="selectedoption-item">
            <span>{item?.instituteName}</span>
            <span data-id={item?.id} onClick={removeItemHandler} className="remove-icon">
              <i className="ri-close-line"></i>
            </span>

          </div>)
        })
      }
    </div>)
  }
}
export function renderOptionsEmployee(item: any) {
  return `${item?.branchId} - ${item?.branchName}`;
}
export function renderOptionsInstitute(item: any) {
  return `${item?.instituteName}`;
}

export function renderValueClass(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (
      <div className="selected-container">
        {selectedItems.map((item) => {
          return (
            <div key={`item-${item?.classSequence}`} className="selectedoption-item">
              <span>{item?.className}</span>
              <span data-id={item?.classSequence} onClick={removeItemHandler} className="remove-icon">
                <i className="ri-close-line"></i>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

export function renderOptionsClass(item: any) {
  return <p className="mb-0">{item?.className}</p>;
}
export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "branchId"];