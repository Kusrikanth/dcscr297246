import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl, UserDetails, AvatarGroupUpdated } from "../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";
import { useHistory } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, CircleArrowUpRightIcon } from "@hugeicons-pro/core-stroke-standard";

export function getAssigneesName(options: (Array<any> | null)) {
    if (Array.isArray(options) && options.length > 0) {
        return (
            <div className="tw-flex tw-flex-wrap tw-gap-1">
                {options.map((item, index) => {
                    return (
                        <span
                            key={item.assigneeIds}
                            title={item?.employeeName}
                            className="tw-inline-block tw-uppercase tw-bg-gray-100 tw-text-gray-600 tw-px-2 tw-py-1 tw-rounded tw-text-xs"
                        >
                            {item.employeeName}
                        </span>
                    )
                })}
            </div>
        )
    } else {
        return (<span className="tw-text-info">N/A</span>)
    }
}

export function generateColumns(actionsList: Array<IOptionsHrtl>,
    redirectViewHndlr: any, redirectIconViewHndlr: any, toggleEmployeeDetailModal: any, userMeResp: any, pathName: string) {
    return ([
        {
            Header: "Complaint No.",
            accessor: "complaintNo",
            disableSortBy: true,
            columnClassName: "tw-sticky tw-left-0 tw-min-w-[150px] tw-w-[150px] tw-max-w-[150px] tw-bg-white tw-z-10",
            Cell: ({ row: { original } }: any) => {
                const history = useHistory()
                return (
                <>
                <div className="tw-flex tw-items-center tw-gap-1">
                    <div onClick={(e: any) => redirectViewHndlr(original?.complaintId, e)} className="tw-underline" style={{ color: "#1492E6", cursor: "pointer" }}>{original?.complaintNo || "-"}</div>
                    <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        className="flex-shrink-0 tw-text-[#1492E6] tw-cursor-pointer"
                        size={16}
                        onClick={(e: any) => redirectIconViewHndlr(original?.complaintId, e)}
                    />
                </div>
                </>
            )
            }
        },
        {
            Header: "Branch",
            accessor: "branchName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <div>
                            <div className="">{`${original?.branchName}`}</div>
                            <div className="text-muted fs-12">{`${original?.instituteName}`}</div>
                        </div>
                    </>
                );
            },
          },
        {
            Header: "Owner",
            accessor: "owner",
            disableSortBy: true,
            columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px] tw-text-wrap",
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
                        <span className="text-wrap">{original?.complaintSubject || "-"}</span>
                    </>
                );
            },
        },
        {
            Header: "Module",
            accessor: "moduleName",
            disableSortBy: true,
        },
        {
            Header: "Request Type",
            accessor: "requestType",
            disableSortBy: true,
        },
        {
            Header: "Dept To",
            accessor: "departmentName",
            disableSortBy: true,
        },
        {
            Header: "Source",
            accessor: "source",
            disableSortBy: true,
        },
        {
            Header: "Date",
            accessor: "createdDate",
            disableSortBy: true,
            columnClassName: "tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px]",
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
            Header: "Assigned To",
            accessor: "assignee",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {

                return !(original?.assignee?.length > 0) ? (
                    <>-</>
                ) : (
                    <>
                        {/* <div> {getAssigneesName(original?.assignee)}</div> */}
                        {original?.assignee?.length === 1 ? <>
                            <UserDetails
                                displayName={original?.assignee[0]?.employeeName}
                                displayId={original?.assignee[0]?.employeeCode}
                                showAvatar={false}
                            />
                        </> :
                            <AvatarGroupUpdated
                                avatars={original?.assignee || []}
                                imageKey="employeeImage"
                                tooltipKey="employeeName"
                                numberOfAvatarToShow={3}
                                dataId={original?.assigneeIds}
                                showLimitedAvatar={true}
                                showAvatarName={true}
                                uniqueAvatarKey="assigneeIds"
                                onClickMoreAvatarHndlr={(event: any) => toggleEmployeeDetailModal(original?.assignee)}
                            />}

                    </>
                )
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
            Header: "Target Date",
            accessor: "targetDate",
            disableSortBy: true,
            columnClassName: "tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
            Cell: ({ row: { original } }: any) => {
                return original?.targetDate ? getDdMmYyyyFormat(new Date(original?.targetDate)) : "-";
            },
        },
        {
            Header: "Complaint Status",
            accessor: "status",
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
                        if (item?.id === "reopen" && original?.status?.toLowerCase() !== "closed") {
                            return null;
                        }
                        if (item?.id === "view" && original?.status?.toLowerCase() === "closed") {
                            return null;
                        }
                        return item;
                    }).filter(f => f)
                return (
                    updatedAction.length > 0 && <MoreActions isHorizontal={true} actionOptions={updatedAction || []} rowId={original?.complaintId} />
                );
            },
        },
    ])
}

export function getEmployeeDetailColumn() {
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

export const accessRoles = ["STUDENT", "PARENT", "EMPLOYEE", "ADM_CONS", "ADM_HEAD",
    "TRANSPORT_HEAD", "ACCOUNT_HEAD", "ACCOUNT", "TRANSPORT", "PRINCIPAL",
    "VICE_PRINCIPAL", "PA", "HR", "HR_HEAD", "TEACHER",
    "MEDICAL", "LIBRARY"];


export function hasStateChanged(newState: any) {
    let count: any = 0;
    let showState: boolean = false;
    for (const key in newState) {
        const newValue = newState[key];
        if (newValue) {
            if (!(key === "category" || key === "complaintUser")) {
                showState = true;
            }
            if (!(key === "searchString" || key === "academicYearId" || key === "status" || key === "selectedEmployee" || key === "category" || key === "complaintUser" || key === "startDate"))
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
    return (
        <div>
            <div>{`${item?.employeeName}`}</div>
            <div className="text-muted fs-13px">{`${item?.employeeCode} | ${item?.departmentName} | ${item?.branchName}`}</div>
        </div>
    );
}

export function renderOptionsDepartment(item: any) {
    return `${item?.departmentName}`;
}

export function renderValueDepartment(selectedItems: any) {
    return `${selectedItems?.departmentName}`;
}


export const dateType = [
    {
        id: "CLOSED_DATE",
        name: "Closed Date"
    },
    {
        id: "ASSIGNED_DATE",
        name: "Assigned Date"
    },
    {
        id: "CREATED_DATE",
        name: "Created Date"
    },
    {
        id: "TARGET_DATE",
        name: "Target Date"
    },
]