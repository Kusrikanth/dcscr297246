import { useMemo, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import ParentNotification from "./Parent";
import EmployeeNotification from "./Employee";


const NotificationHistory = () => {
  const [activeId, setActiveId] = useState("parent_notification");

  const MenuOptions = [
    {
      id: "parent_notification",
      labelName: "Parent Notification",
      customPadding: "0px 15px",
    },  
    {
      id: "employee_notification",
      labelName: "Employee Notification",
      customPadding: "0px 15px",
    },
  ];
  function getActiveMenuComponent(menuId: any) {
    switch (menuId) {
      case "parent_notification":
        return ParentNotification;
      case "employee_notification":  
        return EmployeeNotification;
      default:
        return null;
    }
  }
  function clickMenuHandler(event: any) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
      const TabComponent = getActiveMenuComponent(activeId);
      return TabComponent ? <TabComponent  /> : null;
    }, [activeId]);

  return (
    <>
       <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Communication" />

          <div className="tw-bg-white tw-rounded tw-shadow">
            <div className="tw-border-b tw-border-gray-200">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow tw-p-4">
                    Notification History
                  </h4>
                </div>
              </div>
            </div>

            <div className="tw-p-0 tw-mb-4">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto tw-whitespace-nowrap"
              />
              {activeComponent}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default NotificationHistory;
