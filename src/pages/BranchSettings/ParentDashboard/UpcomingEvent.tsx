import React, { useState } from 'react'
import { Calendar } from 'react-calendar'
import { SelectInput } from '../../../Components/Common'


const upcomingEvents = [
    {
        eventNo: '09',
        backgroundColor: "#50D3A1",
        eventName: "Guest Lecture For XII-Science",
        eventTime: "12:00pm - 03:30pm",
        notificationTime: "9:20 AM"
    },
    {
        eventNo: '09',
        backgroundColor: "#50D3A1",
        eventName: "Guest Lecture For XII-Science",
        eventTime: "12:00pm - 03:30pm",
        notificationTime: "9:20 AM"
    },
    {
        eventNo: '09',
        backgroundColor: "#50D3A1",
        eventName: "Guest Lecture For XII-Science",
        eventTime: "12:00pm - 03:30pm",
        notificationTime: "9:20 AM"
    }
]
const UpcomingEvent = () => {
    const [date, setDate] = useState(new Date());
    return (
        <div>
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-overflow-hidden">

                <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between tw-gap-3">

                        <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                            Upcoming Schedules
                        </h4>

                        <div className="tw-flex tw-justify-end">
                            <SelectInput
                                name="test"
                                value={"02 Nov 2022 to 31 Dec 2022"}
                                onChange={() => { }}
                                menuItems={[{ text: "02 Nov 2022 to 31 Dec 2022" }]}
                                valueKey="text"
                                textKey="text"
                                inputClassName="tw-text-gray-500 tw-border-0 tw-bg-transparent"
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                    </div>
                </div>

                <div className="tw-p-0">

                    <Calendar value={date} />

                    <div className="tw-px-4 tw-py-3">

                        <h6 className="tw-text-sm tw-text-gray-500 tw-font-medium tw-mb-3">
                            EVENTS:
                        </h6>

                        {upcomingEvents &&
                            upcomingEvents.map((item, i) => (
                                <div
                                    key={i}
                                    className="tw-flex tw-items-center tw-justify-between tw-pb-3 tw-mb-3 tw-border-b tw-border-gray-200 last:tw-border-b-0"
                                >
                                    <div className="tw-flex tw-items-center tw-w-full tw-justify-between">

                                        <div className="tw-flex tw-items-center">

                                            <div
                                                className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-mr-3 tw-text-sm tw-font-semibold"
                                                style={{
                                                    backgroundColor: item?.backgroundColor,
                                                    color: "#0AB39C",
                                                }}
                                            >
                                                {item?.eventNo}
                                            </div>

                                            <div className="tw-flex tw-flex-col">
                                                <h5 className="tw-text-sm tw-font-bold tw-mb-1">
                                                    {item.eventName}
                                                </h5>
                                                <h6 className="tw-text-sm tw-text-gray-500 tw-font-normal">
                                                    {item.eventTime}
                                                </h6>
                                            </div>
                                        </div>
                                        <p className="tw-text-sm tw-text-gray-500">
                                            {item.notificationTime}
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default UpcomingEvent
