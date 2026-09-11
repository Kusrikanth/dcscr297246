import React from "react";
import { default as PaymentIcon } from "../../../assets/imagesdps/modulesettings/money.svg?react";
import { default as CalendarIcon } from "../../../assets/imagesdps/modulesettings/calender.svg?react";
import { default as FeedbackIcon } from "../../../assets/imagesdps/modulesettings/feedback.svg?react";
import { default as PdfFileIcon } from "../../../assets/imagesdps/modulesettings/pdf-file.svg?react";
import { default as PrinterIcon } from "../../../assets/imagesdps/modulesettings/printer.svg?react";

const feeCollectionSetup = [
    {
        id: "fee-categories",
        icon: <PaymentIcon />,
        title: "Master Fee Categories",
        info: "View and Update your school Fee Categories",
    },
    {
        id: "fee-types",
        icon: <PaymentIcon />,
        title: "Fee Types",
        info: "View and Update your school Fee Types",
    },
    {
        id: "fines",
        icon: <PaymentIcon />,
        title: "Fines",
        info: "View and Update Fine",
    }
]
const generalSettings = [
    {
        id: "pdf-settings",
        icon: <PdfFileIcon />,
        title: "PDF Settings",
        info: "View and Update Pdf layouts",
    },
    {
        id: "printer-settings",
        icon: <PrinterIcon />,
        title: "Printer Settings",
        info: "View and Update printer Settings",
    },
    {
        id: "templates",
        icon: <PrinterIcon />,
        title: "Templates",
        info: "View and Update printer Settings",
    }
]
const communicationSetup = [
    {
        id: "reminder-settings",
        icon: <CalendarIcon />,
        title: "Reminders Settings",
        info: "View and Setup the Fee Payment Due Dates",
    },
    {
        id: "sms-templates",
        icon: <FeedbackIcon />,
        title: "SMS & WhatsApp Templates",
        info: "View and Setup sms and watsapp templates.",
    }
]

export default function FeeConfigurationSetup(props: any) { 
    return (
        <div className="tw-rounded-lg tw-shadow-md tw-bg-white tw-overflow-hidden">
            <div className="tw-px-6 tw-py-4 tw-border-b ">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0 tw-flex-grow">
                    Fee Configuration Setup
                </h4>
            </div>
            <div className="tw-p-6">
                <div className="tw-grid tw-grid-cols-12 tw-gap-x-2 module-settings-container tw-mb-4">
                    <div className="tw-col-span-12">
                        <h6 className="title">Fee Collection Setup</h6>
                    </div>
                    <div className="tw-col-span-12">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-x-3">
                            {feeCollectionSetup.map(item => (
                                <div
                                    onClick={props.onClickSettingHndlr}
                                    data-id={item.id}
                                    key={item.id}
                                    className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-4"
                                >
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

                <div className="tw-grid tw-grid-cols-12 tw-gap-x-2 module-settings-container tw-mb-4">
                    <div className="tw-col-span-12">
                        <h6 className="title">General Settings</h6>
                    </div>
                    <div className="tw-col-span-12">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-x-3">
                            {generalSettings.map(item => (
                                <div key={item.id} className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-4">
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

                <div className="tw-grid tw-grid-cols-12 tw-gap-x-2 module-settings-container">
                    <div className="tw-col-span-12">
                        <h6 className="title">Communication Setup</h6>
                    </div>
                    <div className="tw-col-span-12">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-x-3">
                            {feeCollectionSetup.map(item => (
                                <div key={item.id} className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-4">
                                    <div className="setting-card-container">
                                        <div className="img-container">
                                            <PaymentIcon />
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