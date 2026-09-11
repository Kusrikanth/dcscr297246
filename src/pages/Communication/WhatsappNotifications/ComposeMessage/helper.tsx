import React from 'react';
import { MenuOptionHrtl, StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";


export const AudienceSelectorProvider = React.createContext<any>(null);
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
            columnClassName: "max-w-300px text-wrap",
        },
        {
            Header: "Template",
            accessor: "templateName",
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
            columnClassName: "text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return getDateWithTimeFormat(original?.triggerDate ? `${original?.triggerDate}` : '');
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
        id: "ADMIN",
        name: "Admin",
        selected: true,
    },
    {
        id: "NONTEACHING",
        name: "Non-Teaching",
        selected: false,
    },
    {
        id: "TEACHING",
        name: "Teaching",
        selected: false,
    },
]

export function staffCategoryNamesFromIds(ids?: string[] | null): string {
    if (!Array.isArray(ids) || ids.length === 0) return "";
    const idsSet = new Set(ids.map(String));
    return statusOptionsStaff
        .filter(opt => idsSet.has(String(opt.id)))
        .map(opt => opt.name)
        .join(", ");
}

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
                return getDateWithTimeFormat(original?.sendDate ? `${original?.sendDate}` : '');
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
    },
    {
        id: "selected-student",
        name: "Selected Student",
    },
    {
        id: "manual-entry",
        name: "Manual Students Entry",
    }
]

export const employeeTypeOptions = [
    {
        id: "all-employee",
        name: "All Employee",
    }, {
        id: "selected-employee",
        name: "Selected Employee",
    }
]

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

function toMediaLabel(type: string) {
    return type ? type.charAt(0) + type.slice(1).toLowerCase() : '';
}

export function extractMediaTypesFromTemplates(templates: Array<any> = []) {
    const unique = Array.from(
        new Set(templates.map(t => t?.templateType).filter(Boolean))
    );
    return unique.map(t => ({ id: t?.toString(), name: toMediaLabel(t?.toString()) }));
}

export function validateUploadByMedia(
    mediaType?: string,
    file?: File | null,
    uploadedFileId?: string | number | null
) {
    if (!mediaType || mediaType === 'NONE') {
        if (file || uploadedFileId) {
            return { valid: false, message: 'Attachment not required for Text Only.' };
        }
        return { valid: true };
    }
    if (uploadedFileId) return { valid: true };
    if (!file) {
        return { valid: false, message: 'Attachment is required.' };
    }
    const allowedExtByType: Record<string, string[]> = {
        DOCUMENT: ['pdf', 'mp3', 'ogg', 'wav'],
        IMAGE: ['jpg', 'jpeg', 'png'],
        VIDEO: ['mp4'],
    };
    const maxSizeByType: Record<string, number> = {
        DOCUMENT: 10 * 1024 * 1024,
        IMAGE: 5 * 1024 * 1024,
        VIDEO: 50 * 1024 * 1024,
    };
    const ext = (file.name?.split('.').pop() || '').toLowerCase();
    const allowed = allowedExtByType[mediaType] || [];
    if (allowed.length && !allowed.includes(ext)) {
        return { valid: false, message: `Only ${allowed.join(', ').toUpperCase()} files are allowed.` };
    }
    const maxSize = maxSizeByType[mediaType] ?? 10 * 1024 * 1024;
    if (file.size > maxSize) {
        return { valid: false, message: `File size should not exceed ${Math.round(maxSize / (1024 * 1024))}MB.` };
    }
    return { valid: true };
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

