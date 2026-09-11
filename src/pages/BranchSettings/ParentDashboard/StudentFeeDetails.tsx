import React from 'react'
import { Card, CardBody, CardHeader } from 'reactstrap';
import { default as YellowBook } from "../../../assets/imagesdps/academics/YellowBook.svg?react";
import { default as DownloadSvg } from "../../../assets/imagesdps/academics/Download.svg?react";
import { default as CalendarSvg } from "../../../assets/imagesdps/academics/Calendar.svg?react";
import { default as UpArrowGreen } from "../../../assets/imagesdps/academics/UpArrowGreen.svg?react";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import avatar from "../../../assets/images/users/avatar-1.jpg";


const FeeRates = [
    {
        feeName: "Attendance Rate",
        per: "99.9 %",
        color: "#0AB39C",
        icon: <UpArrowGreen />
    },
    {
        feeName: "Homework Rate",
        per: "99.9 %",
        color: "#0AB39C",
        icon: <UpArrowGreen />
    },
    {
        feeName: "Marks Rate",
        per: "99.9 %",
        color: "#0AB39C",
        icon: <UpArrowGreen />
    }
]
const StudentFeeDetails = () => {
    return (
        <div className="tw-w-full">
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-overflow-hidden">
                {/* <div className="card-header p-0">
                    <div className="row align-items-center gap-2 m-2">
                        <div className="col mt-0">
                            <h4 className="card-title mb-0 flex-grow-1 py-2">
                                Messages
                            </h4>
                        </div>
                    </div>
                </div> */}
                <div className="tw-p-0 tw-h-fit">

                    <div className="tw-flex tw-flex-col tw-items-center tw-mt-5 tw-pb-4 tw-border-b tw-border-gray-200">

                        <div
                            className="tw-w-24 tw-h-24 tw-rounded-full tw-border-[3px] tw-border-[#E9EBEC] tw-overflow-hidden"
                        >
                            <img
                                src={avatar}
                                className="tw-w-full tw-h-full tw-object-cover"
                                alt="Student"
                            />
                        </div>

                        <h4 className="tw-text-lg tw-font-semibold tw-mt-3">
                            Lingam Prkruth
                        </h4>
                        <p className="tw-text-sm tw-text-gray-500">
                            Class VII-A
                        </p>
                    </div>

                    <div className="tw-py-3 tw-px-4 xl:tw-py-4 xl:tw-px-6">
                        {FeeRates.map((fee, index) => (
                            <div key={index} className="tw-grid tw-grid-cols-2 tw-items-center tw-mb-2">

                                <p className="tw-text-sm tw-text-gray-500">
                                    {fee.feeName}
                                </p>

                                <div
                                    className="tw-flex tw-justify-end tw-items-center tw-text-sm"
                                    style={{ color: fee.color }}
                                >
                                    <span className="tw-mr-1">
                                        {fee.icon}
                                    </span>
                                    <p className="tw-mb-0">{fee.per}</p>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className="tw-flex tw-justify-between tw-items-center">
                        <div className="tw-w-[12px] tw-h-[20px] tw-rounded-r-full tw-bg-[#F3F3F9]"></div>
                        <div className="tw-border-b-2 tw-border-dashed tw-border-gray-300 tw-w-full"></div>
                        <div className="tw-w-[12px] tw-h-[20px] tw-rounded-l-full tw-bg-[#F3F3F9]"></div>
                    </div>

                    <div className="tw-grid tw-grid-cols-2 tw-items-center tw-py-3 tw-px-4 xl:tw-py-4 xl:tw-px-6">

                        <p className="tw-text-sm tw-text-gray-500 tw-mb-0">
                            Outstanding Fee
                        </p>

                        <div className="tw-flex tw-justify-end tw-items-center tw-text-[#F06548] tw-font-medium">
                            <RupeeSvg fill="#F06548" width="11px" height="11px" />
                            <span className="tw-ml-1">47,540.00</span>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default StudentFeeDetails
