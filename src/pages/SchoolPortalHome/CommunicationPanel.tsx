import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Message01Icon,
  Notification03Icon,
  Tick02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import UpdatedHorizontalTab from "../../Components/Common/UpdatedHorizontalTab";
import { communications } from "./helper";

const CommunicationPanel: React.FC = () => {
  const [channel, setChannel] = useState("whatsapp");
  const [selectedId, setSelectedId] = useState(communications.whatsapp[0].id);

  const items = communications[channel];
  const selected = items.find((item) => item.id === selectedId) || items[0];
  const engagement = Math.round((selected.engaged / selected.sent) * 100);
  const isWhatsapp = channel === "whatsapp";

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const nextChannel = event.currentTarget.getAttribute("data-id") || "whatsapp";
    setChannel(nextChannel);
    setSelectedId(communications[nextChannel][0].id);
  }

  return (
    <div className="tw-card tw-h-full">
      <div className="tw-card-header">
        <h4 className="tw-card-title">Messages &amp; notifications</h4>
        <p className="tw-card-subTitle">
          Delivery performance and recipient preview
        </p>
      </div>

      <div className="tw-card-body">
        <UpdatedHorizontalTab
          MenuOptions={[
            {
              id: "whatsapp",
              labelName: "WhatsApp",
              customPadding: "0px 10px 4px 10px",
            },
            {
              id: "app",
              labelName: "Mobile app",
              customPadding: "0px 10px 4px 10px",
            },
          ]}
          clickMenuHandler={clickMenuHandler}
          activeTabId={channel}
          horizontalClass="tw-border-b tw-border-gray-200 tw-mb-3"
          tabWrapperClass="!tw-border-0"
        />

        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
          <div className="tw-col-span-12 lg:tw-col-span-7">
            <div className="tw-grid tw-grid-cols-3 tw-gap-2 tw-mb-2">
              <div className="tw-bg-gray-50 tw-rounded-md tw-p-2 tw-text-center">
                <b className="tw-block tw-text-lg">{selected.sent}</b>
                <small className="tw-text-gray-500">
                  {isWhatsapp ? "Sent" : "Delivered"}
                </small>
              </div>
              <div className="tw-bg-gray-50 tw-rounded-md tw-p-2 tw-text-center">
                <b className="tw-block tw-text-lg">{selected.engaged}</b>
                <small className="tw-text-gray-500">
                  {isWhatsapp ? "Read" : "Opened"}
                </small>
              </div>
              <div className="tw-bg-gray-50 tw-rounded-md tw-p-2 tw-text-center">
                <b className="tw-block tw-text-lg">{engagement}%</b>
                <small className="tw-text-gray-500">Engagement</small>
              </div>
            </div>

            <div className="progress tw-mb-3" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${engagement}%` }}
                aria-valuenow={engagement}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <div className="tw-flex tw-flex-col tw-gap-2">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`tw-border tw-rounded-md tw-p-3 tw-flex tw-items-center tw-gap-3 tw-text-start ${item.id === selected.id
                      ? "tw-border-[#1bb3a6] tw-bg-teal-50"
                      : "hover:tw-bg-gray-50"
                    }`}
                >
                  <span
                    className={`tw-flex tw-items-center tw-justify-center tw-rounded-md tw-w-9 tw-h-9 tw-flex-shrink-0 ${isWhatsapp
                        ? "tw-bg-green-50 tw-text-green-600"
                        : "tw-bg-blue-50 tw-text-blue-600"
                      }`}
                  >
                    <HugeiconsIcon icon={Message01Icon} size={16} />
                  </span>
                  <span className="tw-flex-grow tw-min-w-0">
                    <strong className="tw-text-sm tw-block">{item.title}</strong>
                    <span className="tw-text-xs tw-text-gray-500">
                      {item.audience}
                    </span>
                  </span>
                  <small className="tw-text-gray-500 tw-flex-shrink-0">
                    {item.time}
                  </small>
                </button>
              ))}
            </div>
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-5">
            <div
              className="tw-mx-auto tw-rounded-3xl tw-border-4 tw-border-gray-800 tw-overflow-hidden tw-bg-white"
              style={{ maxWidth: "17rem" }}
              aria-label={`${isWhatsapp ? "WhatsApp message" : "Mobile app notification"
                } preview`}
            >
              <div className="tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-1 tw-text-[10px] tw-bg-gray-800 tw-text-white">
                <span>9:41</span>
                <span>LTE · 87%</span>
              </div>

              {isWhatsapp ? (
                <>
                  <div className="tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-bg-[#075e54] tw-text-white">
                    <span className="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-w-8 tw-h-8 tw-bg-white tw-text-[#075e54] tw-text-[10px] tw-font-bold">
                      DPS
                    </span>
                    <span className="tw-flex tw-flex-col">
                      <strong className="tw-text-xs">Delhi Public School</strong>
                      <small className="tw-text-[10px] tw-opacity-75">
                        official account
                      </small>
                    </span>
                  </div>
                  <div className="tw-bg-[#ece5dd] tw-p-3 tw-min-h-[13rem]">
                    <div className="tw-text-center tw-mb-2">
                      <span className="tw-bg-white tw-rounded-full tw-px-2 tw-py-0.5 tw-text-[10px] tw-text-gray-500">
                        TODAY
                      </span>
                    </div>
                    <div className="tw-bg-[#dcf8c6] tw-rounded-lg tw-p-2 tw-ms-auto tw-max-w-[92%]">
                      <p className="tw-text-[11px] tw-mb-1">{selected.message}</p>
                      <small className="tw-text-[9px] tw-text-gray-500 tw-flex tw-items-center tw-justify-end tw-gap-1">
                        {selected.time}
                        <HugeiconsIcon icon={Tick02Icon} size={10} />
                      </small>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-bg-[#405189] tw-text-white">
                    <span className="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-w-8 tw-h-8 tw-bg-white tw-text-[#405189] tw-text-[10px] tw-font-bold">
                      DPS
                    </span>
                    <strong className="tw-text-xs">Delhi Public School</strong>
                  </div>
                  <div className="tw-bg-gray-100 tw-p-3 tw-min-h-[13rem]">
                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-p-2 tw-flex tw-items-start tw-gap-2">
                      <span className="tw-flex tw-items-center tw-justify-center tw-rounded-md tw-w-7 tw-h-7 tw-flex-shrink-0 tw-bg-blue-50 tw-text-blue-600">
                        <HugeiconsIcon icon={Notification03Icon} size={14} />
                      </span>
                      <div className="tw-min-w-0">
                        <small className="tw-text-[9px] tw-text-gray-500 tw-block">
                          DELHI PUBLIC SCHOOL · NOW
                        </small>
                        <strong className="tw-text-[11px] tw-block">
                          {selected.title}
                        </strong>
                        <p className="tw-text-[11px] tw-mb-0">
                          {selected.message}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-soft-primary tw-w-full tw-mt-2 tw-text-[11px]"
                    >
                      View details
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPanel;
