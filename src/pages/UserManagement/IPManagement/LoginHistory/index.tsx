import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { setLoginHistoryAct } from "../../../../store/global/globalslice";
import LoginUser from "./LoginUser";
import NotLoginUser from "./NotLoginUser";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const LoginHistory = () => {

  const dispatch = useAppDispatch();
  const {
      loginHistoryId
    } = useAppSelector(
      ({ globalData }) => ({
        loginHistoryId: globalData.loginHistoryId,
      }),
      shallowEqual
    );

  const [activeId, setActiveId] = useState(loginHistoryId || "login_user");

  const MenuOptions = [
    {
      id: "login_user",
      labelName: "Login User",
      customPadding: "0px 15px",
    },
    {
      id: "not_login_user",
      labelName: "Not Login User",
      customPadding: "0px 15px",
    },
  ];
  function getActiveMenuComponent(menuId: any) {
    dispatch(setLoginHistoryAct(menuId))
    switch (menuId) {
      case "login_user":
        return LoginUser;
      case "not_login_user":  
        return NotLoginUser;
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
      return TabComponent ? <TabComponent /> : null;
    }, [activeId]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb pageTitle="User Management" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Login History
              </h4>
            </div>
            <div className="tw-pt-2 tw-pb-2">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-x-auto tw-whitespace-nowrap"
              />
              <div className="tw-pt-">
                {activeComponent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginHistory;
