import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

function getClassList(options: (Array<any> | null)) {
    if (Array.isArray(options) && options.length > 0) {
        return (
            <div className="tw-flex tw-flex-wrap tw-gap-1">
                {options.map((item, index) => {
                    return (
                        <span key={`class-${index}-${item.id}`}>{item.classShortName}{((index !== (options.length - 1))) ? "," : ""}</span>
                    )
                })}
            </div>
        )
    } else {
        return (<span className="tw-text-gray-500">N/A</span>)
    }
}


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-max-w-[200px]",
        },
        {
            Header: "Classes",
            accessor: "classData",
            disableSortBy: true,
            columnClassName: "tw-w-[250px] tw-max-w-[250px]",
            Cell: ({ value }: any) => {
                return (
                    getClassList(value)
                );
            },
        },
        {
            Header: "Stream",
            accessor: "stream",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                if (original?.streamGroups.length > 0) {
                    let data = original?.streamGroups.map((item: any) => {
                        return (item.shortName)
                    })
                    return (
                        data.join(' , ')
                    );
                }
                else {
                    return "N/A"
                }
            },
        },
        {
            Header: "Subject",
            accessor: "subjectName",
            disableSortBy: true,
        },
        {
            Header: "Max Marks",
            accessor: "maxMarks",
            disableSortBy: true,
        },
        {
            Header: "Pass Marks",
            accessor: "passMarks",
            disableSortBy: true,
        },
        {
            Header: "Actions",
            filterable: false,
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

export function renderValueStream(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
      return (<div className="selected-container">
        {
          selectedItems.map((item, index) => {
            return (<div key={`item-${item?.streamId}`} className="selectedoption-item">
              <span>{item?.streamGroupName}</span>
              <span data-id={item?.streamId} onClick={removeItemHandler} className="remove-icon">
                <i className="ri-close-line"></i>
              </span>
  
            </div>)
          })
        }
      </div>)
    }
  }
  
  export function renderOptionsStream(item: any) {
    return `${item?.streamGroupName}`;
  }

export function renderValueClasses(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
      return (<div className="selected-container">
        {
          selectedItems.map((item, index) => {
            return (<div key={`item-${item?.id}`} className="selectedoption-item">
              <span>{item?.shortName}</span>
              <span data-id={item?.id} onClick={removeItemHandler} className="remove-icon">
                <i className="ri-close-line"></i>
              </span>
  
            </div>)
          })
        }
      </div>)
    }
  }
  
  export function renderOptionsClasses(item: any) {
    return `${item?.shortName}`;
  }