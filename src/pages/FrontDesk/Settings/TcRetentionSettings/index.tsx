import React, { useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { TcRetentionMasterType } from "../../../../utility/tcretentionutility";
import { tcRetentionMasterConfigs } from "./helper";
import TcRetentionMasterList from "./TcRetentionMasterList";

// Same order the masters are filled in on the TC retention follow-up form.
const tabTypes: Array<TcRetentionMasterType> = ["leavingReason", "retentionStatus", "retentionOfferType"];

const menuOptions = tabTypes.map((type) => ({
  id: type,
  labelName: tcRetentionMasterConfigs[type].title,
  customPadding: "",
}));

const TcRetentionSettings = () => {
  const [activeTab, setActiveTab] = useState<TcRetentionMasterType>("leavingReason");

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    setActiveTab(event.currentTarget.getAttribute("data-id") as TcRetentionMasterType);
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="TC Retention Settings" pageTitle="Admissions" />
        <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
          <div className="tw-border-b tw-px-4 tw-py-3">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0">TC Retention Settings</h4>
          </div>
          <UpdatedHorizontalTab
            MenuOptions={menuOptions}
            clickMenuHandler={clickMenuHandler}
            activeTabId={activeTab}
            horizontalClass="tw-px-3 tw-pt-2"
          />
          {/* Keyed by type so search and pagination start fresh on every tab switch. */}
          <TcRetentionMasterList key={activeTab} type={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default TcRetentionSettings;
