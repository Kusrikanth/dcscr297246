import React, { useContext, useEffect, useMemo, useState } from "react";
import { MenuOptions } from "./helper";
import classnames from "classnames";
import AdvanceSettings from "./AdvanceSettings";
import ResultSettings from "./ResultSettings";
import GradesDistrubition from "./GradesDistrubition";
import Notifcations from "./Notifcations";
import Rules from "./Rules";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { getGlobalSettingsBranchIdAct } from "../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../utility/reduxutility";

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "advance-settings":
      return AdvanceSettings;
    case "grades-distribution":
      return GradesDistrubition;
    case "notifcations":
      return Notifcations;
    case "rules":
      return Rules;
    case "result-settings":
      return ResultSettings;
    default:
      return null;
  }
}

const GlobalSettings = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(
      "advance-settings"
    );

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveMenuId(menuId);
  }
function getActiveMenuLabel(menuId: string | null) {
  const found = MenuOptions.find(option => option.id === menuId);
  return found ? found.labelName : "";
}
  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeMenuId);
    return <TabComponent />;
  }, [activeMenuId]);

  return (
    <>
      <div className="page-content master-setup-wrapper">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS"></BreadCrumb>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
               Assessment Settings - {getActiveMenuLabel(activeMenuId)}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4 col-xl-3">
              <div className="card">
                <div className="card-body">
                  <ul className="left-menu-section lms">
                    {MenuOptions.map((item) => (
                      <li
                        data-id={item.id}
                        onClick={clickMenuHandler}
                        className={classnames("fs-12", {
                          active: item.id === activeMenuId,
                        })}
                        key={item.id}
                      >
                        {item.labelName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-8 col-xl-9">{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalSettings;
