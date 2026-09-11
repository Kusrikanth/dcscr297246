import React from "react";
import { default as BrchTransportationSvg } from "../../../../assets/imagesdps/menuicon/branch-icon/transportation.svg?react";
import { useHistory } from "react-router-dom";

const routes = [
    {
        id: "routeTabs",
        path:"/transportation-settings/routes-tab"
    },
    {
        id: "allStops",
        path:"/transportation-settings/all-stops"
    },
    {
        id: "slabs",
        path:"/transportation-settings/slabs"
    },
    {
        id: "stop-schedules",
        path:"/transportation-settings/create-stop"
    }
]
const vehicle = [
    {
        id: "vehiclesType",
        path:"/transportation-settings/vehicles-types"
    },
    {
        id: "vehicleDetails",
        path:"/transportation-settings/vehicles-details"
    },
    {
        id: "vehicleManufacture",
        path:"/transportation-settings/vehicles-manufacture"
    },
]
const usersmapping = [
    {
        id: "assign-employee",
        path:"/transportation-settings/assign-employee"
    },
]
const transportfee = [
    {
        id: "slabTerms",
        path:"/transportation-settings/slabs-terms"
    }
]
const routeEntry = [
    {
        id: "routeTabs",
        icon: <BrchTransportationSvg />,
        title: "Routes Details",
        info: "View and Update your school Vehicle Types",

    },
    {
        id: "allStops",
         icon: <BrchTransportationSvg />,
        title: "All Stops",
        info: "View and Update your Vehicle Registration Owner & Operation Details",
    },
    {
        id: "slabs",
         icon: <BrchTransportationSvg />,
        title: "Slabs",
        info: "View & Update Routes name and Route No.",
    },
    {
        id: "stop-schedules",
         icon: <BrchTransportationSvg />,
        title: "Stops Schedules",
        info: "View & Update Routes name and Route No.",
    }
]
const vehicles = [
    {
        id: "vehiclesType",
        icon: <BrchTransportationSvg />,
        title: "Vehicle Type",
        info: "View and Update your school Vehicle Types",
    },
    
    {
        id: "vehicleManufacture",
        icon: <BrchTransportationSvg />,
        title: "Vehicle Manufacture",
        info: "View and Update your school Vehicle Types",
    },
    {
        id: "vehicleDetails",
        icon: <BrchTransportationSvg />,
        title: "Vehicle Details",
        info: "View and Update your school Vehicle Types",
    },
]
const usersMapping = [
    {
        id: "assign-employee",
        icon: <BrchTransportationSvg />,
        title: "Assign Employee",
        info: "map driver / attenders/ and transport heads to the vehicle",
    }
]

const transportFee = [
    {
        id: "slabTerms",
        icon: <BrchTransportationSvg />,
        title: "Slabs Terms",
        info: "View & Update Slabs and assign Term wise fee to Slabs.",
    }
]
const FeeConfigurationSetup= (props: any) => {
    const history = useHistory();

    const SettingsRoutes = (id:any) => {
        routes.filter((ele,idx)=>{
            if (ele.id==id) {
                history.push(ele.path);
            }
        })
    
    };
    const SettingsVehicle = (id:any) => {
        vehicle.filter((ele,idx)=>{
            if (ele.id==id) {
                history.push(ele.path);
            }
        })
    
    };
    const UsersMapping = (id:any) => {
        usersmapping.filter((ele,idx)=>{
            if (ele.id==id) {
                history.push(ele.path);
            }
        })
    
    };
    const TransportFee = (id:any) => {
        transportfee.filter((ele,idx)=>{
            if (ele.id==id) {
                history.push(ele.path);
            }
        })
    
    };
    return (
        <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">

            <div className="tw-p-6 tw-mb-6">

                <div className="tw-mb-6">

                    <div className="tw-mb-4">
                        <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
                            Route Entry
                        </h6>
                    </div>

                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        {routeEntry.map((item) => (
                            <div
                                onClick={() => SettingsRoutes(item.id)}
                                data-id={item.id}
                                key={item.id}
                                className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-3"
                            >
                                <div className="tw-p-4 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm hover:tw-bg-[#f5f5f5] tw-transition tw-cursor-pointer tw-flex tw-gap-3">

                                    <div className="img-container">
                                        {item.icon}
                                    </div>

                                    <div className="tw-flex tw-flex-col">
                                        <h6 className="tw-text-sm tw-font-medium tw-text-blue-600 tw-mb-0">
                                            {item.title}
                                        </h6>
                                        <div className="tw-text-xs tw-text-gray-500">
                                            {item.info}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="tw-mb-6">

                    <div className="tw-mb-4">
                        <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
                            Vehicles
                        </h6>
                    </div>

                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        {vehicles.map((item) => (
                            <div
                                onClick={() => SettingsVehicle(item.id)}
                                data-id={item.id}
                                key={item.id}
                                className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-3"
                            >
                                <div className="tw-p-4 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm hover:tw-bg-[#f5f5f5] tw-transition tw-cursor-pointer tw-flex tw-gap-3">

                                    <div className="tw-flex-shrink-0">
                                        {item.icon}
                                    </div>

                                    <div className="tw-flex tw-flex-col">
                                        <h6 className="tw-text-sm tw-font-medium tw-text-blue-600 tw-mb-0">
                                            {item.title}
                                        </h6>
                                        <div className="tw-text-xs tw-text-gray-500">
                                            {item.info}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div>

                    <div className="tw-mb-4">
                        <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
                            Transport Fee
                        </h6>
                    </div>

                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        {transportFee.map((item) => (
                            <div
                                onClick={() => TransportFee(item.id)}
                                data-id={item.id}
                                key={item.id}
                                className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-3"
                            >
                                <div className="tw-p-4 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm hover:tw-bg-[#f5f5f5] tw-transition tw-cursor-pointer tw-flex tw-gap-3">

                                    <div className="tw-flex-shrink-0">
                                        {item.icon}
                                    </div>

                                    <div className="tw-flex tw-flex-col">
                                        <h6 className="tw-text-sm tw-font-medium tw-text-blue-600 tw-mb-0">
                                            {item.title}
                                        </h6>
                                        <div className="tw-text-xs tw-text-gray-500">
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
    )
}
export default FeeConfigurationSetup;