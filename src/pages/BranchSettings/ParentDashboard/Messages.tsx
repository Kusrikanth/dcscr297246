import React from 'react'
import { Card, CardBody, CardHeader } from 'reactstrap';
import { default as YellowBook } from "../../../assets/imagesdps/academics/YellowBook.svg?react";
import { default as DownloadSvg } from "../../../assets/imagesdps/academics/Download.svg?react";
import { default as CalendarSvg } from "../../../assets/imagesdps/academics/Calendar.svg?react";
import { default as ClockSvg } from "../../../assets/imagesdps/academics/ClockSvg.svg?react";
import avatar from "../../../assets/images/users/avatar-1.jpg";

const feeDefaultersData = [
    {
        icon: avatar,
        name: "Tina Allis",
        position:"Class Teacher",
        time:"10:45AM",
    },
    {
        icon: avatar,
        name: "Tina Allis",
        position:"Hindi Teacher",
        time:"10:45AM",
    },
    {
        icon: avatar,
        name: "Tina Allis",
        position:"Telugu Teacher",
        time:"10:45AM",
    },
];

const Messages = () => {
    return (
        <div className="tw-w-full">
            <div className="tw-bg-white fee_collection_analysis_wrap tw-rounded-xl tw-shadow-sm tw-overflow-hidden">

                <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                        Messages
                    </h4>
                </div>
                <div className="tw-px-4 tw-pt-0 tw-pb-2 tw-h-fit">
                    {feeDefaultersData &&
                        feeDefaultersData?.map((item, i) => (
                            <div
                                key={i}
                                className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-gray-200 tw-py-3 last:tw-border-b-0"
                            >
                                <div className="tw-flex tw-w-full tw-items-start">

                                    <div className="tw-w-10 tw-h-10 tw-rounded-full tw-overflow-hidden tw-mr-3 tw-flex-shrink-0">
                                        <img
                                            src={item.icon}
                                            className="tw-w-full tw-h-full tw-object-cover"
                                            alt="User"
                                        />
                                    </div>
 {/* <div
                                                    className="d-flex justify-content-center align-items-center me-3 fee_defaulter_icon_card"
                                                    style={{
                                                        background: `${item?.color}`,
                                                    }}
                                                >
                                                    {item?.icon}
                                                </div> */}
                                    <div className="tw-flex tw-flex-col tw-w-full tw-pt-1">

                                        <h5 className="tw-text-sm tw-font-bold tw-mb-1">
                                            {item.name}
                                        </h5>

                                        <div className="tw-flex tw-justify-between tw-items-center">

                                            <p className="tw-text-xs tw-text-gray-500">
                                                {item.position}
                                            </p>

                                            <div className="tw-flex tw-items-center tw-text-gray-500">
                                                <ClockSvg />
                                                <span className="tw-text-xs tw-ml-1">
                                                    {item.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="d-inline-block">
                  <div className="flex-shrink-0 avatar-xs avatar-shadow rounded-circle ms-2">
                    <img
                      className="rounded-circle header-profile-user"
                      src={}
                      alt="Header Avatar"
                    />
                  </div>
                </div> */}
                            </div>
                        ))}
                </div>
            </div>

        </div>
    )
}

export default Messages
