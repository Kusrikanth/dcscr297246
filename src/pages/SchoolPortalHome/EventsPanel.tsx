import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons-pro/core-stroke-standard";
import { eventItems } from "./helper";

const EventsPanel: React.FC = () => {
  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header tw-flex tw-items-start tw-gap-3">
        <div className="tw-flex-grow tw-min-w-0">
          <h4 className="tw-card-title">Upcoming events</h4>
          <p className="tw-card-subTitle">Next seven days</p>
        </div>
        <HugeiconsIcon
          icon={Calendar03Icon}
          size={18}
          className="tw-text-gray-500 tw-flex-shrink-0"
        />
      </div>

      <div className="tw-card-body">
        <div className="tw-flex tw-flex-col tw-gap-3">
          {eventItems.map((event) => (
            <div key={event.title} className="tw-flex tw-items-center tw-gap-3">
              <time className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-rounded-md tw-w-11 tw-h-11 tw-flex-shrink-0 tw-bg-gray-100">
                <b className="tw-text-sm tw-leading-none">{event.day}</b>
                <span className="tw-text-[10px] tw-text-gray-500">
                  {event.month}
                </span>
              </time>
              <div className="tw-min-w-0">
                <strong className="tw-text-sm tw-block">{event.title}</strong>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                  {event.time} · {event.place}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EventsPanel);
