import React from "react";
import { default as PaymentIcon } from "../../../assets/imagesdps/modulesettings/money.svg?react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useHistory } from "react-router-dom";

const routes = [
    {
        id: "hostel-details",
        path: "/hostel-setup/hostel-details"
    },
    {
        id: "hostel-bulding",
        path: "/hostel-setup/hostel-building"
    },
    {
        id: "hostel-floor",
        path: "/hostel-setup/hostel-floor"
    },
    {
        id: "hostel-room-type",
        path: "/hostel-setup/hostel-room-type"
    },
    {
        id: "hostel-room-details",
        path: "/hostel-setup/hostel-room-details"
    },
]

const hostelSetup = [
    {
        id: "hostel-details",
        icon: <PaymentIcon />,
        title: "Hostel Details",
        info: "View and Update Hostel Name",
    },
    {
        id: "hostel-bulding",
        icon: <PaymentIcon />,
        title: "Building",
        info: "View and Update Hostel building name and details",
    },
    {
        id: "hostel-floor",
        icon: <PaymentIcon />,
        title: "Floor",
        info: "View and Update Hostel Building Floor Name",
    },
    {
        id: "hostel-room-type",
        icon: <PaymentIcon />,
        title: "Room Type",
        info: "View and Update Pdf layouts",
    },
    {
        id: "hostel-room-details",
        icon: <PaymentIcon />,
        title: "Rooms",
        info: "View and Update printer Settings",
    },
]

const HostelSetup = (props: any) => {
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
                <BreadCrumb title="Dashboard" pageTitle="Hostel" />

                <div className="tw-pl-3">
                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Hostel Setup
                            </h4>
                        </div>

                        <div className="tw-p-4">
                            <div className="tw-mb-4 module-settings-container">
                                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-3">
                                    {hostelSetup.map((item) => (
                                        <div
                                            key={item.id}
                                            data-id={item.id}
                                            onClick={() => SettingsRoutes(item.id)}
                                            className="tw-cursor-pointer"
                                        >
                                            <div className="setting-card-container">
                                                <div className="img-container">
                                                    {item.icon}
                                                </div>

                                                <div className="tw-flex tw-flex-col">
                                                    <h6 className="setting-title">
                                                        {item.title}
                                                    </h6>

                                                    <div className="setting-info">
                                                        {item.info}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default HostelSetup