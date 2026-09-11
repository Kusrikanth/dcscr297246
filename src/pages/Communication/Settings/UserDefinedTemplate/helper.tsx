import React from "react";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { MenuOptionHrtl, StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { UserDefinedTemplateDataTypes } from "./UserDefinedTemplateTypes";

export const selectData1 = [

    {
        yearType: "2022-23",
    },
    {
        yearType: "2021-22",
    },
    {
        yearType: "2020-21",
    },
];

function communicationMode(options: (Array<any> | null)) {

    return (
        <div className="tw-flex tw-flex-wrap tw-gap-1">
            <span className="badge tw-uppercase bg-light text-muted tw-p-2">SMS</span>
            {/* <span className="badge text-uppercase bg-primary text-white p-2">Email</span> */}
        </div>
    )
}

export function generateColumns(actionList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Module",
            accessor: "module",
            disableSortBy: true,
        },
        {
            Header: "Alert Name",
            accessor: "alertName",
            disableSortBy: true,
            columnClassName: "w-250px min-w-250px max-w-250px",
        },
        {
            Header: "Templates",
            accessor: "noofTemplates",
            disableSortBy: true,
        },
        {
            Header: "Communication Mode",
            accessor: "communicationMode",
            disableSortBy: true,
            Cell: communicationMode
        },
        {
            Header: "Send To",
            accessor: "sendTo",
            disableSortBy: true,
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <StatusLabel type={original.status} labelName={original.status} />
                );
            },
        },
        {
            Header: "Action",
            thClass: "tw-w-[5%]",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
                );
            },
        },
    ];
}
export const UserDefinedTemplateTableData: Array<UserDefinedTemplateDataTypes> =
    [
        {
            id: 1,
            module: "Attendance",
            alertName: "Student Absence",
            noofTemplates: "2",
            communicationMode: "SMS",
            sendTo: "Parents",
            status: "Active",
        },
        {
            id: 2,
            module: "Health Records",
            alertName: "Details",
            noofTemplates: "2",
            communicationMode: "SMS,Email",
            sendTo: "Parents, Employee",
            status: "Active",
        },
        {
            id: 3,
            module: "Admission",
            alertName: "Details",
            noofTemplates: "2",
            communicationMode: "SMS,Email",
            sendTo: "Parents",
            status: "Active",
        },
    ];
export const statusOptionsCheckbox = [
    // {
    //     id: "sendSms",
    //     name: "SMS",
    //     selected: true,
    // },
    // {
    //     id: "sendEmail",
    //     name: "EMAIL",
    //     selected: false,
    // },
    // {
    //     id: "whatsApp",
    //     name: "WhatsApp",
    //     selected: true,
    // },
    {
        id: "mobileApp",
        name: "Mobile App",
        selected: false,
    },
]
export const statusOptionsParent = [
    {
        id: "father",
        name: "Father",
        selected: false,
    },
    {
        id: "mother",
        name: "Mother",
        selected: true,
    },
    {
        id: "localGaurdian",
        name: "Local Gaurdian",
        selected: false,
    },
    {
        id: "primaryContact",
        name: "Primary Contact",
        selected: false,
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

export const userTypeOptions = [
    {
        name: "ALL",
        id: "ALL"
    },
    {
        name: "PARENT",
        id: "PARENT"
    },
    {
        name: "EMPLOYEE",
        id: "EMPLOYEE"
    },
]

export const studentTypeOptions= [
    {
        id : "all-student",
        name : "All Student",
    },{
        id : "selected-student",
        name : "Selected Student",
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