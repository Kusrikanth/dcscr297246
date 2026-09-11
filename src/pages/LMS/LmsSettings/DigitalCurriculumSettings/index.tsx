import React, { useMemo, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { MenuOptions } from "./helper";
import classnames from "classnames";
import AcademicYearDetails from "./AcademicYearDetails";
import AcademicTermDetails from "./AcademicTermDetails";
import SchoolHolidays from "./SchoolHolidays";
import SchoolPeriods from "./SchoolPeriods";
import DigitalCurriculumValidation from "./DigitalCurriculumValidation";
import DigitalCurriculumRules from "./DigitalCurriculumRules";

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "academic-year-details":
      return AcademicYearDetails;
    case "academic-term-details":
      return AcademicTermDetails;
    case "school-periods":
      return SchoolPeriods;
    case "school-working-days":
      return SchoolHolidays;
    case "curriculum-validation":
      return DigitalCurriculumValidation;
    case "curriculum-rules":
      return DigitalCurriculumRules;
  }
}

const DigitalCurriculumSettings = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(
    "academic-year-details"
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
        </div>
        <div>
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

export default DigitalCurriculumSettings;
