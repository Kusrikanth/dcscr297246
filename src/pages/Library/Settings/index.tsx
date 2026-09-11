import React from "react";
import { default as PaymentIcon } from "../../../assets/imagesdps/modulesettings/money.svg?react";
import { default as CalendarIcon } from "../../../assets/imagesdps/modulesettings/calender.svg?react";
import { default as FeedbackIcon } from "../../../assets/imagesdps/modulesettings/feedback.svg?react";
import { default as PdfFileIcon } from "../../../assets/imagesdps/modulesettings/pdf-file.svg?react";
import { default as PrinterIcon } from "../../../assets/imagesdps/modulesettings/printer.svg?react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useHistory } from "react-router-dom";

const routes = [
    {
        id: "library-details",
        path: "/library-settings/library-details"
    },
    {
        id: "library-rooms",
        path: "/library-settings/library-rooms"
    },
    {
        id: "library-room-shelves",
        path: "/library-settings/library-room-shelves"
    },
    {
        id: "library-racks",
        path: "/library-settings/library-racks"
    },
    {
        id: "library-publishers",
        path: "/library-settings/library-publishers"
    },
    {
        id: "library-records",
        path: "/library-settings/library-records"
    },
    {
        id: "library-category",
        path: "/library-settings/library-category"
    },
    {
        id: "library-language",
        path: "/library-settings/library-language"
    },
    {
        id: "library-user-type",
        path: "/library-settings/library-user-type"
    },
    {
        id: "library-user-record-type",
        path: "/library-settings/library-user-record-type"
    },
   
]

const librarySettingsSetup1 = [
    {
        id: "library-details",
        icon: <PaymentIcon />,
        title: "Library Details",
        info: "View and Setup Library Details",
    },
    {
        id: "library-rooms",
        icon: <PaymentIcon />,
        title: "Library Rooms",
        info: "View and Setup Library Rooms",
    },
    {
        id: "library-room-shelves",
        icon: <PaymentIcon />,
        title: "Library Room Shelves",
        info: "View and Setup Library Room Shelves",
    },
    {
        id: "library-racks",
        icon: <PaymentIcon />,
        title: "Library Racks",
        info: "View and Setup Library Racks",
    },
   
]

const librarySettingsSetup2 = [
    {
        id: "library-publishers",
        icon: <PaymentIcon />,
        title: "Publishers",
        info: "View and Setup Publishers",
    },
    {
        id: "library-records",
        icon: <PaymentIcon />,
        title: "Record Types",
        info: "View Record Types",
    },
    {
        id: "library-category",
        icon: <PaymentIcon />,
        title: "Category",
        info: "View Category",
    },
    {
        id: "library-language",
        icon: <PaymentIcon />,
        title: "Languages",
        info: "View Languages",
    },
]

const librarySettingsSetup3 = [
    
    {
        id: "library-user-type",
        icon: <PaymentIcon />,
        title: "User Type",
        info: "View and Update User Type",
    },
    {
        id: "library-user-record-type",
        icon: <PaymentIcon />,
        title: "User Record Type",
        info: "View User Record Type",
    },
]

const LibrarySettings = (props: any) => {
    const history = useHistory();

    const SettingsRoutes = (id: any) => {
        routes.filter((ele, idx) => {
            if (ele.id == id) {
                history.push(ele.path);
            }
        })

    };

    return (
        <div className="page-content transportaion_dashboard_wrapper">
            <div className="container-fluid">
                <BreadCrumb title="Dashboard" pageTitle="Library" />
                <div className="tw-mx-3">
                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border">
                        <div className="tw-border-b tw-px-5 tw-py-3">
                            <h4 className="tw-text-sm md:tw-text-base tw-font-semibold tw-mb-0">Library Setup</h4>
                        </div>
                        <div className="tw-p-3">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-x-6 tw-gap-y-4 tw-py-3">
                                {[...librarySettingsSetup1, ...librarySettingsSetup2, ...librarySettingsSetup3].map(
                                    (item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => SettingsRoutes(item.id)}
                                            className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-3 tw-cursor-pointer"
                                        >
                                            <div className="tw-flex tw-items-center tw-gap-4 tw-p-2 tw-rounded-md hover:tw-bg-gray-100 tw-transition">
                                                <div className="tw-bg-gray-50 tw-rounded-md tw-p-2 tw-shadow-sm">
                                                    {item.icon}
                                                </div>
                                                <div className="tw-flex tw-flex-col">
                                                    <span className="tw-text-[#4f8cff] tw-font-medium">
                                                        {item.title}
                                                    </span>
                                                    <span className="tw-text-sm tw-text-gray-500">
                                                        {item.info}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default LibrarySettings