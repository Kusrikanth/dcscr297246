import React from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useHistory } from "react-router-dom";
import { default as PaymentIcon } from "../../../assets/imagesdps/modulesettings/money.svg?react";


const routes = [
    {
        id: "organization-profile",
        path: "/enquiry-settings/organization-profile"
    },
    {
        id: "manage-institute",
        path: "/enquiry-settings/manage-institute"
    },
    {
        id: "manage-lead-status",
        path: "/enquiry-settings/manage-lead-status"
    },
    {
        id: "campaign-setup",
        path: "/enquiry-settings/campaign-setup"
    },
    {
        id: "integation",
        path: "/enquiry-settings/integation"
    },
    {
        id: "communication",
        path: "/enquiry-settings/communication"
    }
   
]

const enquirySettingsSetup1 = [
    {
        id: "organization-profile",
        icon: <PaymentIcon />,
        title: "Organization Profile",
        info: "View and Update organization profile and enquiry form links",
    },
    {
        id: "manage-institute",
        icon: <PaymentIcon />,
        title: "Manage Institute",
        info: "View and Update organization profile and enquiry form links",
    },
    {
        id: "manage-lead-status",
        icon: <PaymentIcon />,
        title: "Manage Lead Status",
        info: "View and Update organization profile and enquiry form links",
    },
    {
        id: "campaign-setup",
        icon: <PaymentIcon />,
        title: "Campaign Setup",
        info: "View and Update organization profile and enquiry form links",
    },
    {
        id: "integation",
        icon: <PaymentIcon />,
        title: "Integation",
        info: "View and Update API Keys",
    },
    {
        id: "communication",
        icon: <PaymentIcon />,
        title: "Communication",
        info: "View and Update API Keys",
    },
   
]


const EnquirySettings = (props: any) => {
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
            <BreadCrumb title="settings" pageTitle="Enquiry Management" pageTitleName="settings" />
            <div className="tw-pl-3"> 
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title tw-mb-0 tw-flex-grow">Lead Management Configuration Setup</h4>
                    </div>
                    <div className="card-body">
                        <div className="tw-flex tw-flex-wrap tw-gap-x-2 module-settings-container">
                            <p className="tw-text-base tw-font-bold tw-text-gray-500">Organization Setup</p>
                            <div className="tw-w-full">
                                <div className="tw-flex tw-flex-wrap tw-gap-x-3">

                                    {enquirySettingsSetup1.map(item => (
                                        <div onClick={() => SettingsRoutes(item.id)} data-id={item.id} key={item.id} className="tw-w-full lg:tw-w-1/2 xl:tw-w-1/4">
                                            <div className="setting-card-container">
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
            </div>
        </div>
    </div>

    )
}
export default EnquirySettings