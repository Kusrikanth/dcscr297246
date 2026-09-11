import React, { useMemo } from 'react';
import avatar1 from "../../../assets/images/users/avatar-1.jpg"
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { transformEvents } from './helper';


const UpcomingActivities = () => {

    const {
        getEventsListResp

    } = useAppSelector(({ academicRequest }) => ({
            getEventsListResp: academicRequest.getEventsListResp
    }), shallowEqual);

    const activities = useMemo(() => transformEvents(getEventsListResp?.data), [getEventsListResp]);

    return (
        <>
            <div className="custom_card_wrap upcoming-activities-container">

                <div className="tw-py-0">

                    <div className="tw-flex tw-flex-col">

                        <ul className="tw-flex tw-flex-col tw-gap-2 tw-px-2">

                            {(activities || []).map((item: any, key: any) => (
                                <li
                                    key={key}
                                    className="tw-shadow tw-rounded-md tw-my-2 tw-p-2 tw-flex tw-flex-col tw-transition tw-duration-200 hover:tw-shadow-lg upcoming-activities-item"
                                    style={{ borderLeft: `4px solid ${item.blColour}` }}
                                >

                                    <div className="tw-flex tw-items-center tw-gap-3">

                                        <div className="tw-flex-1 tw-flex tw-items-center">
                                            <div className="tw-mr-2">
                                                <img
                                                    src={item.src || avatar1}
                                                    alt="Employee Avatar"
                                                    className="tw-rounded-full"
                                                    style={{ height: "32px", width: "32px" }}
                                                />
                                            </div>

                                            <div className="tw-flex tw-flex-col">
                                                <p className="tw-text-gray-900 tw-text-sm tw-mb-0">{item.caption}</p>
                                                <div className="tw-flex tw-items-center tw-gap-1 tw-mb-0">
                                                    <i className="ri-map-pin-line tw-text-gray-400 tw-text-sm"></i>
                                                    <p className="tw-text-blue-500 tw-text-xs tw-mb-0">{item.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tw-flex-1 tw-flex tw-flex-col tw-gap-1">
                                            <div className="tw-flex tw-items-center tw-gap-1">
                                                <div className='tw-flex'>
                                                    <i className="ri-calendar-2-line" style={{ color: "#878a99" }}></i><p className="tw-m-0 tw-text-sm">{item.date}</p>
                                                </div>
                                                <div className="tw-flex">
                                                    <i className="ri-time-line me-1" style={{ color: "#878a99" }}></i><p className="text-muted my-0 fs-13">{item.time}</p>
                                                </div>
                                            </div>
                                            <div className="tw-flex-1 tw-flex tw-justify-center tw-items-center">
                                                <p className="tw-m-0 tw-px-2 tw-py-1 tw-rounded tw-text-xs"
                                                    style={{
                                                        backgroundColor: item.status.statusBgColor,
                                                        color: item.status.statusColor,
                                                    }}
                                                >
                                                    {item.status.statusText}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpcomingActivities;
