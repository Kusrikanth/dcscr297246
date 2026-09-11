import { StatusLabel, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../Components/Common/MenuOptions";


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.studentName}
                            displayId={original?.studentCode}
                            size={"xs"}
                            defaultImgType="student"
                        //   contentNotCenter={true}
                        //   paddingTop={"pt-2"}
                        />
                    </>
                );
            },
        },
        {
            Header: "Curriculum Name",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Section",
            accessor: "sectionName",
            disableSortBy: true,
        },
        {
            Header: "Roll Number",
            accessor: "rollNo",
            disableSortBy: true,
        },
        {
            Header: "From Date",
            accessor: "fromDate",
            disableSortBy: true,
            columnClassName: 'tw-text-nowrap'
        },
        {
            Header: "To Date",
            accessor: "toDate",
            disableSortBy: true,
            columnClassName: 'tw-text-nowrap'
        },
        {
            Header: "Raised By",
            accessor: "raisedBy",
            disableSortBy: true,
        },
        {
            Header: "Leave Type",
            accessor: "leaveType",
            disableSortBy: true,
            Cell : ({ value }: any) => {
                const leaveTypes = [
                    {
                        id: "SICK",
                        leaveType: "SICK",
                        badgeClass: "badge-soft-danger"
                    },
                    {
                        id: "MEDICAL_LEAVE",
                        leaveType: "MEDICAL LEAVE",
                        badgeClass: "badge-soft-info"
                    },
                    {
                        id: "VACATION",
                        leaveType: "VACATION",
                        badgeClass: "badge-soft-success"
                    },
                    {
                        id: "PERSONAL",
                        leaveType: "PERSONAL",
                        badgeClass: "badge-soft-primary"
                    },
                    {
                        id: "CASUAL",
                        leaveType: "CASUAL",
                        badgeClass: "badge-soft-warning"
                    },
                    {
                        id: "OTHERS",
                        leaveType: "OTHERS",
                        badgeClass: "badge-soft-secondary"
                    }
                ];

                const leaveTypeItem = leaveTypes.find(leaveItem => leaveItem.id === value);
                return (
                    <span className={`badge ${leaveTypeItem?.badgeClass}`} key={value}>
                        {leaveTypeItem?.leaveType}
                    </span>
                )
            }
        },
        {
            Header: "Reason",
            accessor: "reason",
            disableSortBy: true,
        },
        {
            Header: "Approval Status",
            accessor: "approvalStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                  <StatusLabel
                    type={original.approvalStatus}
                    labelName={original.approvalStatus}
                  />
                );
              },
        },   
        {
            Header: "Approval Remarks",
            accessor: "approvalRemarks",
            disableSortBy: true,
        },
        {
            Header: "Document",
            accessor: "document",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                if (!value?.s3URL) {
                    return "-";
                }
                return (
                    <a target="_blank" className="text-info tw-underline" href={value?.s3URL}>Link</a>
                );
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const updatedAction = actionsList.filter((action: any) => {                    
                    if (original.approvalStatus === 'APPROVED') {
                            return action.actionName === 'Edit' || action.actionName === 'Cancel';
                    } 
                    else if( original.approvalStatus === 'PENDING') {
                            return action.actionName === 'Edit'  || action.actionName === 'Approve' || action.actionName === 'Reject' || action.actionName === 'Cancel';
                    }
                  });
                return (
                updatedAction.length > 0 && <MoreActions actionOptions={updatedAction} rowId={original.id} isHorizontal={true} />
                );
            },
        },
    ];
}

export const leaveTypes = [
        {
            id: "SICK",
            leaveType: "Sick",
        },
        {
            id: "MEDICAL_LEAVE",
            leaveType: "Medical Leave",
        },
        {
            id: "VACATION",
            leaveType: "Vacation",
        },
        {
            id: "PERSONAL",
            leaveType: "Personal",
        },
        {
            id: "CASUAL",
            leaveType: "Casual",
        },
        {
            id: "OTHERS",
            leaveType: "Others",
        }
]

export const approvalStatus = [
    {
        id: "PENDING",
        approvalStatus: "Pending",
    },
    {
        id: "APPROVED",
        approvalStatus: "Approved",
    },
    {
        id: "REJECTED",
        approvalStatus: "Rejected",
    },
    {
        id: "CANCELLED",
        approvalStatus: "Cancelled",
    },
]   

export const raisedByValues = [
    {
        id: "PARENT",
        raisedBy: "PARENT",
    },
    {
        id: "STUDENT",
        raisedBy: "STUDENT",
    },
    {
        id: "ADMIN",
        raisedBy: "ADMIN",
    },
    {
        id: "EMPLOYEE",
        raisedBy: "EMPLOYEE",
    },
]

export function getRaisedByKey(raisedBy: string){
    if (raisedBy === 'PARENT_ROLE') {
        return 'PARENT'
    } else if (raisedBy === 'TEACHER') {
        return 'EMPLOYEE';
    } else {
        return 'ADMIN'
    }
}