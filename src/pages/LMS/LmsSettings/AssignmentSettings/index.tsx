import classnames from "classnames";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { MenuOptions } from "./helper";
import React, { useMemo, useState } from "react";
import AssignmentTypes from "./AssignmentTypes";
import AssignmentClasses from "./AssignmentClasses";
import AssignmentStatus from "./AssignmentStatus";
import OtherSettings from "./OtherSettings";

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "assignment-types":
      return AssignmentTypes;
    case "assignment-levels":
      return AssignmentClasses;
    case "assignment-status":
      return AssignmentStatus;
    case "other-settings":
      return OtherSettings;
  }
}

const AssignmentSettings = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(
    "assignment-types"
  );

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveMenuId(menuId);
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
            <div className="col-12 col-lg-4 col-xl-3">
              <div className="card">
                <div className="card-body p-0">
                  <ul className="left-menu-section">
                    {MenuOptions.map((item: any) => (
                      <li
                        className={classnames("fs-6", {
                          active: item.id === activeMenuId,
                        })}
                        data-id={item.id}
                        key={item.id}
                        onClick={clickMenuHandler}
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

export default AssignmentSettings;
