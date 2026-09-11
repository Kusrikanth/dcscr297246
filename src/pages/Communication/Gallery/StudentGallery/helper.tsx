import React from "react";
import { StatusLabel } from "../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Gallery Title",
      accessor: "title",
      disableSortBy: true,
    },
    {
      Header: "Description",
      accessor: "description",
      disableSortBy: true,
    },
    // {
    //   Header: "Class & Section",
    //   accessor: "classSection",
    //   disableSortBy: true, 
    // },
    {
      Header: "Upload Date",
      accessor: "uploadDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          getDateWithTimeFormat(original?.eventDate ? `${original?.eventDate}z` : '')
        );
      },
    },
    {
      Header: "Total Image Count",
      accessor: "totalImageCount",
      disableSortBy: true,
    },
    {
      Header: "Total Video Count",
      accessor: "totalVideoCount",
      disableSortBy: true,
    },
    // {
    //   Header: "Upload Type",
    //   accessor: "uploadType",
    //   disableSortBy: true,
    //   Cell: ({ row: { original, index } }: any) => {
    //     const { uploadType } = original || {};

    //     return (
    //       <div>
    //         {Array.isArray(uploadType) && uploadType.length > 1 ? (
    //           <div className="avatar-group">
    //             <>
    //               {uploadType.slice(0, 2).map((img: any, ind: number) => (
    //                 <div
    //                   className="avatar-group-item"
    //                   data-bs-toggle="tooltip"
    //                   data-bs-placement="top"
    //                   title=""
    //                   key={ind}
    //                 >
    //                   <img
    //                     src={DefaultStudentImage}
    //                     alt=""
    //                     className="rounded-circle avatar-xs"
    //                   ></img>
    //                 </div>
    //               ))}
    //               {uploadType.length > 2 && (
    //                 <div
    //                   className="avatar-group-item cursor-pointer"
    //                   data-bs-toggle="tooltip"
    //                   data-bs-placement="top"
    //                   title="more"
    //                   data-id={index}
    //                   onClick={() => {}}
    //                 >
    //                   <div className="avatar-xs">
    //                     <div
    //                       className="avatar-title rounded-circle"
    //                       style={{
    //                         backgroundColor: "#D4F5F0",
    //                         color: "#0AB39C",
    //                       }}
    //                     >
    //                       {uploadType.length - 2 + "+"}
    //                     </div>
    //                   </div>
    //                 </div>
    //               )}
    //             </>
    //           </div>
    //         ) : (
    //           <span>{original.uploadType}</span>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      Header: "Canonical Title",
      accessor: "canonicalTitle",
      disableSortBy: true,
    },
    // {
    //   Header: "Send To",
    //   accessor: "sendTo",
    //   disableSortBy: true,
    // },
    // {
    //   Header: "Status",
    //   accessor: "status",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <StatusLabel
    //         type={original.status}
    //         labelName={original.status}
    //       ></StatusLabel>
    //     );
    //   },
    // },
    {
      Header: "Action",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const userTypeOptions = [
  {
    name: "All",
    id: "ALL",
  },
  {
    name: "PARENTS",
    id: "PARENT",
  },
  {
    name: "EMPLOYEES",
    id: "STAFF",
  },
];

export const studentTypeOptions = [
  {
    id: "all-student",
    name: "All Student",
  },
  {
    id: "selected-student",
    name: "Selected Student",
  },
];

export const galleryCategory = [
  {
    name: "ACADEMIC",
    id: "ACADEMIC",
  },
  {
    name: "NON ACADEMIC",
    id: "NONACADEMIC",
  },
];

export const uploadType = [
  {
    name: "URL",
    id: "url",
  },
  {
    name: "Direct Upload",
    id: "directUpload",
  },
];

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
];

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
];

export function renderValueStaff(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (
      <div className="selected-container">
        {selectedItems.map((item, index) => {
          return (
            <div key={`item-${item?.id}`} className="selectedoption-item">
              <span>{item?.employeeName}</span>
              <span
                data-id={item?.userId}
                onClick={removeItemHandler}
                className="remove-icon"
              >
                <i className="ri-close-line"></i>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

export function renderOptionsEmployee(item: any) {
  return `${item?.employeeName} - ${item?.employeeCode}`;
}

export function renderValueStudent(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (
      <div className="selected-container">
        {selectedItems.map((item, index) => {
          return (
            <div key={`item-${item?.id}`} className="selectedoption-item">
              <span>{item?.name}</span>
              <span
                data-id={item?.id}
                onClick={removeItemHandler}
                className="remove-icon"
              >
                <i className="ri-close-line"></i>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

export function renderOptionsStudent(item: any) {
  return `${item?.name} - ${item?.studentCode}`;
}

export interface Student {
  id: string;
}

export interface Employee {
  id: string;
}
