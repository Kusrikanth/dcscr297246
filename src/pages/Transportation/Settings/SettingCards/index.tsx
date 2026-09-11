import React from "react";
import { default as BrchTransportationSvg } from "../../../../assets/imagesdps/menuicon/branch-icon/transportation.svg?react";

const routeEntry = [
    {
        id: "fee-categories",
        icon: <BrchTransportationSvg />,
        title: "Routes Details",
        info: "View and Update your school Vehicle Types",
    },
    {
        id: "fee-types",
         icon: <BrchTransportationSvg />,
        title: "All Stops",
        info: "View and Update your Vehicle Registration Owner & Operation Details",
    },
    {
        id: "fines",
         icon: <BrchTransportationSvg />,
        title: "Slabs",
        info: "View & Update Routes name and Route No.",
    },
    {
        id: "fines",
         icon: <BrchTransportationSvg />,
        title: "Stops Schedules",
        info: "View & Update Routes name and Route No.",
    }
]
const vehicles = [
    {
        id: "pdf-settings",
        icon: <BrchTransportationSvg />,
        title: "Vehicle Type",
        info: "View and Update your school Vehicle Types",
    },
    {
        id: "printer-settings",
        icon: <BrchTransportationSvg />,
        title: "Vehicle Details",
        info: "View and Update your school Vehicle Types",
    }
]
const usersMapping = [
    {
        id: "pdf-settings",
        icon: <BrchTransportationSvg />,
        title: "Assign Employee",
        info: "map driver / attenders/ and transport heads to the vehicle",
    }
]

const transportFee = [
    {
        id: "pdf-settings",
        icon: <BrchTransportationSvg />,
        title: "Slabs Terms",
        info: "View & Update Slabs and assign Term wise fee to Slabs.",
    }
]
export default function SettingCards(props: any) { 
    return (
        <div className="card tw-pl-3">
            {/* <div className="card-header">
                <h4 className="card-title mb-0 flex-grow-1">Fee Configuration Setup</h4>
            </div> */}
            <div className="card-body">
                <div className="tw-flex tw-flex-wrap tw-mx-1 module-settings-container tw-mb-4">
                    <div className="tw-w-full">
                        <h6 className="title">Route Entry</h6>
                    </div>
                    <div className="tw-w-full">
                        <div className="tw-flex tw-flex-wrap tw-mx-1.5">
                            {routeEntry.map(item => (
                                <div onClick={props.onClickSettingHndlr} data-id={item.id} key={item.id} className="tw-w-full lg:tw-w-1/2 xl:tw-w-1/4 tw-px-1.5 tw-mb-3">
                                    <div className="tw-px-3 setting-card-container">
                                        <div className="img-container">
                                            {item.icon}
                                        </div>
                                        <div className="tw-flex tw-flex-col">
                                            <h6 className="setting-title">{item.title}</h6>
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

                <div className="tw-flex tw-flex-wrap -tw-mx-1 module-settings-container tw-mb-4">
                    <div className="tw-w-full">
                        <h6 className="title">Vehicles</h6>
                    </div>
                    <div className="tw-w-full">
                        <div className="tw-flex tw-flex-wrap -tw-mx-1.5">
                            {vehicles.map(item => (
                                <div key={item.id} className="tw-w-full lg:tw-w-1/2 xl:tw-w-1/4 tw-px-1.5 tw-mb-3">
                                    <div className="tw-px-3 setting-card-container">
                                        <div className="img-container">
                                            {item.icon}
                                        </div>
                                        <div className="tw-flex tw-flex-col">
                                            <h6 className="setting-title">{item.title}</h6>
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

                <div className="tw-flex tw-flex-wrap tw--mx-1 module-settings-container tw-mb-4">
                    <div className="tw-w-full">
                        <h6 className="title">Users Mapping</h6>
                    </div>
                    <div className="tw-w-full">
                        <div className="tw-flex tw-flex-wrap -tw-mx-1.5">
                            {usersMapping.map(item => (
                                <div key={item.id} className="tw-w-full lg:tw-w-1/2 xl:tw-w-1/4 tw-px-1.5 tw-mb-3">
                                    <div className="tw-px-3 setting-card-container">
                                        <div className="img-container">
                                        {item.icon}
                                        </div>
                                        <div className="tw-flex tw-flex-col">
                                            <h6 className="setting-title">{item.title}</h6>
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

                <div className="tw-flex tw-flex-wrap tw--mx-1 module-settings-container ">
                    <div className="tw-w-full">
                        <h6 className="title">Transport Fee</h6>
                    </div>
                    <div className="tw-w-full">
                        <div className="tw-flex tw-flex-wrap tw--mx-1.5">
                            {transportFee.map(item => (
                                <div key={item.id} className="tw-w-full lg:tw-w-1/2 xl:tw-w-1/4 tw-px-1.5 tw-mb-3">
                                    <div className="tw-px-3 setting-card-container">
                                        <div className="img-container">
                                        {item.icon}
                                        </div>
                                        <div className="tw-flex tw-flex-col">
                                            <h6 className="setting-title">{item.title}</h6>
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
    )
}