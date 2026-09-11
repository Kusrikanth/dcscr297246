import React from 'react';
import { MenuOptionHrtl, StatusLabel, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { getDateWithTimeFormat } from "../../../utility/dateutility";
import { cardStatData } from '../../UpdatedDashboard/FeeSummaryStatsList/helper';
import {
    CheckmarkBadge03Icon,
    EyeIcon,
    PieChartIcon,
    SentIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { StatusLabelWithStepper } from './StatusLabelWithStepper';

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Title",
            accessor: "title",
            disableSortBy: true,
        },
        {
            Header: "Publisher",
            accessor: "publisherName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.userName || "-"}
                            displayId={original?.userCode || "-"}
                            showAvatar={false}
                        />
                    </>
                );
            },
        },
        {
            Header: "Send To",
            accessor: "sendTo",
            disableSortBy: true,
            columnClassName: "w-200px min-w-200px",
            Cell: ({ row: { index: rowIndex, original } }: any) => {
                const { parentDetails, staffDetails } = original || {};
                const senderList: any = [];
                if (!!parentDetails) {
                    senderList.push('Parents');
                }
                if (!!staffDetails) {
                    senderList.push('Employee')
                }
                if (!Array.isArray(senderList)) {
                    return "-";
                }
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>{senderList.map((item, index) => (<div key={`${rowIndex}-${index}`} className="d-flex flex-wrap gap-1">
                        <span className="badge bg-light text-muted text-uppercase px-2 py-1">{item}</span>
                    </div>))}</div>
                )
            },
        },
        {
            Header: "Trigger Date",
            accessor: "triggerDate",
            disableSortBy: true,
            columnClassName: "text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return getDateWithTimeFormat(original?.triggerDate ? `${original?.triggerDate}Z` : '');
            },
        },
        {
            Header: "Status",
            accessor: "flowStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const status = original?.flowStatus ?? "";
                return (
                    <StatusLabelWithStepper
                        id={original?.id}
                        type={status}
                        labelName={status}
                        overViewStats={original?.overViewStats}
                        waOrderRef={original?.waOrderRef}
                        recipientType={original?.recipientType}
                    />
                );
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl
                        actionOptions={actionsList}
                        rowId={original.id}
                    ></MenuOptionHrtl>
                );
            },
        },
    ];
}

export const statusOptionsCheckbox = [
    {
        id: "WhatsApp",
        name: "WhatsApp",
        isDisabled: true,
    }
]
export const statusOptionsParent = [
    // {
    //     id: "father",
    //     name: "Father",
    // },
    // {
    //     id: "mother",
    //     name: "Mother",
    // },
    // {
    //     id: "localGaurdian",
    //     name: "Local Gaurdian",
    // },
    {
        id: "primaryContact",
        name: "Primary Contact",
    },
]
export const statusOptionsStaff = [
    {
        id: "admin",
        name: "Admin",
        selected: true,
    },
    {
        id: "nonTeaching",
        name: "Non-Teaching",
        selected: false,
    },
    {
        id: "teaching",
        name: "Teaching",
        selected: false,
    },
]
export const statusOptionsAll = [
    {
        id: "primaryContact",
        name: "Primary Contact",
        selected: false,
    },
]

export const userTypeOptions = [
    {
        name: "PARENTS",
        id: "PARENT"
    },
    {
        name: "EMPLOYEES",
        id: "STAFF"
    }
]

export const chooseTemplateOptions = [
    {
        name: "New",
        id: "new"
    },
    {
        name: "Existing",
        id: "existing"
    },
]
export const eventTemplateOptions = [
    {
        name: "Fee",
        id: "fee"
    },
    {
        name: "Anouncement",
        id: "anouncements"
    },
    {
        name: "Anouncement",
        id: "anouncements"
    },
    {
        name: "Attendance ",
        id: "attendance"
    },
    {
        name: "School Updates",
        id: "schoolUpdates"
    },
    {
        name: "Othes",
        id: "anouncemothersents"
    },
]
export const dayOptions = [
    {
        name: "Daily",
        id: "daily"
    },
    {
        name: "Weekly",
        id: "weekly"
    },
    {
        name: "Monthly",
        id: "monthly"
    },
]

function channelStatus(options: (Array<any> | null)) {

    return (
        <div className="d-flex flex-wrap gap-1">
            <span className="badge text-uppercase bg-light text-muted p-2">SMS</span>
            <span className="badge text-uppercase bg-light text-muted p-2">Email</span>
        </div>
    )
}

export function generateStatusCommunicationLogsColumns() {
    return [
        {
            Header: "Tittle",
            accessor: "tittle",
            disableSortBy: true,
        },
        {
            Header: "Channel",
            accessor: "channel",
            disableSortBy: true,
            Cell: channelStatus
        },
        {
            Header: "Recipients",
            accessor: "recipients",
            disableSortBy: true,
        },
        {
            Header: "In-Progress",
            accessor: "inProgress",
            disableSortBy: true,
        },
        {
            Header: "Deliveried",
            accessor: "deliveried",
            disableSortBy: true,
        },
        {
            Header: "Failed",
            accessor: "failed",
            disableSortBy: true,
        },
        {
            Header: "Total Sms",
            accessor: "totalSms",
            disableSortBy: true,
        },
        {
            Header: "Delivery(%)",
            accessor: "delivery",
            disableSortBy: true,
        },
        {
            Header: "Send Date",
            accessor: "sendDate",
            disableSortBy: true,
            columnClassName: "text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return getDateWithTimeFormat(original?.sendDate ? `${original?.sendDate}Z` : '');
            },
        },
    ];
}

export const communicationChannel = [
    {
        name: "SMS",
        id: "SMS"
    },
    {
        name: "Email",
        id: "Email"
    },
    {
        name: "WhatsApp",
        id: "WhatsApp"
    },
]

export const studentTypeOptions = [
    {
        id: "all-student",
        name: "All Student",
    }, {
        id: "selected-student",
        name: "Selected Student",
    }
]

export const CurriculumSelectorProvider = React.createContext<any>(null);

export function renderOptionsStudent(item: any) {
    return `${item?.name} - ${item?.studentCode}`;
}

export function renderValueStudent(selectedItems: any, removeItemHandler: any) {
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

export function renderValueStaff(selectedItems: any, removeItemHandler: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="selected-container">
            {
                selectedItems.map((item, index) => {
                    return (<div key={`item-${item?.id}`} className="selectedoption-item">
                        <span>{item?.employeeName}</span>
                        <span data-id={item?.userId} onClick={removeItemHandler} className="remove-icon">
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

export function whatsappCampaignStatsResponse(response: any) {
    return [
        {
            bgColor: "#ebeedf",
            cardTitle: "Total Sent",
            cardCount: response?.totalMessagesSent || "0",
            cardIcon: SentIcon,
            overlayColor: "#C1C4A8",
            overlayChildColor: "#D4D7C3",
        },
        {
            bgColor: "#F8EFE2",
            cardTitle: "Delivered",
            cardCount: response?.totalMessagesDelivered || "0",
            cardIcon: CheckmarkBadge03Icon,
            overlayColor: "#D7C5A9",
            overlayChildColor: "#EDE0C8",
        },
        {
            bgColor: "#EFF7E2",
            cardTitle: "Read",
            cardCount: response?.totalMessagesRead || "0",
            cardIcon: EyeIcon,
            overlayColor: "#C7D3B2",
            overlayChildColor: "#DDEABA",
        },
        {
            bgColor: "#E1E2F6",
            cardTitle: "Clicked CTA",
            cardCount: response?.totalMessageClicked || "0",
            cardIcon: PieChartIcon,
            overlayColor: "#B0B2D4",
            overlayChildColor: "#CACBF0",
        },
    ]
}

export function generateStudentModalColumns() {
    return (
        [{
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "w-300px min-w-300px max-w-300px",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        imageUrl={original?.studentBase64Image}
                        displayId={original.code}
                        displayName={original.name}
                        showAvatar={true}
                        size="xs"
                    />
                );
            },
        },
        {
            Header: "Phone",
            accessor: "phoneNumber",
            disableSortBy: true,
        },
        {
            Header: "Created At",
            accessor: "timeStamp",
            disableSortBy: true,
            columnClassName: "text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return getDateWithTimeFormat(original?.timeStamp ? `${original?.timeStamp}Z` : '');
            },
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true,
            columnClassName: "text-nowrap",
                Cell: ({ row: { original } }: any) => {
                    if (
                        original?.status !== "FAILED" &&
                        original?.status !== "INVALID"
                    ) {
                        return "-";
                    }
                    try {
                        return JSON.parse(original?.remarks || "{}")?.message
                            || original?.remarks
                            || "-";
                    } catch {
                        return original?.remarks || "-";
                    }
                }
            },
        ]
    )
}