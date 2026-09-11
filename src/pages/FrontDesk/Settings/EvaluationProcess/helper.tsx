import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Classes",
            accessor: "classShortName",
            disableSortBy: true,
            // columnClassName:"w-30"
        },
        {
            Header: "Evaluation Process",
            accessor: "evaluationNames",
            disableSortBy: true,
            // columnClassName:"w-30"
        },
        {
            Header: "Created User",
            accessor: "userName",
            disableSortBy: true,
            // columnClassName:"w-10"
        },
        {
            Header: "Created Date",
            accessor: "createdDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return getDdMmYyyyWithMonthNameFormat(new Date(original?.createdDate));
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            // columnClassName:"w-10",
            Cell: ({ row: { original } }: any) => {
                return (
                    <MoreActions
                        actionOptions={actionsList}
                        rowId={original.id}
                        isHorizontal={true}
                    />
                );
            },
        },
    ];
}

export function renderValueProcess(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
      return (<div className="selected-container">
        {
          selectedItems.map((item, index) => {
            return (<div key={`item-${item?.id}`} className="selectedoption-item">
              <span>{item?.name}</span>
              <span data-id={item?.id} onClick={removeItemHandler} className="remove-icon">
                <i className="ri-close-line"></i>
              </span>
  
            </div>)
          })
        }
      </div>)
    }
  }
  
  export function renderOptionsProcess(item: any) {
    return `${item?.name}`;
  }