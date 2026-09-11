import React from 'react'
import { Card, CardBody, CardHeader } from 'reactstrap';
import { default as YellowBook } from "../../../assets/imagesdps/academics/YellowBook.svg?react";
import { default as DownloadSvg } from "../../../assets/imagesdps/academics/Download.svg?react";
import { default as CalendarSvg } from "../../../assets/imagesdps/academics/Calendar.svg?react";

const feeDefaultersData = [
    {
        icon: <YellowBook width={"15px"} height={"19px"} />,
        color: "#F7B84B1F",
        subject: "Telugu",
        homework: "Text Book"
    },
    {
        icon: <YellowBook width={"15px"} height={"19px"} />,
        color: "#F7B84B1F",
        subject: "Math",
        homework: "Text Book"
    },
    {
        icon: <YellowBook width={"15px"} height={"19px"} />,
        color: "#F7B84B1F",
        subject: "social Science",
        homework: "Test your self Questions"
    },
    {
        icon: <YellowBook width={"15px"} height={"19px"} />,
        color: "#F7B84B1F",
        subject: "Telugu",
        homework: "Work Sheets"
    },
];

const HomeWork = () => {
    return (
        <div className="tw-w-full">
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-overflow-hidden fee_collection_analysis_wrap">
                <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                        Homework
                    </h4>
                </div>
                <div className="tw-px-4 tw-py-2 tw-h-fit">
                    {feeDefaultersData &&
                        feeDefaultersData?.map((item, i) => (
                            <div
                                key={i}
                                className="tw-flex tw-items-start tw-justify-between tw-border-b tw-border-gray-200 tw-py-3 tw-mb-2 last:tw-border-b-0"
                            >
                                <div className="tw-flex tw-w-full">
                                    <div
                                        className="tw-p-2 tw-rounded-full tw-mr-3 tw-flex tw-items-center tw-justify-center"
                                        style={{ backgroundColor: item?.color }}
                                    >
                                        {item?.icon}
                                    </div>
                                    {/* <div
                                                    className="d-flex justify-content-center align-items-center me-3 fee_defaulter_icon_card"
                                                    style={{
                                                        background: `${item?.color}`,
                                                    }}
                                                >
                                                    {item?.icon}
                                                </div> */}

                                    <div className="tw-flex tw-flex-col tw-w-full">
                                        <h5 className="tw-text-sm tw-font-bold tw-mb-1">
                                            {item.homework}
                                        </h5>
                                        <div className="tw-flex tw-justify-between tw-items-center">
                                            <p className="tw-text-xs tw-text-gray-500 tw-opacity-80">
                                                {item.subject}
                                            </p>
                                            <div className="tw-text-right">
                                                <DownloadSvg fill="#cfcfcf" />
                                                <div className="tw-flex tw-items-center tw-justify-end tw-mt-1">
                                                    <CalendarSvg />
                                                    <span className="tw-text-xs tw-text-gray-500 tw-ml-2">
                                                        20 Oct, 2022
                                                    </span>
                                                </div>
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

export default HomeWork
