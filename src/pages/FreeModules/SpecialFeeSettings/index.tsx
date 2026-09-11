import { useMemo, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import SpecialFee from "../SpecialFee";
import SpecialFeeNames from "./SpecialFeeNames";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const SpecialFeeSettings = () => {
  const [activeId, setActiveId] = useState<any>("fee-names");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "fee-names",
      labelName: "Fee Names",
      customPadding: "0px 10px 4px 10px",
    },
    {
      id: "fee-details",
      labelName: "Fee Details",
      customPadding: "0px 10px 4px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "fee-names":
        return SpecialFeeNames;
      case "fee-details":
        return SpecialFee;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const menuId = event.currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent />;
  }, [activeId]);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Special Fee Settings" pageTitle="Fee"></BreadCrumb>

          <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mt-4">

            <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
              <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0">
                Special Fee Settings
              </h4>
            </div>

            <div className="tw-p-0">

              <div className="tw-w-full">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="tw-border-b tw-border-gray-200"
                  tabWrapperClass="!tw-border-0"
                />
              </div>

              <div className="tw-mt-0">
                {activeComponent}
              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default SpecialFeeSettings;
