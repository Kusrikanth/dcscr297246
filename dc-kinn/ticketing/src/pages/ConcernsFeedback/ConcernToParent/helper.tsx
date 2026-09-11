import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { StatusLabel, UserDetails } from "../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";
import { useHistory } from "react-router-dom";

export function getAssigneesName(options: (Array<any> | null)) {
    if (Array.isArray(options) && options.length > 0) {
        return (
            <div className="tw-flex tw-flex-wrap tw-gap-1">
                {options.map((item, index) => {
                    return (
                        <span key={item.assigneeIds} title={item?.employeeName} className="badge tw-uppercase bg-light tw-text-gray-600 tw-p-2">{item.employeeName}</span>
                    )
                })}
            </div>
        )
    } else {
        return (<span className="text-info text">N/A</span>)
    }
}

export function generateColumns(actionsList: Array<IOptionsHrtl>, loggedInUserRole: any) {
    return ([
        {
            Header: "Complaint No.",
            accessor: "complaintNumber",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const history = useHistory()
                return <div onClick={() => {
                    if(loggedInUserRole !== "PARENT_ROLE"){
                        history.push(`/concerns-to-parent/view-concern-to-parent`, { complaintId: original?.complaintId  });
                    }else{
                        history.push(`/concerns-from-school/view-concern-from-school`, { complaintId: original?.complaintId  });
                    }
                }} className="text-decoration-underline text-info cursor-pointer">{original?.complaintNumber || "-"}</div>
            }
        },
        {
            Header: "Owner",
            accessor: "owner",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] tw-break-words",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.complaintByName}
                            displayId={original?.complaintByCode}
                            showAvatar={false}
                        />
                    </>
                );
            },
        },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] tw-break-words",
            Cell: ({ row: { original } }: any) => {
                let student: any = {};
                if (Array.isArray(original?.studentDetails) && original?.studentDetails.length > 0) {
                    student = original?.studentDetails[0]
                }
                return (
                    <>
                        <UserDetails
                            displayName={student?.studentName}
                            displayId={student?.studentCode}
                            showAvatar={false}
                        />
                    </>
                );
            },
        },
        {
            Header: "Subject",
            accessor: "subject",
            disableSortBy: true,
            columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <span className="tw-text-wrap">{original?.subject || "-"}</span>
                    </>
                );
            },
        },
        {
            Header: "Dept To",
            accessor: "complaintToDepartmentName",
            disableSortBy: true,
        },
        {
            Header: "Date",
            accessor: "complaintDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.complaintDate ? getDdMmYyyyFormat(new Date(original?.complaintDate)) : "-";
            },
        },
        {
            Header: "Email",
            accessor: "email",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] tw-break-words",
            Cell: ({ row: { original } }: any) => {
                let student: any = {};
                if (Array.isArray(original?.studentDetails) && original?.studentDetails.length > 0) {
                    student = original?.studentDetails[0]
                }
                return (
                    <>
                        <UserDetails
                            displayName={student?.fatherName}
                            displayId={student?.email}
                            showAvatar={false}
                        />
                    </>
                );
            },
        },
        {
            Header: "Phone No.",
            accessor: "mobileNo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                let student: any = {};
                if (Array.isArray(original?.studentDetails) && original?.studentDetails.length > 0) {
                    student = original?.studentDetails[0]
                }
                return student?.phoneNo
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
    {
        id: "REOPEN",
        name: "REOPEN"
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
    return `${item?.departmentName}`;
}

export function renderValueDepartment(selectedItems: any) {
    return `${selectedItems?.departmentName}`;
}
