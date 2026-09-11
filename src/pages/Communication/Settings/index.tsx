import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import Whatsapp from "./Whatsapp";
import UserDefinedTemplate from "./UserDefinedTemplate";
import SmsTemplate from "./SmsTemplate";
import { MenuOption } from "./SettingsTypes";
import MailTemplate from "./MailTemplate";


const CommunicationSettings: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("userDefinedTemplate");

  const MenuOptions: MenuOption[] = [
    {
      id: "userDefinedTemplate",
      labelName: "User Defined Templates",
      customPadding: "0px 15px",
    },
    {
      id: "smsTemplate",
      labelName: "SMS DLT Templates",
      customPadding: "0px 15px",
    },
    {
      id: "emailTemplate",
      labelName: "Email DLT Templates",
      customPadding: "0px 15px",
    },
    {
      id: "whatsapp",
      labelName: "Whatsapp DLT Templates",
      customPadding: "0px 15px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "userDefinedTemplate":
        return UserDefinedTemplate;
      case "smsTemplate":
        return SmsTemplate;
      case "emailTemplate":
        return MailTemplate;
      case "whatsapp":
        return Whatsapp;
      default:
        return null;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLDivElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    if (menuId) setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent = getActiveMenuComponent(activeId);
    return TabComponent ? <TabComponent /> : null;
  }, [activeId]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Communication" pageTitle="Communication" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">

            {/* Header */}
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                  Pre Defined Templates
                </h4>
              </div>
            </div>

            {/* Body */}
            <div className="tw-p-0">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-x-auto tw-whitespace-nowrap"
              />

              {activeComponent}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunicationSettings;
