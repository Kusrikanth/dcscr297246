import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import {  AvatarGroupUpdated, MenuOptionHrtl, UserDetails } from "../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>,toggleEmployeeDetailModal:any) {
    return ([
        {
            Header: "Employee Category",
            accessor: "category",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    original?.category?.split("_")?.join(' ')
                );
            },
        },
        {
            Header: "Department",
            accessor: "departmentName",
            disableSortBy: true,
        },
        {
            Header: "Display Order",
            accessor: "displayOrder",
            disableSortBy: true,
        },
        {
            Header: "Count of Complaints",
            accessor: "countOfComplaints",
            disableSortBy: true,
        },
        {
            Header: "ShortName",
            accessor: "shortName",
            disableSortBy: true,
        },
        {
            Header: "Employee",
            accessor: "departmentHeadName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {

                return !(original?.headsDtos?.length > 0) ? (
                    <>-</>
                ) : (
                    <>
                        {original?.headsDtos?.length === 1 ? <>
                            <UserDetails
                                displayName={original?.headsDtos[0]?.departmentHeadName}
                                displayId={original?.headsDtos[0]?.departmentHeadCode}
                                showAvatar={false}
                            />
                        </> :
                            <AvatarGroupUpdated
                                avatars={original?.headsDtos || []}
                                imageKey="employeeImage"
                                tooltipKey="departmentHeadName"
                                numberOfAvatarToShow={3}
                                dataId={original?.id}
                                showLimitedAvatar={true}
                                showAvatarName={true}
                                uniqueAvatarKey="id"
                                onClickMoreAvatarHndlr={(event: any) => toggleEmployeeDetailModal(original?.headsDtos)}
                            />}

                    </>
                )
            },
        },
        // {
        //     Header: "Designation",
        //     accessor: "departmentHeadDesignation",
        //     disableSortBy: true,
            
        // },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original?.id} />
                );
            },
        },
    ])
}

export function renderValueEmployee(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
      return (<div className="selected-container">
        {
          selectedItems.map((item, index) => {
            return (<div key={`item-${item?.id}`} className="selectedoption-item">
              <span>{item?.employeeName}</span>
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
    return (
        <div>
            <div>{`${item?.employeeName}`}</div>
            <div className="text-muted fs-13px">{`${item?.employeeCode} | ${item?.departmentName} | ${item?.branchName}`}</div>
        </div>
    );
  }

  export function getEmployeeDetailColumn() {
    return ([
        {
            Header: "Employee Name",
            accessor: "departmentHeadName",
            disableSortBy: true,
        },
        {
            Header: "Employee Code",
            accessor: "departmentHeadCode",
            disableSortBy: true,
        },
    ])
}
