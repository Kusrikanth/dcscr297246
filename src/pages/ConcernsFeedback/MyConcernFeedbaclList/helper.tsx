import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl, UserDetails, AvatarGroupUpdated } from "../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";
import { useHistory } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons-pro/core-stroke-standard";

export function getAssigneesName(options: (Array<any> | null)) {
    if (Array.isArray(options) && options.length > 0) {
      return (
        <div className="tw-flex tw-flex-wrap tw-gap-1">
          {options.map((item, index) => {
            return (
              <span key={item.assigneeIds} title={item?.employeeName} className="badge text-uppercase bg-light text-muted p-2">{item.employeeName}</span>
            )
          })}
        </div>
      )
    } else {
      return (<span className="tw-text-blue-600 text">N/A</span>)
    }
  }

export function generateColumns(actionsList: Array<IOptionsHrtl>,toggleViewDetailsModal:any,toggleEmployeeDetailModal:any, academicYearId?:any, redirectViewHndlr?:any, redirectIconViewHndlr?:any) {
    return ([
        {
            Header: "Complaint No.",
            accessor: "complaintNo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const history = useHistory()
                return (
                <div className="tw-flex tw-items-center tw-gap-1">
                    <div onClick={(e: any) => redirectViewHndlr(original?.complaintId, e)} 
                    className="text-decoration-underline" style={{ color: "#1492E6", cursor: "pointer" }}>{original?.complaintNo || "-"}</div>
                    <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        className="tw-flex-shrink-0 tw-text-[#1492E6] tw-cursor-pointer"
                        size={16}
                        onClick={(e: any) => redirectIconViewHndlr(original?.complaintId, e)}
                    />
                </div>
                )
            }
        },
        {
            Header: "Owner",
            accessor: "owner",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] tw-text-wrap",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            // imageUrl={original?.studentName?.imgUrl}
                            defaultImgType="employee"
                            size="xs"
                            displayName={original?.complaintFirstName}
                            displayId={original?.complaintUserName}
                        />
                    </>
                );
            },
        },
        {
            Header: "Subject",
            accessor: "complaintSubject",
            disableSortBy: true,
            columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                      <span className="tw-text-wrap">{ original?.complaintSubject || "-"}</span>
                    </>
                );
            },
        },
        // {
        //     Header: "File Name",
        //     accessor: "fileName",
        //     disableSortBy: true,
        // },
        {
            Header: "Dept To",
            accessor: "departmentName",
            disableSortBy: true,
        },
        {
            Header: "Date",
            accessor: "createdDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.createdDate ? getDdMmYyyyFormat(new Date(original?.createdDate)) : "-";
              },
        },
        {
            Header: "Priority",
            accessor: "priority",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                const priority = value || "";
                return (
                    <StatusLabel type={priority} labelName={priority} />
                );
            },
        },
      
        {
            Header: "Assigned Date",
            accessor: "assignedDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.assignedDate ? getDdMmYyyyFormat(new Date(original?.assignedDate)) : "-";
              },
        },
        {
            Header: "Complaint Status",
            accessor: "complaintStatus",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                const status = value || "";
                return (
                    <StatusLabel type={status} labelName={status} />
                );
            },
        },
        // {
        //     Header: "Comments(for User)",
        //     accessor: "comments",
        //     disableSortBy: true,
        // },
        {
            Header: "Closing Date",
            accessor: "closedDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.closedDate ? getDdMmYyyyFormat(new Date(original?.closedDate)) : "-";
              },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const updatedAction = actionsList.map((item: any) => {
                    if (item?.id === "reopen" && original?.complaintStatus?.toLowerCase() !== "closed") {
                        return null;
                    }
                    if (item?.id === "view" && original?.complaintStatus?.toLowerCase() === "closed") {
                        return null;
                    }
                    return item;
                }).filter(f => f)
                return (
                    <MoreActions isHorizontal={true} actionOptions={updatedAction || []} rowId={original?.complaintId} />
                );
            },
        },
    ])
}

export function getEmployeeDetailColumn(){
    return ([
        {
            Header: "Employee Name",
            accessor: "employeeName",
            disableSortBy: true,
        },
        {
            Header: "Employee Code",
            accessor: "employeeCode",
            disableSortBy: true,
        },
    ])
}


export const statusFilter = [
    {
        id: "OPEN",
        name: "OPEN"
    },
    {
        id: "INPROGRESS",
        name: "INPROGRESS"
    },
    {
        id: "CLOSED",
        name: "CLOSED"
    },
    {
        id: "ON_HOLD",
        name: "ON HOLD"
    },
    {
        id: "BLOCKED",
        name: "BLOCKED"
    },
]
export const priorityFilter = [
    {
        id: "LOW",
        name: "LOW"
    },
    {
        id: "MEDIUM",
        name: "MEDIUM"
    },
    {
        id: "HIGH",
        name: "HIGH"
    },
    {
        id: "CRITICAL",
        name: "CRITICAL"
    },
]

export const AdmissionTypeMenuOptions = [
    {
        id: "Residential",
        value: "Residential"
    },
    {
        id: "Non-Residential",
        value: "Non-Residential"
    },

]

export const studentTypeMenuOptions = [
    {
        id: "NEW_ADMISSION",
        value: "NEW ADMISSION"
    },
    {
        id: "OLD_ADMISSION",
        value: "OLD ADMISSION"
    },

]

export const complaintUserTypeOptions = [
    {
        id: "EMPLOYEE",
        name: "EMPLOYEE"
    },
    {
        id: "STUDENT",
        name: "STUDENT",
    },
    {
        id: "PARENT",
        name: "PARENT",
    }
]

export const accessRoles = ["STUDENT","PARENT","EMPLOYEE","TEACHER"]

export function hasStateChanged(newState: any) {
    let count: any = 0;
    let showState: boolean = false;
    for (const key in newState) {
        const newValue = newState[key];
        if (newValue) {
            if(!(key === "category")){
                showState = true;
            }
            if (!(key === "searchString" || key === "academicYearId" || key === "status" || key === "selectedEmployee" || key === "category"))
                count += 1;
        }
    }
    if (count > 0) { return { stateChange: showState, count: count } }
    else { return { stateChange: showState, count: count } }
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
    return `${item?.employeeName} - ${item?.employeeCode}`;
  }

  export function renderOptionsDepartment(item: any) {
    return `${item?.departmentName} - ${item?.category?.split("_")?.join(" ")}`;
  }
  
  export function renderValueDepartment(selectedItems: any) {
    return `${selectedItems?.departmentName} - ${selectedItems?.category?.split("_")?.join(" ")}`;
  }
