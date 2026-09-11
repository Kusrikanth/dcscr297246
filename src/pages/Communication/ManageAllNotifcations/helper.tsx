import React from 'react';
import { MenuOptionHrtl, StatusLabel, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { StatusCommunicationLogsDataTypes } from "./ManageAllNotifcationsTypes";
import { getDateWithTimeFormat } from "../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Title",
            accessor: "title",
            disableSortBy: true,
        },
        {
            Header: "Description",
            accessor: "description",
            disableSortBy: true,
            columnClassName: "max-w-300px min-w-300px",
            Cell: ({ row: { original } }: any) => {
                const tempElement = document.createElement("div");
                tempElement.innerHTML = original?.description || "";
                const plainText =
                    tempElement.textContent ||
                    tempElement.innerText ||
                    "-";
                return (
                    <div
                        className="tw-max-w-[300px] tw-line-clamp-3 tw-break-words"
                        title={plainText}
                    >
                        {plainText}
                    </div>
                );
            },
        },
        {
            Header: "Publisher",
            accessor: "publisherName",
            disableSortBy: true,
            columnClassName: "w-150px min-w-150px text-wrap",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.userName || '-'}
                            displayId={original?.userCode || '-'}
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
            Header: "Communication Mode",
            accessor: "communicationModes",
            disableSortBy: true,
            columnClassName: "w-200px min-w-200px",
            Cell: ({ value, row: { index: rowIndex } }: any) => {
                if (!Array.isArray(value)) {
                    return "-";
                }
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>{value.map((item, index) => (<div key={`${rowIndex}-${index}`} className="d-flex flex-wrap gap-1">
                        <span className="badge badge-soft-primary text-uppercase px-2 py-1">{item}</span>
                    </div>))}</div>
                )
            }
        },
        {
            Header: "Trigger Date",
            accessor: "triggerDate",
            disableSortBy: true,
            columnClassName: "w-200px min-w-200px text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return getDateWithTimeFormat(original?.triggerDate ? `${original?.triggerDate}Z` : '');
            },
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <StatusLabel type={'issued'} labelName={'Sent'} />
                );
            },
        }
        // ,
        // {
        //     Header: "Action",
        //     thClass: "w-5",
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         return (
        //             <MoreActions actionOptions={actionList} rowId={original.id} />
        //         );
        //     },
        // },
    ];
}

export const statusOptionsCheckbox = [
    {
        id: "sms",
        name: "SMS",
        isDisabled: true,
    },
    {
        id: "email",
        name: "EMAIL",
        isDisabled: true,
    },
    {
        id: "whatsApp",
        name: "WhatsApp",
        isDisabled: true,
    },
    {
        id: "mobileApp",
        name: "Mobile App",
    },
]
export const statusOptionsParent = [
    {
        id: "father",
        name: "Father",
    },
    {
        id: "mother",
        name: "Mother",
    },
    {
        id: "localGaurdian",
        name: "Local Gaurdian",
    },
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
        name: "All",
        id: "ALL"
    },
    {
        name: "PARENTS",
        id: "PARENT"
    },
    {
        name: "EMPLOYEES",
        id: "STAFF"
    },
    {
        name: "FEE DUE",
        id: "FEE_DUE"
    },
]

export const categoryOptions = [
  {
    name: "Absent",
    id: "ABSENT",
  },
  {
    name: "Birthday Wishes",
    id: "BIRTHDAY_WISHES",
  },
  {
    name: "Fee Alert",
    id: "FEE_ALERT",
  },
  {
    name: "Transport Alert",
    id: "TRANSPORT_ALERT",
  },
  {
    name: "Home Work",
    id: "HOME_WORK",
  },
  {
    name: "Out Of School",
    id: "OUT_OF_SCHOOL",
  },
  {
    name: "Bio Metric Alert",
    id: "BIO_METRIC_ALERT",
  },
  {
    name: "Live Class Absent",
    id: "LIVE_CLASS_ABSENT",
  },
  {
    name: "Others",
    id: "OTHERS",
  },
];
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
            columnClassName: "tw-text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return getDateWithTimeFormat(original?.sendDate ? `${original?.sendDate}Z` : '');
            },
        },
    ];
}
export const StatusCommunicationLogsTableData: Array<StatusCommunicationLogsDataTypes> =
    [
        {
            id: 1,
            tittle: "Health Records",
            channel: "Sms",
            recipients: "24",
            inProgress: "0",
            deliveried: "3",
            failed: "0",
            totalSms: "3",
            delivery: "100%",
            sendDate: "23-04-2024",
        },
        {
            id: 2,
            tittle: "Admissions",
            channel: "Sms",
            recipients: "18",
            inProgress: "0",
            deliveried: "5",
            failed: "1",
            totalSms: "6",
            delivery: "100%",
            sendDate: "23-09-2024",
        },
        {
            id: 3,
            tittle: "Fee",
            channel: "Sms",
            recipients: "13",
            inProgress: "0",
            deliveried: "9",
            failed: "0",
            totalSms: "9",
            delivery: "100%",
            sendDate: "23-07-2024",
        },
    ];
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
    },
    {
        id: "manual-entry",
        name: "Manual Students Entry",
    }
]

export const listData = [
    {
        id: "2",
        name: "Curriculum 1",
        classes: [
            {
                id: "34",
                className: "Test Class",
                sections: [
                    {
                        id: "4343",
                        sectionName: "Section 1"
                    }
                ]
            }
        ]
    },
    {
        id: "22",
        name: "Curriculum 122",
        classes: [
            {
                id: "343",
                className: "Test Class",
                sections: [
                    {
                        id: "43433",
                        sectionName: "Section 13"
                    }
                ]
            }
        ]
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
export function generateValidateStudentsColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.name || "-"}
            displayId={original?.studentCode || "-"}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "SMS Priority Number",
      accessor: "smsPriorityNumber",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return <span>{value ? value : "-"}</span>;
      },
    },
  ];
}
