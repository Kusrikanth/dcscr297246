import { useState } from "react";
import UpdatedHorizontalTab from "../../../../../../Components/Common/UpdatedHorizontalTab";
interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  count?: number;
}

export default function AdvanceFilterModal() {
  const [activeId, setActiveId] = useState<any>("all");

  const events = [
    {
      type: "Critical",
      color: "tw-bg-red-500",
      text: "Tab switch detected — STU-1042",
      time: "10:18:34",
    },
    {
      type: "Warning",
      color: "tw-bg-yellow-500",
      text: "Low bandwidth — STU-1103",
      time: "10:19:02",
    },
    {
      type: "Info",
      color: "tw-bg-blue-500",
      text: "Heartbeat OK — STU-1188",
      time: "10:19:48",
    },
    {
      type: "Info",
      color: "tw-bg-blue-500",
      text: "Fullscreen exit — STU-1027",
      time: "10:20:05",
    },
    {
      type: "Info",
      color: "tw-bg-blue-500",
      text: "Auto-save complete — batch 24",
      time: "10:20:28",
    },
  ];

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "all",
      labelName: "All",
      customPadding: "0px 10px 6px 10px",
    },
    {
      id: "critical",
      labelName: "Critical",
      customPadding: "0px 10px 6px 10px",
    },
    {
      id: "warning",
      labelName: "Warning",
      customPadding: "0px 10px 6px 10px",
    },
    {
      id: "info",
      labelName: "Info",
      customPadding: "0px 10px 6px 10px",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const menuId = event.currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  return (
    <div className="offcanvas-body">
      {/* <div className="tw-flex tw-space-x-4 tw-text-sm tw-mb-4">
        <div className="tw-flex tw-items-center tw-space-x-1">
          <span className="tw-h-2 tw-w-2 tw-rounded-full tw-bg-red-500"></span>
          <span>Critical</span>
        </div>
        <div className="tw-flex tw-items-center tw-space-x-1">
          <span className="tw-h-2 tw-w-2 tw-rounded-full tw-bg-yellow-500"></span>
          <span>Warning</span>
        </div>
        <div className="tw-flex tw-items-center tw-space-x-1">
          <span className="tw-h-2 tw-w-2 tw-rounded-full tw-bg-blue-500"></span>
          <span>Info</span>
        </div>
        
      </div> */}
      <div className="mb-4">
        <UpdatedHorizontalTab
          MenuOptions={MenuOptions}
          clickMenuHandler={clickMenuHandler}
          activeTabId={activeId}
          horizontalClass=""
          showBadge={true}
        ></UpdatedHorizontalTab>
      </div>

      <ul className="tw-space-y-3 tw-ps-0">
        {events.map((event, index) => (
          <li
            key={index}
            className="tw-flex tw-justify-between tw-items-center tw-text-sm tw-border-b tw-pb-2"
          >
            <div className="tw-flex tw-items-center tw-space-x-2">
              <span
                className={`tw-h-2 tw-w-2 tw-rounded-full ${event.color}`}
              ></span>
              <span>{event.text}</span>
            </div>
            <span className="tw-text-gray-500 tw-text-xs">{event.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
