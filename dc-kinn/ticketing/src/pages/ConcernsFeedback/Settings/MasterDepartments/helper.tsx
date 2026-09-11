import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { default as CorrectIcon } from "../../../../assets/imagesdps/common_icon/correct_icon.svg?react";
import { default as WrongIcon } from "../../../../assets/imagesdps/common_icon/wrong_icon.svg?react";


export const generateColumns = (actionList: Array<IOptionsHrtl>, showInstituteAdminUI: boolean, paginationDetailRef: any) => {
    const columns: any[] = [
        {
            Header: "S.No",
            thClass: "w-15",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }: any) => {
                const { pageNo, pageSize } = paginationDetailRef.current;
                return pageNo * pageSize + row.index + 1;
            },
        },
        {
            Header: "Department Name",
            accessor: "departmentName",
        },
    ];
    if (showInstituteAdminUI) {
        columns.push(
            {
                Header: "Branch Name",
                accessor: "branchNames",
                Cell: ({ row: { original } }: any) => (
                    <span className="tw-text-wrap">
                        {(Array.isArray(original.branchNames)
                            ? original.branchNames
                            : []
                        ).join(", ")}
                    </span>
                ),
            },
            {
                Header: "Display Parent",
                accessor: "isDisplayParent",
                disableSortBy: true,
                Cell: ({ value }: any) => (
                    <span>
                        {value ? (
                            <CorrectIcon style={{ width: "15px" }} />
                        ) : (
                            <WrongIcon style={{ width: "13px" }} />
                        )}
                    </span>
                ),
            },
            {
                Header: "Display Employee",
                accessor: "isDisplayEmployee",
                disableSortBy: true,
                Cell: ({ value }: any) => (
                    <span>
                        {value ? (
                            <CorrectIcon style={{ width: "15px" }} />
                        ) : (
                            <WrongIcon style={{ width: "13px" }} />
                        )}
                    </span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => (
                    <MenuOptionHrtl
                        actionOptions={actionList}
                        rowId={original.id}
                    />
                ),
            }
        );
    }
    return columns;
};

export function renderValueStaff(selectedItems: any[], removeItemHandler: any, isEditMode: boolean) {
  if (!Array.isArray(selectedItems)) return null;
  return (
    <div className="selected-container">
      {selectedItems.map((item) => {
        const hideRemove =
          isEditMode && item.isPrefilled === true;

        return (
          <div
            key={`item-${item?.branchId}`}
            className="selectedoption-item"
          >
            <span>{item?.branchName}</span>

            {!hideRemove && (
              <span
                data-id={item?.branchId}
                onClick={removeItemHandler}
                className="remove-icon"
              >
                <i className="ri-close-line"></i>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

 export function renderOptionsEmployee(item: any) {
    return `${item?.branchName}`;
  }